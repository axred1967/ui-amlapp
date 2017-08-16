app2.controller('add_customer', function ($scope,$http,$state,$translate,$rootScope,$timeout) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuovo Persona"

  $scope.page={}

   $scope.curr_page='add_customer'
   page=localStorage.getItem($scope.curr_page)
   if ( page!= null && page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }
   $scope.main.location=$scope.page.location

  $scope.loadItem=function(){
    data={"action":"view_Customer_Profile_info",customer_id:$scope.id,email:$scope.email,agency_id:$scope.agencyId,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $scope.main.loader=true
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        $.each(data, function(key, value){
          if (value === null){
            delete data[key];
          }
        });
        $scope.Customer =  data;
        $scope.Customer.IMAGEURI=BASEURL+"uploads/user/small/"
        //$rootScope.$broadcast('show')
        $scope.loader=false
        $scope.Customer.Docs=IsJsonString($scope.Customer.Docs)
        if (!isObject($scope.Customer.Docs)){
            $scope.Customer.Docs=[{}]
            $scope.newDocs=true;

        }
        convertDateStringsToDates($scope.Customer)

        $('input.mdl-textfield__input').each(
          function(index){
            $(this).parent('div.mdl-textfield').addClass('is-dirty');
            $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
        );

      }
      else
      {
        if (responceData.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        console.log('error');
      }
    })
    , (function() {
      console.log("error");
    });

  }

  $scope.countryList=getCountryList()

  switch ($scope.page.action){
    case 'add_customer':
    $scope.main.viewName="Censisci Cliente"
    $scope.action="addcustomer"
    if ($scope.page.agent){
      $scope.main.viewName="Censisci Agente"
    }
    break;
    case 'update_customer':
    $scope.id=localStorage.getItem("CustomerProfileId");
    $scope.email=localStorage.getItem("userEmail");
    $scope.agencyId = localStorage.getItem('agencyId');

    $scope.main.viewName="Modifica Cliente"
    if ($scope.page.agent){
      $scope.main.viewName="Modifica Agente"
    }
    $scope.action="saveProfileCustomer"
    break;
    case 'add_customer_for_owners':
    $scope.main.viewName="Inserisci Titolare Effettivo"
    $scope.action="addcustomer"
    break;
    case 'add_customer_for_contract':
    $scope.main.viewName="Inserisci Firmatario contratto"
    $scope.action="addcustomer"
    break;

    case 'add_customer_for_kyc_owners':
    $scope.main.viewName="Inserisci Titolare Effettivo"
    $scope.action="addcustomer"
    break;

    case 'edit_customer_for_kyc_owner':
    Customer=JSON.parse(localStorage.getItem('Owner'))
    convertDateStringsToDates(Customer)
    $scope.Customer=Customer
    $scope.id=Customer.user_id
    $scope.email=Customer.email;
    $scope.agencyId = localStorage.getItem('agencyId');

    $scope.main.viewName="Modifica Titolare Effettivo"
    $scope.action="saveProfileCustomer"
    break;

    default:



  }
  if ($scope.main.editDoc) {
    $scope.Customer=JSON.parse(localStorage.getItem('Customer'))
    convertDateStringsToDates($scope.Customer)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Customer.Docs[Doc.indice]=Doc

  }
  else if ($scope.main.addDoc){
    $scope.Customer=JSON.parse(localStorage.getItem('Customer'))
    convertDateStringsToDates($scope.Customer)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    if ($scope.Customer.Docs.length!==undefined|| $scope.Customer.Docs.length>0 ){
      $scope.Customer.Docs[$scope.Customer.Docs.length]=Doc
    }
    else {
      $scope.Customer.Docs={}
      $scope.Customer.Docs[0]=Doc
    }

  }
  else {
     if ($scope.action=="saveProfileCustomer")
        $scope.loadItem()
}
$scope.uploadprofileweb=function(){
    $("#loader_img_int").show()
      var f = document.getElementById('msds').files[0],
          r = new FileReader();
          $scope.f=f
      r.onloadend = function(e) {
          var data = e.target.result;
          console.log(data);
          f={}
          f.data=data
          f.name=$scope.f.name
          data={action:"upload_document_ax",type:"profile",id:$scope.Customer.user_id, f:f,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
          $http.post(SERVICEURL2,data,{
          headers: {'Content-Type': undefined}
      })
          .then(function(data){
            $scope.Customer.image=data.image;
            if($scope.image_type.indexOf($scope.Doc.file_type) === -1) {
              $scope.Doc.isImage=false
            }
            $("#loader_img_int").hide()
            if (data.data.RESPONSECODE=='-1'){
               localstorage('msg','Sessione Scaduta ');
               $state.go('login');;;
            }
              console.log('success');
          })
          , (function(){
              console.log('error');
          });
      };
      r.readAsDataURL(f);

}

$scope.imageurl=function(image){
  if (image===undefined ||  image== null || image.length==0)
    imageurl= ''
  else
  imageurl= BASEURL+ "file_down.php?action=file&file=" + image +"&profile=1&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie
//
  //  Customer.imageurl= Customer.IMAGEURI +Customer.image
  return   imageurl

}

$scope.add_customer= function (){
  if ($scope.form.$invalid) {
    angular.forEach($scope.form.$error, function(field) {
      angular.forEach(field, function(errorField) {
        errorField.$setTouched();
      })
    });
    $scope.formStatus = "Dati non Validi.";
    swal('','Dati non validi')
    console.log("Form is invalid.");
    return
  } else {
    //$scope.formStatus = "Form is valid.";
    console.log("Form is valid.");
    console.log($scope.data);
  }
  lang=localStorage.getItem('language');
  var email=localStorage.getItem("userEmail");

  var userId = localStorage.getItem('userId');
  var usertype = localStorage.getItem('userType');
  var agencyId = localStorage.getItem('agencyId');
  dbData=$scope.Customer
  if ($scope.page.agent)
  dbData['user_type']=2
 data={ "action":$scope.action, id:userId,email:email,usertype:usertype,lang:lang, dbData: dbData,agent:$scope.page.agent,agency_id:agencyId,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie},pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
  $scope.main.loader=true
  $http.post( SERVICEURL2,  data )
  .then(function(data) {
    if(data.data.RESPONSECODE=='1') 			{
      //swal("",data.data.RESPONSE);
      $scope.lastid=data.data.lastid
      $scope.back()
    }
    else
    {
      $scope.main.loader=false
      if (data.data.RESPONSECODE=='-1'){
         localstorage('msg','Sessione Scaduta ');
         $state.go('login');;;
      }
      console.log('error');
      swal("",data.data.RESPONSE);
    }
  })
  , (function() {
    $scope.main.loader=false
    console.log("error");
    $scope.loader=false
  });
}



$scope.deleteDoc=function()
{
  $scope.Customer.image=""
}

$scope.uploadfromgallery=function()
{
  $scope.loader=true
  navigator.camera.getPicture($scope.uploadPhoto,
    function(message) {
      alert('get picture failed');
    },
    {
      quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    }
  );
}
$scope.add_photo=function()
{
  $scope.loader=true
  // alert('cxccx');
  navigator.camera.getPicture($scope.uploadPhoto,
    function(message) {
      alert('get picture failed');
    },
    {
      quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType: navigator.camera.PictureSourceType.CAMERA
    }
  );
}

$scope.uploadPhoto=function(imageURI){
  userid=$scope.Customer.user_id
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
  options.mimeType="text/plain";
  options.chunkedMode = false;
  var params = new Object();

  options.params = params;
  var ft = new FileTransfer();
  $scope.loader=true
  //$http.post( LOG,  {data:BASEURL+"service.php?action=upload_user_image&userid="+userid})
  ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_user_image&userid="+userid), $scope.winFT, $scope.failFT, options);

  //          ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per), $scope.winFT, $scope.failFT, options,true);



}
$scope.winFT=function (r)
{
  var review_info   =JSON.parse(r.response);
  $scope.Customer.image=review_info.response
  $scope.loader=false
  $scope.$apply()

}
$scope.failFT =function (error)
{
  $("#loader_img").hide()
  $scope.loader=false

}
$scope.showAC=function($search,$word, settings){
  var id=localStorage.getItem("userId");
  var usertype = localStorage.getItem('userType');
  res = $search.split(".")
  $search=res[1]
  if ($word===undefined){
    $word=$scope[res[0]][res[1]]
  }
  else {
    $word=$('#'+$word).val()
  }
  $table=res[0].toLowerCase()

  if (( $word  !== "undefined" && $word.length>0 &&  $word!=$scope.oldWord) || settings.zero){

   data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,zero:settings.zero,order:settings.order,countries:settings.countries,search:$word ,table:$table,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      if(data.data.RESPONSECODE=='1') 			{
        //$word=$($search.currentTarget).attr('id');
        $scope.word[$search]=data.data.RESPONSE;
      }
      if (data.data.RESPONSECODE=='-1'){
         localstorage('msg','Sessione Scaduta ');
         $state.go('login');;;
      }
    })
    , (function() {
      console.log("error");
    });
  }
  $scope.oldWord= $($search.currentTarget).val()
}
$scope.resetAC=function(){
  $scope.word={}
  $scope.list={}
  $scope.listOther={}
  $scope.listCompany={}


}
$scope.addWord=function($search,$word,par){
  res = $search.split(".")
  switch(res.length){
    case 2:
    $scope[res[0]][res[1]]=$word
    $scope.word[res[1]]=[]
    break;
    case 3:
    $scope[res[0]][res[1]][res[2]]=$word
    $scope.word[res[2]]=[]
    break;

  }
  if (par.id!==undefined){
    $('#'+par.id).parent('div.mdl-textfield').addClass('is-dirty');
    $('#'+par.id).parent('div.mdl-textfield').removeClass('is-invalid');

  }

  if (par.countries && $scope.word['countries']!==undefined){
    $scope.word['countries']=[]
  }
}
$scope.other=function(){
  if($scope.page.other_data)
  $scope.page.other_data=false
  else
  $scope.page.other_data=true
  $scope.arrow=(page.other_data!== undefined || page.other_data) ? 'arrow_drop_up' : 'arrow_drop_down';

}
$scope.add_document=function(Doc,per_id){
  if (Doc===undefined){
    Doc={}
  }
  localstorage('add_document',JSON.stringify({action:"add_document_for_customer",per_id:$scope.Customer.user_id,location:"add_customer"}))
  Doc.doc_name=""
  Doc.doc_type="Documento di Identità"
  Doc.agency_id=localStorage.getItem('agencyId')
  Doc.per='customer'
  if ($scope.Customer.user_id===undefined && $scope.Customer.user_id>0)
  Doc.per_id=$scope.Customer.user_id;
  Doc.id=null
  Doc.image_name=null
  Doc.indice=$scope.Customer.Docs.length
  localstorage('Doc',JSON.stringify(Doc))
  localstorage('Customer',JSON.stringify($scope.Customer))
  $state.go('add_document')
  return;
}
$scope.edit_doc=function(Doc,indice){
  localstorage('add_document',JSON.stringify({action:"edit_document_customer",location:"add_customer"}))
  Doc.agency_id=localStorage.getItem('agencyId')
  Doc.per='customer'
  if ($scope.Customer.user_id===undefined && $scope.Customer.user_id>0)
  Doc.per_id=$scope.Customer.user_id;
  Doc.indice=indice
  localstorage('Doc',JSON.stringify(Doc))
  localstorage('Customer',JSON.stringify($scope.Customer))
  $state.go('add_document')
  return;
}
$scope.back=function(){
  precPage=JSON.parse(localStorage.getItem($scope.page.location))
  if (!isObject(precPage))
    precPage={}
  switch ($scope.page.action){
    case'add_customer_for_contract':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
      $scope.Contract.fullname=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Contract.contractor_id= $scope.lastid
      precPage.add=true
      localstorage('Contract', JSON.stringify($scope.Contract));
    }
    break;
    case'add_other_for_contract':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
      $scope.Contract.other_name=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Contract.user_id= $scope.lastid
      precPage.add=true
      localstorage('Contract', JSON.stringify($scope.Contract));
    }
    break;
    case'add_customer_for_owner':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
      $scope.Owner.fullname=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Owner.user_id= $scope.lastid
      precPage.load=true
      localstorage('Owner', JSON.stringify($scope.Owner));
    }
    break;
    case'edit_customer_for_kyc_owner':
    localstorage('Owner', JSON.stringify($scope.Customer));
    precPage.edit=true
    break;
    case'add_customer_for_kyc_owner':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
      $scope.Owner.fullname=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Owner.user_id= $scope.lastid
      precPage.add=true
      localstorage('Owner', JSON.stringify($scope.Owner));
    }
    break;
  }
  localstorage($scope.page.location,JSON.stringify(precPage))
  $state.go($scope.page.location)

}
  $scope.$on('backButton', function(e) {
      $scope.main.reload=true
      $scope.back()
  });

  $scope.$on('addButton', function(e) {

  })
  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               $('input.mdl-textfield__input').each(
                 function(index){
                   $(this).parent('div.mdl-textfield').addClass('is-dirty');
                   $(this).parent('div.mdl-textfield').removeClass('is-invalid');
                 })
               $scope.main.loader=false
            }, 5);
  });


})
