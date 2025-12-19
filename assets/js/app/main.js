const OMNI_ENV_PROD_URL = ['omni.neb.host']

Omni.env = OMNI_ENV_PROD_URL.includes(document.location.hostname)
  ? 'prod'
  : 'local'

// will be filled up as sites are created
Omni.techTags = new Set([])

// used to filter which sites to show
Omni.filterList = []
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
    if (!site.hideIframe) section.classList.add('iframe-embedded')
    section.dataset.tech = site.tech.sort()

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

    // e.g. HTML, CSS, Composer, 6502 Assembly
    const site_tech = document.createElement('div')
    site_tech.classList.add('site-tech')
    if (cl !== '') site_tech.classList.add(cl)
    if (site.tech.length) {
      site.tech.sort().forEach((tech) => {
        Omni.techTags.add(tech)
        site_tech.innerHTML += `<span class='tag ${tech}' alt="${tech}" title="${tech}"><a href='${Omni.techLinks[tech].url}' target='_blank'>${Omni.techLinks[tech].title}</a>`
      })
    }

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

    // e.g. [website-embedded-here]
    let site_iframe_frame
    if (!site.hideIframe) {
      site_iframe_frame = document.createElement('div')
      site_iframe_frame.classList.add('iframe-frame')
      const site_iframe = document.createElement('iframe')
      site_iframe.id = `iframe-${site.name.replace(/\s/g, '').toLowerCase()}`
      site_iframe.setAttribute('data-src', site.url)
      // this doesn't work because they are dynamically generated :-(
      // site_iframe.loading = 'lazy'
      site_iframe.addEventListener(
        'load',
        function () {
          console.log('this.iframe loaded', this)
        },
        true
      )

      site_iframe_frame.append(site_iframe)
    }

    // end specific iframe
    // end inner
    // end section

    section_inner.append(site_header)
    section_inner.append(site_blurb)
    section_inner.append(site_link)
    section_inner.append(site_tech)
    if (!site.hideIframe) {
      section_inner.append(site_iframe_frame)
    }

    section.append(section_inner)

    $article.append(section)
  }

  // use Intersection Observer API to add lazy loading
  function enable_lazy_loading() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = entry.target
          iframe.src = iframe.getAttribute('data-src')
          iframe.removeAttribute('data-src')
          obs.unobserve(iframe)
        }
      })
    })

    document.querySelectorAll('iframe[data-src]').forEach((iframe) => {
      observer.observe(iframe)
    })
  }

  function change_filter({ target }) {
    const tech = target.dataset.keyword

    if (!Omni.filterList.includes(tech)) {
      Omni.filterList.push(tech)
      target.classList.add('active')
    } else {
      Omni.filterList = Omni.filterList.filter((t) => t != tech)
      target.classList.remove('active')
    }

    if (tech == 'all') {
      Omni.filterList = []
      document.querySelectorAll('#filter .change-filter').forEach((button) => {
        button.classList.remove('active')
      })
      target.classList.add('active')
      document
        .querySelectorAll('.main-container article section')
        .forEach((site) => {
          site.classList.remove('hidden')
        })
    }

    // if we have an active filter, turn off 'all'
    // go through site tech and hide ones that don't match
    if (Omni.filterList.length) {
      filter.querySelector('button:first-of-type').classList.remove('active')

      document
        .querySelectorAll('.main-container article section')
        .forEach((site) => {
          // if this site's tech array has no overlap with filterList
          // then there is no match and we should hide it
          const siteTechArray = site.dataset.tech.split(',')
          if (
            siteTechArray.filter((value) => Omni.filterList.includes(value))
              .length == 0
          ) {
            site.classList.add('hidden')
          } else {
            site.classList.remove('hidden')
          }
        })
    } else {
      filter.querySelector('button:first-of-type').classList.add('active')
      document
        .querySelectorAll('.main-container article section')
        .forEach((site) => {
          site.classList.remove('hidden')
        })
    }
  }

  let sites

  const current_sites_file = await fetch('assets/json/sites.current.json')
  const current_sites = await current_sites_file.json()

  sites = current_sites

  // if on local, add any private site data that exists, and update title
  if (Omni.env == 'local') {
    try {
      // pull private site creation data on local
      const private_sites_file = await fetch('assets/json/sites.private2.json')

      if (private_sites_file) {
        const private_sites = await private_sites_file.json()

        sites = [...current_sites, ...private_sites].sort((a, b) => a.name.localeCompare(b.name))
      }
    } catch {}

    if (!document.title.includes('(LH) ')) {
      document.title = '(LH) ' + document.title
    }
  }

  const current = document.getElementById('sites-current')
  current.innerHTML = ''

  let article_height = 0

  // <article id='sites-current'>
  sites.forEach((v) => {
    create_site(v, current)
    article_height += 350
  })

  const archived_sites_file = await fetch('assets/json/sites.archived.json')
  const archived_sites = await archived_sites_file.json()
  const archived = document.getElementById('sites-archived-container')
  archived.innerHTML = ''
  sites = archived_sites

  // <article id='sites-archived'>
  sites.forEach((v) => {
    create_site(v, archived, 'archived')
  })

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
    enable_lazy_loading()
  }

  // window.onresize = function () {
  //   const current_sections = document.getElementsByTagName(
  //     'article#sites-current section'
  //   )

  //   current_sections.forEach((element) => {})
  //   if (window.innerWidth < 1030) {
  //     current.height('auto')
  //   } else {
  //     let article_height = 0

  //     // <article id='sites-current'>
  //     current.each(() => {
  //       article_height += 350
  //     })
  //     // </article>

  //     // figure out height of <article>
  //     let height_mod = 0.615

  //     current.height(article_height * height_mod)
  //   }
  // }

  // turn tech tags into nav buttons
  const filter = document.getElementById('filter')
  // add event listener to "All" button
  filter
    .querySelector('button:first-of-type')
    .addEventListener('click', change_filter)
  Array.from(Omni.techTags)
    .sort()
    .forEach((tag) => {
      const button = document.createElement('button')
      button.addEventListener('click', change_filter)
      button.classList.add('change-filter')
      button.classList.add(tag)
      button.dataset.keyword = tag
      button.innerHTML = Omni.techLinks[tag].title

      filter.appendChild(button)
    })
})()
