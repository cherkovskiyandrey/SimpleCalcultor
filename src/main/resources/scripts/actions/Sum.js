

function Sum() {
}

// inherit from Element
Sum.prototype = Object.create(Action.prototype);
Sum.prototype.constructor = Sum;

Sum.prototype.getPriority = function() {
    return Action.priorities.Low;
}

Sum.prototype._submitHelper = function() {
}

Sum.prototype._evaluateHelper = function(stepCallback, left, right) {
    return left + right;
}

Sum.prototype.toString = function() {
    return this.isMark() ? " <br>+</br> " : " + "; //TODO
}