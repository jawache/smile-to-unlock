importScripts('workbox-sw.prod.v2.0.1.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "assets/icon/favicon.ico",
    "revision": "d2f619d796fbe8bed6200da2691aa5b6"
  },
  {
    "url": "assets/img/icon.png",
    "revision": "b96ad6e1e0b755c8cd45e6aec40bca25"
  },
  {
    "url": "build/app.global.js",
    "revision": "2eab51fa98ed28b23cf1de2416e32427"
  },
  {
    "url": "build/app.js",
    "revision": "64cdb64d03a9253cb08788b5189ad751"
  },
  {
    "url": "build/app.registry.json",
    "revision": "09ddb8646747cd811049f3646cb95ef0"
  },
  {
    "url": "build/app/app.bimwyhdt.pf.js",
    "revision": "a93e54df7101825d1ffa9f6043e878e5"
  },
  {
    "url": "build/app/app.opuojsxl.js",
    "revision": "c6571648301ba8c4137fa64cdb59abf1"
  },
  {
    "url": "build/app/if0opbrp.js",
    "revision": "921a0f2053ba0a1728845286a22d9e61"
  },
  {
    "url": "build/app/imd9xidt.js",
    "revision": "2286d47e08db8815a3d1046e6f67975d"
  },
  {
    "url": "build/app/ohlge6kf.css",
    "revision": "b1be35fb5bb8579bf5dffa03a79ed7f7"
  },
  {
    "url": "build/app/wzncpgz8.js",
    "revision": "79264d981d46704d6346ee5d2e2eb51b"
  },
  {
    "url": "favicon.ico",
    "revision": "d2f619d796fbe8bed6200da2691aa5b6"
  },
  {
    "url": "index.html",
    "revision": "103d2500f676732d7ee5b3e607f601a2"
  },
  {
    "url": "manifest.json",
    "revision": "05d7b2b39f66ef5a848f8e0327eb2e35"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
