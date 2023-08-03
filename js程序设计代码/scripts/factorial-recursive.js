/*
 * Returns the factorial of n.  Precondition: n is a nonnegative 
 * integer.
 */
var factorial = function (n) {
    return n <= 1 ? 1 : factorial(n-1) * n;
};

console.log(factorial(10));
