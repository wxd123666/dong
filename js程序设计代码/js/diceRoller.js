onload = (function () {

    var roll = function () {
        var die1 = Math.floor(Math.random() * 6) + 1;
        var die2 = Math.floor(Math.random() * 6) + 1;
        return die1 + die2;
    };

    var rolls = {};

    return function () {
        //setUp();
        for (var i = 0; i < 1000000; i++) {
            var total = roll();
            rolls[total] = rolls[total] || 0;
            rolls[total]++;
        }
        for (var s in rolls) {
            alert(s + "  ==> " + rolls[s]);
        }
    };

})();
