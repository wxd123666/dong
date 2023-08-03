var rot13 = function (s) {
    var result = "";
    for (var i = 0; i < s.length(); i++) {
        var c = s.charAt(i);
        if ('A' <= c && c <= 'M' || 'a' <= c && c <= 'm') {
            c += 13;
        } else if ('N' <= c && c <= 'Z' || 'n' <= c && c <= 'z') {
            c -= 13;
        }
        result += c;
    }
    return result;
}
