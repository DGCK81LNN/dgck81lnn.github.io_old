<?php

function getHttpResponseGET($url, $headers = NULL)
{
    global $curl_error;
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    //curl_setopt($curl, CURLOPT_ENCODING, 'gzip');
    if($headers)
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    $responseText = curl_exec($curl);
    $curl_error = curl_error($curl);
    curl_close($curl);

    return $responseText;
}

header("Content-Type: application/json");
if (!isset($_GET['uid'])) die('null');
$id = $_GET['uid'];
echo getHttpResponseGET("https://api.bilibili.com/x/space/acc/info?mid=$id");

?>