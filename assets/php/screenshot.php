<?php

namespace App\Services\Screeenly;

require_once '../../vendor/autoload.php';

use GuzzleHttp\Client;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable('../..');
$dotenv->load();

$SCREENLY_API_KEY = $_ENV['SCREEENLY_API_KEY'];

$base_uri = 'https://secure.screeenly.com/api/v1/fullsize';
$screenshot_url = isset($_GET['url']) ? 'https://' . $_GET['url'] : 'https://neb.host';

$options = [
  'headers' => [
    'Content-Type' => 'application/x-www-form-urlencoded',
    'Accept' => 'application/json',
  ],
  'form_params' => [
    'key' => $SCREENLY_API_KEY,
    'url' => $screenshot_url,
    'width' => 640,
    'height' => 480
  ]
];

$client = new Client([
  'timeout'  => 30.0,
]);

$response = $client->request('POST', $base_uri, $options);

if ($response->getStatusCode() == 200) {
  print_r($response);

  $jsonBody = json_decode($response->getBody()->getContents(), true);

  return $jsonBody;
} else {
  echo $response->title . "\n";
  echo $response->message . "\n";
}
