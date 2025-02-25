<?php
session_start();
header('Content-Type: application/json');

// 接收POST数据
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$captcha = $data['captcha'] ?? '';

// 验证验证码
if (!isset($_SESSION['captcha']) || $_SESSION['captcha'] !== $captcha) {
    echo json_encode([
        'success' => false,
        'message' => '验证码错误'
    ]);
    exit;
}

// 这里添加您的用户验证逻辑
// 示例：检查用户名和密码是否匹配（实际应用中应该查询数据库）
$valid_users = [
    'admin' => 'admin123',
    'user1' => 'password123'
];

if (isset($valid_users[$username]) && $valid_users[$username] === $password) {
    // 登录成功
    $_SESSION['user'] = $username;
    echo json_encode([
        'success' => true,
        'message' => '登录成功'
    ]);
} else {
    // 登录失败
    echo json_encode([
        'success' => false,
        'message' => '用户名或密码错误'
    ]);
}
?> 