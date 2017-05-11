
function ParseException(expression, message, cause) {
  this.expression = expression;
  this.message = message;
  this.cause = cause;
  this.name = 'ParseException';
  this.stack = cause.stack;
}