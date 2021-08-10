# Omni (All My Webs)

A simple way to show a bunch of websites on a one-pager. It uses [Recliner.js](https://sourcey.com/recliner/) for lazy-loading the iframes, and [Initializr](https://www.initializr.com), naturally, for the responsive site itself.

In order to use this web app yourself, just create a `json/sites.json` file under the root in the following manner:

```json
{ "sites": [
  {
    "name": "Website Name 1",
    "url":  "https://website1.com"
  },
  {
    "name": "Website Name 2",
    "url":  "https://website2.com"
  }
] }
```

The power of JavaScript will fill your web app with glorious (or not-so-glorious, depending on the sites you choose) websites as you scroll to them.
