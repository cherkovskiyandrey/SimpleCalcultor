
//$("form button").removeClass("disable");

// Simple validator without brackets
//var regexp = /^\s*[0-9]+([.][0-9]+)?\s*([+\-/]\s*[0-9]+([.][0-9]+)?\s*)*$/i;
function Parser(formId) {
    this._formId = formId;
    this._expression = $("#" + formId + " textarea");
    this._submit = $("#" + formId + " :submit");
    this._submit.click(this._evaluate.bind(this));
}

Parser.prototype._lockTextArea = function() {
    this._expression.attr("readonly", true);
}

Parser.prototype._unlockTextArea = function() {
    this._expression.attr("readonly", false);
}

//TODO: brackets
// 1 + 2 * ((3 - 5 * 17 / 20) + 256.3) * 15
Parser.prototype._parse = function(expr) {
    var cursor = new Expression();
    for(var ch = 0; ch < expr.length; ch++) {
        switch (expr.charAt(ch)) {
            case " ":
            case "\n":
            case "\r":
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                cursor.getCurVal().addDigitAsStr(expr.charAt(ch));
                break;
            case ".":
                cursor.getCurVal().addPoint();
                break;
            case "+":
                cursor.sum();
                break;
            case "-":
                cursor.subtrOrNegative();
                break;
            case "*":
                cursor.multiply();
                break;
            case "/":
                cursor.divide();
                break;

            default:
                throw new Error("Invalid symbol: position[" + ch + "], symbol[" + str.charAt(ch) + "]"); //TODO: own exception
        }
    }
    cursor.submit();
    return cursor;
}

Parser.prototype._sleep = function(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

Parser.prototype._evaluate = function(expression) {
    this._lockTextArea();
    var val = expression.evaluate(function() {
        var htmlStr = expression.toString();
        //TODO: output to page
        this._expression.val(htmlStr);
        console.log(htmlStr);
        this._sleep(1000);
    }.bind(this));


    this._expression.val(val);
    this._unlockTextArea();
}




