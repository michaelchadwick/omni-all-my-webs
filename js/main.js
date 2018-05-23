/* global $ */
$(function ($) {
  var $toc = $('select#toc')
  var $sites = $('article#sites')
  var extraClass = ''

  function initSites () {
    $.getJSON('json/sites.json')
      .success(function (data) {
        $sites.html('')
        // <article>
        $.each(data, function (k, v) {
          if (v.url.indexOf('https') >= 0) {
            extraClass = 'ssl'
          } else {
            extraClass = ''
          }
          $toc.append(
            `<option name='${v.name.replace(/\s/g, '').toLowerCase()}'>${v.name}</option>`
          )
          var html = ''
          html += `<a name='${v.name.replace(/\s/g, '').toLowerCase()}'></a>`
          html += `<section class="${extraClass}" id='site-${v.name.replace(/\s/g, '').toLowerCase()}'>`
          html += `  <h2 class='site-header ${extraClass}'>${v.name}</h2>`
          html += `  <h3 class='site-blurb ${extraClass}'>${v.blurb}</h3>`
          html += `  <h3 class='site-link'>`
          html += `    <a href='${v.url}' target='_blank'>${v.url}</a>`
          html += `  </h3>`
          html += `  <div class='iframe-frame'>`
          html += `    <iframe id='iframe-${v.name.replace(/\s/g, '').toLowerCase()}' data-src='${v.url}' height='200'></iframe>`
          html += `  </div>`
          html += `</section>`
          $sites.append(html)
        })
      // </article>
      })
      .error(function (e) {
        if (e.status === 404) {
          $sites.html('<p>Error: json/sites.json is missing</p>')
        } else {
          $sites.html('<p>Error: json/sites.json is malformed</p>')
          $sites.append(`<textarea id='json' style='border: 1px solid #000; font-family: Consolas; height: 200px; width: 500px;'>${e.responseText}</textarea>`)
        }
      })
  }

  $('section iframe').recliner({
    attrib: 'data-src', // selector for attribute containing the media src
    throttle: 300, // millisecond interval at which to process events
    threshold: 100, // scroll distance from element before its loaded
    live: true // auto bind lazy loading to ajax loaded elements
  })

  $toc.on('change', function () {
    var name = $toc.find(':selected').attr('name')
    window.location.href = '#' + name
  })

  initSites()
})
