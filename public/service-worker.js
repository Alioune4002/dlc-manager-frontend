self.addEventListener('push', event => {
    const data = event.data.json();
    const { title, body } = data;

    self.registration.showNotification(title, {
        body,
        icon: '/favicon.ico'
    });
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/reminders')
    );
});