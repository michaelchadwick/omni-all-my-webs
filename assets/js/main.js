;(async function () {
  function create_site(site, $article, cl = '') {
    // create anchor
    const anchor = document.createElement('a')
    anchor.setAttribute('name', site.name.replace(/\s/g, '').toLowerCase())
    $article.append(anchor)

    // create section
    const section = document.createElement('section')
    section.id = `site-${site.name.replace(/\s/g, '').toLowerCase()}`
    if (cl !== '') section.classList.add(cl)

    // create inner
    const section_inner = document.createElement('div')
    section_inner.classList.add('site-inner')

    // e.g. SiteName
    const site_header = document.createElement('h2')
    site_header.classList.add('site-header')
    if (cl !== '') site_header.classList.add(cl)
    site_header.innerHTML = site.name

    // e.g. Site is for awesomeness
    const site_blurb = document.createElement('h3')
    site_blurb.classList.add('site-blurb')
    if (cl !== '') site_blurb.classList.add(cl)
    site_blurb.innerHTML = site.blurb

    // e.g. HTML, CSS, 6502 Assembly
    const site_tech = document.createElement('div')
    site_tech.classList.add('site-tech')
    if (cl !== '') site_tech.classList.add(cl)
    site_tech.innerHTML = site.tech

    // e.g. https://cool.site
    const site_link = document.createElement('h5')
    site_link.classList.add('site-link')
    const site_link_anchor = document.createElement('a')
    site_link_anchor.href = site.url
    site_link_anchor.innerHTML = site.url
    site_link_anchor.target = '_blank'

    site_link.append(site_link_anchor)

    if (site.url2) {
      const site_link_anchor2 = document.createElement('a')
      site_link_anchor2.href = site.url2
      site_link_anchor2.innerHTML = site.url2
      site_link_anchor2.target = '_blank'

      site_link.append(` | `)
      site_link.append(site_link_anchor2)
    }

    // e.g. [web-screenshot-goes-here]
    const site_iframe_frame = document.createElement('div')
    site_iframe_frame.classList.add('iframe-frame')
    const site_iframe = document.createElement('iframe')
    site_iframe.id = `iframe-${site.name.replace(/\s/g, '').toLowerCase()}`
    site_iframe.setAttribute('src', site.url)
    site_iframe.loading = 'lazy'
    site_iframe.addEventListener(
      'load',
      function () {
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
  const result = await fetch('assets/json/sites.json')
  const data = await result.json()

  // if (e.status === 404) {
  //   $sites.html('<p>Error: json/sites.json is missing</p>')
  // } else {
  //   $sites.html('<p>Error: json/sites.json is malformed</p>')
  //   $sites.append(`<textarea id='json' style='border: 1px solid #000; font-family: Consolas; height: 200px; width: 500px;'>${e.responseText}</textarea>`)
  // }

  const current = document.getElementById('sites-current')
  const archived = document.getElementById('sites-archived')

  current.innerHTML = ''
  archived.innerHTML = ''

  let article_height = 0

  // <article id='sites-current'>
  data.current.forEach((v) => {
    create_site(v, current)
    article_height += 350
  })
  // </article>

  // <article id='sites-archived'>
  data.archived.forEach((v) => {
    create_site(v, archived, 'archived')
  })
  // </article>

  // figure out height of <article>
  let height_mod = 0.615

  if (window.innerWidth >= 1030) {
    current.height = article_height * height_mod
  } else {
    current.height = 'auto'
  }

  window.onload = function () {
    //   var iframes = document.getElementsByTagName('iframe')
    //   Array.from(iframes).forEach(iframe => {
    //     console.log('iframe', iframe.contentWindow)
    //     iframe.contentWindow.postMessage('hello from omni!', iframe.url);
    //   })
    window.scrollTo(0, 0)
  }

  window.onresize = function () {
    const current_sections = document.getElementsByTagName('article#sites-current section')

    current_sections.forEach((element) => {})
    if (window.innerWidth < 1030) {
      current.height('auto')
    } else {
      let article_height = 0

      // <article id='sites-current'>
      current.each(() => {
        article_height += 350
      })
      // </article>

      // figure out height of <article>
      let height_mod = 0.615

      current.height(article_height * height_mod)
    }
  }
})()
