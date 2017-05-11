

function Element() {
    this._isSubmitted = false;
    this._isEvaluated = false;
    this._isMark = false;
}

Element.prototype.isAction = function() {
    return false;
}

Element.prototype.isExpression = function() {
    return false;
}

Element.prototype.checkAction = function() {
    if(this._isSubmitted) {
        throw new Error("Invalid command: expression is already submitted");
    }
}

Element.prototype.evaluate = function() {
    if(!this._isSubmitted) {
        throw new Error("Uncommitted element.");
    }
    if(this._isEvaluated) {
        throw new Error("Already evaluated element.");
    }
    try {
        return this._evaluateHelper.apply(this, arguments);
    } finally {
        this._isEvaluated = true;
    }
}

Element.prototype._evaluateHelper = function(stepCallback) {
    throw new Error("Abstract method _evaluateHelper has been invoked.");
}

Element.prototype.isSubmit = function() {
    return this._isSubmitted;
}

Element.prototype.submit = function() {
    if(this._isSubmitted) {
        throw new Error("Invalid command: element is already submitted");
    }
    try {
        return this._submitHelper();
    } finally {
        this._isSubmitted = true;
    }
}

Element.prototype._submitHelper = function() {
    return this;
}

Element.prototype.setMark = function() {
    this._isMark = true;
}

Element.prototype.unsetMark = function() {
    this._isMark = false;
}

Element.prototype.markAround = function(str) {
    return this._isMark ? "<span style=\"background: #66ffb3;\"> " + str + " </span>" : str;
}