if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>a(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-4d767a27"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"d4686711911e1cb1056206c00adf23a4"},{url:"/_next/static/Go6nUp4ML6wxfhFarkQmZ/_buildManifest.js",revision:"6dac071db5282694749381a48bd20466"},{url:"/_next/static/Go6nUp4ML6wxfhFarkQmZ/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/13b76428-1947e09b2321d766.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/1449-2515e240191ff5aa.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/1483-d430b66d1ac83fdc.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/1684-0498d6ed8218129a.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/2145-a086481c30b52c27.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/2336.696d9c1f06cc2b67.js",revision:"696d9c1f06cc2b67"},{url:"/_next/static/chunks/2405-db89da90e4878aec.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/2510-30d5ec883776adeb.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/2642.2a9522d472f4ae7c.js",revision:"2a9522d472f4ae7c"},{url:"/_next/static/chunks/2854-92aa401859919e6b.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/2898-cc7f137baae38519.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/3063-59f29799c25a1338.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/3464-41b484c4b5989022.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/3504-cd93792b3232bc8e.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/3796-fe704c4e455abdfd.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/391-19310071f2ba0c53.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/401-40eaad21fcf1edde.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/4806-3dfa3330d25ec9fb.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/4bd1b696-7d769a0edc3f3c1a.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/5725-63b33763baa42f4f.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/5886-f3f62420aac674b0.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/6244-38b761bb066632e5.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/6523-a2389733bec0f09f.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/6796-a9fff554aa024993.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/6874-f1c556f3567266b1.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/7394-9ae7ee33dd5b9517.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/7849-7e1c9377a7186470.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/795-2aeea304ae1c0235.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/9205-a42cf93bcaefcc62.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/9511-b61f27f4dc1daf94.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(auth)/sign-in/%5B%5B...sign-in%5D%5D/page-fab8ccd3e8a3d2b1.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(auth)/sign-up/%5B%5B...sign-up%5D%5D/page-8932c6f90da1c7ac.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/advice/page-08f557bd8b7e8452.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/budgets/page-5b8185c6b78cd173.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/currency/page-0742c2bf469ac05c.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/expenses/%5Bid%5D/page-2ec0b8eeeb8d8c84.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/expenses/page-a385e3c3ba7e5f5a.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/forecasting/page-9c3519fe8dd5bf58.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/layout-4f99928e2adad737.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/monthly/page-cfee756f8650d32b.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/page-d088542d6d8587d8.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/settings/page-42b80c572b822fb8.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/(routes)/dashboard/todo/page-f8092fdcd3967f37.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/_not-found/page-891205c289c9571d.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/api/forecast/route-9987a722f1942261.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/api/monthly/route-575cad872d6344d0.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/layout-7a3d89e969b5fc9a.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/manifest.webmanifest/route-49bbffdf6111b1fc.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/app/page-182f0eae697d2d2b.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/ca377847-f53a0de407b7086e.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/e80c4f76-193a78a62c972ba7.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/fcfb803e-0affdf05416cb8d1.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/framework-2c2be674e67eda3d.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/main-app-0e41ca7315147ada.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/main-d66deab6f3c8adb1.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/pages/_app-5d1abe03d322390c.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/pages/_error-3b2a1d523de49635.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-92b7a39c92ba19f5.js",revision:"Go6nUp4ML6wxfhFarkQmZ"},{url:"/_next/static/css/2c7a15db8f85ce56.css",revision:"2c7a15db8f85ce56"},{url:"/_next/static/css/730f50e4bd5b4038.css",revision:"730f50e4bd5b4038"},{url:"/_next/static/media/07a54048a9278940-s.p.woff2",revision:"5e6c7802c5c4cc0423f86c3aad29f60a"},{url:"/_next/static/media/4f2204fa15b9b11a-s.woff2",revision:"6f4cf2d9f078b52024414970b7b7f704"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icon-192x192.jpg",revision:"1d1fd715d79c32e64f87fe5517448e50"},{url:"/icon-192x192.png",revision:"63a5a5e77febca33feb9f1b74824d3be"},{url:"/icon-512-maskable.png",revision:"4d819adeb8ff3c037ba479b55cfae652"},{url:"/icon-512x512.png",revision:"fc834aa1f532757ab2cc7f22ca2a48bd"},{url:"/icons/icon-192x192.jpg",revision:"1d1fd715d79c32e64f87fe5517448e50"},{url:"/icons/icon-192x192.png",revision:"63a5a5e77febca33feb9f1b74824d3be"},{url:"/icons/icon-512-maskable.png",revision:"4d819adeb8ff3c037ba479b55cfae652"},{url:"/icons/icon-512x512.png",revision:"fc834aa1f532757ab2cc7f22ca2a48bd"},{url:"/logo-sm.png",revision:"6182aba43dc7ada7a0bc696cc2c39b91"},{url:"/logo.png",revision:"7303a97ec23d4d65ccd83975da9a5dea"},{url:"/money.jpg",revision:"74e71cc67f01a10e7300a9edf32104db"},{url:"/output.css",revision:"995e8ee19eec23c6d511bd7866c9d3f2"},{url:"/screenshot-1.png",revision:"3697f761842ab0b0973fb539e1ca6fdd"},{url:"/screenshot-2.png",revision:"3ec2f825fd284f3789a13516d672fde4"},{url:"/welcome.png",revision:"55711e833b79f546b88082bfa863683d"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
