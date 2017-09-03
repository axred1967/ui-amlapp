<?php
defined('PATH_LIB') or die("Restricted Access");
function __autoload($strClass)
{
	$strFile="class.".strtolower($strClass).".php";
	require_once(PATH_CLASS.$strFile);
}
function addhttp($url)
{
    if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
        $url = "http://" . $url;
    }
	return str_replace("////","//",$url);
}

function smart_resize_image( $file, $width = 0, $height = 0, $proportional = false, $output = 'file', $delete_original = true, $use_linux_commands = false )
  {
    if ( $height <= 0 && $width <= 0 ) {
      return false;
    }
    $info = getimagesize($file);
    $image = '';
    $final_width = 0;
    $final_height = 0;
    list($width_old, $height_old) = $info;
    if ($proportional) {
      if ($width == 0) $factor = $height/$height_old;
      elseif ($height == 0) $factor = $width/$width_old;
      else $factor = min ( $width / $width_old, $height / $height_old);
      $final_width = round ($width_old * $factor);

      $final_height = round ($height_old * $factor);



    }

    else {

      $final_width = ( $width <= 0 ) ? $width_old : $width;

      $final_height = ( $height <= 0 ) ? $height_old : $height;

    }



    switch ( $info[2] ) {

      case IMAGETYPE_GIF:

        $image = imagecreatefromgif($file);

      break;

      case IMAGETYPE_JPEG:

        $image = imagecreatefromjpeg($file);

      break;

      case IMAGETYPE_PNG:

        $image = imagecreatefrompng($file);

      break;

      default:

        return false;

    }



    $image_resized = imagecreatetruecolor( $final_width, $final_height );



    if ( ($info[2] == IMAGETYPE_GIF) || ($info[2] == IMAGETYPE_PNG) ) {

      $trnprt_indx = imagecolortransparent($image);



      // If we have a specific transparent color

      if ($trnprt_indx >= 0) {



        // Get the original image's transparent color's RGB values

        $trnprt_color    = imagecolorsforindex($image, $trnprt_indx);



        // Allocate the same color in the new image resource

        $trnprt_indx    = imagecolorallocate($image_resized, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);



        // Completely fill the background of the new image with allocated color.

        imagefill($image_resized, 0, 0, $trnprt_indx);



        // Set the background color for new image to transparent

        imagecolortransparent($image_resized, $trnprt_indx);





      }

      // Always make a transparent background color for PNGs that don't have one allocated already

      elseif ($info[2] == IMAGETYPE_PNG) {



        // Turn off transparency blending (temporarily)

        imagealphablending($image_resized, false);



        // Create a new transparent color for image

        $color = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);



        // Completely fill the background of the new image with allocated color.

        imagefill($image_resized, 0, 0, $color);



        // Restore transparency blending

        imagesavealpha($image_resized, true);

      }

    }



    imagecopyresampled($image_resized, $image, 0, 0, 0, 0, $final_width, $final_height, $width_old, $height_old);



    if ( $delete_original ) {

      if ( $use_linux_commands )

        exec('rm '.$file);

      else

        @unlink($file);

    }



    switch ( strtolower($output) ) {

      case 'browser':

        $mime = image_type_to_mime_type($info[2]);

        header("Content-type: $mime");

        $output = NULL;

      break;

      case 'file':

        $output = $file;

      break;

      case 'return':

        return $image_resized;

      break;

      default:

      break;

    }



    switch ( $info[2] ) {

      case IMAGETYPE_GIF:

        imagegif($image_resized, $output);

      break;

      case IMAGETYPE_JPEG:

        imagejpeg($image_resized, $output);

      break;

      case IMAGETYPE_PNG:

        imagepng($image_resized, $output);

      break;

      default:

        return false;

    }



    return true;

  }


function redirect($url=NULL)
{
	if(is_null($url)) $url=curPageURL();
	if(headers_sent())
	{
		echo "<script>window.location='".$url."'</script>";
	}
	else
	{
		header("Location:".$url);
	}
	exit;
}

function chkHeader()
{
	if(strpos($_SERVER['HTTP_REFERER'],URL_ROOT)==0) return true;
	return false;
}

function setMsgPage($mod, $sec, $type, $note)
{
	//possible values for type
	//success
	//information
	//warning
	//error
	if(!isset($_SESSION['msg_er'])) $_SESSION['msg_er']=array();
	if(!isset($_SESSION['msg_er'][$mod])) $_SESSION['msg_er'][$mod]=array();
	if(!isset($_SESSION['msg_er'][$mod][$sec])) $_SESSION['msg_er'][$mod][$sec]=array();

	$_SESSION['msg_er'][$mod][$sec]['page']=array(
												  'type'=>$type,
												  'note'=>$note
												  );
}

function getMsgPage($mod, $sec)
{
	$return='';
	if(isset($_SESSION['msg_er'][$mod][$sec]['page']) && is_array($_SESSION['msg_er'][$mod][$sec]['page']) && count($_SESSION['msg_er'][$mod][$sec]['page'])>0)
	{
		$class=$_SESSION['msg_er'][$mod][$sec]['page']['type'];
		$return="<div class=\"notification ".$class."\">";
		$return.=$_SESSION['msg_er'][$mod][$sec]['page']['note'];
		$return.="</div>";

		unset($_SESSION['msg_er'][$mod][$sec]['page']);
	}

	clearErMsg($mod,$sec);

	return $return;
}

function setMsgField($mod, $sec, $field, $type, $note)
{
	//possible values for type
	//success
	//information
	//warning
	//error

	if(!isset($_SESSION['msg_er'])) $_SESSION['msg_er']=array();

	if(!isset($_SESSION['msg_er'][$mod])) $_SESSION['msg_er'][$mod]=array();
	if(!isset($_SESSION['msg_er'][$mod][$sec])) $_SESSION['msg_er'][$mod][$sec]=array();

	if(!isset($_SESSION['msg_er'][$mod][$sec]['field'])) $_SESSION['msg_er'][$mod][$sec]['field']=array();

	$_SESSION['msg_er'][$mod][$sec]['field'][$field]=array(
														   'type'=>$type,
														   'note'=>$note
														   );
}

function getMsgField($mod, $sec, $field)
{
	$return='';
	if(isset($_SESSION['msg_er'][$mod][$sec]['field'][$field]) && is_array($_SESSION['msg_er'][$mod][$sec]['field'][$field]) && count($_SESSION['msg_er'][$mod][$sec]['field'][$field])>0)
	{
		$class=$_SESSION['msg_er'][$mod][$sec]['field'][$field]['type'];
		$return="<span class=\"notification ".$class."\">";
		$return.=$_SESSION['msg_er'][$mod][$sec]['field'][$field]['note'];
		$return.="</span>";
		unset($_SESSION['msg_er'][$mod][$sec]['field'][$field]);
	}
	if(isset($_SESSION['msg_er'][$mod][$sec]['field']) && is_array($_SESSION['msg_er'][$mod][$sec]['field']) && count($_SESSION['msg_er'][$mod][$sec]['field'])===0) unset($_SESSION['msg_er'][$mod][$sec]['field']);

	clearErMsg($mod,$sec);

	return $return;
}

function clearErMsg($mod,$sec)
{
	if(isset($_SESSION['msg_er'][$mod][$sec]) && is_array($_SESSION['msg_er'][$mod][$sec]) && count($_SESSION['msg_er'][$mod][$sec])===0) unset($_SESSION['msg_er'][$mod][$sec]);

	if(isset($_SESSION['msg_er'][$mod]) && is_array($_SESSION['msg_er'][$mod]) && count($_SESSION['msg_er'][$mod])===0) unset($_SESSION['msg_er'][$mod]);

	if(isset($_SESSION['msg_er']) && is_array($_SESSION['msg_er']) && count($_SESSION['msg_er'])===0) unset($_SESSION['msg_er']);
}

function setSort($mod,$sec,$val)
{
	if(!isset($_SESSION['sort'])) $_SESSION['sort']=array();
	if(!isset($_SESSION['sort'][$mod])) $_SESSION['sort'][$mod]=array();

	$_SESSION['sort'][$mod][$sec]=$val;
}

function getSort($mod,$sec)
{
	return $_SESSION['sort'][$mod][$sec];
}

function curPageURL()
{
	$pageURL = 'http';
 	if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
 	$pageURL .= "://";
 	if ($_SERVER["SERVER_PORT"] != "80")
	{
  		$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
 	}
	else
	{
  		$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
 	}
 	return $pageURL;
}

function getQueryString($aryQueryStr)
{
	$aryMatch=array();
	foreach($aryQueryStr as $opt=>$val) { $aryMatch[]=$opt.'='.urlencode($val); }
	return '?'.implode('&',$aryMatch);
}

function selected($needle,$haystack)
{
	if(is_array($haystack) && in_array($needle,$haystack)) { return 'selected="selected"'; }
	elseif(!is_array($haystack) && $needle===$haystack) { return 'selected="selected"'; }
	else { return ''; }
}

function checked($needle,$haystack)
{
	if(is_array($haystack) && in_array($needle,$haystack)) { return 'checked="checked"'; }
	elseif(!is_array($haystack) && $needle===$haystack) { return 'checked="checked"'; }
	else { return ''; }
}

function isValidDate($val)
{
	if(preg_match(REGX_DATE,$val))
	{
		list($year,$month,$date)=explode("-",$val);
		if(checkdate($month,$date,$year)) return true;
	}
	return false;
}

function getPaging($refUrl,$aryOpts,$pgCnt,$curPg)
{
//	echo $aryOpts." ".$pgCnt." ".$curPg;
	$return='';
	$return.='<div class="dataTables_paginate paging_bootstrap"><ul class="pagination" >';
	if($curPg>1)
	{
		$aryOpts['pg']=1;
		$return.='<li><a href="'.$refUrl.getQueryString($aryOpts).'">First</a></li>';

		$aryOpts['pg']=$curPg-1;
		$return.='<li><a href="'.$refUrl.getQueryString($aryOpts).'">Prev</a></li>';
	}
	for($i=1;$i<=$pgCnt;$i++)
	{
		$aryOpts['pg']=$i;

		if($curPg==$i)
		{
			$return.='<li class="active" ><a href="'.$refUrl.getQueryString($aryOpts).'" class="';

			$return.='" >'.$i.'</a></li>';
		}
		else
		{
			$return.='<li ><a href="'.href($refUrl,getQueryString($aryOpts)).'" class="';
		    //	$return.='<li ><a href="'.$refUrl.getQueryString($aryOpts).'" class="';
			$return.='" >'.$i.'</a></li>';
		}
		/*
		$return.='<li ><a href="'.$refUrl.getQueryString($aryOpts).'" class="';
		if($curPg==$i) $return.=' active';
		$return.='" >'.$i.'</a></li>';*/
	}
	if($curPg<$pgCnt)
	{
		$aryOpts['pg']=$curPg+1;
		$return.='<li><a href="'.$refUrl.getQueryString($aryOpts).'">Next</a></li>';
		$aryOpts['pg']=$pgCnt;
		$return.='<li><a href="'.$refUrl.getQueryString($aryOpts).'">Last</a></li>';
	}
	$return.='</ul></div>';
	return $return;
}

function isAdmin()
{
	if(isset($_SESSION[LOGIN_ADMIN]) && is_array($_SESSION[LOGIN_ADMIN]) && isset($_SESSION[LOGIN_ADMIN]['id'])) return true;
	return false;
}

function getFileSize($path)
{
	if(is_array($path) && count($path)>0)
	{
		//if(!file_exists($path)) return 0;
		//if(is_file($path)) return filesize($path);
		$ret = 0;
		foreach($path as $file)
			$ret+=getFileSize($file);
		return $ret;
	}
	else
	{
		if(!file_exists($path)) return 0;
		if(is_file($path)) return filesize($path);
	}
}

function formatBytes($bytes, $precision = 2) {
    $units = array('B', 'KB', 'MB', 'GB', 'TB');

    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);

    $bytes /= pow(1024, $pow);

    return round($bytes, $precision) . ' ' . $units[$pow];
	//return $bytes;
}

function getRealIpAddr()
{
    if(!empty($_SERVER['HTTP_CLIENT_IP']))//check ip from share internet
    {
		$ip=$_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))//to check ip is pass from proxy
    {
		$ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else
    {
		$ip=$_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

function fetchSetting($mixVal)
{
	$aryReturn=array();
	$strSetting='';
	if(is_array($mixVal) && count($mixVal)>0)
	{
		$strSetting="'".implode("', '",$mixVal)."'";
	}
	elseif(trim($mixVal)!='')
	{
		$strSetting="'".$mixVal."'";
	}
	if(trim($strSetting)!='')
	{
		global $db;
		$arySetData=$db->getRows("select * from settings where `field` in (".$strSetting.")");
		if(is_array($arySetData) && count($arySetData)>0)
		{
			foreach($arySetData as $iSetData)
			{
				$aryReturn[$iSetData['field']]=$iSetData['value'];
			}
		}
	}
	return $aryReturn;
}

function getStatusImg($status)
{
	$aryImg=array(
				  '0'=>"status_inactive.png",
				  '1'=>"status_active.png"
				  );
	return '<img src="'.URL_ADMIN_IMG.$aryImg[$status].'" title="'.getStatusStr($status).'" />';
}

function getStatusAds($status)
{
	$aryImg=array(
				  '0'=>"status_inactive.png",
				  '1'=>"status_active.png",
				   '2'=>"status_inactive.png"
				  );
	return '<img src="'.URL_ADMIN_IMG.$aryImg[$status].'" title="'.getStatusAdsstr($status).'" />';
}

function getStatusUserImg($status)
{
	$aryImg=array(
				  '0'=>"status_pending.png",
				  '1'=>"status_active.png",
				  '2'=>"status_inactive.png"
				  );
	return '<img src="'.URL_ADMIN_IMG.$aryImg[$status].'" title="'.getStatusUserStr($status).'" />';
}




function getOptionImg($status)
{
	$aryImg=array(
				  '0'=>"cross.png",
				  '1'=>"tick.png"
				  );
	return '<img src="'.URL_ADMIN_IMG."icons/".$aryImg[$status].'" />';
}

function getStatusStr($val)
{
	if($val==0)
	{
		return "Inactive";
	}
	else
	{
		return "Active";
	}
}
function getStatusAdsstr($val)
{
	if($val==0)
	{
		return "Pending";
	}
	else if($val==2)
	{
		return "Reject";
	}
	else
	{
		return "Approved";
	}
}

function getStatusUserStr1($val)
{
	if($val==2)
	{
		return "Block";
	}
	else if($val==0)
	{
		return "Pending";
	}
	else
	{
		return "Active";
	}
}

function getStatusUserStr($val)
{
	if($val==2)
	{
		return "Inactive";
	}
	elseif($val==0)
	{
		return "Pending";
	}
	else
	{
		return "Active";
	}
}

function getOptionStr($val)
{
	if($val==0)
	{
		return "No";
	}
	else
	{
		return "Yes";
	}
}

function delete_directory($dirname)
{
	if (is_dir($dirname))
      $dir_handle = opendir($dirname);
   if (!$dir_handle)
      return false;
   while($file = readdir($dir_handle))
   {
      if ($file != "." && $file != "..")
	  {
         if (!is_dir($dirname.DS.$file))
            @unlink($dirname.DS.$file);
         else
            delete_directory($dirname.DS.$file);
      }
   }
   closedir($dir_handle);
   @rmdir($dirname);
   return true;
}

function check_login($userType='User')
{
	if($userType=='User' && (!isset($_SESSION[LOGIN_USER]) || count($_SESSION[LOGIN_USER])==0))
		return false;
	elseif($userType=='Admin' && (!isset($_SESSION[LOGIN_ADMIN]) || count($_SESSION[LOGIN_ADMIN])==0))
		return false;

	return true;
}

function resizeVideo($markup, $dimensions)
{
    $w = $dimensions['width'];
    $h = $dimensions['height'];

    $patterns = array();
    $replacements = array();
    if( !empty($w) )
    {
        $patterns[] = '/width="([0-9]+)"/';
        $patterns[] = '/width:([0-9]+)/';
        $patterns[] = '/width="([0-9]+)px"/';

        $replacements[] = 'width="'.$w.'"';
        $replacements[] = 'width:'.$w;
		$replacements[] = 'width="'.$w.'px"';
    }

    if( !empty($h) )
    {
        $patterns[] = '/height="([0-9]+)"/';
        $patterns[] = '/height:([0-9]+)/';
        $patterns[] = '/height="([0-9]+)px"/';

        $replacements[] = 'height="'.$h.'"';
        $replacements[] = 'height:'.$h;
		$replacements[] = 'height="'.$h.'px"';
    }

    return preg_replace($patterns, $replacements, $markup);
}
function listDirs($where){
	$directoryarr=array();
    $itemHandler=opendir($where);
    $i=0;
    while(($item=readdir($itemHandler)) !== false){
	if ($item == "." || $item == "..") { }
	else {$directoryarr[]=$item;}
       }
	  return($directoryarr);
}
function recurse_copy($src,$dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if ( is_dir($src . '/' . $file) ) {
                recurse_copy($src . '/' . $file,$dst . '/' . $file);
            }
            else {
                copy($src . '/' . $file,$dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}
function calc_dist($latitude1, $longitude1, $latitude2, $longitude2) {
$thet = $longitude1 - $longitude2;
$dist = (sin(deg2rad($latitude1)) * sin(deg2rad($latitude2))) + (cos(deg2rad($latitude1)) * cos(deg2rad($latitude2)) * cos(deg2rad($thet)));
$dist = acos($dist);
$dist = rad2deg($dist);
$kmperlat = 111.325; // Kilometers per degree latitude constant
$dist = $dist * $kmperlat;
return (round($dist));
}

//Calculates distance in KM between postcodes
function postcode_dist($postcode1,$postcode2, $suburb1 = '', $suburb2 = '') {
//Get lat and lon for postcode 1
$extra = "";
if ($suburb1 != '') {
$extra = " and suburb = '$suburb1'";
}
$sqlquery = "SELECT * FROM postcode_db WHERE lat <> 0 and lon <> 0 and postcode = '$postcode1'$extra";
$res = mysql_query($sqlquery);
$num = mysql_num_rows($res);


//Get lat and lon for postcode 2

$extra = "";
if ($suburb2 != '') {
$extra = " and suburb = '$suburb2'";
}
$sqlquery = "SELECT * FROM postcode_db WHERE lat <> 0 and lon <> 0 and postcode = '$postcode2'$extra";
$res1 = mysql_query($sqlquery);
$num1 = mysql_num_rows($res1);

if ($num != 0 && $num1 != 0) {
//proceed
$lat1 = mysql_result($res,0,"lat");
$lon1 = mysql_result($res,0,"lon");
$lat2 = mysql_result($res1,0,"lat");
$lon2 = mysql_result($res1,0,"lon");
$dist = calc_dist($lat1, $lon1, $lat2, $lon2);
if (is_numeric($dist)) {
return $dist;
}
else
{
return "Unknown";
}
}
else
{
return "Unknown";
}
}
function getPagingfront($refUrl,$aryOpts,$pgCnt,$curPg)
{
//	echo $aryOpts." ".$pgCnt." ".$curPg;
	$return='';
	$return.='<div class="pagination"><ul>';
	if($curPg>1)
	{
		$aryOpts['pg']=1;
		$return.='<li class="prev"><a href="'.$refUrl.getQueryString($aryOpts).'">First</a></li>';

		$aryOpts['pg']=$curPg-1;
		$return.='<li class="prev"><a href="'.$refUrl.getQueryString($aryOpts).'">Prev</a></li>';
	}
	for($i=1;$i<=$pgCnt;$i++)
	{
		$aryOpts['pg']=$i;
		$return.='<li><a href="'.$refUrl.getQueryString($aryOpts).'" class="graybutton pagelink';
		if($curPg==$i) $return.=' active';
		$return.='" >'.$i.'</a></li>';
	}
	if($curPg<$pgCnt)
	{
		$aryOpts['pg']=$curPg+1;
		$return.='<li class="prev"><a href="'.$refUrl.getQueryString($aryOpts).'">Next</a></li>';
		$aryOpts['pg']=$pgCnt;
		$return.='<li class="prev"><a href="'.$refUrl.getQueryString($aryOpts).'">Last</a></li>';
	}
	$return.='</ul></div>';
	return $return;
}


function getPagingfront2($refUrl,$aryOpts,$pgCnt,$curPg)
{

	$maxPage = 0;
	$return='';

        $return.='<div ><ul class="pagination">';
	if($curPg>1)
	{
		$aryOpts['pg']=1;
		$return.=' <li><a href="'.$refUrl.getQueryString($aryOpts).'">First</a></li> ';

		$aryOpts['pg']=$curPg-1;
		$return.=' <li><a href="'.$refUrl.getQueryString($aryOpts).'"> ← Previous</a></li> ';
	}
	$range = $curPg;

	$upto = $range+2;

	$downto = $range-2;

	if($upto > $maxPage)
	{

		$maxPage = $upto;
	}
	if($downto<=0)
	{
		$downto = 1;
	}
	if($maxPage>1)
	{
		for($i=$downto;$i<=$upto && $i<=$pgCnt;$i++)
		{
                    /*
                    $aryOpts['pg']=$i;
                    $return.=' <li><a href="'.$refUrl.getQueryString($aryOpts).'" class="';
                    if($curPg==$i) $return.=' active';
                    $return.='" >'.$i.'</a></li> ';

                     */

                    $aryOpts['pg']=$i;
                    $return.=' <li class="';
                    if($curPg==$i) $return.=' active';
                    $return.='" ><a href="'.$refUrl.getQueryString($aryOpts).'">'.$i.'</a></li> ';

		}
	}

	if($curPg<$pgCnt)
	{
		$aryOpts['pg']=$curPg+1;
		$return.=' <li><a href="'.$refUrl.getQueryString($aryOpts).'">Next → </a></li> ';
		$aryOpts['pg']=$pgCnt;
		$return.=' <li><a href="'.$refUrl.getQueryString($aryOpts).'">Last</a></li> ';
	}
        $return.='</ul></div>';

	return $return;
}



function enum_select( $table , $field )
{
	$query = "SHOW COLUMNS FROM `$table` LIKE '$field' ";
	$result = mysql_query( $query ) or die( 'error getting enum field ' . mysql_error() );
	$row = mysql_fetch_array( $result , MYSQL_NUM );
	#extract the values
	#the values are enclosed in single quotes
	#and separated by commas
	$regex = "/'(.*?)'/";
	preg_match_all( $regex , $row[1], $enum_array );
	$enum_fields = $enum_array[1];
	return( $enum_fields );
}
function randomFix($length)
{
	$random= "";

	srand((double)microtime()*1000000);

	$data = "AbcDE123IJKLMN67QRSTUVWXYZ";
	$data .= "aBCdefghijklmn123opq45rs67tuv89wxyz";
	$data .= "0FGH45OP89";

	for($i = 0; $i < $length; $i++)
	{
		$random .= substr($data, (rand()%(strlen($data))), 1);
	}
	return $random;
}
function href($page,$param="")
{
	global $db;
	$sef="1";
	if($sef=="1")
	{
		$x = explode("&",$param);

		$var = array();
		foreach($x as $k1 => $v1)
		{
			$x2 = explode("=",$v1);
			$x2[0]=str_replace("?","",$x2[0]);
			$var[$x2[0]]=$x2[1];
		}

		switch($page)
		{
			case 'test.php':
			{
			    return 	URL_ROOT."wallpaper/".$var['filter']."/page-".$var['pg'];
				break;
			}
			case 'training.php':
			{
				return 	URL_ROOT."training.htm";
				break;
			}
			case 'consultancy.php' :
			{
				return 	URL_ROOT."consultancy.htm";
				break;
			}
			case 'connect.php' :
			{
				return 	URL_ROOT."contactus.htm";
				break;
			}

			case 'album.php':
			{
				return 	URL_ROOT."album.htm";
				break;
			}
		default:
			{
				if($param=="")
				{
				  return URL_ROOT.$page;
				}
				else
				{
				  return URL_ROOT.$page.'?'.$param;
				}
			}
		}

	}
	else
	{
		if($param=="")
		{
		  return URL_ROOT.$page;
		}
		else
		{
		  return URL_ROOT.'/'.$page.'?'.$param;
		}
	}
}
function create_token($nm="token")
{
	$_SESSION[$nm] = time();
	echo '<input type="hidden" name="'.$nm.'"  value="'.$_SESSION[$nm].'"/>';
}

function token($nm="token")
{
 if($_SESSION[$nm]==$_POST[$nm])
	return true;
 else
 	return false;
}
function convertdatenew($date)
{
$arrdate=explode('-',$date);
return $arrdate[2].'-'.$arrdate[0].'-'.$arrdate[1];
}

function convertdatenew1($date)
{
$arrdate=explode('-',$date);
return $arrdate[0].'-'.$arrdate[1].'-'.$arrdate[2];
}

class Paging
{

	var $rowsPerPage =30;

	var $pageNum = 1;

	var $numrows = 0;

	var $maxPage = 0;

	var $offset = 0;



	function sql($sqlquery)

	{

	  $this->pageNum = isset($_REQUEST['gotopage'])?$_REQUEST['gotopage']:1;

	  $this->offset = ($this->pageNum - 1) * $this->rowsPerPage;

	  $q = mysql_query($sqlquery. " LIMIT ".$this->offset.", ".$this->rowsPerPage) or die(mysql_error());

	  $q2 = mysql_query($sqlquery) or die(mysql_error());

	  $this->numrows = mysql_num_rows($q2);

 	  $this->maxPage = ceil($this->numrows/$this->rowsPerPage);

		while($row=mysql_fetch_array($q)) { $aryResult[]=$row; }
	  return $aryResult;

	}
	function navigations($param='ser=')
	{

		$self = basename($_SERVER['PHP_SELF']);


		$self = $self ."?".$param;

		if ($this->pageNum > 1)

		{

			$gotopage = $this->pageNum - 1;

			$prev = "<td class=\"text\"><a class=\"head\" href=\"$self&gotopage=$gotopage\">Previous</a></td>";



			$first = "<td class=\"text\"><a class=\"head\" href=\"$self&gotopage=1\">First</a></td>";

		}

		else

		{

			$prev  = '';       // we're on page one, don't enable 'previous' link

			$first = ''; // nor 'first page' link

		}

		if ($this->pageNum < $this->maxPage)

		{

			$gotopage = $this->pageNum + 1;

			$next = "<td class=\"text\"><a class=\"head\" href=\"$self&gotopage=$gotopage\">Next</a></td>";



			$last = "<td class=\"text\"><a class=\"head\" href=\"$self&gotopage=".$this->maxPage."\">Last</a></td>";

		}

		else

		{

			$next = '';      // we're on the last page, don't enable 'next' link

			$last = ''; // nor 'last page' link

		}

		$i=$this->pageNum;

		$upto=$i+5;

		$downto=$i-5;

		if($upto>$this->maxPage)

		{

			$upto=$this->maxPage;

		}



		if($downto<=0)



		{

			$downto=1;

		}



		if($this->maxPage>1)

		{

			for($i=$downto;$i<=$upto;$i++)

			{

				if($i==$this->pageNum)

				{

				$pages .= '<td class="page">'."<a href=\"$self&gotopage=$i\">".$i.'</a></td>';

				}

				else

				{

				$pages .= "<td><a href=\"$self&gotopage=$i\">$i</a></td>";

				}



			}

		}


		return '<tr>'.$first . $prev."&nbsp;&nbsp;$pages&nbsp;&nbsp;".$next . $last.'</tr>';

	}
}
class Paging_social
{
	var $rowsPerPage =10;

	var $pageNum = 1;

	var $numrows = 0;

	var $maxPage = 0;

	var $offset = 0;

	function sql($fields="*",$table,$cond='')

	{

	  $this->pageNum = isset($_REQUEST['gotopage'])?$_REQUEST['gotopage']:1;

	  $this->offset = ($this->pageNum - 1) * $this->rowsPerPage;

	  $q = mysql_query("select $fields from $table $cond LIMIT ".$this->offset.", ".$this->rowsPerPage);

	  $q2 = mysql_query("select $fields from $table $cond  ");

	  $this->numrows = mysql_num_rows($q2);

 	  $this->maxPage = ceil($this->numrows/$this->rowsPerPage);

	  return $q;

	}


	function navigations($param='')

	{
		$self = basename($_SERVER['PHP_SELF']);

		if ($this->pageNum > 1)
		{
			$gotopage = $this->pageNum - 1;
			if($self=='index.php')
			{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$gotopage");
				$prev = '<li><a href="'.$href.'">'.PREVIOUS.'</a></li>';

				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=1");

				$first = '<li><a href="'.$href.'">'.FIRST.'</a></li>';

			}
			else
			{
				if($param)
				{
					$href= href($self,"gotopage=$gotopage&$param");
				}
				else
				{
					$href= href($self,"gotopage=$gotopage");
				}
				$prev = '<li><a  href="'.$href.'">'.PREVIOUS.'</a></li>';

				$href= href($self,"gotopage=1");

				$first = '<li><a  href="'.$href.'">'.FIRST.'</a></li>';

			}
		}
		else
		{
			$prev  = '';       // we're on page one, don't enable 'previous' link

			$first = ''; // nor 'first page' link
		}
		if ($this->pageNum < $this->maxPage)
		{
			$gotopage = $this->pageNum + 1;

			if($self=='index.php')
			{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$gotopage");

				$next = '<li><a  href="'.$href.'">'.NEXT.'</a></li>';

				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=".$this->maxPage);

				$last = '<li><a  href="'.$href.'">'.LAST.'</a></li>';

			}
			else
			{
				if($param)
				{
					$href= href($self,"gotopage=$gotopage&$param");

					$next = '<li><a  href="'.$href.'">'.NEXT.'</a></li>';

					$href= href($self,"gotopage=".$this->maxPage."&$param");

					$last = '<li><a href="'.$href.'">'.LAST.'</a></li>';

				}

				else

				{

					$href= href($self,"gotopage=$gotopage");

					$next = '<li><a href="'.$href.'">'.NEXT.'</a></li>';



					$href= href($self,"gotopage=".$this->maxPage);

					$last = '<li><a href="'.$href.'">'.LAST.'</a></li>';

				}

			}

		}

		else

		{
			$next = '';      // we're on the last page, don't enable 'next' link

			$last = ''; // nor 'last page' link

		}

		$i=$this->pageNum;

		$upto=$i+5;

		$downto=$i-5;

		if($upto>$this->maxPage)

		{

			$upto=$this->maxPage;

		}

		if($downto<=0)

		{

			$downto=1;

		}

		if($this->maxPage>1)

		{

			for($i=$downto;$i<=$upto;$i++)

			{

				if($i==$this->pageNum)

				{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$i");
				$pages .= '<li class="selected"><a href="'.$href.'">'.$i.'</a></li>';

				}

				else

				{
					if($self=='index.php')

					{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$i");

						$pages .= '<li><a href="'.$href.'">'.$i.'</a></li>';
				}
				else
				{
						if($param)
						{
							$href= href($self,"gotopage=$i&$param");
							$pages .= '<li><a  href="'.$href.'">'.$i.'</a></li>';
						}
						else
						{
							$href= href($self,"gotopage=$i");
							$pages .= '<li><a href="'.$href.'">'.$i.'</a></li>';
						}
					}
				}
			}
		}
		if($pages)
		return '<ul class="pagination">'."$prev $pages $next".'</ul>';
		else
		return false;
	}



}

class Paging_social2
{
	var $rowsPerPage =10;

	var $pageNum = 1;

	var $numrows = 0;

	var $maxPage = 0;

	var $offset = 0;

	function sql2($fields="*",$table,$cond='')

	{

	  $this->pageNum = isset($_REQUEST['gotopage'])?$_REQUEST['gotopage']:1;

	  $this->offset = ($this->pageNum - 1) * $this->rowsPerPage;

	  $q = mysql_query("select $fields from $table $cond LIMIT ".$this->offset.", ".$this->rowsPerPage);

	  $q2 = mysql_query("select $fields from $table $cond  ");

	  $this->numrows = mysql_num_rows($q2);

 	  $this->maxPage = ceil($this->numrows/$this->rowsPerPage);

	  return $q;

	}


	function navigations($param='')

	{
		$self = basename($_SERVER['PHP_SELF']);

		if ($this->pageNum > 1)
		{
			$gotopage = $this->pageNum - 1;
			if($self=='index.php')
			{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$gotopage");
				$prev = '<li><a href="'.$href.'">'.PREVIOUS.'</a></li>';

				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=1");

				$first = '<li><a href="'.$href.'">'.FIRST.'</a></li>';

			}
			else
			{
				if($param)
				{
					$href= href($self,"gotopage=$gotopage&$param");
				}
				else
				{
					$href= href($self,"gotopage=$gotopage");
				}
				$prev = '<li><a  href="'.$href.'">'.PREVIOUS.'</a></li>';

				$href= href($self,"gotopage=1");

				$first = '<li><a  href="'.$href.'">'.FIRST.'</a></li>';

			}
		}
		else
		{
			$prev  = '';       // we're on page one, don't enable 'previous' link

			$first = ''; // nor 'first page' link
		}
		if ($this->pageNum < $this->maxPage)
		{
			$gotopage = $this->pageNum + 1;

			if($self=='index.php')
			{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$gotopage");

				$next = '<li><a  href="'.$href.'">'.NEXT.'</a></li>';

				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=".$this->maxPage);

				$last = '<li><a  href="'.$href.'">'.LAST.'</a></li>';

			}
			else
			{
				if($param)
				{
					$href= href($self,"gotopage=$gotopage&$param");

					$next = '<li><a  href="'.$href.'">'.NEXT.'</a></li>';

					$href= href($self,"gotopage=".$this->maxPage."&$param");

					$last = '<li><a href="'.$href.'">'.LAST.'</a></li>';

				}

				else

				{

					$href= href($self,"gotopage=$gotopage");

					$next = '<li><a href="'.$href.'">'.NEXT.'</a></li>';



					$href= href($self,"gotopage=".$this->maxPage);

					$last = '<li><a href="'.$href.'">'.LAST.'</a></li>';

				}

			}

		}

		else

		{
			$next = '';      // we're on the last page, don't enable 'next' link

			$last = ''; // nor 'last page' link

		}

		$i=$this->pageNum;

		$upto=$i+5;

		$downto=$i-5;

		if($upto>$this->maxPage)

		{

			$upto=$this->maxPage;

		}

		if($downto<=0)

		{

			$downto=1;

		}

		if($this->maxPage>1)

		{

			for($i=$downto;$i<=$upto;$i++)

			{

				if($i==$this->pageNum)

				{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$i");
				$pages .= '<li class="selected"><a href="'.$href.'">'.$i.'</a></li>';

				}

				else

				{
					if($self=='index.php')

					{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$i");

						$pages .= '<li><a href="'.$href.'">'.$i.'</a></li>';
				}
				else
				{
						if($param)
						{
							$href= href($self,"gotopage=$i&$param");
							$pages .= '<li><a  href="'.$href.'">'.$i.'</a></li>';
						}
						else
						{
							$href= href($self,"gotopage=$i");
							$pages .= '<li><a href="'.$href.'">'.$i.'</a></li>';
						}
					}
				}
			}
		}
		if($pages)
		return '<ul class="pagination">'."$prev $pages $next".'</ul>';
		else
		return false;
	}



}

class Paging_ads
{
	var $rowsPerPage =10;

	var $pageNum = 1;

	var $numrows = 0;

	var $maxPage = 0;

	var $offset = 0;

	function sql($fields="*",$table,$cond='')

	{

	  $this->pageNum = isset($_REQUEST['gotopage'])?$_REQUEST['gotopage']:1;

	  $this->offset = ($this->pageNum - 1) * $this->rowsPerPage;

	  $q = mysql_query("select $fields from $table $cond LIMIT ".$this->offset.", ".$this->rowsPerPage);

	  $q2 = mysql_query("select $fields from $table $cond  ");

	  $this->numrows = mysql_num_rows($q2);

 	  $this->maxPage = ceil($this->numrows/$this->rowsPerPage);

	  return $q;

	}


	function navigations($param='')

	{
		$self = basename($_SERVER['PHP_SELF']);

		if ($this->pageNum > 1)
		{
			$gotopage = $this->pageNum - 1;
			if($self=='index.php')
			{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$gotopage");
				$prev = '<li><a href="'.$href.'">'.PREVIOUS.'</a></li>';

				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=1");

				$first = '<li><a href="'.$href.'">'.FIRST.'</a></li>';

			}
			else
			{
				if($param)
				{
					$href= href($self,"gotopage=$gotopage&$param");
				}
				else
				{
					$href= href($self,"gotopage=$gotopage");
				}
				$prev = '<li><a  href="'.$href.'">'.PREVIOUS.'</a></li>';

				$href= href($self,"gotopage=1");

				$first = '<li><a  href="'.$href.'">'.FIRST.'</a></li>';

			}
		}
		else
		{
			$prev  = '';       // we're on page one, don't enable 'previous' link

			$first = ''; // nor 'first page' link
		}
		if ($this->pageNum < $this->maxPage)
		{
			$gotopage = $this->pageNum + 1;

			if($self=='index.php')
			{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$gotopage");

				$next = '<li><a  href="'.$href.'">'.NEXT.'</a></li>';

				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=".$this->maxPage);

				$last = '<li><a  href="'.$href.'">'.LAST.'</a></li>';

			}
			else
			{
				if($param)
				{
					$href= href($self,"gotopage=$gotopage&$param");

					$next = '<li><a  href="'.$href.'">'.NEXT.'</a></li>';

					$href= href($self,"gotopage=".$this->maxPage."&$param");

					$last = '<li><a href="'.$href.'">'.LAST.'</a></li>';

				}

				else

				{

					$href= href($self,"gotopage=$gotopage");

					$next = '<li><a href="'.$href.'">'.NEXT.'</a></li>';



					$href= href($self,"gotopage=".$this->maxPage);

					$last = '<li><a href="'.$href.'">'.LAST.'</a></li>';

				}

			}

		}

		else

		{
			$next = '';      // we're on the last page, don't enable 'next' link

			$last = ''; // nor 'last page' link

		}

		$i=$this->pageNum;

		$upto=$i+5;

		$downto=$i-5;

		if($upto>$this->maxPage)

		{

			$upto=$this->maxPage;

		}

		if($downto<=0)

		{

			$downto=1;

		}

		if($this->maxPage>1)

		{

			for($i=$downto;$i<=$upto;$i++)

			{

				if($i==$this->pageNum)

				{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$i");
				$pages .= '<li ><a href="'.$href.'" class="active">'.$i.'</a></li>';

				}

				else

				{
					if($self=='index.php')

					{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$i");

						$pages .= '<li><a href="'.$href.'">'.$i.'</a></li>';
				}
				else
				{
						if($param)
						{
							$href= href($self,"gotopage=$i&$param");
							$pages .= '<li><a  href="'.$href.'">'.$i.'</a></li>';
						}
						else
						{
							$href= href($self,"gotopage=$i");
							$pages .= '<li><a href="'.$href.'">'.$i.'</a></li>';
						}
					}
				}
			}
		}
		if($pages)
		return '<ul class="paging">'."$prev $pages $next".'</ul>';
		else
		return false;
	}



}


function get_youtube_video_image($youtube_code)
{
	// get the video code if this is an embed code	(old embed)
	preg_match('/youtube\.com\/v\/([\w\-]+)/', $youtube_code, $match);

	// if old embed returned an empty ID, try capuring the ID from the new iframe embed
	if($match[1] == '')
		preg_match('/youtube\.com\/embed\/([\w\-]+)/', $youtube_code, $match);

	// if it is not an embed code, get the video code from the youtube URL
	if($match[1] == '')
		preg_match('/v\=(.+)&/',$youtube_code ,$match);

	// get the corresponding thumbnail images
	$full_size_thumbnail_image = "http://img.youtube.com/vi/".$match[1]."/0.jpg";
	$small_thumbnail_image1 = "http://img.youtube.com/vi/".$match[1]."/1.jpg";
	$small_thumbnail_image2 = "http://img.youtube.com/vi/".$match[1]."/2.jpg";
	$small_thumbnail_image3 = "http://img.youtube.com/vi/".$match[1]."/3.jpg";

	// return whichever thumbnail image you would like to retrieve
	return $small_thumbnail_image1;
}
function get_Advertise_Banner($cookie,$page_id,$banner_area)
{
	global $db;
	if(isset($cookie) && $cookie!="" && $cookie!='All')
	{
		$getTopBanner=$db->getVal("SELECT banner_image FROM advertisement WHERE region = '".$cookie."' AND page_id='".$page_id."' AND banner_area='".$banner_area."' AND (from_date<='".date('Y-m-d')."' AND to_date>='".date('Y-m-d')."') AND payment_status=2 AND status=1");
		if(!isset($getTopBanner))
		{
				$getTopBanner=$db->getVal("SELECT banner_image FROM advertisement WHERE region = '".$cookie."' AND page_id='".$page_id."' AND banner_area='".$banner_area."' AND user_id=0 AND payment_status=2 AND status=1");
		}
	}
	else
	{
		$getTopBanner=$db->getVal("SELECT banner_image FROM advertisement WHERE region = 'All' AND page_id='".$page_id."' AND banner_area='".$banner_area."' AND (from_date<='".date('Y-m-d')."' AND to_date>='".date('Y-m-d')."') AND payment_status=2 AND status=1");
		if(!isset($getTopBanner))
		{
				$getTopBanner=$db->getVal("SELECT banner_image FROM advertisement WHERE region = 'All' AND page_id='".$page_id."' AND banner_area='".$banner_area."' AND user_id=0 AND payment_status=2 AND status=1");
		}
	}
	return $getTopBanner;
}
function getFeatureBanner($cookie,$page_id,$banner_area)
{
	global $db;
	if(isset($cookie) && $cookie!="" && $cookie!='All')
	{
		$getFeatureBanner=$db->getRows("SELECT banner_image, description FROM advertisement WHERE region = '".$cookie."' AND page_id='".$page_id."' AND banner_area='".$banner_area."' AND (from_date<='".date('Y-m-d')."' AND to_date>='".date('Y-m-d')."') AND payment_status=2 AND status=1");
		if(is_array($getFeatureBanner) && count($getFeatureBanner)==0)
		{
				$getFeatureBanner=$db->getRows("SELECT banner_image, description FROM advertisement WHERE region = '".$cookie."' AND page_id='".$page_id."' AND banner_area='".$banner_area."' AND user_id=0 AND payment_status=2 AND status=1");
		}
	}
	else
	{
		$getFeatureBanner=$db->getRows("SELECT banner_image, description FROM advertisement WHERE region = 'All' AND page_id='".$page_id."' AND banner_area='".$banner_area."' AND (from_date<='".date('Y-m-d')."' AND to_date>='".date('Y-m-d')."') AND payment_status=2 AND status=1");
		if(is_array($getFeatureBanner)  && count($getFeatureBanner)==0)
		{
				$getFeatureBanner=$db->getRows("SELECT banner_image, description FROM advertisement WHERE region = 'All' AND page_id='".$page_id."' AND banner_area='".$banner_area."' AND user_id=0 AND payment_status=2 AND status=1");
		}
	}
	return $getFeatureBanner;
}
function array_sort($array, $on, $order=SORT_ASC)
{
    $new_array = array();
    $sortable_array = array();

    if (count($array) > 0) {
        foreach ($array as $k => $v) {
            if (is_array($v)) {
                foreach ($v as $k2 => $v2) {
                    if ($k2 == $on) {
                        $sortable_array[$k] = $v2;
                    }
                }
            } else {
                $sortable_array[$k] = $v;
            }
        }

        switch ($order) {
            case SORT_ASC:
                asort($sortable_array);
            break;
            case SORT_DESC:
                arsort($sortable_array);
            break;
        }

        foreach ($sortable_array as $k => $v) {
            $new_array[$k] = $array[$k];
        }
    }

    return $new_array;
}

// edit by saurabh

/*function get_difftime($datefr,$dateto=-1)
{
// Defaults and assume if 0 is passed in that
// its an error rather than the epoch
$datefrom = strtotime($datefr);
if($datefrom<=0) { return "A long time ago"; }
if($dateto==-1) { $dateto = time(); }

// Calculate the difference in seconds betweeen
// the two timestamps

$difference = $dateto - $datefrom;

// If difference is less than 60 seconds,
// seconds is a good interval of choice

if($difference < 60)
{
$interval = "s";
}

// If difference is between 60 seconds and
// 60 minutes, minutes is a good interval
elseif($difference >= 60 && $difference<60*60)
{
$interval = "n";
}

// If difference is between 1 hour and 24 hours
// hours is a good interval
elseif($difference >= 60*60 && $difference<60*60*24)
{
$interval = "h";
}

// If difference is between 1 day and 7 days
// days is a good interval
elseif($difference >= 60*60*24 && $difference<60*60*24*7)
{
$interval = "d";
}

// If difference is between 1 week and 30 days
// weeks is a good interval
elseif($difference >= 60*60*24*7 && $difference <
60*60*24*30)
{
$interval = "ww";
}

// If difference is between 30 days and 365 days
// months is a good interval, again, the same thing
// applies, if the 29th February happens to exist
// between your 2 dates, the function will return
// the 'incorrect' value for a day
elseif($difference >= 60*60*24*30 && $difference <
60*60*24*365)
{
$interval = "m";
}

// If difference is greater than or equal to 365
// days, return year. This will be incorrect if
// for example, you call the function on the 28th April
// 2008 passing in 29th April 2007. It will return
// 1 year ago when in actual fact (yawn!) not quite
// a year has gone by
elseif($difference >= 60*60*24*365)
{
$interval = "y";
}

// Based on the interval, determine the
// number of units between the two dates
// From this point on, you would be hard
// pushed telling the difference between
// this function and DateDiff. If the $datediff
// returned is 1, be sure to return the singular
// of the unit, e.g. 'day' rather 'days'

switch($interval)
{
case "m":
$months_difference = floor($difference / 60 / 60 / 24 /
29);
while (mktime(date("H", $datefrom), date("i", $datefrom),
date("s", $datefrom), date("n", $datefrom)+($months_difference),
date("j", $dateto), date("Y", $datefrom)) < $dateto)
{
$months_difference++;
}
$datediff = $months_difference;

// We need this in here because it is possible
// to have an 'm' interval and a months
// difference of 12 because we are using 29 days
// in a month

if($datediff==12)
{
$datediff--;
}

$res = ($datediff==1) ? "$datediff month ago" : "$datediff
months ago";
break;

case "y":
$datediff = floor($difference / 60 / 60 / 24 / 365);
$res = ($datediff==1) ? "$datediff year ago" : "$datediff
years ago";
break;

case "d":
$datediff = floor($difference / 60 / 60 / 24);
$res = ($datediff==1) ? "$datediff day ago" : "$datediff
days ago";
break;

case "ww":
$datediff = floor($difference / 60 / 60 / 24 / 7);
$res = ($datediff==1) ? "$datediff week ago" : "$datediff
weeks ago";
break;

case "h":
$datediff = floor($difference / 60 / 60);
$res = ($datediff==1) ? "$datediff hour ago" : "$datediff
hours ago";
break;

case "n":
$datediff = floor($difference / 60);
$res = ($datediff==1) ? "$datediff minute ago" :
"$datediff minutes ago";
break;

case "s":
$datediff = $difference;
$res = ($datediff==1) ? "$datediff second ago" :
"$datediff seconds ago";
break;
}
return $res;
}*/

function time_since($time1, $time2, $precision = 6) {
	date_default_timezone_set('Asia/Calcutta');
    // If not numeric then convert texts to unix timestamps
    if (!is_int($time1)) {
      $time1 = strtotime($time1);
    }
    if (!is_int($time2)) {
      $time2 = strtotime($time2);
    }

    // If time1 is bigger than time2
    // Then swap time1 and time2
    if ($time1 > $time2) {
      $ttime = $time1;
      $time1 = $time2;
      $time2 = $ttime;
    }

    // Set up intervals and diffs arrays
    $intervals = array('year','month','day','hour','minute','second');
    $diffs = array();

    // Loop thru all intervals
    foreach ($intervals as $interval) {
      // Set default diff to 0
      $diffs[$interval] = 0;
      // Create temp time from time1 and interval
      $ttime = strtotime("+1 " . $interval, $time1);
      // Loop until temp time is smaller than time2
      while ($time2 >= $ttime) {
	$time1 = $ttime;
	$diffs[$interval]++;
	// Create new temp time from time1 and interval
	$ttime = strtotime("+1 " . $interval, $time1);
      }
    }

    $count = 0;
    $times = array();
    // Loop thru all diffs
    foreach ($diffs as $interval => $value) {
      // Break if we have needed precission
      if ($count >= $precision) {
	break;
      }
      // Add value and interval
      // if value is bigger than 0
      if ($value > 0) {
	// Add s if value is not 1
	if ($value != 1) {
	  $interval .= "s ago";
	}
	else
	{
		$interval .= " ago";
	}
	// Add value and interval to times array
	$times[] = $value . " " . $interval;
	$count++;
      }
    }

 $timeCount = count($times);
     if($times[0]!=''){ return $times[0]; } elseif($times[1]!=''){ return $times[1]; } elseif($times[2]!=''){ return $times[2]; }elseif($times[3]!=''){ return $times[3]; }elseif($times[4]!='') { return $times[4]; }elseif($times[5]!='') { return $times[5]; } else {  }

    // Return string with times
  //  return implode(", ", $times);
  }

class Paging_social1
{
	var $rowsPerPage =10;

	var $pageNum = 1;

	var $numrows = 0;

	var $maxPage = 0;

	var $offset = 0;

	function sql($fields="*",$table,$cond='')

	{

	  $this->pageNum = isset($_REQUEST['gotopage'])?$_REQUEST['gotopage']:1;

	  $this->offset = ($this->pageNum - 1) * $this->rowsPerPage;

	  $q = mysql_query("select $fields from $table $cond LIMIT ".$this->offset.", ".$this->rowsPerPage);

	  $q2 = mysql_query("select $fields from $table $cond  ");

	  $this->numrows = mysql_num_rows($q2);

 	  $this->maxPage = ceil($this->numrows/$this->rowsPerPage);

	  return $q;

	}


	function navigations($param='')

	{

		$self = basename($_SERVER['PHP_SELF']);

		if ($this->pageNum > 1)
		{
			$gotopage = $this->pageNum - 1;
			if($self=='index.php')
			{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$gotopage");
				$a=URL_IMG.'page_prev.png';
				$prev = '<li><a href="'.$href.'">'.'<img src="'.$a.'">'.'</a></li>';



				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=1");

				$first = '<li><a href="'.$href.'">'.FIRST.'</a></li>';

			}
			else
			{
				if($param)
				{
					$href= href($self,"gotopage=$gotopage&$param");
				}
				else
				{
					$href= href($self,"gotopage=$gotopage");
				}
				$prev = '<li><a  href="'.$href.'"><img src="http://192.168.0.5/deve02/club_deal/images/page_prev.png" title="Previous" /></a></li>';

				$href= href($self,"gotopage=1");

				$first = '<li><a  href="'.$href.'"><img src="http://192.168.0.5/deve02/club_deal/images/page_next.png" title="Next"  /></a></li>';

			}
		}
		else
		{
			$prev  = '';       // we're on page one, don't enable 'previous' link

			$first = ''; // nor 'first page' link
		}
		if ($this->pageNum < $this->maxPage)
		{
			$gotopage = $this->pageNum + 1;

			if($self=='index.php')
			{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$gotopage");

				$next = '<li><a  href="'.$href.'">'.NEXT.'</a></li>';

				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=".$this->maxPage);

				$last = '<li><a  href="'.$href.'">'.LAST.'</a></li>';

			}
			else
			{
				if($param)
				{
					$href= href($self,"gotopage=$gotopage&$param");

					$next = '<li><a  href="'.$href.'">'.NEXT.'</a></li>';

					$href= href($self,"gotopage=".$this->maxPage."&$param");

					$last = '<li><a href="'.$href.'">'.LAST.'</a></li>';

				}

				else

				{

					$href= href($self,"gotopage=$gotopage");

					$next = '<li><a href="'.$href.'"><img src="http://192.168.0.5/deve02/club_deal/images/page_next.png" title="Next" /></a></li>';



					$href= href($self,"gotopage=".$this->maxPage);

					$last = '<li><a href="'.$href.'">'.LAST.'</a></li>';

				}

			}

		}

		else

		{
			$next = '';      // we're on the last page, don't enable 'next' link

			$last = ''; // nor 'last page' link

		}

		$i=$this->pageNum;

		$upto=$i+5;

		$downto=$i-5;

		if($upto>$this->maxPage)

		{

			$upto=$this->maxPage;

		}

		if($downto<=0)

		{

			$downto=1;

		}

		if($this->maxPage>1)

		{

			for($i=$downto;$i<=$upto;$i++)

			{

				if($i==$this->pageNum)

				{
				//$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$i");
				//$pages .= '<li class="selected"><a href="'.$href.'">'.$i.'</a></li>';

				}

				else

				{
					if($self=='index.php')

					{
				$href =href($self,$_SERVER['QUERY_STRING']."&gotopage=$i");

						//$pages .= '<li><a href="'.$href.'">'.$i.'</a></li>';
				}
				else
				{
						if($param)
						{
							$href= href($self,"gotopage=$i&$param");
							//$pages .= '<li><a  href="'.$href.'">'.$i.'</a></li>';
						}
						else
						{
							$href= href($self,"gotopage=$i");
							$pages .= '<li><a href="'.$href.'">'.$i.'</a></li>';
						}
					}
				}
			}
		}
		if($pages)
		return "$prev  $next";
		else
		return false;
	}



}

function getdays($day_1,$day_2) {
   $diff = strtotime($day_1) - strtotime($day_2);

   $sec   = $diff % 60;
   $diff  = intval($diff / 60);
   $min   = $diff % 60;
   $diff  = intval($diff / 60);
   $hours = $diff % 24;
   $days  = intval($diff / 24);

   if($days==0)
   {
	   if($hours==0)
	   {

	   return $min .' minute ago';
	   }
	   else
	   {
		 return $hours .' hours ago';
	   }
  }
   else
   {
	   if($days==1){  return $days .' day ago';  }
	   else{ return $days .' days ago';   }

   }


  // return array($sec,$min,$hours,$days);
}


/* For currency converter */
function Currency_Converter($from=CURRENCY_FROM,$to=CURRENCY_TO,$amount=1)
{
//make string to be put in API
$string = "1".$from."=?".$to;

//Call Google API
$google_url = "http://www.google.com/ig/calculator?hl=en&q=".$string;

//Get and Store API results into a variable
$result = file_get_contents($google_url);


//Explode result to convert into an array
$result = explode('"', $result);

################################
# Right Hand Side
################################
$converted_amount = explode(' ', $result[3]);
$conversion = $converted_amount[0];
$conversion = $conversion * $amount;
$conversion = round($conversion, 2);

//Get text for converted currency
$rhs_text = ucwords(str_replace($converted_amount[0],"",$result[3]));

//Make right hand side string
$rhs = $conversion;//.$rhs_text;

################################
# Left Hand Side
################################
$google_lhs = explode(' ', $result[1]);
$from_amount = $google_lhs[0];

//Get text for converted from currency
$from_text = ucwords(str_replace($from_amount,"",$result[1]));

//Make left hand side string
$lhs = $amount." ".$from_text;

################################
# Make the result
################################
return $rhs;
}

function distance($lat1, $lon1, $lat2, $lon2, $unit)
{
	  $theta = $lon1 - $lon2;
	  $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
	  $dist = acos($dist);
	  $dist = rad2deg($dist);
	  $miles = $dist * 60 * 1.1515;
	  $unit = strtoupper($unit);

	  if ($unit == "K") {
		return ($miles * 1.609344);
	  } else if ($unit == "N") {
		  return ($miles * 0.8684);
		} else {
			return $miles;
		  }

}

function login()
{
   if($_SESSION[loginuser]['user_id']=='' || !isset($_SESSION[loginuser]['user_id'])  || $_SESSION[loginuser]['types']!=1)
	{
		redirect(href("login.php"));
	}
   elseif($_SESSION[loginuser]['profile']=='0' || $_SESSION[loginuser]['profile']=='')
	{
		redirect(href("password.php"));
	}

}

// $_SESSION[loginuser]['types']

function memberlogin()
{
   if($_SESSION[loginuser]['user_id']=='' || !isset($_SESSION[loginuser]['user_id']) || $_SESSION[loginuser]['types']!=2)
	{
		redirect(href("login.php"));
	}
   elseif($_SESSION[loginuser]['profile']=='0' || $_SESSION[loginuser]['profile']=='')
	{
		redirect(href("password.php"));
	}

}


function agencylogin()
{
   if($_SESSION[loginuser]['agency_id']=='' || !isset($_SESSION[loginuser]['agency_id']) || $_SESSION[loginuser]['types']!=4)
	{
		redirect(href("agency/login.php"));
	}
}

function candidatelogin()
{
   if($_SESSION[loginuser]['candidate_id']=='' || !isset($_SESSION[loginuser]['candidate_id']) || $_SESSION[loginuser]['types']!=3)
	{
		redirect(href("candidates/login.php"));
	}
}
function mail_template($to,$email_type,$vars=NULL,$lang="it",$subject=NULL,$body=NULL)
{
	date_default_timezone_set('Europe/Rome');
//	echo "to : ".$to;
//	echo "<br/><br/>";
//	echo "subject : ".$subject;
//	echo "<br/><br/>";
 error_log("parametri mail".$to.PHP_EOL.$email_type.PHP_EOL.print_r($vars,1).$lang.PHP_EOL);
	global $db;
	$emails = $db->getRow("select * from emails where email_type = '".$email_type."'");
	$arySettings = fetchSetting(array('mail_host','mail_port','mail_uname','mail_password','mail_secure',"admin_email","contact_email"));

				$subject = $emails[$lang.'_subject'];
        $body = "--".$emails[$lang.'_body'];

        if ($vars != "")
        {
            if (count($vars))
            {
                foreach ($vars as $key => $val)
                {

                    if($key=='url'){$val="<a href='".$val."'>Click Here</a></h1>";}
                    $body = str_replace("{".$key ."}", $val, $body);
										$subject = str_replace("{".$key ."}", $val, $subject);                }

                }
        }


//	echo "<pre>";
//	print_r($arySettings);
//	echo "</pre>";
	$mail = new PHPMailer();
	//$mail->IsSMTP();
	$mail->Host 	= $arySettings['mail_host'];
	$mail->SMTPDebug= 1;
	$mail->SMTPAuth = true;
	if (strlen($arySettings['mail_secure'])>0){
		$mail->SMTPSecure 	= $arySettings['mail_secure'];

	}
	error_log("prima di mail   -body".$body.PHP_EOL."subecjet". $subject. PHP_EOL. print_r($arySettings,1).PHP_EOL);

	$mail->Port 	= $arySettings['mail_port'];
	$mail->Username	= $arySettings['mail_uname'];
	$mail->Password = $arySettings['mail_password'];

	//$mail->SetFrom($arySettings['admin_email'],"Lapetit");
        $mail->SetFrom($emails['from_email'], $emails['from_name']);
	//$mail->SetFrom("ayushi@omsoftware.net","Vendorbid");
	$mail->Subject=$subject;
	$mail->CharSet = "UTF-8";
	$mail->AltBody= "To view the message, please use an HTML compatible email viewer!";
	$mail->MsgHTML($body);
	$to=explode(';',str_replace(array(' ',','),';',$to));
	foreach( $to as $mailto)
	 {
		 $mail->AddAddress($mailto, $mailto);
	 }
	if ($mail->Send())
	{
		error_log(" mail spedita    -".print_r($arySettings,1).PHP_EOL);
	}
	else
	{
		error_log(" mail non inviata   -".print_r($arySettings,1) .print_r(error_get_last(),1) .PHP_EOL);
	}
	/*


	//$mail->ClearAddresses();
	/*if($mail->Send())
	{
		echo "mail sent";
	}
	else
	{
		echo "<pre>".print_r(error_get_last(), true)."</pre>";
	}*/
}
function getSQL($settings,$db){
	$sql= "SELECT * from " .$settings['table'] . "as uno ";
	//Determino il tipo dei campi
	$sql="SHOW COLUMNS FROM  " .   $settings['table'];
	$result = $db->getRows( $sql  );
	//error_log("result:" .print_r($result,1));
	$numColumns = count($result);
	$x = 0;
	$tipi=array();
	while ($x < $numColumns)
	{
		//		print_r($row);
		$result[$x]['Field']=strtolower($result[$x]['Field']);
		$col[$colname[0]] = $x;
		list($uno,$due)=explode("(",$result[$x]['Type'],2);
		$tipi[strtolower($result[$x]['Field'])]=$uno;
		$tipi['uno.' . strtolower($result[$x]['Field'])]=$uno;
		$nome[strtolower($result[$x]['Field'])]=($result[$x]['Field']);
		$x++;
	}
	$join=$settings['join'];
	//
	if (is_array($join)){
		foreach($join as $key => $val) {
			if (strlen($join[$key]['table'])>0){
				$sql="SHOW COLUMNS FROM  " . $join[$key]['table'];
				$result = $db->getRows($sql);
			}
			else{
				$sql="SHOW COLUMNS FROM  " . $key ;
				$result = $db->getRows($sql);

			}
			$numColumns = count($result);
			$x = 0;
			//$tipi=array();
			while ($x < $numColumns)
			{
				//		print_r($row);
				$result[$x]['Field']=strtolower($result[$x]['Field']);
				$col[$colname[0]] = $x;
				list($uno,$due)=explode("(",$result[$x]['Type'],2);
				$tipi[strtolower($result[$x]['Field'])]=$uno;
				if (strlen($join[$key]['table']>0))
				$tipi[(strlen($join[$key]['alias'])>0 ? $join[$key]['alias']  : $join[$key]['table']) .'.' . strtolower($result[$x]['Field'])]=$uno;
				else
				$tipi[(strlen($join[$key]['alias'])>0 ? $join[$key]['alias']  : $key) .'.' . strtolower($result[$x]['Field'])]=$uno;

				$nome[strtolower($result[$x]['Field'])]=($result[$x]['Field']);
				$x++;
			}
		}
	}
	$fields=$settings['fields'];
	$SQL=" select " ;
	if (is_array($fields)  ){
		$whj=$fields;
		$first=false;
		foreach($whj as $key => $val) {
			$key=strtolower($key);
			if ( $first) $SQL.= " , ";
			if (is_array($val) )
			$SQL.=  " " . $val['col'] . ' As ' . ( isset($val['alias']) ? $val['alias'] :$key  );
			else
			$SQL.=  " " . (strlen($val)>0 ? $val . ' As ' . $key  : $key);
			$first=true;
		}
	}
	else {
		$SQL.=" * ";
	}
	$SQL.= " from  "  . $settings['table'] . " as uno " ;

	$first=false;
	$joinSQL="";
	if (is_array($join)){
		foreach($join as $key => $val) {
			$KEY=$key;
			$key=strtolower($key);
			$joinSQL.= " " .$join[$KEY]['tipo'] . " JOIN ";
			if (strlen($join[$KEY]['table'])>0)
			$joinSQL.=  " "   .  $join[$KEY]['table'] .   (strlen($join[$KEY]['alias'])>0 ? ' As ' . $join[$KEY]['alias']  : ' AS  ' . $key)  . " ON " ;
			else
			$joinSQL.=  " "   .  $key  . (strlen($join[$KEY]['alias'])>0 ? ' As ' . $join[$KEY]['alias']  : ' ') . " ON " ;
			$first=false;
			$joinSQL.= $join[$KEY]['condition'] ." ";
		}
	}
	error_log("join" .print_r($join,1).$joinSQL);

	$first=false;
	$where=$settings['where'];
	if (is_array($where)){
		$whj=$where;
		foreach($whj as $key => $val) {
			$key=strtolower($key);
			if (! $first) $whereSQL.= " where  ";
			if (is_array($val)){
				foreach($val as $key1 => $val2) {

					$key1=strtolower($key1);
					if ( $first) $whereSQL.=" " .(isset($val['oprel']) ? $val['oprel'] : 'And'). " ";
					// gestione cancellato
					// gestisco struttura where senza array
					if (!isset($val2['opcond'])){
						if (isset($val['opcond']))
						$val['opcond']=htmlspecialchars_decode($val['opcond']);
						if ($key=='cancellato'|| $key=='contatore')
						$key=" uno." .$key ." ";
						$key=(isset($val['col']) ? $val['col'] : $key);
						$whereSQL.=  " " . $key . " ".(isset($val['opcond']) ? $val['opcond'] : '=')." '".
						$val['pre'].$val['valore'].$val['post']."'" ;
						$first=true;
						break;
					}else {
						// gestisco struttura where con array
						$val2['opcond']=htmlspecialchars_decode($val2['opcond']);
						if ($key1=='cancellato'|| $key1=='contatore')
						$key1=" uno." .$key1. " ";
						$key1=(isset($val2['col']) ? $val2['col'] : $key1);
						$whereSQL.=  " " .$key1 . " ".(isset($val2['opcond']) ? $val2['opcond'] : '=')." '". $val2['pre'].$val2['valore'].$val2['post'] ."'" ;

					}

					$first=true;
				}
			}
			else {
				if ( $first) $SQL.=" And " ;
				$whereSQL.= " " . $key . "='" . $val ."'";
				$first=true;
			}
		}
	}
	else {
		$whereSQL=" where 1=1 ";
	}

	$groupby=$settings['groupby'];
	if (is_array($groupby)){
		$first=false;
		foreach($groupby as $key => $val) {
			$key=strtolower($key);
			if ( ! $first) $groupbySQL.= " group By ";
			if ( $first) $groupbySQL.= " , ";
			$groupbySQL.= " " . $key  ." " . $val ;
			$first=true;
		}
	}
	$order=$settings['order'];
	if (is_array($order)){
		$first=false;
		foreach($order as $key => $val) {
			$key=strtolower($key);
			if ( ! $first) $orderSQL.= " Order By ";
			if ( $first) $orderSQL.= " , ";
			$orderSQL.= " " . $key  ." " . $val ;
			$first=true;
		}
	} else {
		$orderSQL= "  order by uno." . $settings['id'] . " DESC ";
	}
	if (strlen($settings['last'])>0)
		$lastSQL = " and uno." .$settings['id']. "<  " .$settings['last'] ." ";
	if (strlen($settings['limit'])>0)
		$limitSQL = " limit  " . $settings['limit'];
	else
		$limitSQL = " limit  5 " ;

	$whereSQL.= $lastSQL;
	$SQL.=$joinSQL.$whereSQL .$groupbySQL .$orderSQL .$limitSQL;
	return $SQL;
}
function mime_content_type_ax($filename) {
  $file=$filename;
  $mime_types = array(

    'txt' => 'text/plain',
    'htm' => 'text/html',
    'html' => 'text/html',
    'php' => 'text/html',
    'css' => 'text/css',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'xml' => 'application/xml',
    'swf' => 'application/x-shockwave-flash',
    'flv' => 'video/x-flv',

    // images
    'png' => 'image/png',
    'jpe' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'jpg' => 'image/jpeg',
    'gif' => 'image/gif',
    'bmp' => 'image/bmp',
    'ico' => 'image/vnd.microsoft.icon',
    'tiff' => 'image/tiff',
    'tif' => 'image/tiff',
    'svg' => 'image/svg+xml',
    'svgz' => 'image/svg+xml',

    // archives
    'zip' => 'application/zip',
    'rar' => 'application/x-rar-compressed',
    'exe' => 'application/x-msdownload',
    'msi' => 'application/x-msdownload',
    'cab' => 'application/vnd.ms-cab-compressed',

    // audio/video
    'mp3' => 'audio/mpeg',
    'qt' => 'video/quicktime',
    'mov' => 'video/quicktime',

    // adobe
    'pdf' => 'application/pdf',
    'psd' => 'image/vnd.adobe.photoshop',
    'ai' => 'application/postscript',
    'eps' => 'application/postscript',
    'ps' => 'application/postscript',

    // ms office
    'doc' => 'application/msword',
    'rtf' => 'application/rtf',
    'xls' => 'application/vnd.ms-excel',
    'ppt' => 'application/vnd.ms-powerpoint',

    // open office
    'odt' => 'application/vnd.oasis.opendocument.text',
    'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
  );

  $ext = strtolower(array_pop(explode('.',$file)));
  if (array_key_exists($ext, $mime_types)) {
    return $mime_types[$ext];
  }
  elseif (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME);
    $mimetype = finfo_file($finfo, $filename);
    finfo_close($finfo);
    return $mimetype;
  }
  else {
    return 'application/octet-stream';
  }
}

function email_attach($dati){
  require_once('../library/class.phpmailer.php');

  $mail             = new PHPMailer(); // defaults to using php "mail()"
  $mail->CharSet = 'UTF-8';
  //$body             = file_get_contents();
  $body="In Allegato modulo PDF di cui si è richiesta la stampa per il cliente ".$dati['fullname'] .".";
  $body             = eregi_replace("[\]",'',$body);

  $mail->AddReplyTo("amlapp@euriskoformazione.it","AMLAPP");

  $mail->SetFrom('amlapp@euriskoformazione.it', 'AMLAPP');


  //$address = "app@amlapp.euriskformazione.it";
  $mail->AddAddress($dati['mailto'], "AMLAPP");

  $mail->Subject    = 'Oggetto: Modulo di Valutazione del rischio per il  CPU ' . $dati['CPU'];
  $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test

  $mail->MsgHTML($body);

  $mail->AddAttachment($dati['file']);      // attachment
  //$mail->AddAttachment("images/phpmailer_mini.gif"); // attachment

  if(!$mail->Send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
    error_log('mail NON inviata'.print_r($mail,1). error_get_last().PHP_EOL);
  } else {
    echo "Message sent!";
    error_log('mail inviata'.print_r($dati,1).$mailto.$subject.PHP_EOL);
  }

}


function numero_lettere($numero)
{
    if (($numero < 0) || ($numero > 999999999))
    {
        return "$numero";
    }

    $milioni = floor($numero / 1000000);  // Milioni
    $numero -= $milioni * 1000000;
    $migliaia = floor($numero / 1000);    // Migliaia
    $numero -= $migliaia * 1000;
    $centinaia = floor($numero / 100);     // Centinaia
    $numero -= $centinaia * 100;
    $decine = floor($numero / 10);       // Decine
    $unita = $numero % 10;               // Unità

    $cifra_lettere = "";

    if ($milioni)
    {
    $tmp = numero_lettere($milioni);
    $cifra_lettere .= ($tmp=='un') ? '' : $tmp;
    $cifra_lettere .= ($milioni == '1') ? "un milione ":" milioni ";
    }

    if ($migliaia)
    {
    $tmp = numero_lettere($migliaia);
    $cifra_lettere .= ($tmp=='uno') ? '' : $tmp;
    $cifra_lettere .= ($migliaia == '1') ? "mille":"mila ";
    }

    if ($centinaia)
    {
    $tmp = numero_lettere($centinaia);
    $cifra_lettere .= ($tmp=='uno') ? '' : $tmp;
    $cifra_lettere .= "cento";
    }

    $array_primi = array("", "uno", "due", "tre", "quattro", "cinque", "sei",
        "sette", "otto", "nove", "dieci", "undici", "dodici", "tredici",
        "quattordici", "quindici", "sedici", "diciassette", "diciotto",
        "diciannove");
    $array_decine = array("", "", " venti", " trenta", " quaranta", " cinquanta", " sessanta",
        " settanta", " ottanta", " novanta");
    $array_decine_tronc = array("", "", " vent", " trent", " quarant", " cinquant", " sessant",
        " settant", " ottant", " novant");


    if ($decine || $unita)
    {

        if ($decine < 2)
        {
            $cifra_lettere .= $array_primi[$decine * 10 + $unita];
        }
        else
        {
            if ($unita == 1 || $unita == 8)
            $cifra_lettere .= $array_decine_tronc[$decine];
            else
            $cifra_lettere .= $array_decine[$decine];

            if ($unita)
            {
                    $cifra_lettere .= $array_primi[$unita];
            }
        }
    }


    if (empty($cifra_lettere))
    {
        $cifra_lettere = "zero";
    }

    return $cifra_lettere;
}


function mycrop($src, array $rect)
{
    $dest = imagecreatetruecolor($rect['width'], $rect['height']);
    imagesavealpha($dest, true);
    $trans_colour = imagecolorallocatealpha($dest, 0, 0, 0, 127);
    imagefill($dest, 0, 0, $trans_colour);
    imagecopy(
        $dest,
        $src,
        0,
        0,
        $rect['x'],
        $rect['y'],
        $rect['width'],
        $rect['height']
    );

    return $dest;
}

?>
