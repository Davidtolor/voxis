<?php
header('Content-Type: application/json; charset=utf-8');

$dataFile = __DIR__ . '/../data/cards.json';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo json_encode(["error" => "Cards file not found"]);
    }
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        echo json_encode(["success" => false, "error" => "Invalid JSON payload"]);
        exit;
    }

    if (isset($input['cards']) && is_array($input['cards'])) {
        $existing = json_decode(file_get_contents($dataFile), true) ?: [];
        $existing['cards'] = $input['cards'];
        file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(["success" => true, "count" => count($input['cards'])]);
        exit;
    }

    echo json_encode(["success" => false, "error" => "No cards provided"]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
