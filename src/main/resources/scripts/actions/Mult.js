

function Mult() {
}

// inherit from Element
Mult.prototype = Object.create(Action.prototype);
Mult.prototype.constructor = Mult;

Mult.prototype.getPriority = function() {
    return Action.priorities.Height;
}

Mult.prototype._submitHelper = function() {
}

Mult.prototype._evaluateHelper = function(stepCallback, left, right) {
    return left * right;
}

Mult.prototype.toString = function() {
    return this.isMark() ? " <br>*</br> " : " * "; //TODO
}