

function Sub() {
}

// inherit from Element
Sub.prototype = Object.create(Action.prototype);
Sub.prototype.constructor = Sub;

Sub.prototype.getPriority = function() {
    return Action.priorities.Low;
}

Sub.prototype._submitHelper = function() {
}

Sub.prototype._evaluateHelper = function(stepCallback, left, right) {
    return left - right;
}

Sub.prototype.toString = function() {
    return this.isMark() ? " <br>-</br> " : " - "; //TODO
}