<?php
/**
 * Voxis Neural TTS Server Endpoint (Native PHP cURL + Local Cache)
 * Voice: ElevenLabs Bella (hpp4J3VqNfWAUOO0d1Us, eleven_v4)
 * Automatically caches audio files in assets/audio/cache/ for instant zero-latency replay.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load .env variables natively (cPanel compatible, no Python required)
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($envName, $envVal) = explode('=', $line, 2);
            $envName = trim($envName);
            $envVal = trim($envVal);
            putenv("$envName=$envVal");
            $_ENV[$envName] = $envVal;
        }
    }
}

$text = trim($_GET['text'] ?? $_POST['text'] ?? '');
if (empty($text)) {
    http_response_code(400);
    echo json_encode(['error' => 'No text provided']);
    exit;
}
if (mb_strlen($text, 'UTF-8') > 300) {
    $text = mb_substr($text, 0, 300, 'UTF-8');
}

// ხმის შერჩევა: ექსკლუზიურად Bella
$voiceKey = 'bella';
$rate = '-4';

// ნორმალიზება
if ($text === 'დაღლილი' || $text === 'დაღლილი.') {
    $text = 'დავიღალე';
}
$isEn = (bool)preg_match('/[a-zA-Z]/', $text);
$text = str_replace(['/', '\\'], $isEn ? ' or ' : ' ან ', $text);
$text = str_replace('&', $isEn ? ' and ' : ' და ', $text);
$text = preg_replace('/\s+/', ' ', trim($text));
$textTrimDot = rtrim($text, '.!?');

// 0. პირდაპირი სტუდიური აუდიო გადაფარვა „ყელი“-ს ფრაზებისთვის (გვერდს უვლის ნებისმიერ ძველ ქეშს სერვერზე!)
$cardsDir = __DIR__ . '/../assets/audio/cards';
$throatStudioMap = [
    'ყელი' => 'pain_throat.mp3',
    'ყელი მტკივა' => 'pain_throat_hurt.mp3',
    'ყელი (მტკივა)' => 'pain_throat_hurt.mp3',
    'ყელი ოდნავ მტკივა' => 'pain_throat_1.mp3',
    'ყელი (ოდნავ მტკივა)' => 'pain_throat_1.mp3',
    'ყელი საშუალოდ მტკივა' => 'pain_throat_2.mp3',
    'ყელი (საშუალოდ მტკივა)' => 'pain_throat_2.mp3',
    'ყელი ძალიან მტკივა' => 'pain_throat_3.mp3',
    'ყელი (ძალიან მტკივა)' => 'pain_throat_3.mp3',
];
if (isset($throatStudioMap[$textTrimDot])) {
    $studioFile = $cardsDir . '/' . $throatStudioMap[$textTrimDot];
    if (file_exists($studioFile) && filesize($studioFile) > 500) {
        serveAudio($studioFile);
        exit;
    }
}

// 1. ქეშის დირექტორია
$cacheDir = __DIR__ . '/../assets/audio/cache';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}

$cachePrefix = (strpos($text, 'ყელი') !== false) ? 'bella_v4_qeli_v2_' : 'bella_v4_pure_';
$cacheKey = md5($cachePrefix . $voiceKey . '_' . $text);
$cacheFile = $cacheDir . '/' . $cacheKey . '.mp3';

// ასევე შევამოწმოთ წერტილის გარეშე/წერტილით ვარიანტი ქეშში
$cacheKeyNoDot = md5($cachePrefix . $voiceKey . '_' . $textTrimDot);
$cacheFileNoDot = $cacheDir . '/' . $cacheKeyNoDot . '.mp3';

// 2. შემოწმება ქეშში
if (file_exists($cacheFile) && filesize($cacheFile) > 500) {
    serveAudio($cacheFile);
    exit;
}
if (file_exists($cacheFileNoDot) && filesize($cacheFileNoDot) > 500) {
    serveAudio($cacheFileNoDot);
    exit;
}

// 3. პირდაპირი გენერაცია PHP cURL-ით (ElevenLabs Bella v4) — მუშაობს ყველა cPanel სერვერზე!
$apiKey = trim(getenv('ELEVENLABS_API_KEY') ?: ($_ENV['ELEVENLABS_API_KEY'] ?? ''));
if (!empty($apiKey) && function_exists('curl_init')) {
    $speakText = $text;
    if (!preg_match('/[.!?]$/u', $speakText)) {
        $speakText .= '.';
    }
    if (strpos($speakText, 'პიჟამის ჩაცმა') !== false) {
        $speakText = str_replace('პიჟამის ჩაცმა', 'пижамис чацма', $speakText);
    } elseif (strpos($speakText, 'პიჟამა') !== false) {
        $speakText = str_replace('პიჟამა', 'пижама', $speakText);
    }
    if (strpos($speakText, 'ყელი') !== false) {
        $speakText = str_replace('ყელი', 'კყელი', $speakText);
    }

    $voiceId = 'hpp4J3VqNfWAUOO0d1Us'; // Bella
    $url = "https://api.elevenlabs.io/v1/text-to-speech/{$voiceId}";
    $payload = json_encode([
        'text' => $speakText,
        'model_id' => 'eleven_v4',
        'language_code' => $isEn ? 'en' : 'ka',
        'voice_settings' => [
            'stability' => 0.85,
            'similarity_boost' => 0.85,
            'style' => 0.0,
            'use_speaker_boost' => true
        ]
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => [
            'xi-api-key: ' . $apiKey,
            'Content-Type: application/json',
            'Accept: audio/mpeg'
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    $audioBytes = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $audioBytes && strlen($audioBytes) > 500) {
        @file_put_contents($cacheFile, $audioBytes);
        serveAudio($cacheFile);
        exit;
    }
}

// 4. Fallback: Python სკრიპტი (მხოლოდ თუ სერვერზე ჩართულია exec)
if (function_exists('exec')) {
    $pythonScript = __DIR__ . '/tts_generate.py';
    if (file_exists($pythonScript)) {
        $cmd = sprintf(
            'python %s %s %s %s %s 2>&1',
            escapeshellarg($pythonScript),
            escapeshellarg($text),
            escapeshellarg($cacheFile),
            escapeshellarg($voiceKey),
            escapeshellarg($rate)
        );
        @exec($cmd, $output, $returnVar);
        if (file_exists($cacheFile) && filesize($cacheFile) > 300) {
            serveAudio($cacheFile);
            exit;
        }
    }
}

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Audio not in cache and live TTS unavailable']);
exit;

function serveAudio($filePath) {
    header('Content-Type: audio/mpeg');
    header('Content-Length: ' . filesize($filePath));
    header('Cache-Control: public, max-age=2592000');
    header('Accept-Ranges: bytes');
    readfile($filePath);
}
