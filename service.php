<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
include_once("config.php");
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty( $_POST ))
  $_POST=$_REQUEST = json_decode( file_get_contents( 'php://input' ), true );
error_log("passato ".$_SERVER['REQUEST_METHOD']. $_REQUEST['action'].PHP_EOL);

switch($_REQUEST['action'])
{
  case 'upload_user_image' :
  {
    $newfile=md5(microtime()).".jpg";
    if(move_uploaded_file($_FILES['file']['tmp_name'],"uploads/user/".$newfile))
    {
      copy("uploads/user/" . $newfile, "uploads/user/small/" . $newfile);
      smart_resize_image("uploads/user/" . "small/$newfile", 210, 194);
      $imagename=$db->getVal("select image from users where user_id='".$_REQUEST['userid']."' ");
      @unlink("uploads/user/$imagename");


    }



    $aryData = array("image" =>	$newfile);

    $db->updateAry("users",$aryData,"where user_id='".$_REQUEST['userid']."'");

    $flgIn = $_REQUEST['userid'];



    $data = array('review_id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
    echo json_encode($data);
    break;

  }
  case 'get_user_image_name' :
  {
    $imagename=$db->getVal("select image from users where user_id='".$_REQUEST['userid']."' ");
    $data = array(
      'RESPONSECODE'	=>  1,
      'RESPONSE'	=> $imagename,
    );
    echo json_encode($data);
    break;
  }
  case 'upload_profile_image':
  {
    $newfile=md5(microtime()).".jpg";
    if(move_uploaded_file($_FILES['file']['tmp_name'],"uploads/user/".$newfile))
    {
      copy("uploads/user/".$newfile,"uploads/user/small/".$newfile);
      smart_resize_image("uploads/user/small/".$newfile,150,150);

      $aryData = array("image" =>	$newfile,'user_id'=>$_GET['id']);
      $flgIn=$db->updateAry("users",$aryData,"where user_id='".$_REQUEST['id']."'");

    }
    //echo json_encode($data);
    break;
  }
  case 'get_profile_image_name':
  {
    $imgList=$db->getRows("select image FROM users where user_id='".$_REQUEST['id']."' ");
    if(count($imgList)>0)
    {
      $i=1;
      foreach($imgList as $imgListi)
      {
        $datas[$i] = $imgListi['image'];
        $i++;
      }
      $data = array('RESPONSECODE'	=>  1,'RESPONSE'	=> $datas);
    }
    else
    {
      $data = array('RESPONSECODE'	=> 0,'RESPONSE'	=> "");
    }

    echo json_encode($data);
    break;
  }
  case 'Profile_info' :
  {
    if($_REQUEST['id']!='' && $_REQUEST['id']!='')
    {
      $userDetails=$db->getRow("SELECT users.* FROM  users WHERE user_id='".trim($_REQUEST['id'])."'");
      if($userDetails['user_type'] == '1'  )
      {
        $type =1;
        $plan_name=$db->getVal("SELECT pl.plan_name FROM plan pl JOIN agency ay ON pl.plan_id =ay.plan_id  WHERE ay.user_id='".$_REQUEST['id']."' ");
      }
      else if($userDetails['user_type'] == '2')
      {
        $type =2;
        $plan_name=$db->getVal("SELECT name FROM users  us JOIN agent ay ON us.user_id = ay.agency_id WHERE ay.user_id='".$_REQUEST['id']."' ");
      }

      if($userDetails['user_id']!='')
      {

        $userInfo= array('name'=> $userDetails['name'],'email'=>$userDetails['email'],'mobile_number'=>$userDetails['mobile_number'],'imagename'  =>$userDetails['image'] ,'plan_name'  => ucwords($plan_name),'type' => $type );
        $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> $userInfo);
      }
      else{$data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Invalid User");}
    }
    else
    {
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
    }
    echo json_encode($data);
    break;
  }
  case 'saveProfile':
  {
    $error='';


    if($error=='')
    {

      $aryData=array(	'name'			=>	trim($_REQUEST['name']),
      'mobile_number'     =>	trim($_REQUEST['mobile_number']),
    );
    $flgIn=$db->updateAry("users",$aryData,"where user_id='".$_REQUEST['id']."'");
    if(!is_null($flgIn))
    {
      $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> "Details Saved Successfully");
    }
    else
    {
      $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Error");
    }
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
  }
  echo json_encode($data);
  break;


}


case 'viewkyc5':{
  if($_REQUEST['customer_id']!='' )
  {      // print_r($_REQUEST['customer_id']);
    $userDetails=$db->getRow("SELECT us.*,cs.customer_dob,cs.surname,cs.customer_birth_country,cs.customer_fiscal_number,cs.customer_check_pep,cs.customer_pep_domestic FROM  users us JOIN customer cs ON cs.user_id = us.user_id WHERE us.user_id='".trim($_REQUEST['customer_id'])."' ");
    $countryList = $db->getRows("SELECT * FROM countries  ORDER BY FIELD( country_name,  'San Marino','Italy' ) DESC, country_name ASC ");

    if($userDetails['user_id']!='')
    {

      $userInfo= array('name'=> $userDetails['name'],'email'=>$userDetails['email'],'mobile_number'=>$userDetails['mobile_number'],'imagename'  =>$userDetails['image'],'surname'=>$userDetails['surname'],'dob'=>$userDetails['customer_dob'],'customer_birth_country'=>$userDetails['customer_birth_country'],'customer_fiscal_number'=>$userDetails['customer_fiscal_number'],'customer_check_pep'=>$userDetails['customer_check_pep'],'customer_pep_domestic'=>$userDetails['customer_pep_domestic']);
      $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> $userInfo,'countrylist'=>$countryList);
    }
    else{$data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Invalid User");}
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
  }
  echo json_encode($data);
  break;
}

case 'savekyc5':{

  $aryData1 =array(
    'customer_dob'  => $_REQUEST['dob'],
    'customer_birth_country'  => $_REQUEST['customer_birth_country'],
    'customer_fiscal_number'  => $_REQUEST['customer_fiscal_number'],
    'customer_check_pep'      => $_REQUEST['customer_check_pep'],
    'customer_pep_domestic'   =>$_REQUEST['customer_pep_domestic']
  );
  $flgIn=$db->updateAry("customer",$aryData1,"where user_id='".$_REQUEST['customer_id']."'");
  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
  echo json_encode($data);
  break;


}
case 'Password' :
{
  if($_REQUEST['currentPassword']!='' )
  {
    $chkuser=$db->getRow("SELECT password FROM `users` WHERE user_id='".$_REQUEST['id']."'");
    if(($chkuser['password'])!=$_REQUEST['currentPassword'])
    {

      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Current password you entered is incorrect");
    }
    else
    {
      $aryData=array('password'=>$_REQUEST['newPassword']);
      $flgIn=$db->updateAry("users",$aryData,"where user_id='".$_REQUEST['id']."'");
      if(!is_null($flgIn))
      {
        $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Password Changed Successfully");
      }
    }
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
  }
  echo json_encode($data);
  break;
}
///////////////////////Login User //////////////////////////////////////
case 'login' :
{
  if($_REQUEST['username']!='' && $_REQUEST['password']!='')
  {
    $sql="SELECT * FROM users  WHERE BINARY email='".trim($_REQUEST['username'])."' AND BINARY password='".$_REQUEST['password']."' AND (user_type = '1' OR user_type = '2' ) ";
    $chkuser=$db->getRow("SELECT * FROM users  WHERE BINARY email='".trim($_REQUEST['username'])."' AND BINARY password='".$_REQUEST['password']."' AND (user_type = '1' OR user_type = '2' ) ");

    if($chkuser['user_id']!='' && $chkuser['status']=='0')
    {
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Please activate your account");
    }
    elseif($chkuser['user_id']!='' && $chkuser['status']=='2')
    {
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> " Your Account is Deleted");
    }
    elseif($chkuser['user_id']!='' && $chkuser['status']=='1')
    {
      if($chkuser['user_type'] == 2 )
      {
        $agentprovilige = $db->getRow("SELECT * FROM agent WHERE user_id = '".$chkuser['user_id']."' ");

        $data = array('RESPONSECODE'=> 1 ,"userId"=>$chkuser['user_id'],"name"  =>$chkuser['name'],"usertype" => $chkuser['user_type'], "email" => $chkuser['email'],"image_name" => $chkuser["image"],"privilige" => $agentprovilige['agent_previledge'] );


      }
      else
      {
        $data = array('RESPONSECODE'=> 1 ,"userId"=>$chkuser['user_id'],"name"  =>$chkuser['name'],"usertype" => $chkuser['user_type'], "email" => $chkuser['email'],"image_name" => $chkuser["image"] );
      }

    }
    else
    {
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Username / Password Mismatch" );
    }


  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
  }
  echo json_encode($data);
  break;
}
case 'Forgot' :
{
  if($_REQUEST['email']!='')
  {
    $chkuser=$db->getRow("SELECT status,user_id,name,password,email,username FROM users WHERE email='".$_REQUEST['email']."' AND (user_type ='2' OR user_type = '1' ) ");

    if($chkuser['user_id']=='')
    {
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Email ID does not exist");
    }
    elseif($chkuser['user_id']!='' && $chkuser['status']=='0')
    {
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Please activate your account");
    }
    elseif($chkuser['user_id']!='' && $chkuser['status']=='1')
    {
      $random_passw = rand(1000,1500000);
      $aryData =array(  'password'  => $random_passw );

      $flgIn=$db->updateAry("users",$aryData,"where user_id='".$chkuser['user_id']."'");
      $vars = array(

        'user_email' => $chkuser['email'],
        'passwords' => $random_passw
      );
      mail_template($chkuser['email'],'forgot_front',$vars);
      $data = array('RESPONSECODE'=>  1 ,'RESPONSE'=> "A new password has been sent to your e-mail address.");
      unset($_POST);

    }
    else
    {
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Email ID does not exist");
    }
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Please enter Email ID");
  }
  echo json_encode($data);
  break;
}
///////////////SignUp//////////////////////////////////////////
case 'SignUp' :
{
  $error='';
  if($_REQUEST['email']!='')
  {
    $aryCheckEmail=$db->getVal("select email  from users where email='".trim($_REQUEST['email'])."'");
  }
  if($aryCheckEmail!='')
  {
    $error=" Email Id  already exists";
  }
  elseif(strlen($_REQUEST['password'])<6)
  {
    $error="Password should be in between 6 and 12 characters";
  }
  elseif(strlen($_REQUEST['password'])>12)
  {
    $error="Password should be in between 6 and 12 characters";
  }
  if($error=='')
  {

    $aryData=array(	'name'			=>	trim($_REQUEST['name']),
    'email'			=>	trim($_REQUEST['email']),
    'password'		=>	md5($_REQUEST['password']),
    'dob'		=>	trim($_REQUEST['dob']),
    'status'		=>  1 );
    $flgIn=$db->insertAry("users",$aryData);
    if(!is_null($flgIn))
    {
      include_once("library/class.phpmailer.php");
      include_once("library/class.smtp.php");
      ////////////////////////////////////////////////
      /*							$arySettings=fetchSetting(array('mail_sender_email','mail_sender_name','mail_host','mail_port','mail_uname','mail_password'));
      $mail = new PHPMailer();
      $mail->SMTPAuth = true;
      $mail->Host 	= SMTP_HOST;
      $mail->SMTPDebug= 0;
      $mail->Host 	= SMTP_HOST;
      $mail->Port 	= SMTP_PORT;
      $mail->SMTPSecure = "tls";
      $mail->Username	= SMTP_USER;
      $mail->Password   = SMTP_PSWD;
      $mail->SetFrom($arySettings['mail_sender_email'], $arySettings['mail_sender_name']);
      $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!";
      $subject='Thank you for registering';

      $body = "<p> Hi ".$_REQUEST['name']."</p>";
      $body .=  "<p>Thank you for creating an account with Bottled<p>";
      $body .=  "<p>Your account details :<p>";
      $body .=  "<p>Username : ".$_REQUEST['name']."<br/> </p>";
      $body .=  "<p>Password : ".$_REQUEST['password']."<br/> </p>";

      $body .=  "<p><strong>Thanks</strong><br/>Bottled </p>";

      $mail->Subject = $subject;
      $mail->AddAddress($_REQUEST['email'],'Bottled');
      */							//$mail->MsgHTML($body);
      //$mail->Send();
      //$mail->ClearAddresses();


      $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Thank you for registering. We have sent you an email message with an activation link");
    }
    else
    {
      $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Error");
    }
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
  }
  echo json_encode($data);
  break;

}
case 'CustomerList' :
{
  $sql="SELECT concat(us.name,' ',us.surname) as fullname ,us.email,us.mobile_number,us.image,us.user_id
  FROM users us   ";
  $where="";
  if (strlen($_REQUEST['last'])>0){
    $where = " and us.user_id <  " .$_REQUEST['last'];

  }
  if($_REQUEST['usertype'] =='2')
  {
    if($_REQUEST['priviledge'] == 1 )
    {
      $sql.="  WHERE us.agent_id ='".$_REQUEST['id']."'  AND us.status <> 2 and us.user_type='3' ".$where." ORDER BY us.user_id DESC limit 5 ";

    }
    else if($_REQUEST['priviledge'] == 2)
    {
      $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$_REQUEST['id']."'  ");
      $sql.=" WHERE us.agency_id ='".$agencyvalue."'  AND us.status <> 2 and us.user_type='3' ".$where." ORDER BY us.user_id DESC limit 5 ";

    }
  }
  else if($_REQUEST['usertype'] =='1')
  {

    $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$_REQUEST['id']."'  ");
    $sql.=" WHERE us.agency_id ='".$agencyvalue."'  AND us.status <> 2 and us.user_type='3' ".$where." ORDER BY us.user_id DESC limit 5 ";
  }
  error_log($_REQUEST['action']."1-".$_REQUEST['id'] .$sql.  PHP_EOL);

  $getcustomerlist = $db->getRows($sql);
  if(count($getcustomerlist) > 0 && is_array($getcustomerlist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getcustomerlist);
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;
}
case 'ContractList' :
{
  if (strlen($_REQUEST['last'])>0){
    $where = " and co.id <  " .$_REQUEST['last'];

  }
  $sql= "SELECT co.id as contract_id, co.nature_contract,co.scope_contract,co.CPU,co.contract_date,co.kyc_status,co.contract_value,co.status,
  us.user_id, concat(us.name,' ',us.surname) as fullname,us.email,us.mobile_number,us.image,us.user_id,cmy.name,concat(op.name,' ',op.surname) as other_name
  FROM contract co JOIN users us ON co.contractor_id = us.user_id
  left JOIN risk rk ON rk.cpu = co.cpu
  LEFT JOIN company cmy ON co.other_id =cmy.company_id and co.act_for_other=1
  LEFT JOIN users op ON co.other_id =op.user_id  and co.act_for_other=2";

  if($_REQUEST['usertype'] =='2')
  {

    if($_REQUEST['priviledge'] == 1 )
    {
      $sql.="  WHERE co.agent_id ='".$_REQUEST['id']."' AND co.status <> 2 ".$where." ORDER BY co.id DESC ";

    }
    else if($_REQUEST['priviledge'] == 2)
    {
      $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$_REQUEST['id']."'  ");
      $sql.=" WHERE co.agency_id ='".$agencyvalue ."' AND co.status <> 2 ".$where." ORDER BY co.id DESC ";


    }
  }
  else if($_REQUEST['usertype'] =='1')
  {
    $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$_REQUEST['id']."'  ");
    $sql.=" WHERE co.agency_id ='".$agencyvalue ."' AND co.status <> 2  ".$where." ORDER BY co.id DESC ";


  }
  $getcustomerlist = $db->getRows($sql);

  if(count($getcustomerlist) > 0 && is_array($getcustomerlist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getcustomerlist);
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;
}
case 'ACCustomerList' :
{ $getcustomerlist=array();
  if (strlen($_REQUEST['name'])>0){
    $sql="SELECT us.user_id, concat(us.name,' ',us.surname) fullname, us.email from  users as us  WHERE (us.email  like '%".$_REQUEST['name']. "%' or concat(us.name,' ',us.surname)  like '%".$_REQUEST['name']."%' ) and user_type='3'  ORDER BY concat(us.name,us.surname) ASC limit 5 ";
    $getcustomerlist = $db->getRows($sql);

  }
  if(count($getcustomerlist) > 0 && is_array($getcustomerlist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getcustomerlist);
  }
  else
  {
    $data = array('RESPONSECODE'=> $sql , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;

}
case 'ACCompanyList' :
{ $getcustomerlist=array();
  if (strlen($_REQUEST['last'])>0){
    $where = " and co.company_id <  " .$_REQUEST['last'];

  }
  if (strlen($_REQUEST['name'])>0){
    $sql="SELECT co.company_id  ,co.name, co.fiscal_id from  company as co
    WHERE (co.name  like '%".$_REQUEST['name']. "%' or co.fiscal_id  like '%".$_REQUEST['name']."%' ) ".$where."  ORDER BY co.company_id ASC limit 5 ";
    $getcustomerlist = $db->getRows($sql);

  }
  if(count($getcustomerlist) > 0 && is_array($getcustomerlist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getcustomerlist);
  }
  else
  {
    $data = array('RESPONSECODE'=> $sql , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;

}
case 'ACWord' :
{
  error_log($_REQUEST['usertype']);
  if($_REQUEST['usertype'] =='1')
  {
    $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$_REQUEST['id']."'  ");

  }else{
    $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$_REQUEST['id']."'  ");

  }

  $getcustomerlist=array();
  if (strlen($_REQUEST['search'])>0){
    $sql="SELECT distinct " . $_REQUEST['word']."  as word from  ". $_REQUEST['table'] ."
    WHERE " . $_REQUEST['word']."   like '%".$_REQUEST['search']. "%'  AND agency_id=".$agencyvalue." ORDER BY " . $_REQUEST['word']. "  ASC limit 5 ";
    $getcustomerlist = $db->getRows($sql);

  }
  if(count($getcustomerlist) > 0 && is_array($getcustomerlist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getcustomerlist);
  }
  else
  {
    $data = array('RESPONSECODE'=> $sql , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;

}
case 'addcustomer' :
{
  error_log($_REQUEST['action']."prima insert -".$_REQUEST['id'] .print_r($_REQUEST,1). print_r($_REQUEST['dbData'],1).  PHP_EOL);
  $error='';
  if($_REQUEST['dbData']['email']!='')
  {
    $sql="select email  from users where email='".trim($_REQUEST['dbData']['email'])."'";
    $aryCheckEmail=$db->getVal($sql);
    error_log($_REQUEST['action']."dopo controllo email  -".$_REQUEST['id'] .$sql.  PHP_EOL);
  }

  if($aryCheckEmail!='')
  {
    $error=" Email Id  already exists";
  }
  if($_REQUEST['usertype'] =='1')
  {

    $agency = $db->getRow("SELECT  a.agency_id, u.name as agency_name FROM agency  a join users u  on  a.user_id=u.user_id WHERE u.user_id = '".$_REQUEST['id']."'  ");

  }
  else {
    $agency = $db->getRow("SELECT  a.agency_id, u.name as agency_name FROM agent a join users u  on  a.agency_id=u.user_id  WHERE u.user_id = '".$_REQUEST['id']."'  ");


  }
  $random_passw = rand(1000,1500000);
  if($error=='')
  {

    $aryData=$_REQUEST['dbData'];
    $aryData['agency_id']=$agency['agency_id'];
    $aryData['agent_id']=$_REQUEST['id'];
    $aryData['user_type']=3;
    $aryData['status']=1;
    $aryData['password']=$random_passw;

    $flgIn=$db->insertAry("users",$aryData);
    if(!is_null($flgIn))
    {
      $lastid=$db->getVal("SELECT LAST_INSERT_ID()");
      error_log($_REQUEST['action']."dopo insert -".print_r($_REQUEST['dbData'],1). print_r($agency,1). print_r($aryData,1) .$sql.  PHP_EOL);
      $vars = array(
        'email' => $_REQUEST['dbData']['email'],
        'password' => $random_passw,
        'agency_name' => $agency['agency_name']
      );

      error_log($_REQUEST['action']."prima -".print_r($vars,1) .$sql.  PHP_EOL);
      mail_template($_REQUEST['dbData']['email'],'add_customer',$vars, $_REQUEST['lang']);
      error_log($_REQUEST['action']."dopo-".$_REQUEST['id'] .$sql.  PHP_EOL);
      $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Customer Added successfully","lastid"=>$lastid);
    }
    else
    {
      $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Error");
    }
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
  }
  echo json_encode($data);
  break;

}
case 'addcontract' :
{
  error_log("addContract1 ". print_r($_REQUEST,1).PHP_EOL .$_REQUEST['appData']['usertype'] .PHP_EOL);
  if ($_REQUEST['appData']['usertype'] >=3 &&  $_REQUEST['appData']['usertype'] <1){
    $error="Non hai i privilegi per salvare un contratto";
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=>$error);
    echo json_encode($data);
    break;
  }
  $error='';
  $aryData=$_REQUEST['dbData'];
  $sql="SELECT agency_id FROM agent WHERE user_id = '".$_REQUEST['appData']['id']."'";
  if ($_REQUEST['appData']['usertype'] ==1)
  $agency_id =$db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$_REQUEST['appData']['id']."'");
  else
  $agency_id =$db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$_REQUEST['appData']['id']."'");
  $aryData['agency_id']=$agency_id;

  $sql="SELECT MAX( CPU ) FROM  `contract`  where  agency_id = ". $agency_id;
  $CPU =$db->getVal($sql);
  if (is_null($CPU)){
    $CPU="0/".date("Y");
  };
  list($num, $anno) = split("/", $CPU,2);
  $num++;
  $CPU=$num ."/" .$anno;
  $aryData['CPU']=$CPU;
  error_log("EDIT::". $_REQUEST['edit'] .PHP_EOL);
  if ($_REQUEST['edit']=="edit"){
    $flgIn=$db->updateAry("contract",$aryData, "where id='".$_REQUEST['dbData']['contract_id']."'");
    $ok="Contratto Aggiornato Correttamente";
    if(!is_null($flgIn))  {
      // inserisco riga valutazione rischio.
      $db->insertAry("risk", $arydata2);
      $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> $ok);
      echo json_encode($data);
      break;
    }
  }
  else {
    $ok="Contratto Inserito Correttamente";

    $flgIn=$db->insertAry("contract",$aryData);
    $ok="Contratto Inserito Correttamente";
    if(!is_null($flgIn))  {
      // inserisco riga valutazione rischio.
      $lastid=$this->getVal("SELECT LAST_INSERT_ID()");
      $aryData['contractor_id']=$lastid;
      $flgIn=$db->insertAry("customer",$aryData);

      $arydata2 = array(
        'CPU'          => $aryData['CPU'],
        'agent_id'     => $aryData['agent_id'],
        'agency_id'    => $agency_id,


      );
      $db->insertAry("risk", $arydata2);
      $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> $ok, "lastid"=>$lastid);
      echo json_encode($data);
      break;
      //mail_template($_REQUEST['customer_email'],'add_customer',$vars);

    }
  }
  //$flgIn=$db->insertAry("contract",$aryData);

  $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Error");
  echo json_encode($data);
  break;

}
case 'addagent' :
{
  $error='';
  if($_REQUEST['agent_email']!='')
  {
    $aryCheckEmail=$db->getVal("select email  from users where email='".trim($_REQUEST['agent_email'])."'");
  }

  if($aryCheckEmail!='')
  {
    $error=" Email Id  already exists";
  }

  $random_passw = rand(1000,1500000);
  if($error=='')
  {

    $aryData=array(	            'name'			=>	trim($_REQUEST['agent_name']),
    'email'			=>	trim($_REQUEST['agent_email']),
    'password'		         =>	$random_passw,
    'mobile_number'		=>	trim($_REQUEST['agent_mobile_number']),
    'user_type'                 =>   2,
    'status'		=>  1
  );
  $flgIn=$db->insertAry("users",$aryData);
  if(!is_null($flgIn))
  {

    $agent_last_id = $flgIn;
    $arydata1 = array(
      'user_id'                       => $flgIn,
      'agency_id'                     => $_REQUEST['id'],


    );
    $flgIn=$db->insertAry("agent",$arydata1);



    $vars = array(

      'user_email' => $_REQUEST['agent_email'],
      'user_password' => $random_passw
    );
    mail_template($_REQUEST['agent_email'],'add_agent',$vars);

    //include_once("library/class.phpmailer.php");
    //  include_once("library/class.smtp.php");
    ////////////////////////////////////////////////
    /*							$arySettings=fetchSetting(array('mail_sender_email','mail_sender_name','mail_host','mail_port','mail_uname','mail_password'));
    $mail = new PHPMailer();
    $mail->SMTPAuth = true;
    $mail->Host 	= SMTP_HOST;
    $mail->SMTPDebug= 0;
    $mail->Host 	= SMTP_HOST;
    $mail->Port 	= SMTP_PORT;
    $mail->SMTPSecure = "tls";
    $mail->Username	= SMTP_USER;
    $mail->Password   = SMTP_PSWD;
    $mail->SetFrom($arySettings['mail_sender_email'], $arySettings['mail_sender_name']);
    $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!";
    $subject='Thank you for registering';

    $body = "<p> Hi ".$_REQUEST['name']."</p>";
    $body .=  "<p>Thank you for creating an account with Bottled<p>";
    $body .=  "<p>Your account details :<p>";
    $body .=  "<p>Username : ".$_REQUEST['name']."<br/> </p>";
    $body .=  "<p>Password : ".$_REQUEST['password']."<br/> </p>";

    $body .=  "<p><strong>Thanks</strong><br/>Bottled </p>";

    $mail->Subject = $subject;
    $mail->AddAddress($_REQUEST['email'],'Bottled');
    */							//$mail->MsgHTML($body);
    //$mail->Send();
    //$mail->ClearAddresses();


    $data = array('ID'=>$agent_last_id,'RESPONSECODE'=>1 ,'RESPONSE'=> "Agent Added successfully");
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Error");
  }
}
else
{
  $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
}
echo json_encode($data);
break;

}
case 'AgentList' :
{

  $getcustomerlist = $db->getRows("SELECT us.name,us.email,us.mobile_number,us.image,us.user_id FROM users us JOIN agent cs ON cs.user_id = us.user_id WHERE cs.agency_id ='".$_REQUEST['id']."' AND us.status = '1' ORDER BY us.user_id DESC ");



  if(count($getcustomerlist) > 0 && is_array($getcustomerlist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getcustomerlist);
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;
}
case 'view_Agent_Profile_info' :
{
  if($_REQUEST['agent_id']!='' && $_REQUEST['agent_id']!='')
  {
    $userDetails=$db->getRow("SELECT users.*,ag.agent_previledge FROM  users JOIN agent ag ON ag.user_id = users.user_id WHERE users.user_id='".trim($_REQUEST['agent_id'])."' ");

    if($userDetails['user_id']!='')
    {

      $userInfo= array('name'=> $userDetails['name'],'email'=>$userDetails['email'],'mobile_number'=>$userDetails['mobile_number'],'imagename'  =>$userDetails['image'],'agent_previledge'  => $userDetails['agent_previledge'] );
      $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> $userInfo);
    }
    else{$data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Invalid User");}
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
  }
  echo json_encode($data);
  break;
}
case 'view_Customer_Profile_info' :
{
  if($_REQUEST['customer_id']!='' )
  {      // print_r($_REQUEST['customer_id']);
    $sql="SELECT us.* FROM  users us
    WHERE us.user_id='".trim($_REQUEST['customer_id'])."' ";
    error_log($_REQUEST['action']."1-".$_REQUEST['customer_id'] .$sql.  PHP_EOL);
    $userDetails=$db->getRow($sql);

    if($userDetails['user_id']!='')
    {

      $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> $userDetails);
    }
    else{$data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Invalid User");}
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
  }
  echo json_encode($data);
  break;
}
case 'view_Contract_info' :
{
  error_log($_REQUEST['action']."1-".$_REQUEST['contract_id'] . PHP_EOL .$_REQUEST['appData']['usertype'] .PHP_EOL);

  if($_REQUEST['contract_id']!='' )
  {      // print_r($_REQUEST['customer_id']);
    $sql= "SELECT co.id as contract_id, co.nature_contract,co.scope_contract,co.CPU,co.contract_date,co.kyc_status,co.contract_value,co.contractor_id,co.role_for_other,
    co.contract_eov,co.act_for_other,
    concat(us.name,' ',us.surname) as fullname,us.surname,us.name as name1, us.email,us.mobile_number,us.image,us.user_id as other_id,rk.status,cmy.company_id,cmy.name,concat(op.name,' ',op.surname) as other_name

    FROM contract co JOIN users us ON co.contractor_id = us.user_id
    left JOIN risk rk ON rk.cpu = co.cpu
    LEFT JOIN company cmy ON co.other_id =cmy.company_id and co.act_for_other=1
    LEFT JOIN users op ON co.other_id =op.user_id  and co.act_for_other=2
    WHERE co.id ='".$_REQUEST['contract_id']."'  ";
    error_log($_REQUEST['action']."xx". $sql .PHP_EOL .$_REQUEST['appData']['usertype'] .PHP_EOL);

    $ContractDetails=$db->getRow($sql);
    error_log($_REQUEST['action']."x2-". print_r($ContractDetails,1) ."-".$ContractDetails['id'] .PHP_EOL .$_REQUEST['appData']['usertype'] .PHP_EOL);

    if($ContractDetails['contract_id']!='')
    {

      $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> $ContractDetails);
    }
    else{$data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Invalid User");}
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
  }
  echo json_encode($data);
  break;
}

case 'close_account' :
{
  $aryData =array(  'status'  => 0 );
  $flgIn=$db->updateAry("users",$aryData,"where user_id='".$_REQUEST['agent_id']."'");
  if($flgIn !='')
  {
    $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "You Successfully Close the account");
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
  }
  echo json_encode($data);
  break;
}
case 'customer_risk_profile1' :
{
  $aryData =array(  'risk_information_politically'  => $_REQUEST['risk_information_politically'],
  'risk_information_preceedings' => $_REQUEST['risk_information_preceedings'],
  'risk_information_list'        => $_REQUEST['risk_information_list'],
  'risk_information_other'     =>  trim($_REQUEST['risk_information_other']),

);
$flgIn=$db->updateAry("risk",$aryData,"where user_id='".$_REQUEST['customer_id']."'");


$data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");



echo json_encode($data);
break;
}
case 'customer_risk_profile2' :
{
  $aryData =array(  'risk_activity_activity'  => $_REQUEST['risk_activity_activity'],
  'risk_activity_movements' => $_REQUEST['risk_activity_movements'],
  'risk_activity_financing' =>  $_REQUEST['risk_activity_financing'],
  'risk_activity_funds'     => $_REQUEST['risk_activity_funds'],
  'risk_activity_cash'      => $_REQUEST['risk_activity_cash'],
  'risk_activity_other'     =>  trim($_REQUEST['risk_activity_other']),

);
$flgIn=$db->updateAry("risk",$aryData,"where user_id='".$_REQUEST['customer_id']."'");


$data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");



echo json_encode($data);
break;
}
case 'show_risk_profile1' :
{
  $userDetails=$db->getRow("SELECT us.image,us.name,ag.* FROM  users us JOIN risk ag ON ag.user_id = us.user_id WHERE ag.user_id='".trim($_REQUEST['user_id'])."'");
  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails );
  echo json_encode($data);
  break;
}
case 'show_risk_profile2' :
{
  $userDetails=$db->getRow("SELECT * FROM  risk WHERE user_id='".trim($_REQUEST['customer_id'])."'");
  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails );
  echo json_encode($data);
  break;
}
case 'customer_risk_profile3' :
{
  $aryData =array(  'risk_behaviour_collaborative'  => $_REQUEST['risk_behaviour_collaborative'],
  'risk_behaviour_much_collaborative' => $_REQUEST['risk_behaviour_much_collaborative'],

  'risk_behaviour_not_collaborative'      => $_REQUEST['risk_behaviour_not_collaborative'],
  'risk_behaviour_other'     =>  trim($_REQUEST['risk_behaviour_other']),

);
$flgIn=$db->updateAry("risk",$aryData,"where user_id='".$_REQUEST['customer_id']."'");


$data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");



echo json_encode($data);
break;
}
case 'customer_risk_profile4' :
{
  $aryData =array(  'risk_frequency_business'                     => $_REQUEST['risk_frequency_business'],
  'risk_frequency_duration'                    => $_REQUEST['risk_frequency_duration'],
  'risk_frequency_consistency_relation'        => $_REQUEST['risk_frequency_consistency_relation'],
  'risk_frequency_consistency_dimension'       => $_REQUEST['risk_frequency_consistency_dimension'],
  'risk_frequency_other'                       => trim($_REQUEST['risk_frequency_other']),
  'risk_frequency_consistency_other'           => trim($_REQUEST['risk_frequency_consistency_other']),
  'status'                         =>  1

);


$userDetails=$db->getRow("SELECT * FROM  risk WHERE user_id='".trim($_REQUEST['customer_id'])."'");

$risk_data = array(
  'risk_information_politically' => trim($userDetails['risk_information_politically']),
  'risk_information_preceedings' => trim($userDetails['risk_information_preceedings']),
  'risk_information_list' => trim($userDetails['risk_information_list']),
  'risk_activity_activity' => trim($userDetails['risk_activity_activity']),
  'risk_activity_movements' => trim($userDetails['risk_activity_movements']),
  'risk_activity_financing' => trim($userDetails['risk_activity_financing']),
  'risk_activity_funds' => trim($userDetails['risk_activity_funds']),
  'risk_activity_cash' => trim($userDetails['risk_activity_cash']),
  'risk_behaviour_collaborative' => trim($userDetails['risk_behaviour_collaborative']),
  'risk_behaviour_much_collaborative' => trim($userDetails['risk_behaviour_much_collaborative']),
  'risk_behaviour_not_collaborative' => trim($userDetails['risk_behaviour_not_collaborative']),
  'risk_frequency_business' => trim($userDetails['risk_frequency_business']),
  'risk_frequency_duration' => trim($userDetails['risk_frequency_duration']),
  'risk_frequency_consistency_relation' => trim($userDetails['risk_frequency_consistency_dimension']),
  'risk_frequency_consistency_dimension' => trim($userDetails['risk_frequency_consistency_dimension']),
);
$high_count = 0;
foreach ($risk_data as $key => $value) {
  if ($value == 1) {
    $high_count++;
  }
}

$user_pep = $db->getVal("SELECT customer_check_pep FROM customer WHERE user_id='" . $_GET['id'] . "'");

if($user_pep){

  $risk_other = array(
    'risk_information_other' => trim($_POST['risk_information_other']),
    'risk_activity_other' => trim($_POST['risk_activity_other']),
    'risk_behaviour_other' => trim($_POST['risk_behaviour_other']),
    'risk_frequency_other' => trim($_POST['risk_frequency_other']),
    'risk_frequency_consistency_other' => trim($_POST['risk_frequency_consistency_other'])
  );
  $other_data = FALSE;
  foreach($risk_other as $key => $value){
    if(strlen($value) > 0){
      $other_data = TRUE;
    }
  }


  if ($high_count > 3){
    $high_count = 3;
  }
  $current_date = date('Y-m-d');
  if (($high_count == 0) && ($other_data == FALSE )){
    $risk_result = 0;
    // $risk_type = "Limited Risk";
    $duration = 16;
  } elseif (($high_count <= 1)){
    $risk_result = 1;
    // $risk_type = "Low Risk";
    $duration = 8;
  } elseif ($high_count == 2){
    $risk_result = 2;
    // $risk_type = "Medium Risk";
    $duration = 4;
  }else{
    $risk_result = 3;
    // $risk_type = "High Risk";
    $duration = 2;
  }


  $aryData['result'] = $risk_result;
  $aryData['email_date'] = date("y-m-d", strtotime($current_date));
  $aryData['duration'] = $duration;






}else{

  if ($high_count > 3){
    $high_count = 3;
  }
  $current_date = date('Y-m-d');
  if ($high_count == 0) {
    $duration = 16;
  } elseif ($high_count == 1) {
    $duration = 8;
  } elseif ($high_count == 2) {
    $duration = 4;
  } else {
    $duration = 2;
  }
  $aryData['result'] = $high_count;
  $aryData['email_date'] = date("y-m-d", strtotime($current_date));
  $aryData['duration'] = $duration;



}



/* if ($high_count > 3) {
$high_count = 3;
}
$current_date = date('Y-m-d');
if ($high_count == 0) {
$duration = 16;
} elseif ($high_count == 1) {
$duration = 8;
} elseif ($high_count == 2) {
$duration = 4;
} else {
$duration = 2;
}
$aryData['result'] = $high_count;
$aryData['email_date'] = date("y-m-d", strtotime($current_date));
$aryData['duration'] = $duration;  */

$flgIn=$db->updateAry("risk",$aryData,"where user_id='".$_REQUEST['customer_id']."'");

$data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");



echo json_encode($data);
break;
}
case 'customer_risk_profile5' :
{
  $aryData =array(  'risk_ownership_compreensive'     => $_REQUEST['risk_ownership_compreensive'],
  'risk_ownership_link'            => $_REQUEST['risk_ownership_link'],
  'risk_ownership_country'         => $_REQUEST['risk_ownership_country'],
  'risk_ownership_other'           =>  trim($_REQUEST['risk_ownership_other']),


);
$flgIn=$db->updateAry("risk",$aryData,"where user_id='".$_REQUEST['customer_id']."'");


$data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");



echo json_encode($data);
break;
}
case 'viewkyc' :
{
  $userDetails=$db->getRow("SELECT * FROM  customer cu WHERE cu.contract_id='".trim($_REQUEST['contract_id'])."'");
  if ($_REQUEST['need_country'])
  $countryList = $db->getRows("SELECT * FROM countries  ORDER BY FIELD( country_name,  'San Marino','Italy' ) DESC, country_name ASC ");
  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails, 'countrylist' =>  $countryList  );
  echo json_encode($data);
  break;
}
case 'saveKyc' :
{
  $aryData=$_REQUEST['dbData'];
  $flgIn=$db->updateAry("customer",$aryData,"where contract_id='".$_REQUEST['contract_id']."'");
  if (!is_null($flgIn))
  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information salvate");
  else
  $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "error");
  echo json_encode($data);
  break;
}

case 'show_kyc_profile1' :
{
  $userDetails=$db->getRow("SELECT us.image,us.name,ag.*,us.email,us.mobile_number FROM  users us JOIN customer ag ON ag.user_id = us.user_id WHERE ag.user_id='".trim($_REQUEST['customer_id'])."'");
  $countryList = $db->getRows("SELECT * FROM countries  ORDER BY FIELD( country_name,  'San Marino','Italy' ) DESC, country_name ASC ");
  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails, 'countrylist' =>  $countryList  );
  echo json_encode($data);
  break;
}
case 'savekyc1' :
{

  $aryData =array(   'mobile_number'                 => $_REQUEST['mobile'],
  'name'                          => $_REQUEST['namekyc'],
);
$flgIn=$db->updateAry("users",$aryData,"where user_id='".$_REQUEST['customer_id']."'");

$aryData1 =array(  'surname'                      => $_REQUEST['surname'],
'customer_profession'          => $_REQUEST['customer_profession'],
'customer_tel'                 => $_REQUEST['customer_tel'],
'customer_fax'                 => $_REQUEST['customer_fax']
);
$flgIn=$db->updateAry("customer",$aryData1,"where user_id='".$_REQUEST['customer_id']."'");
$data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
echo json_encode($data);
break;
}
case 'show_kyc_profile2' :
{
  $userDetails=$db->getRow("SELECT us.image,us.name,ag.*,us.email,us.mobile_number FROM  users us JOIN customer ag ON ag.user_id = us.user_id WHERE ag.user_id='".trim($_REQUEST['customer_id'])."'");

  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails,  );
  echo json_encode($data);
  break;
}
case 'savekyc2' :
{

  $currdate = strtotime(date("y-m-d"));
  $customer_id_release_date  = strtotime($_REQUEST['customer_id_release_date']);
  $customer_id_validity  = strtotime($_REQUEST['customer_id_validity']);
  $placeofidentification = strtotime($_REQUEST['placeofidentification']);
  //  $placeofidentification = strtotime($_REQUEST['placeofidentification']);
  $dateofidentification = strtotime($_REQUEST['dateofidentification']);

  if($customer_id_release_date >= $currdate   )
  {
    $error=" Invalid  Release  date";
  }

  if($dateofidentification > $currdate )
  {
    $error=" Invalid  Identification  date";
  }

  if($customer_id_validity <= $currdate  )
  {
    $error=" Invalid validity  date";
  }


  if($_REQUEST['customer_check_pep'] !='')
  {

  }

  if($error=='')
  {

    $aryData1 =array(
      'customer_id_authority_name'  => $_REQUEST['customer_id_authority_name'],
      'customer_id_type'             => $_REQUEST['customer_id_type'],
      'customer_id_release_date'     => $_REQUEST['customer_id_release_date'],
      'customer_id_validity'         => $_REQUEST['customer_id_validity'],
      'customer_annual_income'       => $_REQUEST['customer_annual_income'],
      'customer_id_image'            => $_REQUEST['imagename'],
      'place_of_identification'      => $_REQUEST['placeofidentification'],
      'date_of_identification'       => $_REQUEST['dateofidentification']
    );
    $flgIn=$db->updateAry("customer",$aryData1,"where user_id='".$_REQUEST['customer_id']."'");
    $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
  }
  echo json_encode($data);
  break;
}
case 'savekyc3' :
{
  $aryData1 =array(  'customer_address_resi'                          => $_REQUEST['customer_address_resi'],
  'customer_domecile_address_residence'             => $_REQUEST['customer_domecile_address_residence'],
  'customer_main_nationality'                       => $_REQUEST['customer_main_nationality'],
  'customer_resi_country'                           => $_REQUEST['customer_resi_country'],
  'customer_domecile_country'                       => $_REQUEST['customer_domecile_country'],


);
$flgIn=$db->updateAry("customer",$aryData1,"where user_id='".$_REQUEST['customer_id']."'");
$data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
echo json_encode($data);
break;
}
case 'upload_document_image' :
{
  $newfile=md5(microtime()).".jpg";
  $user_id = $_REQUEST['userid'];
  if (!file_exists(PATH_UPLOAD . "document" . DS . 'user_' . $user_id)) {
    mkdir(PATH_UPLOAD . "document" . DS . 'user_' . $user_id, 0777, true);
    mkdir(PATH_UPLOAD . "document" . DS . 'user_' . $user_id . DS . 'resize', 0777, true);
  }
  if (move_uploaded_file($_FILES['file']['tmp_name'], "uploads/document/user_" . $user_id . DS . $newfile)) {


    copy("uploads/document/user_" . $user_id . DS . $newfile, "uploads/document/user_" . $user_id . DS . "resize/" . $newfile);
    smart_resize_image("uploads/document/user_" . $user_id . DS . "resize/$newfile", 210, 194);
  }

  $aryData = array("imagename" =>	$newfile,"cust_id"  => $user_id);

  $flgIn = $db->insertAry("tmp_image",$aryData);

  $data = array('id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
  echo json_encode($data);
  break;

}
case 'get_document_image_name' :
{
  $imagename=$db->getVal("select imagename from tmp_image where id='".$_REQUEST['id']."' ");
  $data = array(
    'RESPONSECODE'	=>  1,
    'RESPONSE'	=> $imagename,
  );
  echo json_encode($data);
  break;
}
case 'OwnersList' :
{

  //   $getcustomerlist = $db->getRows("SELECT us.name,us.email,us.mobile_number,us.image,us.user_id FROM users us JOIN customer cs ON cs.user_id = us.user_id JOIN risk rk rk.user_id =us.user_id  WHERE cs.agency_id ='".$_REQUEST['id']."' AND us.status = '1' AND us.normal_or_company_owner ='1' ORDER BY us.user_id DESC ");
  // $getcustomerlist = $db->getRows("SELECT us.name,us.email,us.mobile_number,us.image,us.user_id,rk.status,cs.kyc_status FROM users us JOIN customer cs ON cs.user_id = us.user_id  JOIN risk rk ON rk.user_id = us.user_id JOIN  WHERE cs.agency_id ='".$_REQUEST['id']."' AND us.normal_or_company_owner ='1' ORDER BY us.user_id DESC ");
  $sql="SELECT concat(us.name,' ',us.surname) as fullname, us.email,us.mobile_number,us.image,us.user_id,
  co.company_id,co.agency_id, co.percentuale
  FROM company_owners co
  JOIN users us  ON  co.user_id = us.user_id
  WHERE co.company_id ='".$_REQUEST['company_id']."'  AND us.status <> 2 ORDER BY co.id DESC  ";
  error_log($_REQUEST['action']."1-".$_REQUEST['id'] .$sql.  PHP_EOL);
  $getcustomerlist = $db->getRows($sql);


  if(count($getcustomerlist) > 0 && is_array($getcustomerlist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getcustomerlist);
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;
}
case 'view_Owners_Profile_info' :
{
  if($_REQUEST['customer_id']!='' )
  {
    $userDetails=$db->getRow("SELECT us.*,cy.name,cs.customer_dob  FROM  users us JOIN company_owners co ON co.user_id = us.user_id JOIN company cy ON co.company_id = cy.company_id JOIN customer cs ON cs.user_id = us.user_id  WHERE us.user_id='".trim($_REQUEST['customer_id'])."' ");
    //echo $db->getLastQuery(); exit;
    //  $userDetails=$db->getRow("SELECT us.*,cs.customer_dob FROM  users us JOIN customer cs ON cs.user_id = us.user_id WHERE us.user_id='".trim($_REQUEST['customer_id'])."' ");

    if($userDetails['user_id']!='')
    {

      $userInfo= array('name'=> $userDetails['name'],'email'=>$userDetails['email'],'mobile_number'=>$userDetails['mobile_number'],'imagename'  =>$userDetails['image'],'company_name' =>  $userDetails['company_name'],'dob' => $userDetails['customer_dob']  );
      $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> $userInfo);
    }
    else{$data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Invalid User");}
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
  }
  echo json_encode($data);
  break;
  break;
}
case 'show_kyc_profile4' :
{
  $userDetails=$db->getRow("SELECT us.image,us.name,us.email,us.mobile_number,cq.user_role_with_company,cy.* FROM  users us JOIN customer ag ON ag.user_id = us.user_id JOIN company_owners cq ON cq.user_id = us.user_id JOIN company cy ON cq.company_id = cy.company_id  WHERE ag.user_id='".trim($_REQUEST['customer_id'])."'");

  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails,  );
  echo json_encode($data);
  break;
}
case 'savekyc4' :
{
  $aryData1 =array(  'user_role_with_company'                          => $_REQUEST['user_role_with_company'],
);
$flgIn=$db->updateAry("company_owners",$aryData1,"where user_id='".$_REQUEST['customer_id']."'");
$data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
echo json_encode($data);
break;
}
case 'CompanyList' :
{
  $sql="SELECT  * FROM company ";
  if($_REQUEST['usertype'] =='2')
  {
    if($_REQUEST['priviledge'] == 1 )
    {
      $sql.="  WHERE agent_id ='".$_REQUEST['id']."' AND status <> 2 ORDER BY company_id DESC ";

    }
    else if($_REQUEST['priviledge'] == 2)
    {
      $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$_REQUEST['id']."'  ");
      $sql.=" WHERE agency_id ='".$agencyvalue."' AND status <> 2 ORDER BY company_id DESC";

    }
  }
  else if($_REQUEST['usertype'] =='1')
  {

    $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$_REQUEST['id']."'  ");
    $sql.=" WHERE agency_id ='".$agencyvalue."' AND status <> 2 ORDER BY company_id DESC";
  }
  error_log($_REQUEST['action']."1-".$_REQUEST['id'] .$sql.  PHP_EOL);

  // $getcompanylist = $db->getRows("SELECT  * FROM company WHERE agency_id ='".$_REQUEST['id']."' And status <> 2 ORDER BY  company_id DESC ");
  $getcompanylist = $db->getRows($sql);

  if(count($getcompanylist) > 0 && is_array($getcompanylist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getcompanylist);
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;
}
case 'add_company' :
{
  if($_REQUEST['company_name']!='')
  {
    $aryCheckCompName=$db->getVal("select name  from company where fiscal_id='".trim($_REQUEST['dbData']['fiscal_id'])."'");
  }
  if($aryCheckCompName !='')
  {
    $error=" Partita Iva già esistente";
  }
  $currdate = strtotime(date("y-m-d"));
  if($_REQUEST['usertype'] =='1')
  {

    $agency = $db->getRow("SELECT  a.agency_id, u.name as agency_name FROM agency  a join users u  on  a.user_id=u.user_id WHERE u.user_id = '".$_REQUEST['id']."'  ");

  }
  else {
    $agency = $db->getRow("SELECT  a.agency_id, u.name as agency_name FROM agent a join users u  on  a.agency_id=u.user_id  WHERE u.user_id = '".$_REQUEST['id']."'  ");


  }
  /*$company_authorisation_date  = strtotime($_REQUEST['company_authorisation_date']);

  if($company_authorisation_date >= $currdate )
  {
  $error=" Invalid  Authorization  date";
}
*/
error_log($_REQUEST['action']."1-".$_REQUEST['id'] .$sql.  PHP_EOL);

if($error=='')
{
  $aryData=$_REQUEST['dbData'];
  $aryData['status']=1;
  $aryData['agency_id']=$agency['agency_id'];
  $aryData['agent_id']=$_REQUEST['id'];

  $flgIn=$db->insertAry("company",$aryData);
  if (!is_null($flgIn)){
    $lastid=$db->getVal("SELECT LAST_INSERT_ID()");
    $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Società inserita correttamente", 'lastid'=> $lastid);
    echo json_encode($data);
    break;
  }

}
$data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
echo json_encode($data);
break;
}
case 'upload_compnay_doc_image' :
{
  $newfile=md5(microtime()).".jpg";
  $user_id = $_REQUEST['custid'];
  if(move_uploaded_file($_FILES['file']['tmp_name'],"uploads/company/".$newfile))
  {
    copy("uploads/company/" . $newfile, "uploads/company/resize/" . $newfile);
    smart_resize_image("uploads/company/" . "resize/$newfile", 210, 194);
    $aryData = array("imagename" =>	$newfile,"cust_id"  => $user_id);
    $flgIn = $db->insertAry("tmp_image",$aryData);


  }





  $data = array('id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
  echo json_encode($data);
  break;

}
case 'get_compnay_doc_image_name' :
{
  $imagename=$db->getVal("select imagename from tmp_image where id='".$_REQUEST['id']."' ");
  $data = array(
    'RESPONSECODE'	=>  1,
    'RESPONSE'	=> $imagename,
  );
  echo json_encode($data);
  break;
}
case 'upload_company_lisence_image' :
{
  $newfile=md5(microtime()).".jpg";
  $user_id = $_REQUEST['custid'];
  if(move_uploaded_file($_FILES['file']['tmp_name'],"uploads/company/".$newfile))
  {
    copy("uploads/company/" . $newfile, "uploads/company/resize/" . $newfile);
    smart_resize_image("uploads/company/" . "resize/$newfile", 210, 194);
    $aryData = array("imagename" =>	$newfile,"cust_id"  => $user_id);
    $flgIn = $db->insertAry("tmp_image",$aryData);


  }





  $data = array('id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
  echo json_encode($data);
  break;

}
case 'get_company_lisence_image_name' :
{
  $imagename=$db->getVal("select imagename from tmp_image where id='".$_REQUEST['id']."' ");
  $data = array(
    'RESPONSECODE'	=>  1,
    'RESPONSE'	=> $imagename,
  );
  echo json_encode($data);
  break;
}
case 'edit_company' :
{
  if($_REQUEST['company_name']!='')
  {
    $aryCheckCompName=$db->getVal("select name  from company where fiscal_id='".trim($_REQUEST['dbData']['fiscal_id'])."' and company_id !='".$_REQUEST['dbData']['company_id']."' ");
  }
  if($aryCheckCompName !='')
  {
    $error=" Partita Iva già Esistente";
  }
  /*$currdate = strtotime(date("y-m-d"));
  $company_authorisation_date  = strtotime($_REQUEST['company_authorisation_date']);

  if($company_authorisation_date >= $currdate )
  {
  $error=" Invalid Authorization  date";
}
*/
if($error=='')
{
  $aryData=$_REQUEST['dbData'];
  $flgIn=$db->updateAry("company",$aryData,"where company_id='".$_REQUEST['dbData']['company_id']."'");
  if (!is_null($flgIn)){
    $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Società aggiornata correttamente");
    echo json_encode($data);
    break;

  }

}
$data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
echo json_encode($data);
break;
}
case 'show_edit_company' :
{
  $userDetails=$db->getRow("SELECT * FROM   company   WHERE company_id='".trim($_REQUEST['company_id'])."'");

  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails,  );
  echo json_encode($data);
  break;
}
case 'add_owners' :
{
  if($_REQUEST['appData']['usertype'] =='1')
  {
    $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$_REQUEST['appData']['id']."'  ");

  }else{
    $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$_REQUEST['appData']['id']."'  ");

  }
  $error='';
  error_log('add owners: ' . print_r($_REQUEST,1) .print_r($_REQUEST['dbData'],1) . PHP_EOL);
  if($_REQUEST['dbData']['user_id']!='')
  {
    $sql="select user_id  from company_owners where user_id='".trim($_REQUEST['dbData']['user_id'])."'";
    error_log('add owenrs: ' . $sql . PHP_EOL);
    $aryCheckEmail=$db->getVal();
  }

  if($aryCheckEmail!='')
  {
    $error="Cliente già presente fra i titolari";
  }

  if($error=='')
  {
    $aryData=$_REQUEST['dbData'];
    $aryData['agency_id']=$agencyvalue;
    $aryData['agent_id']=$_REQUEST['appData']['id'];

    $flgIn=$db->insertAry("company_owners",$aryData);
    if(!is_null($flgIn))
    {
      $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Titolare Effettivo inserito correttamente");
      echo json_encode($data);
      break;
    }
  }
  $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
  echo json_encode($data);
  break;

}
case 'edit_owners' :
{
  if($_REQUEST['appData']['usertype'] =='1')
  {
    $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$_REQUEST['appData']['id']."'  ");

  }else{
    $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$_REQUEST['appData']['id']."'  ");

  }
  $error='';
  error_log('add owners: ' . print_r($_REQUEST,1) .print_r($_REQUEST['dbData'],1) . PHP_EOL);
  if($_REQUEST['dbData']['user_id']!='')
  {
    $sql="select user_id  from company_owners where user_id='".trim($_REQUEST['dbData']['user_id'])."'";
    error_log('add owenrs: ' . $sql . PHP_EOL);
    $aryCheckEmail=$db->getVal();
  }

  if($aryCheckEmail!='')
  {
    $error="Cliente già presente fra i titolari";
  }

  if($error=='')
  {
    $aryData=$_REQUEST['dbData'];
    $aryData['agency_id']=$agencyvalue;
    $aryData['agent_id']=$_REQUEST['appData']['id'];

    $flgIn=$db->updateAry("company_owners",$aryData);
    if(!is_null($flgIn))
    {
      $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Titolare Effettivo inserito correttamente");
      echo json_encode($data);
      break;
    }
  }
  $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
  echo json_encode($data);
  break;

}

case 'contract_form' :
  {
    $aryData=array(	     'pr_of_service_contract'			=>	trim($_REQUEST['pr_of_service_contract']),
    'scope_contract'			        =>	trim($_REQUEST['scope_contract']),
    'nature_contract'		                =>	$_REQUEST['nature_contract'],
    'name_person_company'		        =>	trim($_REQUEST['name_person_company']),
    'economic_value'                            =>     trim($_REQUEST['economic_value']),

    'actofperson'                               =>  trim($_REQUEST['actofperson']),
    'act_name'                                  =>  trim($_REQUEST['act_first_name']),
    'act_surname'                               =>  trim($_REQUEST['act_last_name']),
    'act_email'                                 =>  trim($_REQUEST['act_email']),
    'act_mobile'                                =>  trim($_REQUEST['act_mobile']),
    'act_address'                               =>  trim($_REQUEST['act_address']),

    'act_username'                              =>  trim($_REQUEST['act_username']),
    'act_resi_country'                          =>  trim($_REQUEST['act_resi_country']),
    'act_domi_country'                          =>  trim($_REQUEST['act_domi_country']),
    'act_domi_address'                          =>  trim($_REQUEST['act_domi_address']),
    'act_nationality'                           =>  trim($_REQUEST['act_nationality']),
    'act_ficscal_no'                            =>  trim($_REQUEST['act_ficscal_no']),
    'act_dob'                                   =>  trim($_REQUEST['act_dob']),
    'act_country_birth'                         =>  trim($_REQUEST['act_country_birth']),
    'act_docu_identity'                         =>  trim($_REQUEST['act_docu_identity']),
    'act_authority_realesed_doc'                =>  trim($_REQUEST['act_authority_realesed_doc']),
    'act_realase_date'                          =>  trim($_REQUEST['act_realase_date']),
    'act_validity_date'                         =>  trim($_REQUEST['act_validity_date']),
    'act_profession'                            =>  trim($_REQUEST['act_profession']),
    'act_telephone'                             =>  trim($_REQUEST['act_telephone']),
    'act_annual_income'                         =>  trim($_REQUEST['act_annual_income']),
    'act_fax'                                   =>  trim($_REQUEST['act_fax']),
    'act_password'                              =>  trim($_REQUEST['act_password']),
    'act_customer_id_image'                            =>  $_REQUEST['image_document'],
    'act_image'                                 => $_REQUEST['imagename']




  );
  // $flgIn=$db->insertAry("company",$aryData);
  $flgIn=$db->updateAry("user_contract",$aryData,"where user_id='".$_REQUEST['customer_id']."'");
  $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Information updated successfully");
  echo json_encode($data);
  break;

}
case 'contract_form_owner' :
  {
    $aryData=array(	     'pr_of_service_contract'			=>	trim($_REQUEST['pr_of_service_contract']),
    'scope_contract'			        =>	trim($_REQUEST['scope_contract']),
    'nature_contract'		                =>	$_REQUEST['nature_contract'],
    'name_person_company'		        =>	trim($_REQUEST['name_person_company']),
    'economic_value'                            =>  trim($_REQUEST['economic_value']),
    'number_of_doc_with_validity'               => trim($_REQUEST['number_of_doc_with_validity']),
    'risk_defined'                              =>  trim($_REQUEST['risk_defined']),
    'company_person_name'                      => trim($_REQUEST['company_person_name']),

    'actofperson'                               =>  trim($_REQUEST['actofperson']),
    'act_name'                                  =>  trim($_REQUEST['act_first_name']),
    'act_surname'                               =>  trim($_REQUEST['act_last_name']),
    'act_email'                                 =>  trim($_REQUEST['act_email']),
    'act_mobile'                                =>  trim($_REQUEST['act_mobile']),
    'act_address'                               =>  trim($_REQUEST['act_address']),

    'act_username'                              =>  trim($_REQUEST['act_username']),
    'act_resi_country'                          =>  trim($_REQUEST['act_resi_country']),
    'act_domi_country'                          =>  trim($_REQUEST['act_domi_country']),
    'act_domi_address'                          =>  trim($_REQUEST['act_domi_address']),
    'act_nationality'                           =>  trim($_REQUEST['act_nationality']),
    'act_ficscal_no'                            =>  trim($_REQUEST['act_ficscal_no']),
    'act_dob'                                   =>  trim($_REQUEST['act_dob']),
    'act_country_birth'                         =>  trim($_REQUEST['act_country_birth']),
    'act_docu_identity'                         =>  trim($_REQUEST['act_docu_identity']),
    'act_authority_realesed_doc'                =>  trim($_REQUEST['act_authority_realesed_doc']),
    'act_realase_date'                          =>  trim($_REQUEST['act_realase_date']),
    'act_validity_date'                         =>  trim($_REQUEST['act_validity_date']),
    'act_profession'                            =>  trim($_REQUEST['act_profession']),
    'act_telephone'                             =>  trim($_REQUEST['act_telephone']),
    'act_annual_income'                         =>  trim($_REQUEST['act_annual_income']),
    'act_fax'                                   =>  trim($_REQUEST['act_fax']),
    'act_password'                              =>  trim($_REQUEST['act_password']),
    'act_customer_id_image'                            =>  $_REQUEST['image_document'],
    'act_image'                                 => $_REQUEST['imagename']

  );
  // $flgIn=$db->insertAry("company",$aryData);
  $flgIn=$db->updateAry("user_contract",$aryData,"where user_id='".$_REQUEST['customer_id']."'");
  $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Information updated successfully");
  echo json_encode($data);
  break;

}
case 'show_contract' :
{
  // $userDetails=$db->getRow("SELECT us.image,us.name,us.email,us.mobile_number,cq.user_role_with_company,cy.* FROM  users us JOIN customer ag ON ag.user_id = us.user_id JOIN company_owners cq ON cq.user_id = us.user_id JOIN company cy ON cq.company_id = cy.company_id  WHERE ag.user_id='".trim($_REQUEST['customer_id'])."'");

  $userDetails=$db->getRow("SELECT uc.*,us.image FROM user_contract uc JOIN users us ON us.user_id = uc.user_id  WHERE uc.user_id='".trim($_REQUEST['customer_id'])."'");
  //$countryList = $db->getRows("SELECT * FROM countries ORDER BY country_name ASC");

  $countryList = $db->getRows("SELECT * FROM countries  ORDER BY FIELD( country_name,  'San Marino','Italy' ) DESC, country_name ASC ");

  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails,'countrylist' =>  $countryList  );
  echo json_encode($data);
  break;
}
case 'kycstep05' :
{
  $aryData1 =array(

    'economic_value_of_service'                      => $_REQUEST['economic_value_of_service'],
    'nature_of_service'                              => $_REQUEST['nature_of_service'],
    'scope_of_service'                               => $_REQUEST['scope_of_service'],
    'kyc_status'                                      => 1


  );
  if($_REQUEST['sign'] != '')
  {
    $aryData1['sign']   = $_REQUEST['sign'];
  }

  $flgIn=$db->updateAry("customer",$aryData1,"where user_id='".$_REQUEST['customer_id']."'");
  $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
  echo json_encode($data);
  break;
}
case 'saveProfileCustomer':
{
  $error='';

  if($error=='')
  {

    $aryData=$_REQUEST['dbData'];
    $flgIn=$db->updateAry("users",$aryData,"where user_id='".$_REQUEST['dbData']['user_id']."'");


    //                $flgIIn2=$db->updateAry("customer",$aryData2,"where contractor_id='".$_REQUEST['dbData']['id']."'");
    if(!is_null($flgIn))
    {
      $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> "Cliente Aggiornato con Successo");
    }
    else
    {
      $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Error");
    }
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
  }
  echo json_encode($data);
  break;


}
case 'saveProfileAgent':
{
  $error='';


  if($error=='')
  {

    $aryData=array(	'name'			=>	trim($_REQUEST['name']),
    'mobile_number'     =>	trim($_REQUEST['mobile_number']),


  );
  $flgIn=$db->updateAry("users",$aryData,"where user_id='".$_REQUEST['id']."'");

  $aryData2 = array( 'agent_previledge'      =>      trim($_REQUEST['agent_previledge']) );
  $flgIn1=$db->updateAry("agent",$aryData2,"where user_id='".$_REQUEST['id']."'");
  if(!is_null($flgIn))
  {


    $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> "Details Saved Successfully");
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Error");
  }
}
else
{
  $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
}
echo json_encode($data);
break;


}
case 'upload_edit_customer_image' :
{
  $newfile=md5(microtime()).".jpg";
  if(move_uploaded_file($_FILES['file']['tmp_name'],"uploads/user/".$newfile))
  {
    copy("uploads/user/" . $newfile, "uploads/user/small/" . $newfile);
    smart_resize_image("uploads/user/" . "small/$newfile", 210, 194);
    $imagename=$db->getVal("select image from users where user_id='".$_REQUEST['userid']."' ");
    @unlink("uploads/user/$imagename");


  }



  $aryData = array("image" =>	$newfile);

  $db->updateAry("users",$aryData,"where user_id='".$_REQUEST['userid']."'");

  $flgIn = $_REQUEST['userid'];



  $data = array('review_id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
  echo json_encode($data);
  break;

}
case 'get_edit_customer_image_name' :
{
  $imagename=$db->getVal("select image from users where user_id='".$_REQUEST['userid']."' ");
  $data = array(
    'RESPONSECODE'	=>  1,
    'RESPONSE'	=> $imagename,
  );
  echo json_encode($data);
  break;
}
case 'show_kyc_profile6' :
{

  $getimaglist = $db->getRows("SELECT  * FROM customer_documents WHERE user_id ='".$_REQUEST['customer_id']."' ORDER BY  id DESC ");

  if(count($getimaglist) > 0 && is_array($getimaglist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getimaglist);
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;
}
case 'documentList' :
{

  $getimaglist = $db->getRows("SELECT  * FROM customer_documents WHERE for_id ='".$_REQUEST['dbData']['for_id']."' for ='".$_REQUEST['dbData']['for']." ORDER BY  id DESC ");

  if(count($getimaglist) > 0 && is_array($getimaglist) )
  {
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getimaglist);
  }
  else
  {
    $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> '');

  }
  echo json_encode($data);
  break;
}
case 'deletecustimage' :
{
  $imagename=$db->getVal("select doc_image from customer_documents where id='".$_REQUEST['id']."' ");
  @unlink("uploads/document/user_" . $_REQUEST['cust_id'] . '/' . $imagename);
  @unlink("uploads/document/user_" . $_REQUEST['cust_id'] . "/resize/" . $imagename);
  $res = $db->delete('customer_documents', "where id='" . $_REQUEST['id'] . "'");
  $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $res );
  echo json_encode($data);
  break;
}
case 'upload_document_image_multi' :
{
  error_log("passato di qui ". print_r($_REQUEST,1) .PHP_EOL);
  $for=$_REQUEST['for'] ;
  $newfile=md5(microtime()).".jpg";
  $user_id = $_REQUEST['userid'];
  error_log("controllo" .PATH_UPLOAD . "document" . DS . $for ."_".  $user_id .PHP_EOL);
  if (!file_exists(PATH_UPLOAD . "document" . DS . $for ."_".  $user_id)) {
    error_log("MKDIR:". PATH_UPLOAD . "document" . DS . $for ."_". $user_id .PHP_EOL);

    mkdir(PATH_UPLOAD . "document" . DS . $for ."_". $user_id, 0777, true);
    mkdir(PATH_UPLOAD . "document" . DS . $for ."_". $user_id . DS . 'resize', 0777, true);
  }
  error_log("MOVE:". $_FILES['file']['tmp_name']. "uploads/document/".$for ."_". $user_id . DS . $newfile .PHP_EOL);

  if (move_uploaded_file($_FILES['file']['tmp_name'], "uploads/document/".$for ."_". $user_id . DS . $newfile)) {
    error_log("COPY:". "uploads/document/".$for ."_" . $user_id . DS . $newfile ."---" . "uploads/document/".$for ."_". $user_id . DS . "resize/" . $newfile.PHP_EOL);


    copy("uploads/document/".$for ."_" . $user_id . DS . $newfile, "uploads/document/".$for ."_". $user_id . DS . "resize/" . $newfile);
    smart_resize_image("uploads/document/".$for ."_". $user_id . DS . "resize/$newfile", 210, 194);
  }

  $aryData = array("imagename" =>	$newfile,"for"  =>$_REQUEST['for'],"doc_id"=>$user_id);

  $flgIn = $db->insertAry("tmp_image",$aryData);

  $data = array('id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
  echo json_encode($data);
  break;

}
case 'get_document_image_name_multi' :
{
  $imagename=$db->getVal("select imagename from tmp_image where id='".$_REQUEST['id']."' ");
  $data = array(
    'RESPONSECODE'	=>  1,
    'RESPONSE'	=> $imagename,
  );
  echo json_encode($data);
  break;
}
case 'savedocument' :
{
  $aryData = $_REQUEST['dbData'];

  $flgIn = $db->insertAry("contract_documents",$aryData);

  $data = array(
    'RESPONSECODE'	=>  1,
    'RESPONSE'	=> $imagename,
  );
  echo json_encode($data);
  break;
}
case 'fetchuserimage' :
{
  $imagename=$db->getRow("select image,name from users where user_id='".$_REQUEST['id']."' ");
  $data = array(
    'RESPONSECODE'	=>  1,
    'RESPONSE'	=> $imagename['image'],
    'NAME'      => $imagename['name']
  );
  echo json_encode($data);
  break;
}
case 'upload_document_imagecontract' :
{
  $newfile=md5(microtime()).".jpg";

  if (move_uploaded_file($_FILES['file']['tmp_name'], "uploads/contractform/". $newfile)) {

    copy("uploads/contractform/" . $newfile, "uploads/contractform/small/" . $newfile);
    smart_resize_image("uploads/contractform/" . "small/$newfile", 210, 194);

  }

  $data = array( 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
  echo json_encode($data);
  break;

}
case 'upload_imagecontract' :
{
  $newfile=md5(microtime()).".jpg";

  if (move_uploaded_file($_FILES['file']['tmp_name'], "uploads/contractform/". $newfile)) {

    copy("uploads/contractform/" . $newfile, "uploads/contractform/small/" . $newfile);
    smart_resize_image("uploads/contractform/" . "small/$newfile", 210, 194);

  }

  $data = array( 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
  echo json_encode($data);
  break;

}




}
?>
