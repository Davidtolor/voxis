<?php
/**
 * PECSAAC Live Voice Recording Upload Endpoint
 * Saves microphone-recorded audio directly to assets/audio/cards/{id}.mp3
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$cardId = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['card_id'] ?? '');
if (empty($cardId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Card ID is required']);
    exit;
}

if (!isset($_FILES['audio']) || $_FILES['audio']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No valid audio file uploaded']);
    exit;
}

$targetDir = __DIR__ . '/../assets/audio/cards';
if (!is_dir($targetDir)) {
    @mkdir($targetDir, 0777, true);
}

$targetFile = $targetDir . '/' . $cardId . '.mp3';

// გადმოცემული აუდიოს შენახვა
if (move_uploaded_file($_FILES['audio']['tmp_name'], $targetFile)) {
    echo json_encode([
        'success' => true,
        'card_id' => $cardId,
        'path' => 'assets/audio/cards/' . $cardId . '.mp3?v=' . time(),
        'size' => filesize($targetFile)
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save audio file']);
}
