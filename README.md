# Omni (All My Webs)

A simple way to show a bunch of websites on a one-pager. I use it at [http://omni.codana.me](http://omni.codana.me) to display all of the websites I'm currently working on (at the very least made the design). It uses [Recliner.js](http://sourcey.com/recliner/) for lazy-loading the iframes, and [Initializr](http://www.initializr.com), naturally, for the responsive site itself.

In order to use this web app yourself, just create a `json/sites.json` file under the root in the following manner:

```
{ "sites": [
  {
    "name": "Website Name 1",
    "url":  "http://website1.com"
  },
  {
    "name": "Website Name 2",
    "url":  "http://website2.com"
  }
] }
```

The power of JavaScript will fill your web app with glorious (or not-so-glorious, depending on the sites you choose) websites as you scroll to them.