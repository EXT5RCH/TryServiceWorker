self.addEventListener("push", (event) => {
  console.log("push イベントを実行します。");

  const title = "テスト通知";
  const body = event.data.text();

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      actions: [
        { action: "google", title: "Google 検索へ移動" },
        { action: "yahoo", title: "yahoo へ移動" },
      ],
    })
  );
});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    switch (event.action) {
      case "google":
        clients.openWindow("https://google.com");
        console.log("google へ遷移します。");
        break;
      case "yahoo":
        clients.openWindow("https://yahoo.co.jp");
        console.log("yahoo へ遷移します。");
        break;
      default:
        clients.openWindow("/");
        break;
    }
  },
  false
);
