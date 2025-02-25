<?php
session_start();

// 创建图片
$image = imagecreatetruecolor(100, 40);
$bgcolor = imagecolorallocate($image, 255, 255, 255);
imagefill($image, 0, 0, $bgcolor);

// 生成随机验证码
$captcha = '';
for($i = 0; $i < 4; $i++) {
    $captcha .= rand(0, 9);
}

// 将验证码保存到会话中
$_SESSION['captcha'] = $captcha;

// 添加干扰线
for($i = 0; $i < 6; $i++) {
    $color = imagecolorallocate($image, rand(0, 120), rand(0, 120), rand(0, 120));
    imageline($image, rand(0,100), rand(0,40), rand(0,100), rand(0,40), $color);
}

// 添加干扰点
for($i = 0; $i < 100; $i++) {
    $color = imagecolorallocate($image, rand(0, 120), rand(0, 120), rand(0, 120));
    imagesetpixel($image, rand(0, 100), rand(0, 40), $color);
}

// 将验证码写入图片
$textcolor = imagecolorallocate($image, 0, 0, 0);
imagestring($image, 5, 30, 12, $captcha, $textcolor);

// 输出图片
header('Content-type: image/png');
imagepng($image);
imagedestroy($image);
?> 