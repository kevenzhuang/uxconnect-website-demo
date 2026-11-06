<?php
// 官网「预约咨询」表单接收：校验 → 保存到网站目录外的 CSV → 企业微信 / 邮件通知。
// 部署：把 config.sample.php 复制为 config.php 并填写。返回 JSON {ok:true|false}。
date_default_timezone_set('Asia/Shanghai');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
function out($ok, $code = 200) { http_response_code($code); echo json_encode(['ok' => $ok]); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 405);
$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) out(false, 500);
$cfg = require $cfgFile;

// 机器人陷阱：真人看不到 website 字段
if (trim($_POST['website'] ?? '') !== '') out(true);

function field($k, $max) { $v = trim((string)($_POST[$k] ?? '')); $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $v); return mb_substr($v, 0, $max); }
$d = [
  'time'    => date('Y-m-d H:i:s'),
  'company' => field('company', 120),
  'name'    => field('name', 60),
  'tel'     => field('tel', 30),
  'email'   => field('email', 120),
  'wechat'  => field('wechat', 60),
  'addr'    => field('addr', 200),
  'biz'     => field('biz', 40),
  'msg'     => field('msg', 2000),
  'lang'    => (strpos($_SERVER['HTTP_REFERER'] ?? '', '/ja/') !== false) ? 'ja' : ((strpos($_SERVER['HTTP_REFERER'] ?? '', '/en/') !== false) ? 'en' : 'zh'),
  'ip'      => $_SERVER['REMOTE_ADDR'] ?? '',
];
if ($d['company'] === '' || $d['name'] === '' || $d['tel'] === '') out(false, 422);
if (!preg_match('/^[0-9+\-\s()]{7,20}$/', $d['tel'])) out(false, 422);

$dir = rtrim($cfg['data_dir'] ?? '', '/');
if ($dir === '' || (!is_dir($dir) && !@mkdir($dir, 0750, true))) out(false, 500);

// 频率限制
$rl = $dir . '/ratelimit.json'; $now = time(); $lim = (int)($cfg['rate_per_hour'] ?? 5);
$fh = fopen($rl, 'c+'); flock($fh, LOCK_EX);
$rec = json_decode(stream_get_contents($fh) ?: '{}', true) ?: [];
foreach ($rec as $ip => $ts) { $rec[$ip] = array_values(array_filter($ts, function ($t) use ($now) { return $t > $now - 3600; })); if (!$rec[$ip]) unset($rec[$ip]); }
if (count($rec[$d['ip']] ?? []) >= $lim) { flock($fh, LOCK_UN); fclose($fh); out(false, 429); }
$rec[$d['ip']][] = $now; ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($rec)); flock($fh, LOCK_UN); fclose($fh);

// 保存 CSV（带 BOM，Excel 打开中文不乱码；防公式注入）
$csv = $dir . '/leads.csv'; $new = !is_file($csv);
$f = fopen($csv, 'a'); flock($f, LOCK_EX);
if ($new) { fwrite($f, "\xEF\xBB\xBF"); fputcsv($f, array_keys($d)); }
fputcsv($f, array_map(function ($v) { return preg_match('/^[=+\-@\t]/', $v) ? "'" . $v : $v; }, array_values($d)));
flock($f, LOCK_UN); fclose($f);

$text = "官网新咨询（" . ($d['lang'] === 'ja' ? '日文站' : ($d['lang'] === 'en' ? '英文站' : '中文站')) . "）\n公司：{$d['company']}\n联系人：{$d['name']}\n电话：{$d['tel']}"
      . ($d['email'] !== '' ? "\n邮箱：{$d['email']}" : '') . ($d['wechat'] !== '' ? "\n微信：{$d['wechat']}" : '') . ($d['addr'] !== '' ? "\n地址：{$d['addr']}" : '')
      . ($d['biz'] !== '' ? "\n业务：{$d['biz']}" : '') . ($d['msg'] !== '' ? "\n需求：{$d['msg']}" : '') . "\n时间：{$d['time']}";

// 企业微信群机器人
if (!empty($cfg['wecom_webhook'])) {
  $ch = curl_init($cfg['wecom_webhook']);
  curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 6,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode(['msgtype' => 'text', 'text' => ['content' => $text]], JSON_UNESCAPED_UNICODE)]);
  curl_exec($ch); curl_close($ch);
}

// 邮件（SMTP over SSL）
function smtp_send($c, $subject, $body) {
  $s = @stream_socket_client('ssl://' . $c['smtp_host'] . ':' . (int)$c['smtp_port'], $en, $es, 8);
  if (!$s) return false; stream_set_timeout($s, 8);
  $rd = function () use ($s) { $l = ''; while (($x = fgets($s, 515)) !== false) { $l .= $x; if (isset($x[3]) && $x[3] === ' ') break; } return $l; };
  $cmd = function ($c2, $want) use ($s, $rd) { fwrite($s, $c2 . "\r\n"); return strpos($rd(), (string)$want) === 0; };
  $rd();
  $ok = $cmd('EHLO youxun.com', 250) && $cmd('AUTH LOGIN', 334) && $cmd(base64_encode($c['smtp_user']), 334)
     && $cmd(base64_encode($c['smtp_pass']), 235) && $cmd('MAIL FROM:<' . $c['smtp_user'] . '>', 250)
     && $cmd('RCPT TO:<' . $c['mail_to'] . '>', 250) && $cmd('DATA', 354);
  if ($ok) {
    $msg = 'From: =?UTF-8?B?' . base64_encode('友讯官网') . '?= <' . $c['smtp_user'] . ">\r\nTo: <" . $c['mail_to'] . ">\r\n"
         . 'Subject: =?UTF-8?B?' . base64_encode($subject) . "?=\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n"
         . "Content-Transfer-Encoding: base64\r\nDate: " . date('r') . "\r\n\r\n" . chunk_split(base64_encode($body)) . "\r\n.";
    $ok = $cmd($msg, 250);
  }
  fwrite($s, "QUIT\r\n"); fclose($s); return $ok;
}
if (!empty($cfg['smtp_host'])) smtp_send($cfg, '官网新咨询：' . $d['company'], $text);

out(true);
