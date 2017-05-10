
function Action() {

}

// inherit from Element
Action.prototype = Object.create(Element.prototype);
Action.prototype.constructor = Action;

Action.priorities = {Height: [Mult, Divide], Low: [Sum, Sub]};

Action.prototype.isAction = function() {
    return true;
}

Action.prototype.getPriority = function() {
    throw Error("Abstract method has been invoked");
}
