<?php
@session_start();
ini_set("log_errors", E_ALL & ~(E_STRICT|E_NOTICE| E_WARNING |E_DEPRECATED  ));
ini_set("error_log", getcwd() . "/tmp/php-error.log");
//ini_set('display_error',E_ALL & ~(E_STRICT |E_NOTICE | E_WARNING |E_DEPRECATED  ));
ini_set('display_error',0);
error_reporting(E_ALL & ~(E_STRICT|E_NOTICE| E_WARNING |E_DEPRECATED ));
//error_log( "Hello, errors!" .  getcwd()  );

$varAdminFolder = "manage";
$varAgencyFolder = "agency";
define("DS", DIRECTORY_SEPARATOR);
define("PATH_ROOT", dirname(__FILE__));
define("PATH_LIB", PATH_ROOT . DS . "library" . DS);
define("PATH_ADMIN", PATH_ROOT . DS . $varAdminFolder . DS);
define("PATH_ADMIN_MODULE", PATH_ADMIN . "modules" . DS);
define("PATH_AGENCY", PATH_ROOT . DS . $varAgencyFolder . DS);
define("PATH_AGENCY_MODULE", PATH_AGENCY . "modules" . DS);
define("PATH_CLASS", PATH_ROOT . DS . "classes" . DS);

define("PATH_CUSTOMER", PATH_ROOT . DS . $varUserFolder . DS);
define("PATH_CUSTOMER_MODULE", PATH_CUSTOMER . "modules" . DS);

define("PATH_IMAGES", PATH_ROOT . DS . 'images' . DS);
define("PATH_UPLOAD", PATH_ROOT . DS . "uploads" . DS);
define("PATH_UPLOAD_BROCHURS", PATH_UPLOAD . "brochure" . DS);
define("PATH_UPLOAD_PRODUCT", PATH_UPLOAD . "product" . DS);
define("PATH_UPLOAD_RESUME", PATH_UPLOAD . "resume" . DS);
define("PATH_UPLOAD_CLUB", PATH_UPLOAD . "club" . DS);
define("PATH_UPLOAD_DEAL", PATH_UPLOAD . "deal" . DS);
define("PATH_UPLOAD_CATEGORY", PATH_UPLOAD . "category" . DS);
define("PATH_UPLOAD_BANNER", PATH_UPLOAD . "banner" . DS);
define("PATH_UPLOAD_ICON", PATH_UPLOAD . "country" . DS);
define("PATH_UPLOAD_PARTNER", PATH_UPLOAD . "partner" . DS);
define("PATH_UPLOAD_ALBUM", PATH_UPLOAD . "album" . DS);
define("PATH_UPLOAD_ACADEMY", PATH_UPLOAD . "academy" . DS);


define("PATH_UPLOAD_USER", PATH_UPLOAD . "user" . DS);
define("URL_ROOT", "http://" . $_SERVER['HTTP_HOST'] . "/amlapp/");
define("URL_CSS", URL_ROOT . "css/");
define("URL_JS", URL_ROOT . "js/");
define("URL_IMG", URL_ROOT . "images/");

define("URL_ADMIN", URL_ROOT . $varAdminFolder . "/");
define("URL_ADMIN_HOME", URL_ADMIN . "index.php");
define("URL_ADMIN_CSS", URL_ADMIN . "css/");

define("URL_ADMIN_ASSETS", URL_ADMIN . "assets/");

define("URL_ADMIN_JS", URL_ADMIN . "js/");
define("URL_ADMIN_IMG", URL_ADMIN . "img/");

define("URL_AGENCY", URL_ROOT . $varAgencyFolder . "/");
define("URL_AGENCY_HOME", URL_AGENCY . "index.php");

define("SELF", basename($_SERVER['PHP_SELF']));
define("DATE_FORMAT", "d/m/Y");
//global variables
$_pswd_len = array(
    'min' => 6,
    'max' => 30 //put 0 for unlimited
);

if(!isset($_SESSION['language']) ||  ($_SESSION['language']== '')){
    $_SESSION['language']='en';
}
include_once(PATH_ROOT.DS.'language'.DS.$_SESSION['language'].'_lang.php');
//define RegX expressions
define("REGX_MAIL", "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/");
define("REGX_URL", "/^(http(s)?\:\/\/(?:www\.)?[a-zA-Z0-9]+(?:(?:\-|_)[a-zA-Z0-9]+)*(?:\.[a-zA-Z0-9]+(?:(?:\-|_)[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,4}(?:\/)?)$/i");
define("REGX_PHONE", "/^[0-9\+][0-9\-\(\)\s]+[0-9]$/");
require_once(PATH_LIB . "class.database.php");
//$db=new MySqlDb("localhost","root","qwuming",'amlapp');
$db=new MySqlDb("89.46.111.35","Sql1048735","4rr5464704",'Sql1048735_2');
require_once(PATH_LIB . "functions.php");
require_once(PATH_LIB . "class.phpmailer.php");
$alert_err = array();
$alert_msg = array();
?>
