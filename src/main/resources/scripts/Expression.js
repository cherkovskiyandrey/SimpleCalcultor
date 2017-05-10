

function Expression() {
    this._elements = [];
}

// inherit from Element
Expression.prototype = Object.create(Element.prototype);
Expression.prototype.constructor = Expression;

Expression.prototype._isEmpty = function() {
    return this._elements.length == 0;
}

Expression.prototype._lastElement = function() {
    return this._elements[this._elements.length - 1];
}

Expression.prototype.getCurVal = function() {
    this.checkAction();
    if(this._isEmpty() || this._lastElement().isAction()) {
        this._elements.push(new Value());
    }

    return this._lastElement();
}

Expression.prototype._regSingMeanAction = function(action) {
    this.checkAction();
    if(this._isEmpty() || this._lastElement().isAction()) {
        throw new Error("Invalid format");
    }

    this._lastElement().submit();
    this._elements.push(action);
    this._lastElement().submit();

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
 */
Expression.prototype.subtrOrNegative = function() {
    this.checkAction();
    if(this._isEmpty() || this._lastElement().isAction()) {
        this._elements.push(new Value(true));
        return;
    }

    this._lastElement().submit();
    this._elements.push(new Sub());
    this._lastElement().submit();

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

Expression.prototype._submitHelper = function() {
    if(this._isEmpty() || this._lastElement().isAction()) {
        throw new Error("Invalid format");
    }
    this._lastElement().submit();
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
                stepCallback();

                var evalVal = element.evaluate(stepCallback, left, right);
                this._elements.splice(elemId - 1, 3, Value.ofNumber(evalVal));
                elemId -= 1;
                stepCallback();
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
    return this.isMark() ? (" <br>" + result + "</br> ") : (" " + result + " ");
}








