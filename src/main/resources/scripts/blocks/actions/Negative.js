
function Negative() {
}

// inherit from Element
Negative.prototype = Object.create(Action.prototype);
Negative.prototype.constructor = Negative;

Negative.prototype.toString = function() {
    return this.markAround(" -");
}