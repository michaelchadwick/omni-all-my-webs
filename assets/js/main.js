// Omni object init
if (typeof Omni === 'undefined') var Omni = {}

const OMNI_ENV_PROD_URL = ['omni.neb.host']

Omni.env = OMNI_ENV_PROD_URL.includes(document.location.hostname)
  ? 'prod'
  : 'local'

Omni.techLinks = {
  bulma: {
    title: 'Bulma',
    url: 'https://bulma.io',
  },
  composer: {
    title: 'Composer',
    url: 'https://getcomposer.org',
  },
  css: {
    title: 'CSS',
    url: 'https://www.w3.org/Style/CSS/',
  },
  drupal: {
    title: 'Drupal',
    url: 'https://drupal.org',
  },
  homer: {
    title: 'Homer',
    url: 'https://github.com/bastienwirtz/homer',
  },
  hugo: {
    title: 'Hugo',
    url: 'https://gohugo.io',
  },
  html: {
    title: 'HTML',
    url: 'https://html.spec.whatwg.org/multipage',
  },
  jekyll: {
    title: 'Jekyll',
    url: 'https://jekyllrb.com',
  },
  jquery: {
    title: 'jQuery',
    url: 'https://jquery.com',
  },
  js: {
    title: 'JavaScript',
    url: 'https://262.ecma-international.org/16.0/index.html?_gl=1*1qb02y6*_ga*MTIxNTM2Nzc2OS4xNzY1NjU1MDkw*_ga_TDCK4DWEPP*czE3NjU2NTUwODkkbzEkZzAkdDE3NjU2NTUwODkkajYwJGwwJGgw',
  },
  mysql: {
    title: 'MySQL',
    url: 'https://mysql.com',
  },
  node: {
    title: 'NodeJS',
    url: 'https://nodejs.org',
  },
  php: {
    title: 'PHP',
    url: 'https://php.net',
  },
  'ruby-on-rails': {
    title: 'Ruby on Rails',
    url: 'https://rubyonrails.org',
  },
  sqlite: {
    title: 'SQLite',
    url: 'https://sqlite.org',
  },
  vue: {
    title: 'VueJS',
    url: 'https://vuejs.org',
  },
  wordpress: {
    title: 'Wordpress',
    url: 'https://wordpress.org',
  },
}

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
    site.tech.sort().forEach((tech) => {
      Omni.techTags.add(tech)
      site_tech.innerHTML += `<span class='tag ${tech}'><a href='${Omni.techLinks[tech].url}' target='_blank'>${Omni.techLinks[tech].title}</a>`
    })

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
    enable_lazy_loading()
  }

  window.onresize = function () {
    const current_sections = document.getElementsByTagName(
      'article#sites-current section'
    )

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

  const filter = document.getElementById('filter')
  Array.from(Omni.techTags)
    .sort()
    .forEach((tag) => {
      const button = document.createElement('button')
      button.addEventListener('click', ({ target }) => {
        const tech = target.dataset.keyword
        if (!Omni.filterList.includes(tech)) {
          Omni.filterList.push(tech)
          target.classList.add('active')
        } else {
          Omni.filterList = Omni.filterList.filter((t) => t != tech)
          target.classList.remove('active')
        }

        if (Omni.filterList.length) {
          filter
            .querySelector('button:first-of-type')
            .classList.remove('active')
        } else {
          filter.querySelector('button:first-of-type').classList.add('active')
        }
      })
      button.classList.add('change-filter')
      button.dataset.keyword = tag
      button.innerHTML = Omni.techLinks[tag].title

      filter.appendChild(button)
    })

  // if local dev, update title
  if (Omni.env == 'local') {
    if (!document.title.includes('(LH) ')) {
      document.title = '(LH) ' + document.title
    }
  }
})()
