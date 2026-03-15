// resonance — push notification service worker

self.addEventListener('push', event => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'resonance', body: event.data.text() }; }

  const title = data.title || 'resonance ✉';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/icon.png',
    tag: data.tag || 'resonance-msg',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // focus existing tab if open
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
