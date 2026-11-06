<?php
// 复制本文件为 config.php（与 trial.php 同目录），填好后生效。config.php 不进 GitHub。
return [
  // 线索保存目录：必须在网站根目录之外，PHP 需有写权限。例如宝塔：/www/wwwroot/youxun-data
  'data_dir' => '/www/wwwroot/youxun-data',

  // 企业微信群机器人 Webhook（推荐）。在企业微信群 → 群机器人 → 添加，复制 Webhook 地址。留空则不推送。
  'wecom_webhook' => '',

  // 邮件通知（可选）。留空 smtp_host 则不发邮件。端口 465 走 SSL。
  'smtp_host' => '',          // 例如 smtp.exmail.qq.com
  'smtp_port' => 465,
  'smtp_user' => '',          // 发件邮箱
  'smtp_pass' => '',          // 邮箱授权码，不是登录密码
  'mail_to'   => 'youxunxingzheng@youxun.com',

  // 同一 IP 每小时最多提交次数
  'rate_per_hour' => 5,
];
