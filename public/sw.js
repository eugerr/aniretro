if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const o=e=>a(e,t),r={module:{uri:t},exports:c,require:o};s[t]=Promise.all(n.map((e=>r[e]||o(e)))).then((e=>(i(...e),c)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/-fB1Do8DPm9q_Ao0uG-r1/_buildManifest.js",revision:"e974c504a3969f6c32d5661a72c8b3f6"},{url:"/_next/static/-fB1Do8DPm9q_Ao0uG-r1/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0e5ce63c-7dc8ed2d649ccdee.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/190-126ddb2041f6f0bf.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/281-e04fb607f8ca4776.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/300-a3af3d6fbd3e9eb7.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/797-157062df6c4f06e6.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/app/(home)/page-7eb9b55009a0f50e.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/app/_not-found/page-d262a57550683535.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/app/layout-9a8cec1d83433b67.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/app/watch/page-90932cf735c85f01.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/fd9d1056-82fc2a82826c61b9.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/main-app-1cd6cd7306eb3e5e.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/main-bb8fa3601d1c1801.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-b8f1b34caa727e58.js",revision:"-fB1Do8DPm9q_Ao0uG-r1"},{url:"/_next/static/css/2f6c22c470832002.css",revision:"2f6c22c470832002"},{url:"/_next/static/media/0b3ba4bd860abcf8-s.p.woff2",revision:"019feeb13fc22f352fa62e895f3f177f"},{url:"/_next/static/media/48fe7c8da6129df0-s.woff2",revision:"517d815a403a0c7a9036ae97aaeeb754"},{url:"/_next/static/media/d270da13e774a5f1-s.woff2",revision:"3724e55234d31baa0b1f3a10d265385a"},{url:"/icon-192x192.png",revision:"cf1d76b89d4d1e458a459df127b9dd46"},{url:"/icon-256x256.png",revision:"122fe83e5a5ce5efc5621649a0d0acac"},{url:"/icon-384x384.png",revision:"0c8f68391e3207a519409f89e0a39b64"},{url:"/icon-512x512.png",revision:"24a998af34b216ffe8ff08e6e5e9661b"},{url:"/manifest.json",revision:"1a4d029520dfefdbf0a779236740ea92"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:a})=>"1"===e.headers.get("RSC")&&a&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
