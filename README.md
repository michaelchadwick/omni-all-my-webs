# Omni (All My Webs)

A simple way to show a bunch of websites on a one-pager.

In order to use this web app yourself, just create a `json/sites.json` file under the root in the following manner:

```json
{ "sites": [
  {
    "name":  "Website Name 1",
    "url":   "https://website1.com",
    "url2":  "https://web1.com",
    "blurb": "Webby website.",
    "tech":  "HTML/CSS/JS"
  },
  {
    "name":  "Website Name 2",
    "url":   "https://website2.com",
    "url2":  "https://web2.com",
    "blurb": "Webbier website.",
    "tech":  "ReactJS"
  }
] }
```

The power of JavaScript will fill your web app with glorious (or not-so-glorious, depending on the sites you choose) websites as you scroll to them.
