export async function notifyUser(notificationText: string) {
  if (!("Notification" in window)) {
    return;
  } else if (Notification.permission === "granted") {
    new Notification(notificationText);
  } else if (Notification.permission !== "denied") {
    await Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(notificationText);
      }
    });
  }
}
