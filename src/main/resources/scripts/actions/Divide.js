

function Divide() {
}

// inherit from Element
Divide.prototype = Object.create(Action.prototype);
Divide.prototype.constructor = Divide;

Divide.prototype.getPriority = function() {
    return Action.priorities.Height;
}

Divide.prototype._submitHelper = function() {
}

Divide.prototype._evaluateHelper = function(stepCallback, left, right) {
    return left / right;
}

Divide.prototype.toString = function() {
    return this.isMark() ? " <br>/</br> " : " / "; //TODO
}