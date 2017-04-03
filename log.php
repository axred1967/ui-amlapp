<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
include_once("config.php");
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty( $_POST ))
  $_POST=$_REQUEST = json_decode( file_get_contents( 'php://input' ), true );
error_log("REMOTELOG ".$_SERVER['REQUEST_METHOD']. print_r($_REQUEST,1).PHP_EOL);
