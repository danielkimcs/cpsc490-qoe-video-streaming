self.addEventListener('fetch', function(event) {
  self.clients.matchAll().then(all => all.forEach(client => {
    client.postMessage("fetch event: " + event.request.url);
  }));
});
  