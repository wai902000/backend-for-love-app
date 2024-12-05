const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// 郵件發送設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API 路由
app.post("/api/send-email", (req, res) => {
  const { name, platform, userAgent, language } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "你的電子郵件@example.com", // 替換為你的郵件地址
    subject: `${name} 的手機資訊來啦！`,
    text: `
      來自 ${name} 的手機資訊：
      設備類型：${platform}
      瀏覽器資訊：${userAgent}
      語言設定：${language}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("郵件發送失敗：", error);
      res.status(500).send("無法發送郵件");
    } else {
      console.log("郵件發送成功：", info.response);
      res.status(200).send("郵件已成功發送");
    }
  });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在運行，端口：${port}`);
});