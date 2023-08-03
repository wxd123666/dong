  $.ajax({url: "/api/uptoken", success: function(res){
    var token = "LUQyAZq-cQzNQg9TT-Mrjq4Th67ETUa8-hpn9PBy:7pA5aOjXIO5ejG2GJjUtih2o4tY=:eyJzY29wZSI6ImZhbHZiYW5nIiwiZGVhZGxpbmUiOjE1NjMwMTk4MTZ9";
    var domain = "pic.falvbang.com";
    var config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 6,
      region: qiniu.region.z2
    };
    var putExtra = {
      fname: "",
      params: {},
      mimeType: null
    };
    $(".nav-box")
      .find("a")
      .each(function(index) {
        $(this).on("click", function(e) {
          switch (e.target.name) {
            case "h5":
              uploadWithSDK(token, putExtra, config, domain);
              break;
            case "expand":
              uploadWithOthers(token, putExtra, config, domain);
              break;
            case "directForm":
              uploadWithForm(token, putExtra, config);
              break;
            default:
              "";
          }
        });
      });
    imageControl(domain);
    uploadWithSDK(token, putExtra, config, domain);
  }})
