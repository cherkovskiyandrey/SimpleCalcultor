
function Parser() {
}

// 1 + 2 * ((3 - 5 * 17 / 20) + 256.3) * 15
Parser.parse = function(expr) {
    var main = cursor = new Expression(null);
    var ch = 0;
    try {
        for(; ch < expr.length; ch++) {
            cursor = Parser._parseStep(cursor, expr.charAt(ch));
        }
        cursor.submit();
        if(main != cursor) {
            throw new Error("Invalid query: check brackets!");
        }
    } catch (err) {
        throw new ParseException(Parser._buildExpressionWithError(expr, ch), err.message, err);
    }
    return cursor;
}

Parser._buildExpressionWithError = function(expr, ch) {
    return expr.substring(0, ch) + "<span style=\"color: red; text-decoration: underline;\">"
        + expr.charAt(ch) + "</span>" + expr.substring(ch + 1);
}

Parser._parseStep = function(cursor, symbol) {
    switch (symbol) {
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
            cursor.getOrCreateCurVal().addDigitAsStr(symbol);
            break;
        case ".":
            cursor.getOrCreateCurVal().addPoint();
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
        case "(":
            return cursor.subExpr();
        case ")":
            return cursor.submit();

        default:
            throw new Error("Invalid symbol");
    }
    return cursor;
}





