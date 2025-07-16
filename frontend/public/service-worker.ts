/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
  sw.skipWaiting();
});

sw.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
});

sw.addEventListener("fetch", (event) => {
  // caching rules
});
