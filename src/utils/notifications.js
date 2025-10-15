export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log("Les notifications ne sont pas supportées par ce navigateur.");
        return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        console.log("Permission de notification accordée.");
        return true;
    } else {
        console.log("Permission de notification refusée.");
        return false;
    }
};

export const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/favicon.ico'
        });
    } else {
        console.log("Notifications non autorisées.");
    }
};