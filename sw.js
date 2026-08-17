self.addEventListener('install', (e) => {
  console.log('KamchyAI успешно готов к установке!');
});

self.addEventListener('fetch', (e) => {
  // Позволяет приложению стабильно отправлять запросы в чат
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
