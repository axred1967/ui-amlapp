<?php
include_once("config.php");

//error_log("passato2 ".$_SERVER['$request_METHOD']. $request['action'].print_r($request,1).PHP_EOL);
function doAction($request,$db,$data=array()){
  error_log("passato ". $request['action'].print_r($request,1).PHP_EOL);
  if ($request['action']=='login'){
      if ($request['username']=='' || $request['password']==''){
        $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Immettere username e password");
        echo json_encode($data);
        return $data;
      }
        //$sql="SELECT * FROM users  WHERE BINARY lower(email)='".trim(strtolower($request['username']))."' AND BINARY password='".$request['password']."' AND (user_type = '1' OR user_type = '2' ) ";
      $sql="SELECT * FROM users  WHERE BINARY lower(email)='".trim(strtolower($request['username']))."' AND BINARY password='".$request['password']."' ";
      $chkuser=$db->getRow($sql);

      if(!$chkuser['user_id']>0){
          $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Username / Password non corrispondono" );
          echo json_encode($data);
          return $data;
      }


      if($chkuser['status']=='2')
      {
        $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> " Your Account is Deleted");
        echo json_encode($data);
        return $data;
      }
      if(!($chkuser['user_type'] =='-1' || $chkuser['user_type'] =='1' || $chkuser['user_type'] =='2' || $chkuser['user_type'] =='3' ) )
      {
        $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Tipo utente non consentito");
        echo json_encode($data);
        return $data;
      }

      if($chkuser['user_type'] =='1')
      {
        $agencyId = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$chkuser['user_id']."'  ");
        $agentId = -1;
        $agentPriviledge =-1;

      }
      if($chkuser['user_type'] =='2')
      {
        $agencyId = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$chkuser['user_id']."'  ");
        $agentId = $db->getVal("SELECT agent_id FROM agent WHERE user_id = '".$chkuser['user_id']."'  ");
        $agentPriviledge = $db->getVal("SELECT agent_priviledge FROM agent WHERE user_id = '".$chkuser['user_id']."'  ");

      }
      if($chkuser['user_type'] =='-1'){
        $agencyId = -1;
        $agentId = -1;
        $agentPriviledge =-1;
      }
      if($chkuser['user_type'] =='3'){
        $agencyId = -3;
        $agentId = -3;
        $agentPriviledge =-3;
      }

      $cookie=rand(0,100000);
      setcookie("user".$chkuser['user_id'],$cookie,time()+3600*24);

      if($chkuser['status']=='99')
      {
        $data = array('RESPONSECODE'=> 3 ,'RESPONSE'=> "Completa la Registrazione!\n clicca sul link di verifica sulla tua email di iscrizione",
                        "userId"=>$chkuser['user_id'],"agentId"=>$agentId,"agencyId"=>$agencyId,
                        "email" => $chkuser['email'],"name"  =>$chkuser['name'],
                        "usertype" => $chkuser['user_type'], "image_name" => $chkuser["image"],
                        "privilidge" => $agentPriviledge,"settings" => $chkuser['settings'],
                         "cookie"=>$cookie );
        echo json_encode($data);
        return $data;
      }


      $data = array('RESPONSECODE'=> 1 ,"userId"=>$chkuser['user_id'],"agentId"=>$agentId,"agencyId"=>$agencyId,
                      "email" => $chkuser['email'],"name"  =>$chkuser['name'],
                      "usertype" => $chkuser['user_type'], "image_name" => $chkuser["image"],
                      "privilidge" => $agentPriviledge,"settings" => $chkuser['settings'],
                       "cookie"=>$cookie );
      //////error_log(print_r($data,1));
      echo json_encode($data);
      die();
  }
  if (strlen($request['pInfo']['agency_id'])==0 ||strlen($request['pInfo']['user_type'])==0 ||strlen($request['pInfo']['agent_id'])==0 ||strlen($request['pInfo']['agency_id'])==0 ){
    $data=array(  'RESPONSECODE'	=>  -1,   'RESPONSE'	=> "Credeziali non valide", "var"=>print_r($_REQUEST,1).print_r($_COOKIE,1));
    //error_log("credenziali non valide". print_r($_REQUEST,1));
    echo json_encode($data);
    die();

  }
  if ($request['pInfo']['user_type']>1){
    $SQL="select a.*,u.* from agent as a
        join users as u on a.users_id=u.users_id
        where a.agent_id='".$request['pInfo']['agent_id']."'
        and a.agency_id'".$request['pInfo']['agency_id']."'";
    $us=$db->getRow($SQL);
    if ($us['agent_id']!=$request['agent_id']){
      $data=array(  'RESPONSECODE'	=>  -1,   'RESPONSE'	=> "Credeziali non valide", "var"=>print_r($_REQUEST,1).print_r($_COOKIE,1));
      //error_log("credenziali non valide". print_r($_REQUEST,1));
      echo json_encode($data);
      die();
    }

  }
  if ($request['pInfo']['user_type']==1){
    $SQL="select a.*,u.* from agency as a
        join users as u on a.user_id=u.user_id
        where a.user_id='".$request['pInfo']['user_id']."'
        and a.agency_id='".$request['pInfo']['agency_id']."'";
    $us=$db->getRow($SQL);
    error_log("us".print_r($us,1));
    if ($us['agency_id']!=$request['pInfo']['agency_id']){
      $data=array(  'RESPONSECODE'	=>  -1,   'RESPONSE'	=> "Credeziali non valide", "var"=>print_r($_REQUEST,1).print_r($_COOKIE,1));
      //error_log("credenziali non valide". print_r($_REQUEST,1));
      echo json_encode($data);
      die();
    }
  }
  if ($request['pInfo']['user_type']==-1){
    $SQL="select u.* from users as u
        where u.user_id='".$request['pInfo']['user_id']."' ";
        $db->getRows($SQL);
        $us=$db->getRow($SQL);
        error_log("us".print_r($us,1));
        if ($us['user_id']!=$request['pInfo']['user_id']){
          $data=array(  'RESPONSECODE'	=>  -1,   'RESPONSE'	=> "Credeziali non valide", "var"=>print_r($_REQUEST,1).print_r($_COOKIE,1));
          //error_log("credenziali non valide". print_r($_REQUEST,1));
          echo json_encode($data);
          die();
        }

  }
  if ($us['status']!=1 && !( strtolower($request['pInfo']['action'])=='signup' || strtolower($request['pInfo']['action'])=='completesignup') ){
    $data=array(  'RESPONSECODE'	=>  -1,   'RESPONSE'	=> "Utente non verificato", "var"=>print_r($us,1).print_r($_REQUEST,1).print_r($_COOKIE,1));
    //error_log("credenziali non valide". print_r($_REQUEST,1));
    echo json_encode($data);
    die();

  }


  switch($request['action'])
  {
    case 'countryList' :
    $countryList = $db->getRows("SELECT * FROM countries  ORDER BY FIELD( country_name,  'San Marino','Italia' ) DESC, country_name ASC ");
    $data = array('countryList'=>$countryList);
    echo json_encode($data);
    break;


    case 'upload_user_image' :
    {
      $newfile=md5(microtime()).".jpg";
      if(move_uploaded_file($_FILES['file']['tmp_name'],"uploads/users/".$newfile))
      {
        copy("uploads/users/" . $newfile, "uploads/users/small/" . $newfile);
        smart_resize_image("uploads/users/" . "small/$newfile", 210, 194);
        $imagename=$db->getVal("select image from users where user_id='".$request['userid']."' ");
        @unlink("uploads/users/$imagename");
      }
      //$aryData = array("image" =>	$newfile);
      //$db->updateAry("users",$aryData,"where user_id='".$request['userid']."'");
      $flgIn = $request['userid'];
      $data = array('review_id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
      echo json_encode($data);
      break;

    }
    case 'upload_company_image' :
    {
      $newfile=md5(microtime()).".jpg";
      if(move_uploaded_file($_FILES['file']['tmp_name'],"uploads/company/".$newfile))
      {
        copy("uploads/user/" . $newfile, "uploads/company/small/" . $newfile);
        smart_resize_image("uploads/company/" . "small/$newfile", 210, 194);
        $imagename=$db->getVal("select image from company where company_id='".$request['company_id']."' ");
        @unlink("uploads/company/$imagename");


      }
      //$aryData = array("image" =>	$newfile);
      //$db->updateAry("users",$aryData,"where user_id='".$request['userid']."'");
      //$flgIn = $request['userid'];
      $data = array('review_id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
      echo json_encode($data);
      break;

    }
    case 'get_user_image_name' :
    {
      $imagename=$db->getVal("select image from users where user_id='".$request['userid']."' ");
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
        $flgIn=$db->updateAry("users",$aryData,"where user_id='".$request['id']."'");

      }
      //echo json_encode($data);
      break;
    }
    case 'get_profile_image_name':
    {
      $imgList=$db->getRows("select image FROM users where user_id='".$request['id']."' ");
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
      if($request['id']!='' && $request['id']!='')
      {
        $userDetails=$db->getRow("SELECT users.* FROM  users WHERE user_id='".trim($request['id'])."'");
        if($userDetails['user_type'] == '1'  )
        {
          $type =1;
          $plan_name=$db->getVal("SELECT pl.plan_name FROM plan pl JOIN agency ay ON pl.plan_id =ay.plan_id  WHERE ay.user_id='".$request['id']."' ");
        }
        else if($userDetails['user_type'] == '2')
        {
          $type =2;
          $plan_name=$db->getVal("SELECT name FROM users  us JOIN agent ay ON us.user_id = ay.agency_id WHERE ay.user_id='".$request['id']."' ");
        }

        if($userDetails['user_id']!='')
        {

          $userInfo= array('name'=> $userDetails['name'],'email'=>$userDetails['email'],'mobile'=>$userDetails['mobile'],'imagename'  =>$userDetails['image'] ,'plan_name'  => ucwords($plan_name),'type' => $type );
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
    case 'saveProfileAx':
    {
      $error='';


      if($error=='')
      {

        $aryData=$request['dbData'];
        $flgIn=$db->updateAry("users",$aryData,"where user_id='".$request['id']."'");
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
    case 'saveKycAx':{
      if ($request['appData']['contract_id']!='' ){
        $db->updateAry("kyc", $request['dbData'], "where contract_id=". $request['appData']['contract_id']);
        $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
        echo json_encode($data);
        if ($request['final']){
          $request['appData']['kyc_status']=1;
          $flgIn=$db->updateAry("contract", $request['appData'], "where id=". $request['appData']['contract_id']);
        }
        break;
      }
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
      echo json_encode($data);
      break;

    }

    case 'kycAx':{
      if ($request['appData']['contract_id']!='' ){
        $SQL="SELECT * FROM kyc WHERE contract_id=".  $request['appData']['contract_id'];
        $kyc=$db->getRow($SQL);
        if (count($kyc)==0){
          $aryData=$request['appData'];
          $Kyc=$request['appData'];
          $new=true;
        }
        $aryData2=$request['appData'];
        ////error_log("arydata2 xx".print_r($aryData2,1));
        ////error_log("kyc ".print_r($kyc,1));
        $aryData2['name']=$aryData['name1'];
        //$aryData['customer_data']=json_encode($aryData2);
        $contractor = $db->getRow("SELECT * FROM users where user_id=".$aryData2['contractor_id']);
        $contr=json_decode($kyc['contractor_data'],true);
        if ($kyc['contractor_data']=='false' || count($contr)==0) {
          $kyc['contractor_data']=json_encode($contractor,JSON_UNESCAPED_SLASHES);
        }
        // aggiorno i contratti
        $contract = $db->getRow("SELECT * FROM contract where id=".$aryData2['contract_id']);
        //error_log("contract: ".print_r($contract,1));
        if ($kyc['contract_data']=='false' || count($contr)==0) {
          $kyc['contract_data']=json_encode($contract,JSON_UNESCAPED_SLASHES);
        }

        if ($aryData2['act_for_other']==1){
          $com=json_decode($kyc['company_data'],true);
          $owner=json_decode($kyc['owner_data'],true);
          $kyc['company_id']=$aryData['other_id'];
          if ($kyc['company_data']=='false' || count($com)==0) {
            $company = $db->getRow("SELECT * FROM company where company_id=".$aryData2['other_id']);
            ////error_log("xx".print_r($company,1));
            $kyc['company_data']=json_encode($company,JSON_UNESCAPED_SLASHES);
          }
          if ($kyc['owner_data']=='false' || count($owner)==0) {
            //inserisco i dati della società
            $owners = $db->getRows("SELECT percentuale ,us.* FROM  company_owners as co join users as us on us.user_id=co.user_id where company_id=".$aryData2['other_id']);
            $kyc['owner_data']=json_encode($owners,JSON_UNESCAPED_SLASHES);
            ////error_log("owner_null".print_r($owners,1));
          }
        }
        if ($aryData2['act_for_other']==2){
          $owner=json_decode($kyc['owner_data'],true);
          if ($kyc['owner_data']=='false' ||  count($owner)==0) {
            //inserisco i dati della società
            $owners = $db->getRows("SELECT percentuale, us.* FROM  company_owners as co join users as us on us.user_id=co.user_id where  contract_id=".$aryData2['contract_id']);
            $kyc['owner_data']=json_encode($owners,JSON_UNESCAPED_SLASHES);
            ////error_log("owner_null".print_r($owners,1));
          }
        }
        $dec=json_decode($kyc['contractor_data'],true);
        //error_log("Contrator_data".print_r($dec,1));
        if ( strlen($dec['Docs'])==0 || $dec['Docs']=='false' ||  count($dec['Docs'])==0) {
          $Docs=array();
          $ContractDocs = $db->getRows("SELECT doc.* FROM  documents as doc where  per='contract' and per_id=".$kyc['contract_id']);
          if (is_array($ContractDocs))
          $Docs=array_merge($Docs,$ContractDocs);
          ////error_log("Docs".print_r($Docs,1));

          $ContractorDocs = $db->getRows("SELECT doc.* FROM  documents as doc where  per='user' and per_id=".$kyc['contractor_id']);
          if (is_array($ContractorDocs))
          $Docs=array_merge($Docs,$ContractorDocs);
          ////error_log("Docs".print_r($Docs,1));

          if ($kyc['act_for_other']==1){
            $CompanyDocs = $db->getRows("SELECT doc.* FROM  documents as doc where  per='company' and per_id=".$kyc['company_id']);
            if (is_array($CompanyDocs))
            $Docs=array_merge($Docs,$CompanyDocs);
            $OwnerDocs = $db->getRows("SELECT doc.* FROM  documents as doc join company_owners as co on  company_id='".$kyc['company_id']."'
            and per='user' and per_id=co.user_id  "  );
            if (is_array($OwnerDocs))
            $Docs=array_merge($Docs,$OwnerDocs);
            ////error_log("Docs".print_r($Docs,1));
          }
          if ($kyc['act_for_other']==2){
            $OwnerDocs = $db->getRows("SELECT doc.* FROM  documents as doc join company_owners as co on  contract_id='".$kyc['contract_id']."'
            and per='user' and per_id=co.user_id  "  );
            if (is_array($OwnerDocs))
            $Docs=array_merge($Docs,$OwnerDocs);
          }
          $aryData2['Docs']=json_encode($Docs,JSON_UNESCAPED_SLASHES);
          ////error_log("Docs".print_r($Docs,1));
        }
        //error_log("Docs".print_r($Docs,1));

        if (count($dec)==0) {
          $kyc['contractor_data']=json_encode($aryData2);
        }
        else {
          if (count($Docs)>0){
            $dec=json_decode($kyc['contractor_data']);
            $dec->{'Docs'}=json_encode($Docs);
            $kyc['contractor_data']=json_encode($dec,JSON_UNESCAPED_SLASHES);

          }
        }

        if ($new){
          //insert onnly if no kyc data are present
          $kyc['contract_id']=$request['appData']['contract_id'];
          $kyc['agent_id']=$request['appData']['agent_id'];
          $kyc['agency_id']=$request['appData']['agency_id'];

          $db->insertAry("kyc", $kyc);
          //$kyc=$aryData;
        } else {

          //$db->updateAry("kyc", $aryData, "where id=". $kyc['id']);

          //$kyc['owner_data']=$aryData['owner_data'];
          //$kyc['contractor_data']=$aryData['contractor_data'];
          //$kyc['company_data']=$aryData['company_data'];
        }

        $countrlist=array();
        if ($request['country']){
          $countryList = $db->getRows("SELECT * FROM countries  ORDER BY FIELD( country_name,  'San Marino','Italy' ) DESC, country_name ASC ");
        }
        $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> $kyc,'countrylist'=>$countryList);
        echo json_encode($data);

        break;
      }
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Invalid Contract");
      echo json_encode($data);
      break;
    }
    case 'saveRiskAx':{
      if ($request['appData']['contract_id']!='' ){
        //  $request['dbData']['risk_data']=stripslashes($request['dbData']['risk_data']);
        $request['dbData']['agent_id']=$request['appData']['agent_id'];
        $request['dbData']['contract_id']=$request['appData']['contract_id'];
        $request['dbData']['CPU']=$request['appData']['CPU'];
        $flgIn=$db->updateAry("risk", $request['dbData'], "where risk_id=". $request['dbData']['risk_id']);
        //error_log("flgin".$flgIn);
        if ($request['final']){
          $dec=json_decode($request['dbData']['risk_data'],true);
          //error_log("dec".print_r($dec,1));
          $request['appData']['risk_defined']=$dec['riskAssigned'];
          $request['appData']['status']=1;
          $flgIn=$db->updateAry("contract", $request['appData'], "where id=". $request['appData']['contract_id']);

        }

        $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
        echo json_encode($data,JSON_UNESCAPED_SLASHES);
        break;
      }
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Error");
      echo json_encode($data);
      break;

    }
    case 'riskAx':{
      if ($request['appData']['CPU']!='' ){
        $SQL="SELECT * FROM risk WHERE CPU='".  $request['appData']['CPU']."'";
        $risk=$db->getRow($SQL);
        if ($request['kyc']){
          $SQL="SELECT * FROM kyc WHERE contract_id=".  $request['appData']['contract_id'];
          $Kyc=$db->getRow($SQL);
        }
        if (count($risk)==0){
          //insert onnly if no kyc data are present
          $risk['CPU']=$request['appData']['CPU'];
          $db->insertAry("risk", $risk);
          //$kyc=$aryData;
        }
        $data = array('RESPONSECODE'=>1 ,'RESPONSE'=> $risk,'kyc'=>$Kyc);
        echo json_encode($data);
        break;
      }
      $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Invalid Contract");
      echo json_encode($data);
      break;
    }


    case 'Password' :
    {
      if($request['currentPassword']!='' )
      {
        $chkuser=$db->getRow("SELECT password FROM `users` WHERE user_id='".$request['id']."'");
        if(($chkuser['password'])!=$request['currentPassword'])
        {

          $data = array('RESPONSECODE'=> 0 ,'RESPONSE'=> "Current password you entered is incorrect");
        }
        else
        {
          $aryData=array('password'=>$request['newPassword']);
          $flgIn=$db->updateAry("users",$aryData,"where user_id='".$request['id']."'");
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
    case 'Forgot' :
    {
      if($request['email']!='')
      {
        $chkuser=$db->getRow("SELECT status,user_id,name,password,email,username FROM users WHERE email='".$request['email']."' AND (user_type ='2' OR user_type = '1' ) ");

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

    case 'CustomerList' :
    {
      $sql="SELECT concat(us.name,' ',us.surname) as fullname ,us.email,us.mobile,us.image,us.user_id
      FROM users us   ";
      $where="";
      if (strlen($request['last'])>0){
        $where = " and us.user_id <  " .$request['last'];

      }
      if($request['usertype'] =='2')
      {
        if($request['priviledge'] == 1 )
        {
          $sql.="  WHERE us.agent_id ='".$request['id']."'  AND us.status <> 2 and us.user_type='3' ".$where." ORDER BY us.user_id DESC limit 5 ";

        }
        else if($request['priviledge'] == 2)
        {
          $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$request['id']."'  ");
          $sql.=" WHERE us.agency_id ='".$agencyvalue."'  AND us.status <> 2 and us.user_type='3' ".$where." ORDER BY us.user_id DESC limit 5 ";

        }
      }
      else if($request['usertype'] =='1')
      {

        $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$request['id']."'  ");
        $sql.=" WHERE us.agency_id ='".$agencyvalue."'  AND us.status <> 2 and us.user_type='3' ".$where." ORDER BY us.user_id DESC limit 5 ";
      }

      if ($request['usertype'] =='-1') {
        $sql.="where us.status <> 2 and us.user_type='3' ".$where." ORDER BY us.user_id DESC limit 5 ";
      }
      //////error_log($request['action']."1-".$request['id'] .$sql.  PHP_EOL);
      if($request['usertype'] =='3')
      {
        if (strlen($request['last'])>0){
          $where = " and us.user_id <  " .$request['last'];

        }
        $sql="SELECT  distinct concat(us.name,' ',us.surname) as fullname ,us.email,us.mobile,us.image,us.user_id from users as us join contract as cn on cn.other_id=us.user_id and cn.act_for_other=2 ";
        $sql.=" WHERE cn.contractor_id ='".$request['id']."' AND us.status <> 2 ".$where." ORDER BY user_id DESC";
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
    case 'ContractList' :
    {

      if (strlen($request['last'])>0){
        $last = " and co.id <  " .$request['last'];

      }
      $sql= "SELECT co.id as contract_id, co.nature_contract,co.scope_contract,co.number,co.CPU,co.contract_date,co.kyc_status,co.contract_value,co.status,co.risk_defined,
      co.act_for_other,co.value_det,'".$request['id'] ."' as agent_id,
      us.user_id, concat(us.name,' ',us.surname) as contractor_name, concat(us.name,' ',us.surname) as fullname,us.email,us.mobile,us.image ,us.user_id,cmy.name,concat(op.name,' ',op.surname) as other_name,
      op.image as owner_image,cmy.image as company_image
      FROM contract co JOIN users us ON co.contractor_id = us.user_id
      left JOIN risk rk ON rk.cpu = co.cpu
      LEFT JOIN company cmy ON co.other_id =cmy.company_id and co.act_for_other=1
      LEFT JOIN users op ON co.other_id =op.user_id  and co.act_for_other=2";

      if($request['usertype'] =='2')
      {

        if($request['priviledge'] == 1 )
        {
          $sql.="  WHERE co.agent_id ='".$request['id']."' AND co.status <> 2 ".$where.$last." ORDER BY co.id DESC limit 5";

        }
        else if($request['priviledge'] == 2)
        {
          $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$request['id']."'  ");
          $sql.=" WHERE co.agency_id ='".$agencyvalue ."' AND co.status <> 2 ".$where.$last." ORDER BY co.id DESC limit 5 ";


        }
      }
      else if($request['usertype'] =='1')
      {
        $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$request['id']."'  ");
        $sql.=" WHERE co.agency_id ='".$agencyvalue ."' AND co.status <> 2  ".$where.$last." ORDER BY co.id DESC limit 5";


      }
      if ($request['usertype'] =='-1'){
        $sql.=" WHERE  co.status <> 2  ".$where. $last." ORDER BY co.id DESC limit 5";
      }

      if ($request['usertype'] =='3'){
        $sql= "SELECT  co.id as contract_id, co.nature_contract,co.scope_contract,co.number,co.CPU,co.contract_date,co.kyc_status,co.contract_value,co.status,co.risk_defined,
        co.act_for_other,co.value_det,'".$request['id'] ."' as agent_id,
        us.user_id, concat(us.name,' ',us.surname) as contractor_name, concat(agyd.name,' ',agyd.surname) as fullname,us.email,us.mobile,agyd.image ,us.user_id,cmy.name,concat(op.name,' ',op.surname) as other_name,
        op.image as owner_image,cmy.image as company_image
        FROM contract co JOIN users us ON co.contractor_id = us.user_id
        join agency agy on co.agency_id=agy.agency_id
        join users as agyd on agy.user_id=agyd.user_id
        left JOIN risk rk ON rk.cpu = co.cpu
        LEFT JOIN company cmy ON co.other_id =cmy.company_id and co.act_for_other=1
        LEFT JOIN users op ON co.other_id =op.user_id  and co.act_for_other=2";

        $sql.=" WHERE co.contractor_id ='".$request['id'] ."' AND co.status <> 2  ".$where.$last." ORDER BY co.contract_date DESC limit 5";
      }
      //error_log("usertype ". $request['usertype'] ."last".$last.PHP_EOL);

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
    case 'ListObjs' :
    {
      error_log("lista oggetti");
      $settings=$request['settings'];
      if (!(strlen($settings['table'])>0 && strlen($settings['id'])>0 )){
        $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "parametri oggetto errati");
        echo json_encode($data);
        break;

      }

      $SQL=getSQL($settings,$db);
      $getOb = $db->getRows($SQL);

      if(count($getOb) > 0 && is_array($getOb) )
      {
        $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getOb);
      }
      else
      {
        $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $sql);
      }
      echo json_encode($data);
      break;

    }
    case 'getObj' :
    {
      error_log("lista oggetti");
      $settings=$request['settings'];
      if (!(strlen($settings['table'])>0 && strlen($settings['id'])>0 )){
        $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "parametri oggetto errati");
        echo json_encode($data);
        break;

      }

      $SQL=getSQL($settings,$db);
      $getOb = $db->getRow($SQL);

      if( is_array($getOb) )
      {
        $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getOb);
      }
      else
      {
        $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $sql);
      }
      echo json_encode($data);
      break;

    }
    case 'saveOb':{
      error_log("salva  oggetti");
      $settings=$request['settings'];
      $aryData=$request['dbData'];
      if (!(strlen($settings['table'])>0 && strlen($settings['id'])>0 )){
        $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "parametri oggetto errati");
        echo json_encode($data);
        break;
      }
      if ($settings['action']=='add'){

        foreach ($settings['other_table'] as $key => $value) {
          $flgIn=$db->insertAry($value['table'],$aryData);
          if (! $flgIn){
            $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Spicenti, qualcosa è andato storto.");
            echo json_encode($data);
            return $data;
          }
          $aryData[$value['id']]=$flgIn;
        }
        $flgIn=$db->insertAry($settings['table'],$aryData);
        if ($flgIn)
        $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> "Riga inserita",'lastid'=>$flgIn);
          else
        $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> "Spiacente qualcosa è andato storto.");
        echo json_encode($data);
        return $data;
      }
      error_log("salva  oggetti prima di update");
      foreach ($settings['other_table'] as $key => $value) {
        $db->updateAry($value['table'],$aryData, "where ".$value['id']."=". $request['dbData'][$value['id']]);
      }
      $db->updateAry( $settings['table'],$aryData, "where ".$settings['id']."=". $request['dbData'][$settings['id']]);
      $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> "Information updated successfully");
      echo json_encode($data);

      break;

    }
    case 'ACCustomerList' :
    { $getcustomerlist=array();
      if (strlen($request['name'])>0){
        $sql="SELECT us.user_id, concat(us.name,' ',us.surname) fullname, us.email from  users as us  WHERE (us.email  like '%".$request['name']. "%' or concat(us.name,' ',us.surname)  like '%".$request['name']."%' ) and user_type='3'  ORDER BY concat(us.name,us.surname) ASC limit 5 ";
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

      if (strlen($request['last'])>0){
        $where = " and co.company_id <  " .$request['last'];

      }
      if (strlen($request['name'])>0){
        $sql="SELECT co.company_id  ,co.name, co.fiscal_id from  company as co
        WHERE (co.name  like '%".$request['name']. "%' or co.fiscal_id  like '%".$request['name']."%' ) ".$where."  ORDER BY co.company_id ASC limit 5 ";
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
      //////error_log($request['usertype']);
      if($request['usertype'] =='1')
      {
        $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$request['id']."'  ");

      }else{
        $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$request['id']."'  ");

      }
      $order="";
      if ($request['order']==1)
      $order= " tag_key asc, ";
      if ($request['order']==-1)
      $order= " tag_key desc, ";
      if (strlen($request['search'])>0 || $request['word']=="countries" || $request['zero'] || $request['countries']){

        if ($request['word']!="countries" || !  $request['zero'] || ! $request['countries'] ){
          $sql="SELECT distinct " . $request['word']."  as word from  ". $request['table'] ."
          WHERE " . $request['word']."   like '%".addslashes($request['search']). "%'  AND agency_id=".$agencyvalue." ORDER BY ". $request['word']. "  ASC limit 5 ";
          //error_log("sql1:". $sql.PHP_EOL);
          $getword = $db->getRows($sql);
        }
        if ($request['word']=="countries"  || $request['zero'] || $request['countries']){
          if ($request['countries'])
          $word="countries";
          else
          $word=$request['word'];


          if (strlen($request['search'])>0 )
          $sql="SELECT distinct  word from  word_tag    WHERE word  like '%".addslashes($request['search']). "%'  AND  '". $word. "'=id_tag order by ".$order. "  field(word, 'Italia','San Marino') DESC, word ASC ";
          else
          $sql="SELECT distinct  word from  word_tag    WHERE  '". $word. "'=id_tag order by ".$order. "  field(word, 'Italia','San Marino') DESC, word ASC ";

        }
        else{
          $sql="SELECT distinct  word from  word_tag    WHERE word  like '%".addslashes($request['search']). "%'  AND  '". $request['word']. "'=id_tag order by ".$order. " word ASC limit 5 ";
        }

        //error_log("concat1:". print_r($getword,1).PHP_EOL);
        $getword1 = $db->getRows($sql);
        //error_log("concat2:". print_r($getword1,1).PHP_EOL);
        if (is_array($getword) && is_array($getword1))
        $getword=array_merge($getword,$getword1);
        elseif (is_array($getword1))
        $getword=$getword1;

        //error_log("concat3:". print_r($getword,1).PHP_EOL);
      }
      if(count($getword) > 0 && is_array($getword) )
      {
        $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getword);
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
      //////error_log($request['action']."prima insert -".$request['id'] .print_r($request,1). print_r($request['dbData'],1).  PHP_EOL);
      $error='';
      if($request['dbData']['email']!='')
      {
        $sql="select email  from users where email='".trim($request['dbData']['email'])."'";
        $aryCheckEmail=$db->getVal($sql);
        //////error_log($request['action']."dopo controllo email  -".$request['id'] .$sql.  PHP_EOL);
      }

      if($aryCheckEmail!='')
      {
        $error=" Email Id  already exists";
      }

      $random_passw = rand(1000,1500000);
      if($error=='')
      {

        $aryData=$request['dbData'];
        $aryData['agency_id']=$request['agency_id'];
        $aryData['agent_id']=$request['id'];
        $aryData['user_type']=3;
        if ($request['agent']){
          $aryData['user_type']=2;
        }
        $aryData['status']=1;
        $aryData['password']=$random_passw;

        $flgIn=$db->insertAry("users",$aryData);
        if(!is_null($flgIn))
        {
          $lastid=$db->getVal("SELECT LAST_INSERT_ID()");
          if ($request['agent']){
            $aryData2=array();
            $aryData2['user_id']=$lastid;
            $aryData2['agency_id']=$request['agency_id'];
            $aryData2['agent_previledge']=$request['dbData']['agent_previledge'];
            $flgIn=$db->insertAry("agent",$aryData2);
          }


          //////error_log($request['action']."dopo insert -".print_r($request['dbData'],1). print_r($agency,1). print_r($aryData,1) .$sql.  PHP_EOL);
          $vars = array(
            'email' => $request['dbData']['email'],
            'password' => $random_passw,
            'agency_name' => $agency['agency_name']
          );

          //////error_log($request['action']."prima -".print_r($vars,1) .$sql.  PHP_EOL);
          mail_template($request['dbData']['email'],'add_customer',$vars, $request['lang']);
          //////error_log($request['action']."dopo-".$request['id'] .$sql.  PHP_EOL);
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
    case 'mail_template':
    {
      $vars = $request['vars'];
      $vars['id']=$data['lastid'];
      if (! isset($request['lang']) || strlen($request['lang'])!=2)
        $request['lang']='it';
      mail_template($request['email'],$request['template'],$vars, $request['lang']);
      break;
    }
    case 'addcontract' :
    {

      //////error_log("addContract1 ". print_r($request,1).PHP_EOL .$request['appData']['usertype'] .PHP_EOL);
      if ($request['appData']['usertype'] >=3 &&  $request['appData']['usertype'] <1){
        $error="Non hai i privilegi per salvare un contratto";
        $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=>$error);
        echo json_encode($data);
        break;
      }
      $error='';
      //  $request['dbData']['CPU']=$request['appData']['CPU'];
      $aryData=$request['dbData'];

      $sql="SELECT agency_id FROM agent WHERE user_id = '".$request['appData']['id']."'";
      if ($request['appData']['usertype'] ==1)
      $agency_id =$db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$request['appData']['id']."'");
      else
      $agency_id =$db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$request['appData']['id']."'");
      $aryData['agency_id']=$agency_id;
      //////error_log("EDIT::". $request['edit'] .PHP_EOL);
      file_put_contents('/var/www/html/tmp/php-error.log',"...". $request['edit'] );
      if ($request['edit']=="edit"){
        $flgIn=$db->updateAry("contract",$aryData, "where id='".$request['dbData']['contract_id']."'");
        $ok="Contratto Aggiornato Correttamente";
        if(!is_null($flgIn))  {
          // inserisco riga valutazione rischio.
          //$db->insertAry("risk", $arydata2);
          $kyc=$db->getRow("select contract_data from kyc where contract_id='" . $request['dbData']['contract_id'] ."'");

          //error_log("contractor data".$kyc['contract_data'].PHP_EOL);
          $con=json_decode($kyc['contract_data'],true);
          //error_log("contractor data".print_r($con,1).PHP_EOL);
          $con=array_merge($con,$aryData);
          foreach ($aryData as $key => $value) {
            $con[$key]=$value;
          }
          //error_log("nuovo contractor data".print_r($con,1).PHP_EOL);
          $con=array('contract_data'=>json_encode($con,JSON_UNESCAPED_SLASHES));
          //error_log("nuovo contractor data".print_r($con,1).PHP_EOL);

          $flgIn=$db->updateAry("kyc",$con, "where contract_id='".$request['dbData']['contract_id']."'");


          if ($aryData['act_for_other']==2){
            $owners=$db->getRows("select * from company_owners where contract_id='" . $request['dbData']['contract_id']."' and user_id=".$request['dbData']['other_id'] );
            if (count($owners)>0){
              $xx=1;
            } else {
              $aryData3['agency_id']=  $aryData['agency_id'];
              $aryData3['agent_id']=  $aryData['agent_id'];
              $aryData3['user_id']=  $aryData['other_id'];
              $aryData3['contract_id']=$request['dbData']['contract_id'];
              $aryData3['percentuale']=$aryData['role_for_other'];
              $db->insertAry("company_owners",$aryData3);

            }

          }
          //error_log("aggKyc".$request['aggKyc'].PHP_EOL );
          if ($request['aggKyc']==1){
            $kyc=array();
            $contractor = $db->getRow("SELECT * FROM users where user_id=".$aryData['contractor_id']);
            $contr=json_decode($kyc['contractor_data'],true);
            $kyc['contractor_data']=json_encode($contractor,JSON_UNESCAPED_SLASHES);
            if ($aryData['act_for_other']==1){
              $company = $db->getRow("SELECT * FROM company where company_id=".$aryData['other_id']);
              ////error_log("xx".print_r($company,1));
              $kyc['company_data']=json_encode($company,JSON_UNESCAPED_SLASHES);
              //inserisco i dati della società
              $owners = $db->getRows("SELECT percentuale ,us.* FROM  company_owners as co join users as us on us.user_id=co.user_id where company_id=".$aryData['other_id']);
              $kyc['owner_data']=json_encode($owners,JSON_UNESCAPED_SLASHES);
              ////error_log("owner_null".print_r($owners,1));
            }
            if ($aryData['act_for_other']==2){
              //inserisco i dati della società
              $owners = $db->getRows("SELECT percentuale, us.* FROM  company_owners as co join users as us on us.user_id=co.user_id where  contract_id=".$aryData['contract_id']);
              $kyc['owner_data']=json_encode($owners,JSON_UNESCAPED_SLASHES);
              ////error_log("owner_null".print_r($owners,1));
            }
            //error_log("Kyc da agg".print_r($kyc,1));
            //$flgIn=$db->updateAry("kyc",$kyc, "where contract_id='".$request['dbData']['contract_id']."'");
          }

          $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> $ok);
          echo json_encode($data);
          break;
        }


      }
      else {
        //GEstione CPU per insert
        $sql="SELECT  CPU  FROM  `contract`  where  agency_id = ". $agency_id ." order by id desc limit 1";
        $CPU =$db->getVal($sql);
        if (is_null($CPU)){
          $CPU="0/".date("Y");
        };
        list($num, $anno) = split("/", $CPU,2);
        $num=intval($num);
        $num++;
        $CPU=$num ."/" .$anno;
        $aryData['CPU']=$CPU;

        $flgIn=$db->insertAry("contract",$aryData);
        $contract=$flgIn;
        $ok="Contratto Inserito Correttamente";
        if(!is_null($flgIn))  {
          // inserisco riga valutazione rischio.
          $lastid=$db->getVal("SELECT LAST_INSERT_ID()");
          $aryData['contractor_id']=$lastid;
          $flgIn=$db->insertAry("customer",$aryData);

          $arydata2 = array(
            'CPU'          => $aryData['CPU'],
            'agent_id'     => $aryData['agent_id'],
            'agency_id'    => $agency_id,


          );
          if ($aryData['act_for_other']==2){
            $aryData3['agency_id']=  $aryData['agency_id'];
            $aryData3['agent_id']=  $aryData['agent_id'];
            $aryData3['user_id']=  $aryData['other_id'];
            $aryData3['contract_id']=$lastid;
            $aryData3['percentuale']=$aryData['role_for_other'];
            $db->insertAry("company_owners",$aryData3);

          }
          foreach ($request['Docs'] as $doc){
            $ary=array("per_id"=>$lastid);
            $db->updateAry($ary,"documents","where id=".$docs['id']);
          }
          $db->insertAry("risk", $arydata2);
          $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> $ok, "lastid"=>$lastid);
          echo json_encode($data);
          break;
          //mail_template($request['customer_email'],'add_customer',$vars);

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
      if($request['agent_email']!='')
      {
        $aryCheckEmail=$db->getVal("select email  from users where email='".trim($request['agent_email'])."'");
      }

      if($aryCheckEmail!='')
      {
        $error=" Email Id  already exists";
      }

      $random_passw = rand(1000,1500000);
      if($error=='')
      {

        $aryData=array(	            'name'			=>	trim($request['agent_name']),
        'email'			=>	trim($request['agent_email']),
        'password'		         =>	$random_passw,
        'mobile'		=>	trim($request['agent_mobile']),
        'user_type'                 =>   2,
        'status'		=>  1
      );
      $flgIn=$db->insertAry("users",$aryData);
      if(!is_null($flgIn))
      {

        $agent_last_id = $flgIn;
        $arydata1 = array(
          'user_id'                       => $flgIn,
          'agency_id'                     => $request['id'],


        );
        $flgIn=$db->insertAry("agent",$arydata1);



        $vars = array(

          'user_email' => $request['agent_email'],
          'user_password' => $random_passw
        );
        mail_template($request['agent_email'],'add_agent',$vars);


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
    $where="";
    if (strlen($request['last'])>0){
      $where = " and us.user_id <  " .$request['last'];

    }

    $sql="SELECT us.* , concat(us.name, ' ' , us.surname) fullname, cs.agent_previledge as priviledge
    FROM users us JOIN agent cs ON cs.user_id = us.user_id
    WHERE cs.agency_id ='".$request['agency_id']."' AND us.status = '1' ".$where." ORDER BY us.user_id DESC ";
    if ($request['usertype'] =='-1'){
      $sql="SELECT us.* , concat(us.name, ' ' , us.surname) fullname, cs.agent_previledge as priviledge
      FROM users us JOIN agent cs ON cs.user_id = us.user_id
      WHERE  us.status = '1' ".$where." ORDER BY us.user_id DESC ";
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
  case 'view_Agent_Profile_info' :
  {
    if($request['agent_id']!='' && $request['agent_id']!='')
    {
      $userDetails=$db->getRow("SELECT users.*, concat(users.name,' ', users.surname) as fullname,ag.agent_previledge FROM  users JOIN agent ag ON ag.user_id = users.user_id WHERE users.user_id='".trim($request['agent_id'])."' ");

      if($userDetails['user_id']!='')
      {

        $userInfo= array('surname'=>$userDetails['name'],'fullname'=>$userDetails['fullname'],'name'=> $userDetails['name'],'email'=>$userDetails['email'],'mobile'=>$userDetails['mobile'],'imagename'  =>$userDetails['image'],'agent_previledge'  => $userDetails['agent_previledge'] );
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
    if($request['customer_id']!='' )
    {      // print_r($request['customer_id']);
      $sql="SELECT us.* ,concat(us.name, ' ',us.surname) as fullname, a.agent_previledge,us.settings FROM  users us left join agent as a on us.user_id=a.user_id and a.agency_id=".$request['agency_id'] ."
      WHERE us.user_id='".trim($request['customer_id'])."' ";
      //////error_log($request['action']."1-".$request['customer_id'] .$sql.  PHP_EOL);
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
    //////error_log($request['action']."1-".$request['contract_id'] . PHP_EOL .$request['appData']['usertype'] .PHP_EOL);

    if($request['contract_id']!='' )
    {      // print_r($request['customer_id']);
      $sql= "SELECT co.agent_id,co.agency_id,co.id as contract_id, co.nature_contract,co.scope_contract,co.number,co.CPU,co.contract_date,co.kyc_status,co.contract_value,co.contractor_id,co.role_for_other,
      co.contract_eov,co.act_for_other,co.Docs,co.other_id,co.risk_defined,co.status,co.value_det,'".$request['id'] ."' as agent_id,
      concat(us.name,' ',us.surname) as fullname,us.surname,us.name as name1, us.email,us.mobile,us.image,cmy.company_id,cmy.name,concat(op.name,' ',op.surname) as other_name

      FROM contract co JOIN users us ON co.contractor_id = us.user_id
      left JOIN risk rk ON rk.cpu = co.cpu
      LEFT JOIN company cmy ON co.other_id =cmy.company_id and co.act_for_other=1
      LEFT JOIN users op ON co.other_id =op.user_id  and co.act_for_other=2
      WHERE co.id ='".$request['contract_id']."'  ";
      //////error_log($request['action']."xx". $sql .PHP_EOL .$request['appData']['usertype'] .PHP_EOL);

      $ContractDetails=$db->getRow($sql);
      //////error_log($request['action']."x2-". print_r($ContractDetails,1) ."-".$ContractDetails['id'] .PHP_EOL .$request['appData']['usertype'] .PHP_EOL);

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
    $flgIn=$db->updateAry("users",$aryData,"where user_id='".$request['agent_id']."'");
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


  case 'upload_document_image' :
  {
    $newfile=md5(microtime()).".jpg";
    $user_id = $request['userid'];
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
    $imagename=$db->getVal("select imagename from tmp_image where id='".$request['id']."' ");
    $data = array(
      'RESPONSECODE'	=>  1,
      'RESPONSE'	=> $imagename,
    );
    echo json_encode($data);
    break;
  }
  case 'OwnersList' :
  {
    if (strlen($request['last'])>0){
      $last = " and co.id <  " .$request['last'];

    }
    if ($request['appData']['act_for_other']==2)
    $other= " co.contract_id ='".$request['appData']['contract_id'];
    else
    $other= " co.company_id ='".$request['company_id'];

    //   $getcustomerlist = $db->getRows("SELECT us.name,us.email,us.mobile,us.image,us.user_id FROM users us JOIN customer cs ON cs.user_id = us.user_id JOIN risk rk rk.user_id =us.user_id  WHERE cs.agency_id ='".$request['id']."' AND us.status = '1' AND us.normal_or_company_owner ='1' ORDER BY us.user_id DESC ");
    // $getcustomerlist = $db->getRows("SELECT us.name,us.email,us.mobile,us.image,us.user_id,rk.status,cs.kyc_status FROM users us JOIN customer cs ON cs.user_id = us.user_id  JOIN risk rk ON rk.user_id = us.user_id JOIN  WHERE cs.agency_id ='".$request['id']."' AND us.normal_or_company_owner ='1' ORDER BY us.user_id DESC ");
    $sql="SELECT co.id,concat(us.name,' ',us.surname) as fullname, us.email,us.mobile,us.image,us.user_id,
    co.company_id,co.agency_id, co.percentuale
    FROM company_owners co
    JOIN users us  ON  co.user_id = us.user_id
    WHERE " .$other ."' ".$last ."  AND us.status <> 2 ORDER BY co.id DESC  limit 5 ";
    //////error_log($request['action']."1-".$request['id'] .$sql.  PHP_EOL);
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
    if($request['customer_id']!='' )
    {
      $userDetails=$db->getRow("SELECT us.*,cy.name,cs.customer_dob  FROM  users us JOIN company_owners co ON co.user_id = us.user_id JOIN company cy ON co.company_id = cy.company_id JOIN customer cs ON cs.user_id = us.user_id  WHERE us.user_id='".trim($request['customer_id'])."' ");
      //echo $db->getLastQuery(); exit;
      //  $userDetails=$db->getRow("SELECT us.*,cs.customer_dob FROM  users us JOIN customer cs ON cs.user_id = us.user_id WHERE us.user_id='".trim($request['customer_id'])."' ");

      if($userDetails['user_id']!='')
      {

        $userInfo= array('name'=> $userDetails['name'],'email'=>$userDetails['email'],'mobile'=>$userDetails['mobile'],'imagename'  =>$userDetails['image'],'company_name' =>  $userDetails['company_name'],'dob' => $userDetails['customer_dob']  );
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
  case 'CompanyList' :
  {
    if (strlen($request['last'])>0){
      $where = " and company_id <  " .$request['last'];

    }
    $sql="SELECT  * FROM company ";
    if($request['usertype'] =='2')
    {
      if($request['priviledge'] == 1 )
      {
        $sql.="  WHERE  agent_id ='".$request['id']."' AND status <> 2 ".$where." ORDER BY company_id DESC ";

      }
      else if($request['priviledge'] == 2)
      {
        $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$request['id']."'  ");
        $sql.=" WHERE agency_id ='".$agencyvalue."' AND status <> 2 ".$where." ORDER BY company_id DESC";

      }
    }
    else if($request['usertype'] =='1')
    {

      $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$request['id']."'  ");
      $sql.=" WHERE agency_id ='".$agencyvalue."' AND status <> 2 ".$where." ORDER BY company_id DESC";
    }
    if($request['usertype'] =='-1')
    {
      $sql.=" WHERE  status <> 2 ".$where." ORDER BY company_id DESC";
    }

    if($request['usertype'] =='3')
    {
      $sql="SELECT  * FROM company as co join contract as cn on cn.other_id=co.company_id and cn.act_for_other=1 ";
      $sql.=" WHERE cn.contractor_id ='".$request['id']."' AND co.status <> 2 ".$where." ORDER BY company_id DESC";
    }
    //////error_log($request['action']."1-".$request['id'] .$sql.  PHP_EOL);

    // $getcompanylist = $db->getRows("SELECT  * FROM company WHERE agency_id ='".$request['id']."' And status <> 2 ORDER BY  company_id DESC ");
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
    if($request['company_name']!='')
    {
      $aryCheckCompName=$db->getVal("select name  from company where fiscal_id='".trim($request['dbData']['fiscal_id'])."'");
    }
    if($aryCheckCompName !='')
    {
      $error=" Partita Iva già esistente";
    }
    $currdate = strtotime(date("y-m-d"));
    if($request['usertype'] =='1')
    {

      $agency = $db->getRow("SELECT  a.agency_id, u.name as agency_name FROM agency  a join users u  on  a.user_id=u.user_id WHERE u.user_id = '".$request['id']."'  ");

    }
    else {
      $agency = $db->getRow("SELECT  a.agency_id, u.name as agency_name FROM agent a join users u  on  a.agency_id=u.user_id  WHERE u.user_id = '".$request['id']."'  ");


    }
    /*$company_authorisation_date  = strtotime($request['company_authorisation_date']);

    if($company_authorisation_date >= $currdate )
    {
    $error=" Invalid  Authorization  date";
  }
  */
  //////error_log($request['action']."1-".$request['id'] .$sql.  PHP_EOL);

  if($error=='')
  {
    $aryData=$request['dbData'];
    $aryData['status']=1;
    $aryData['agency_id']=$agency['agency_id'];
    $aryData['agent_id']=$request['id'];

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
    $user_id = $request['custid'];
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
    $imagename=$db->getVal("select imagename from tmp_image where id='".$request['id']."' ");
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
    $user_id = $request['custid'];
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
    $imagename=$db->getVal("select imagename from tmp_image where id='".$request['id']."' ");
    $data = array(
      'RESPONSECODE'	=>  1,
      'RESPONSE'	=> $imagename,
    );
    echo json_encode($data);
    break;
  }
  case 'edit_company' :
  {
    if($request['company_name']!='')
    {
      $aryCheckCompName=$db->getVal("select name  from company where fiscal_id='".trim($request['dbData']['fiscal_id'])."' and company_id !='".$request['dbData']['company_id']."' ");
    }
    if($aryCheckCompName !='')
    {
      $error=" Partita Iva già Esistente";
    }
    /*$currdate = strtotime(date("y-m-d"));
    $company_authorisation_date  = strtotime($request['company_authorisation_date']);

    if($company_authorisation_date >= $currdate )
    {
    $error=" Invalid Authorization  date";
  }
  */
  if($error=='')
  {
    $aryData=$request['dbData'];
    $flgIn=$db->updateAry("company",$aryData,"where company_id='".$request['dbData']['company_id']."'");
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
    $userDetails=$db->getRow("SELECT * FROM   company   WHERE company_id='".trim($request['company_id'])."'");

    $data = array('RESPONSECODE'=> 1 ,'RESPONSE'=> $userDetails,  );
    echo json_encode($data);
    break;
  }
  case 'add_owners' :
  {
    //error_log("appdata".print_r($request['appData'],1).PHP_EOL);

    if($request['appData']['act_for_other'] >'0'){
      $aryData=$request['dbData'];
      $aryData['agency_id']=$request['appData']['agency_id'];
      $aryData['agent_id']=$request['appData']['agent_id'];
      if ($request['appData']['act_for_other']=='1')
      $aryData['company_id']=$request['appData']['company_id'];
      else
      $aryData['contract_id']=$request['appData']['contract_id'];

      $flgIn=$db->insertAry("company_owners",$aryData);
      $lastid=$flgIn;
      //error_log("ultimo inserito".$lastid.PHP_EOL);
      if(!is_null($flgIn))
      {
        if ($request['appData']['act_for_other']=='1')
        $sql="SELECT percentuale, us.* FROM   company_owners as co join users as us on company_id='".$aryData['company_id']."'  and co.user_id=us.user_id  where us.user_id='". $aryData['user_id']."'";
        else
        $sql="SELECT percentuale, us.* FROM   company_owners as co join users as us on contract_id = '".$aryData['contract_id']."' and co.user_id=us.user_id  where us.user_id='". $aryData['user_id']."'";

        $owner=$db->getRow($sql);
        $data = array('ID'=>$flgIn,'RESPONSECODE'=>1 ,'RESPONSE'=> "Titolare Effettivo inserito correttamente","owner"=>$owner, "lastid"=>$lastid);
        //error_log("owners".print_r($owner,1).PHP_EOL);
        echo json_encode($data);
        break;
      }
      $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> $error);
      echo json_encode($data);
      break;



    }
    if($request['appData']['usertype'] =='1')
    {
      $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$request['appData']['id']."'  ");

    }else{
      $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$request['appData']['id']."'  ");

    }
    $error='';
    //////error_log('add owners: ' . print_r($request,1) .print_r($request['dbData'],1) . PHP_EOL);
    if($request['dbData']['user_id']!='')
    {
      $sql="select user_id  from company_owners where user_id='".trim($request['dbData']['user_id'])."'";
      //////error_log('add owenrs: ' . $sql . PHP_EOL);
      $aryCheckEmail=$db->getVal();
    }

    if($aryCheckEmail!='')
    {
      $error="Cliente già presente fra i titolari";
    }

    if($error=='')
    {
      $aryData=$request['dbData'];
      $aryData['agency_id']=$agencyvalue;
      $aryData['agent_id']=$request['appData']['id'];

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
    if($request['appData']['usertype'] =='1')
    {
      $agencyvalue = $db->getVal("SELECT agency_id FROM agency WHERE user_id = '".$request['appData']['id']."'  ");

    }else{
      $agencyvalue = $db->getVal("SELECT agency_id FROM agent WHERE user_id = '".$request['appData']['id']."'  ");

    }
    $error='';
    //////error_log('add owners: ' . print_r($request,1) .print_r($request['dbData'],1) . PHP_EOL);
    if($request['dbData']['user_id']!='')
    {
      $sql="select user_id  from company_owners where user_id='".trim($request['dbData']['user_id'])."'";
      //////error_log('add owenrs: ' . $sql . PHP_EOL);
      $aryCheckEmail=$db->getVal();
    }

    if($aryCheckEmail!='')
    {
      $error="Cliente già presente fra i titolari";
    }

    if($error=='')
    {
      $aryData=$request['dbData'];
      $aryData['agency_id']=$agencyvalue;
      $aryData['agent_id']=$request['appData']['id'];

      $flgIn=$db->updateAry("company_owners",$aryData, "where id=" . $request['dbData']['id']  );
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


  case 'saveProfileCustomer':
  {
    $error='';

    if($error=='')
    {

      $aryData=$request['dbData'];

      $flgIn=$db->updateAry("users",$aryData,"where user_id='".$request['dbData']['user_id']."'");
      if ($request['agent']){
        $aryData2['agent_previledge']=$request['dbData']['agent_previledge'];
        $flgIn=$db->updateAry("agent",$aryData2,"where user_id='".$request['dbData']['user_id']."'" );
      }

      //                $flgIIn2=$db->updateAry("customer",$aryData2,"where contractor_id='".$request['dbData']['id']."'");
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

      $aryData=array(	'name'			=>	trim($request['name']),
      'mobile'     =>	trim($request['mobile']),


    );
    $flgIn=$db->updateAry("users",$aryData,"where user_id='".$request['id']."'");

    $aryData2 = array( 'agent_previledge'      =>      trim($request['agent_previledge']) );
    $flgIn1=$db->updateAry("agent",$aryData2,"where user_id='".$request['id']."'");
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
      $imagename=$db->getVal("select image from users where user_id='".$request['userid']."' ");
      @unlink("uploads/user/$imagename");


    }



    $aryData = array("image" =>	$newfile);

    $db->updateAry("users",$aryData,"where user_id='".$request['userid']."'");

    $flgIn = $request['userid'];



    $data = array('review_id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
    echo json_encode($data);
    break;

  }
  case 'get_edit_customer_image_name' :
  {
    $imagename=$db->getVal("select image from users where user_id='".$request['userid']."' ");
    $data = array(
      'RESPONSECODE'	=>  1,
      'RESPONSE'	=> $imagename,
    );
    echo json_encode($data);
    break;
  }
  case 'documentList' :
  {
    $getimaglist=array();
    if (strlen($request['last'])>0){
      $where = " and id <  " .$request['last'];

    }


    $getimaglist = $db->getRows("SELECT  * FROM documents WHERE per_id ='".$request['dbData']['per_id']."' AND per ='".$request['dbData']['per']."' " .$requestE['where'].$where." ORDER BY  id DESC limit 5 ");

    if(count($getimaglist) > 0 && is_array($getimaglist) )
    {
      $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getimaglist);
    }
    else if (count($getimaglist) == 0 ){
      $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $getimaglist);

    } else
    {
      $data = array('RESPONSECODE'=> 0 , 'RESPONSE'=> '');

    }
    echo json_encode($data);
    break;
  }
  case 'deletecustimage' :
  {
    $imagename=$db->getVal("select doc_image from customer_documents where id='".$request['id']."' ");
    @unlink("uploads/document/user_" . $request['cust_id'] . '/' . $imagename);
    @unlink("uploads/document/user_" . $request['cust_id'] . "/resize/" . $imagename);
    $res = $db->delete('customer_documents', "where id='" . $request['id'] . "'");
    $data = array('RESPONSECODE'=> 1 , 'RESPONSE'=> $res );
    echo json_encode($data);
    break;
  }
  case 'upload_document_image_multi' :
  {
    //////error_log("passato di qui ". print_r($request,1) .PHP_EOL);
    $for=$request['for'] ;
    $newfile=md5(microtime()).".jpg";
    $user_id = $request['userid'];
    //error_log("file caricato" .$_FILES['file']['tmp_name'] . "<br>tipo:".mime_content_type($_FILES['file']['tmp_name'])  .PHP_EOL);

    //////error_log("controllo" .PATH_UPLOAD . "document" . DS . $for ."_".  $user_id .PHP_EOL);
    if (!file_exists(PATH_UPLOAD . "document" . DS . $for ."_".  $user_id)) {
      //////error_log("MKDIR:". PATH_UPLOAD . "document" . DS . $for ."_". $user_id .PHP_EOL);

      mkdir(PATH_UPLOAD . "document" . DS . $for ."_". $user_id, 0777, true);
      mkdir(PATH_UPLOAD . "document" . DS . $for ."_". $user_id . DS . 'resize', 0777, true);
    }
    //////error_log("MOVE:". $_FILES['file']['tmp_name']. "uploads/document/".$for ."_". $user_id . DS . $newfile .PHP_EOL);

    if (move_uploaded_file($_FILES['file']['tmp_name'], "uploads/document/".$for ."_". $user_id . DS . $newfile)) {
      //////error_log("COPY:". "uploads/document/".$for ."_" . $user_id . DS . $newfile ."---" . "uploads/document/".$for ."_". $user_id . DS . "resize/" . $newfile.PHP_EOL);


      copy("uploads/document/".$for ."_" . $user_id . DS . $newfile, "uploads/document/".$for ."_". $user_id . DS . "resize/" . $newfile);
      smart_resize_image("uploads/document/".$for ."_". $user_id . DS . "resize/$newfile", 210, 194);
    }

    $aryData = array("imagename" =>	$newfile,"for"  =>$request['for'],"per_id"=>$user_id);

    $flgIn = $db->insertAry("tmp_image",$aryData);

    $data = array('id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
    echo json_encode($data);
    break;

  }
  case 'upload_document_ax' :
  {
    if ($request['type']=="profile"){
      $entity=$request['entity'];
      $entity_key=$request['entity_key'];
      if (strlen($request['entity'])==0) {
        $entity='users';
        $entity_key='user_id';
      }
      $file_content = $request['f']['data'];
      $file_content = substr($file_content, strlen('data:' . mime_content_type_ax($request['f']['name']).';base64,'));
      $file_content = base64_decode($file_content);

      $ext=".".pathinfo($request['f']['name'], PATHINFO_EXTENSION);
      $newfile=md5(microtime()).$ext;
      if(file_put_contents ( "uploads/$entity/$newfile",  $file_content ))
      {
        $esit=copy("uploads/$entity/$newfile", "uploads/$entity/small/$newfile");
        error_log("DOPOCOPIA" .$esit);
        if(!$esit) {
          error_log("errore copia file" .$esit);
        }

        smart_resize_image("uploads/$entity/small/$newfile", 210, 194);
        $imagename=$db->getVal("select image from ".$entity." where ".$entyty_key."='".$request['id']."' ");
        if (strlen($imagename)>0){
          //error_log("image:".$imagename.PHP_EOL);
          @unlink("uploads/".$entity."/$imagename");
          @unlink("uploads/".$entity."/small/$imagename");
        }
      }
      $data = array('image' => $newfile);
      //$data = array('review_id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"] );
      echo json_encode($data);
      break;
      return;
    }


    //error_log("ini". PHP_EOL );
    $file_content = $request['f']['data'];
    //error_log('file_content0'.$file_content.PHP_EOL);
    $file_content = substr($file_content, strlen('data:' . mime_content_type_ax($request['f']['name']).';base64,'));
    //error_log("ini2".$request['f']['name']. "-type-".mime_content_type_ax($request['f']['name']) .strlen('data:' . mime_content_type_ax($request['f']['name']).';base64,'). PHP_EOL );
    //error_log('file_content'.$file_content.PHP_EOL);
    $file_content = base64_decode($file_content);
    //error_log('file_content2'.$file_content.PHP_EOL);
    $ext=".".pathinfo($request['f']['name'], PATHINFO_EXTENSION);
    //////error_log("passato di qui ". print_r($request,1) .PHP_EOL);
    $for=$request['for'] ;
    $newfile=md5(microtime()).$ext;
    $user_id = $request['userid'];
    $image_ext=array('.jpg',".png",".gif",".tif",".bmp");
    //  //error_log("file caricato" .$_FILES['file']['tmp_name'] . "<br>tipo:".mime_content_type($_FILES['file']['tmp_name']). "<br>valore:". $file_content .PHP_EOL);
    //////error_log("controllo" .PATH_UPLOAD . "document" . DS . $for ."_".  $user_id .PHP_EOL);
    if (!file_exists(PATH_UPLOAD . "document" . DS . $for ."_" . $user_id  )) {
      //////error_log("MKDIR:". PATH_UPLOAD . "document" . DS . $for ."_". $user_id .PHP_EOL);

      mkdir(PATH_UPLOAD . "document" . DS . $for ."_" . $user_id , 0777, true);
      if (in_array($ext,$image_ext))
      mkdir(PATH_UPLOAD . "document" . DS . $for."_" . $user_id   . DS . 'resize', 0777, true);
    }
    //////error_log("MOVE:". $_FILES['file']['tmp_name']. "uploads/document/".$for ."_". $user_id . DS . $newfile .PHP_EOL);

    if (file_put_contents ( "uploads/document/".$for."_" . $user_id  . DS . $newfile,  $file_content)) {
      //////error_log("COPY:". "uploads/document/".$for ."_" . $user_id . DS . $newfile ."---" . "uploads/document/".$for ."_". $user_id . DS . "resize/" . $newfile.PHP_EOL);
      if ( in_array($ext,$image_ext)){
        //error_log("crea immagine piccola"."uploads/document/".$for ."_" . $user_id . DS . $newfile . PHP_EOL);
        copy("uploads/document/".$for ."_" . $user_id . DS . $newfile, "uploads/document/".$for ."_" . $user_id . DS . "resize/" . $newfile);
        smart_resize_image("uploads/document/".$for."_" . $user_id  . DS . "resize/$newfile", 210, 194);

      }
    }
    $aryData = array("imagename" =>	$newfile,"for"  =>$request['for'],"per_id"=>$user_id, "file_type"=>$ext);
    $flgIn = $db->insertAry("tmp_image",$aryData);
    $data = array('id' => $flgIn, 'response' => $newfile,'file_name' => $_FILES["file"]["tmp_name"],"file_type" => $ext);
    echo json_encode($data);
    break;

  }
  case 'get_document_image_name_multi' :
  {
    $imagename=$db->getVal("select imagename from tmp_image where id='".$request['id']."' ");
    $data = array(
      'RESPONSECODE'	=>  1,
      'RESPONSE'	=> $imagename,
    );
    if ($request['DocId']>0){
      $aryData=array("image_name"=>$imagename);
      $db->updateAry('documents',$aryData,"where id=".$request['DocId']);

    }
    echo json_encode($data);
    break;
  }
  case 'savedocument' :
  {
    $aryData = $request['dbData'];
    if ($request['type']=='add')
    $flgIn = $db->insertAry("documents",$aryData);
    if ($request['type']=='edit'){
      $doc=$db->getRow("select * from documents where id =" .$aryData['id']);
      //error_log('dati' .print_r($doc,1).print_r($aryData,1).PHP_EOL);
      if ($doc['doc_image']!= $aryData['doc_image']){
        $flgIn=$db->delete('tmp_image',"where imagename='".$doc['doc_image']."'");
        //error_log("uploads/document/".$doc['per']."_" .$doc['per_id']."/resize/".$doc['doc_image']);
        @unlink("uploads/document/".$doc['per']."_" .$doc['per_id']."/".$doc['doc_image']);
        @unlink("uploads/document/".$doc['per']."_" .$doc['per_id']."/resize/".$doc['doc_image']);

      }

      $flgIn = $db->updateAry("documents",$aryData,"where id=".$aryData['id']);

    }

    $data = array(
      'RESPONSECODE'	=>  1,
      'RESPONSE'	=> $imagename,
      'lastid'=> $flgIn
    );
    echo json_encode($data);
    break;
  }
  case 'fetchuserimage' :
  {
    $imagename=$db->getRow("select image,name from users where user_id='".$request['id']."' ");
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
  case 'delete':
  {
    foreach ($request['other_table'] as $key => $value) {
      $flgIn=$db->delete($value['table'],"where ".$value['id']. "='".$value['value']."'");
    }
    $where = " where " . $request['primary'] ."=". $request['id'];
    error_log("other_table" .print_r($request['other_table'],1).PHP_EOL);
    //error_log("_$request di table" .$request['table'].PHP_EOL);
    if ($request['table']=='documents'){
      $doc=$db->getRow("select * from documents where id =" .$request['id']);
      $flgIn=$db->delete('tmp_image',"where imagename='".$doc['doc_image']."'");
      //error_log("uploads/document/".$doc['per']."_" .$doc['per_id']."/resize/".$doc['doc_image']);

      @unlink("uploads/document/".$doc['per']."_" .$doc['per_id']."/".$doc['doc_image']);
      @unlink("uploads/document/".$doc['per']."_" .$doc['per_id']."/resize/".$doc['doc_image']);
    }
    if ($request['agent']){
      $flgIn=$db->delete('agent',"where user_id='".$request['id'] ." and  agency_id=".$request['agency_id']);
      //////error_log("uploads/document/".$doc['per']."_" .$doc['per_id']."/resize/".$doc['doc_image']);
    }
    $flgIn=$db->delete($request['table'],$where);
    if ($flgIn>0)
    $data=array(  'RESPONSECODE'	=>  1,   'RESPONSE'	=> "cancellato");
    else
    $data=array(  'RESPONSECODE'	=>  0,   'RESPONSE'	=> "errore");
    echo json_encode($data);
    break;
  }
  case 'print_kyc':
  {
    include('pdfgeneration/kyc.php');
    break;
  }

}
return $data;
}
$data=doAction($_REQUEST,$db,$data);
error_log("data dopo:".print_r($data,1));
if ($data['RESPONSECODE']==1){
  ob_start();
  if (is_array($_REQUEST['other_actions'])){
    foreach($_REQUEST['other_actions'] as $key => $val) {
      error_log(print_r($val,1));
      $res=doAction($val,$db,$data);
    }

  }
  ob_end_clean();
}
?>
