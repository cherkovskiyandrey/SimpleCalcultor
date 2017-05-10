
function Value(isMinus) {
    this._isMinus = (isMinus != undefined && typeof(isMinus) == "boolean") ? isMinus : false;
    this._curValAsStr = "";
    this._curVal = undefined;
}

Value.ofNumber = function(num) {
    var result = new Value();
    result.addDigitAsStr("" + num);
    result.submit();
    return result;
}

// inherit from Element
Value.prototype = Object.create(Element.prototype);
Value.prototype.constructor = Value;

Value.prototype.addDigitAsStr = function(val) {
    this.checkAction();
    if(typeof(val) != "string") {
        throw new Error(val + " is not string");
    }
    this._curValAsStr += val;
}

Value.prototype.addPoint = function() {
    this.checkAction();
    this._curValAsStr += ".";
}

Value.prototype._submitHelper = function() {
    this._curVal = +this._curValAsStr;
    if(isNaN(this._curVal)) {
        throw new Error(this._curVal + " is not valid digit");
    }
    if(this._isMinus) {
        this._curVal *= -1;
    }
}

Value.prototype._evaluateHelper = function() {
    return this._curVal;
}

Value.prototype.toString = function() {
    return this.isMark() ? (" <br>" + this._curVal + "</br> ") : (" " + this._curVal + " "); //TODO
}

//TODO: max value