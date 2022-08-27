const APPLICATION_SERVER_API_BASE_URL = "http://localhost:3000/api";

// 通知ボタン押下処理
const handlePushNotification = async () => {
  const message = document.getElementById("message").value;
  fetch(`${APPLICATION_SERVER_API_BASE_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ message }),
  });
};

// push api 関連
const usePushApi = () => {
  // 通知の許可
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("push 通知が許可されました。");
      return true;
    } else {
      console.log("push 通知が拒否されました。");
      return false;
    }
  };

  // Push 通知の申請
  const subscribePushNotification = async () => {
    // Service Workerの設定（既存のservice workerは上書き）
    const registration = await navigator.serviceWorker.register(
      "./service_worker.js",
      {
        scope: "/",
      }
    );
    if (!registration) {
      console.log("ServiceWorker を登録に失敗しました。");
      return;
    }
    console.log("ServiceWorker を登録しました。");

    // 公開鍵の取得
    const response = await fetch(
      `${APPLICATION_SERVER_API_BASE_URL}/publicKey`
    );
    if (!response.ok) {
      console.log("公開鍵の取得に失敗しました。");
      return;
    }
    const publicKey = (await response.json()).publicKey;
    console.log("公開鍵を取得しました。");
    applicationServerKey = urlB64ToUint8Array(publicKey);
    console.log("applicationServerKey を生成しました。");

    // 通知は申請済みかチェック
    let pushSubscription = await registration.pushManager.getSubscription({
      userVisibleOnly: false,
      applicationServerKey,
    });
    if (pushSubscription) {
      console.log("既に申請されています。");
      return;
    }

    // 通知の申請
    console.log("通知の申請を開始します。");
    pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    fetch(`${APPLICATION_SERVER_API_BASE_URL}/registEndpoint`, {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        subscription: pushSubscription,
      }),
    });
    console.log("通知が申請が完了しました。");
  };

  // アプリケーションサーバーキー用の処理
  const urlB64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return {
    requestPermission,
    subscribePushNotification,
  };
};

// 起動時の呼び出し
(async () => {
  const { requestPermission, subscribePushNotification } = usePushApi();

  // 通知の許可
  if (!(await requestPermission())) return;

  // push 通知の申請
  await subscribePushNotification();
})();
