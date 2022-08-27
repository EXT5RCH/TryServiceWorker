const express = require("express");
const router = express.Router();

const PushService = require("../service/pushService");
const pushService = new PushService();

router.get("/publicKey", (_req, res) => {
  res.json({
    publicKey: pushService.getPublicKey(),
  });
});

router.post("/registEndpoint", async (req, _res) => {
  pushService.setSubscription(req.body.subscription);
});

router.post("/sendMessage", async (req, res) => {
  const message = req.body.message;
  const subscription = pushService.getSubscription();
  const response = await pushService
    .getWebPush()
    .sendNotification(subscription, message);
  return res.json({ statusCode: response.statusCode || -1 });
});

module.exports = router;
