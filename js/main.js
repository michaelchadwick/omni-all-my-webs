$(function() {
  function initSites() {
    $toc = $("select#toc");
    $sites = $("article#sites");
    $.getJSON("json/sites.json")
    .success(function(data) {
      $sites.html("");
      $.each(data, function(k, v) {
        $toc.append("<option name='" + v.name.replace(/\s/g, '').toLowerCase() + "'>" + v.name + "</option>");
        $sites.append("<a name='" + v.name.replace(/\s/g, '').toLowerCase() + "'></a><section><h2>" + v.name + "</h2><h3><a href='" + v.url + "'>" + v.url + "</a></h3><div class='iframe-frame'><iframe data-src='" + v.url + "' height='200'></iframe></div></section>");
      });
    })
    .error(function(e) {
      if (e.status == 404)
        $sites.html("<p>Error: json/sites.json is missing</p>");
      else {
        $sites.html("<p>Error: json/sites.json is malformed</p>");
        $sites.append("<textarea id='json' style='border: 1px solid #000; font-family: Consolas; height: 200px; width: 500px;'>" + e.responseText + "</textarea>");
      }
    });
  };

  $("select#toc").change(function() {
    var anchor = $("select#toc option:selected").attr("name");
    newurl = document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/" + "#" + anchor;
    window.location.href = newurl;
  });

  $("section iframe").recliner({
    attrib: "data-src", // selector for attribute containing the media src
    throttle: 300,      // millisecond interval at which to process events
    threshold: 100,     // scroll distance from element before its loaded
    live: true          // auto bind lazy loading to ajax loaded elements
  });

  initSites();
});
