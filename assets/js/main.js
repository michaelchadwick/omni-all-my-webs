(function ($) {
  function create_site(site, $article, cl = '') {
    // create anchor
    var anchor = document.createElement('a')
    anchor.setAttribute('name', site.name.replace(/\s/g, '').toLowerCase())
    $article.append(anchor)

    // create section
    var section = document.createElement('section')
    section.id = `site-${site.name.replace(/\s/g, '').toLowerCase()}`
    if (cl !== '') section.classList.add(cl)

      // create inner
      var section_inner = document.createElement('div')
      section_inner.classList.add('site-inner')

        // e.g. SiteName
        var site_header = document.createElement('h2')
        site_header.classList.add('site-header')
        if (cl !== '') site_header.classList.add(cl)
        site_header.innerHTML = site.name

        // e.g. Site is for awesomeness
        var site_blurb = document.createElement('h3')
        site_blurb.classList.add('site-blurb')
        if (cl !== '') site_blurb.classList.add(cl)
        site_blurb.innerHTML = site.blurb

        // e.g. HTML, CSS, 6502 Assembly
        var site_tech = document.createElement('div')
        site_tech.classList.add('site-tech')
        if (cl !== '') site_tech.classList.add(cl)
        site_tech.innerHTML = site.tech

        // e.g. https://cool.site
        var site_link = document.createElement('h5')
        site_link.classList.add('site-link')
        var site_link_anchor = document.createElement('a')
        site_link_anchor.href = site.url
        site_link_anchor.innerHTML = site.url
        site_link_anchor.target = '_blank'

        site_link.append(site_link_anchor)

        // e.g. [web-screenshot-goes-here]
        var site_iframe_frame = document.createElement('div')
        site_iframe_frame.classList.add('iframe-frame')
        var site_iframe = document.createElement('iframe')
        site_iframe.id = `iframe-${site.name.replace(/\s/g, '').toLowerCase()}`
        site_iframe.setAttribute('src', site.url)
        site_iframe.height = '300'
        site_iframe.addEventListener(
          'load',
          function() {
            console.log('this.iframe loaded', this)
          },
          true
        )

        site_iframe_frame.append(site_iframe)

        // end specific iframe
      // end inner
    // end section

    section_inner.append(site_header)
    section_inner.append(site_blurb)
    section_inner.append(site_tech)
    section_inner.append(site_link)
    section_inner.append(site_iframe_frame)

    section.append(section_inner)

    $article.append(section)
  }

  // pull site creation data
  $.getJSON('assets/json/sites.json', (data) => {
    var $current = $('article#sites-current')
    var $archived = $('article#sites-archived')

    $current.html('')
    $archived.html('')

    var article_height = 0
    // <article id='sites-current'>
    $.each(data.current, (k, v) => {
      create_site(v, $current)
      article_height += 350
    })
    // </article>

    // <article id='sites-archived'>
    $.each(data.archived, (k, v) => {
      create_site(v, $archived, 'archived')
    })
    // </article>

    // figure out height of <article>
    var height_mod = 0.615

    if (window.innerWidth >= 1030) {
      $current.height(article_height * height_mod)
    } else {
      $current.height('auto')
    }
  })
  .fail(function (e) {
    if (e.status === 404) {
      $sites.html('<p>Error: json/sites.json is missing</p>')
    } else {
      $sites.html('<p>Error: json/sites.json is malformed</p>')
      $sites.append(`<textarea id='json' style='border: 1px solid #000; font-family: Consolas; height: 200px; width: 500px;'>${e.responseText}</textarea>`)
    }
  })

  // lazy load sites
  $('section iframe').recliner({
    attrib: 'data-src', // selector for attribute containing the media src
    throttle: 300, // millisecond interval at which to process events
    threshold: 100, // scroll distance from element before its loaded
    live: true // auto bind lazy loading to ajax loaded elements
  })

  $(window).on('load', function() {
  //   var iframes = document.getElementsByTagName('iframe')
  //   Array.from(iframes).forEach(iframe => {
  //     console.log('iframe', iframe.contentWindow)
  //     iframe.contentWindow.postMessage('hello from omni!', iframe.url);
  //   })
    window.scrollTo(0, 0)
  })

  $(window).on('resize', function() {
    var $current = $('article#sites-current section')

    if (window.innerWidth < 1030) {
      $current.height('auto')
    } else {
      var article_height = 0
      // <article id='sites-current'>
      $current.each(() => {
        article_height += 350
      })
      // </article>

      // figure out height of <article>
      var height_mod = 0.615

      $current.height(article_height * height_mod)
    }
  })
}(jQuery));
