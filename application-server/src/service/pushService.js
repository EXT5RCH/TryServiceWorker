const webpush = require("web-push");

class PushService {
  constructor() {
    // 公開鍵、秘密鍵の作成
    const vapidKeys = webpush.generateVAPIDKeys();
    // 配信元の
    webpush.setVapidDetails(
      "mailto:hoge@example.com",
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    this.publicKey = vapidKeys.publicKey;
    this.webpush = webpush;
  }

  getPublicKey() {
    return this.publicKey;
  }

  getWebPush() {
    return this.webpush;
  }

  setSubscription(subscription) {
    this.subscription = subscription;
  }

  getSubscription() {
    return this.subscription;
  }
}

module.exports = PushService;
