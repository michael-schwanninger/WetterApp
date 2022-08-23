<?php

include 'DotEnv';

(new DotEnv('../.env'))->load();

$apiKey = getenv('APIKEY');
$lat = $_POST['latitude'];
$lon= $_POST['longitude'];

$curl = curl_init();
$url = "https://api.openweathermap.org/data/2.5/forecast?lat=$lat&lon=$lon&lang=de&units=metric&appid=$apiKey";

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

if(curl_errno($curl)){
    echo 'Request Error:' . curl_error($curl);
}

curl_close($curl);

echo $resp;

?>