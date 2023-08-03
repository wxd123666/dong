onload = function () {
    for (var i = 0; i < states.length; i++) {
        var button = document.createElement("button");
        var stateCode = states[i][0];
        var stateName = states[i][1];
        button.appendChild(document.createTextNode(stateCode));
        button.onclick = function () {alert(stateName);};
        document.body.appendChild(button);
    }
}
