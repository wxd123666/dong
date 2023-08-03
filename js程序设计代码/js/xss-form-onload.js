window.onload = function () {
    var setFormFields = function (nameValue, manufacturerValue) {
        $("#nameField").val(nameValue);
        $("#manufacturerField").val(manufacturerValue);
    };

    $("#normalButton").click(function () {
        setFormFields("trap", "acme");
    });

    $("#htmlButton").click(function () {
        setFormFields("<u>trap</u>", "<u>acme</u>");
    });

    $("#inlineButton").click(function () {
        setFormFields("<script>alert('Gotcha!');/*", "*/</script>");
    });
  
    $("#referencedButton").click(function () {
        setFormFields("<script src=\"http://web.me.com/dondi/", ".js\"></script>");
    });
};
