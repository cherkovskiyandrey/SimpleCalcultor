

function Expression(parent) {
    this._parent = parent;
    this._elements = [];
}

// inherit from Element
Expression.prototype = Object.create(Element.prototype);
Expression.prototype.constructor = Expression;

Expression.prototype.isExpression = function() {
    return true;
}

Expression.prototype._isEmpty = function() {
    return this._elements.length == 0;
}

Expression.prototype._lastElement = function() {
    return this._elements[this._elements.length - 1];
}

Expression.prototype.getOrCreateCurVal = function() {
    this.checkAction();
    if(this._isEmpty()) {
        this._elements.push(new Value());

    } else if (this._lastElement().isAction()) {
        if(this._lastElement() instanceof Negative) {
            this._elements.pop();
            this._elements.push(new Value(true));

        } else {
            this._elements.push(new Value());

        }
    }

    return this._lastElement();
}

Expression.prototype._regSingMeanAction = function(action) {
    this.checkAction();
    if(this._isEmpty() || this._lastElement().isAction()) {
        throw new Error("Invalid format");
    }

    this._submitLastElementIfNeed();
    this._elements.push(action);
    this._submitLastElementIfNeed();

    return this._lastElement();
}

/**
 * 1) ... a + b ...
*/
Expression.prototype.sum = function() {
    return this._regSingMeanAction(new Sum());
}

/**
 * 1) ... a - b ...
 * 2) ... a [/-+*] -b ...
 * 3) -a ...
 * 4) ... a [/-+*][/-+*] -b ... -> error
 */
Expression.prototype.subtrOrNegative = function() {
    this.checkAction();
    if(this._isEmpty() || this._lastElement().isAction()) {
        if(this._lastElement() instanceof Negative) {
            throw new Error("Invalid format");
        }
        this._elements.push(new Negative());
        this._submitLastElementIfNeed();
        return;
    }

    this._submitLastElementIfNeed();
    this._elements.push(new Sub());
    this._submitLastElementIfNeed();

    return this._lastElement();
}

/**
 * ... a * b ...
*/
Expression.prototype.multiply = function() {
    return this._regSingMeanAction(new Mult());
}

/**
 * ... a * b ...
*/
Expression.prototype.divide = function() {
    return this._regSingMeanAction(new Divide());
}

/**
* 1) (a + b) * ....
* 2) ... a * (b + c) ...
*/
Expression.prototype.subExpr = function() {
    this.checkAction();
    if(!this._isEmpty() && !this._lastElement().isAction()) {
        throw new Error("Invalid format");
    }

    if(this._lastElement() instanceof Negative) {
        this._elements.pop();
        this._elements.push(Value.ofNumber("-1"));
        this._elements.push(new Mult());
        this._submitLastElementIfNeed();
    }

    var subExpr = new Expression(this);
    this._elements.push(subExpr);

    return this._lastElement();
}

Expression.prototype._submitLastElementIfNeed = function() {
    if(!this._lastElement().isExpression()) {
        this._lastElement().submit();
    }
}

Expression.prototype._submitHelper = function() {
    if(this._isEmpty() || this._lastElement().isAction()) {
        throw new Error("Invalid format");
    }

    this._submitLastElementIfNeed();

    return this._parent;
}

/**
* [...,  Action, Value, Action, Value, Action, ...]
*                     \    |    /
*                      \   |   /
* [...,  Action,         Value`,       Action, ...]
*/
Expression.prototype._evaluateHelper = function(stepCallback) {
    if(this._isEmpty()) {
        throw new Error("Empty expression");
    }

    for(var prioId in Action.priorities) {
        for(var elemId = 0; elemId < this._elements.length; elemId++) {
            var element = this._elements[elemId];
            if(element.isAction() &&
                element.getPriority() == Action.priorities[prioId]) {
                var left = this._elements[elemId - 1].evaluate(stepCallback); //TODO: get rid of recursion
                var right = this._elements[+elemId + 1].evaluate(stepCallback);

                this._elements[elemId - 1] = Value.ofNumber(left);
                this._elements[+elemId + 1] = Value.ofNumber(right);

                this._elements[elemId - 1].setMark();
                this._elements[+elemId + 1].setMark();
                element.setMark();
                stepCallback("<mark>Choose action:</mark>    ");

                var evalVal = Value.ofNumber( element.evaluate(stepCallback, left, right) );
                evalVal.setMark();
                this._elements.splice(elemId - 1, 3, evalVal);
                elemId -= 1;
                stepCallback("<mark>Evaluated action:</mark> ");
                evalVal.unsetMark();
            }
        }
    }
    return this._lastElement().evaluate(stepCallback);
}


Expression.prototype.toString = function() {
    var result = "";
    for(var elemId in this._elements) {
        result += this._elements[elemId].toString();
    }

    if(this._parent == null) {
        return this.markAround(result);
    }

    return this.markAround("( " + result + " )");
}








