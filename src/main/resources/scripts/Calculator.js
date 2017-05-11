
function Calculator() {
    this._exprStr = $(".container textarea");
    this._memoStr = "";
    this._submitBtn = $(".container form :button:first");
    this._resetBtn = $(".container form :button:last");

    this._wholePanel = $(".panel-group");

    this._parsingPanel = $(".panel-group .panel:first");
    this._parsingBody = $(".panel-group .panel:first .panel-body");
    this._parsingAlert = $(".panel-group .alert");

    this._evaluatePanel = $(".panel-group .panel:last");
    this._evaluateBody = $(".panel-group .panel:last .panel-body");
}

Calculator._inputRestr = /^[0-9.*()+\-/ ]*$/i;

Calculator.prototype.start = function() {
    this._bindOnlineRestricter();
    this._resetBtn.click(this._reset.bind(this));
}

Calculator.prototype._bindOnlineRestricter = function() {
    this._exprStr.keyup(function(){
        if( !Calculator._inputRestr.test(this._exprStr.val()) ) {
            this._exprStr.val(this._memo);
        } else {
            this._memo = this._exprStr.val();
            if(this._memo == "") {
                this._disableSubmit();
            } else {
                this._enableSubmit();
            }
        }
    }.bind(this));
}

Calculator.prototype._enableSubmit = function() {
    this._submitBtn.removeClass("disabled");
    this._submitBtn.click(this._process.bind(this));
}

Calculator.prototype._disableSubmit = function() {
    this._submitBtn.addClass("disabled");
    this._submitBtn.off();
}


Calculator.prototype._process = function(event) {
    this._resetReport();
    var expression;
    try {
        expression = Parser.parse(this._exprStr.val());
        this._writeSuccParsResult(expression.toString());
    } catch (err) {
        if(err.name == "ParseException") {
            this._writeFailParsResult(err);
            return;
        }
        console.log(err);
        return;
    }

    this._evaluatePanel.removeClass("hide");
    this._evaluate(expression);
}


Calculator.prototype._writeSuccParsResult = function(str) {
    this._wholePanel.removeClass("hide");
    $("<p>" + str + "</p>").appendTo(this._parsingBody);
}

Calculator.prototype._writeFailParsResult = function(err) {
    this._wholePanel.removeClass("hide");
    this._parsingPanel.removeClass("panel-primary");
    this._parsingPanel.addClass("panel-danger");
    this._parsingAlert.removeClass("hide");

    $("<p>" + err.expression  + "</p>").appendTo(this._parsingBody);
    $("<p>" + err.message  + "</p>").appendTo(this._parsingAlert);
}

Calculator.prototype._reset = function() {
    this._memoStr = "";
    this._exprStr.val(this._memoStr);
    this._disableSubmit();

    this._resetReport();
}

Calculator.prototype._resetReport = function() {
    this._wholePanel.addClass("hide");

    this._parsingPanel.removeClass("panel-danger");
    this._parsingPanel.addClass("panel-primary");
    this._parsingBody.empty();

    this._parsingAlert.addClass("hide");
    this._parsingAlert.empty();

    this._evaluatePanel.addClass("hide");
    this._evaluateBody.empty();
}

Calculator.prototype._evaluate = function(expression) {
    expression.evaluate(function(prefix) {
        $("<p>" + prefix + expression.toString() + "</p>").appendTo(this._evaluateBody);
    }.bind(this));
}

$(
    function() {
        var calc = new Calculator();
        calc.start();
    }
);