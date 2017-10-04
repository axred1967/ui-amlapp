app2.controller('add_customer', function ($scope,$http,$state,$translate,$rootScope,$timeout,$stateParams, $interval) {
//gestisco lo state parameter
  $scope.curr_page=$state.current.name
  $scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]

  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuovo Persona"

  // memorizzo i dati
  		$interval(function(){
  			if ($scope.Customer!==undefined && $scope.pages[$state.current.name]!==undefined){
  				$scope.pages[$state.current.name].temp=$scope.Customer
  				localstorage('pages',JSON.stringify($scope.pages))

  			}

  		},3000)


  $scope.loadItem=function(){
    data={"action":"view_Customer_Profile_info",customer_id:$scope.page.user_id,email:$scope.email,pInfo:$scope.agent.pInfo}
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
        $('input[type="date"]').each(function(){
         d=$(this).attr('ng-model')
         res=d.split('.')
         if (data[res.slice(-1)[0]]===null){
           data[res.slice(-1)[0]]=new Date()
         }
         else {
           data[res.slice(-1)[0]]=new Date(data[res.slice(-1)[0] ])
         }
        })
        $scope.Customer =  data;
        $scope.imageLoaded=true;
        //$rootScope.$broadcast('show')
        $scope.loader=false
        $scope.Customer.settings=IsJsonString($scope.Customer.settings)
        if (!isObject($scope.Customer.settigss)){
            $scope.Customer.settings={}

        }
        //convertDateStringsToDates($scope.Customer)


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
  $scope.Customer={}


  switch ($scope.page.action){
    case 'add_customer':
    $scope.main.viewName="Censisci Cliente"
    $scope.action="addcustomer"
    if ($scope.page.agent){
      $scope.main.viewName="Censisci Agente"
    }
    break;
    case 'update_customer':

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
    case 'add_other_for_contract':
    $scope.main.viewName="Inserisci beneficiario contratto"
    $scope.action="addcustomer"
    break;

    case 'add_customer_for_kyc_owners':
    $scope.main.viewName="Inserisci Titolare Effettivo"
    $scope.action="addcustomer"
    break;

    case 'edit_customer_for_kyc_owner':
    Customer=JSON.parse(localStorage.getItem('Owner'))
    //convertDateStringsToDates(Customer)
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
    //convertDateStringsToDates($scope.Customer)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    //convertDateStringsToDates(Doc)
    $scope.Customer.Docs[Doc.indice]=Doc

  }
  else if ($scope.main.addDoc){
    $scope.Customer=JSON.parse(localStorage.getItem('Customer'))
    //convertDateStringsToDates($scope.Customer)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    //convertDateStringsToDates(Doc)
    if ($scope.Customer.Docs.length!==undefined|| $scope.Customer.Docs.length>0 ){
      $scope.Customer.Docs[$scope.Customer.Docs.length]=Doc
    }
    else {
      $scope.Customer.Docs={}
      $scope.Customer.Docs[0]=Doc
    }

  }

if ($scope.page.temp!==undefined && $scope.page.temp!==null){
  $scope.Customer=$scope.page.temp
  $scope.imageLoaded=true;
  //convertDateStringsToDates($scope.Customer)
}  else {
//     if ($scope.action=="saveProfileCustomer")
        $scope.loadItem()
}
$scope.imageLoaded=true


$scope.uploadprofileweb=function(){
  var f = document.getElementById('msds').files[0],
  r = new FileReader();
  $scope.f=f
  r.onloadend = function(e) {
    var data = e.target.result;
    f={}
    f.data=data
    f.name=$scope.f.name
    var extn = "." +f.name.split(".").pop();
    filename=$scope.Customer.user_id+ "_profilo" +  Math.random().toString(36).slice(-16) +extn
    //f.name=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
    $scope.Customer.image=filename;
    $scope.imageLoaded=false;

    data={action:"upload_document_ax",type:"profile",entity:'users',entity_key:$scope.Customer.user_id, f:f,filename:filename,pInfo:$scope.agent.pInfo}
    $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
    .then(function(data){

        image=data.data.image
        $scope.imageLoaded=true;
        $scope.$broadcast('fileUploaded',image)

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


$scope.imageurl=function(Customer){
  if (Customer===undefined || Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
  imageurl= BASEURL + 'img/customer-listing1.png'
  else
  imageurl= SERVICEDIRURL +"file_down.php?file=" + Customer.image +"&tipo=profilo"+ $scope.agent.pInfoUrl

  if (!$scope.imageLoaded)
    imageurl=BASEURL +'img/loading_image.gif'
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
  dbData=$scope.Customer
  data={ "action":$scope.action, dbData:dbData,agent:$scope.page.agent,pInfo:$scope.agent.pInfo}
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
  window.resolveLocalFileSystemURI(imageURI, $scope.gotFileEntry, $scope.fail);
}
$scope.gotFileEntry= function(fileEntry) {
    fileEntry.file( function(file) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
          var data = e.target.result;
          f={}
          f.data=data
          spedat=data.split(',')
          data1=spedat[1]
          f.name=file.name
          var extn
          var ext=spedat[0].split('/')
          spedat=''
          ext=ext[1].split(';')
          extn='.' + ext[0]

          var filename=$scope.Customer.user_id +"_profilo" + extn
          f.name=filename
          $scope.$apply(function () {
            $scope.imageLoaded=false
          })
          data={action:"upload_document_ax",type:"profile",entity:'users',entity_key:$scope.Customer.user_id, f:f,filename:filename,pInfo:$scope.agent.pInfo}
          $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
          .then(function(data){
            if (data.data.RESPONSECODE=='1'){
              $rootScope.$broadcast('fileUploaded',data.data.response);
            }
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
        reader.readAsDataURL(file);

      })



}
$scope.winFT=function (r)
{
  $scope.$apply(function () {
    $scope.imageLoaded=true
  });

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

   data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,zero:settings.zero,order:settings.order,countries:settings.countries,search:$word ,table:$table,pInfo:$scope.agent.pInfo}
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
  $scope.arrow=($scope.page.other_data!== undefined || $scope.page.other_data) ? 'arrow_drop_up' : 'arrow_drop_down';

}
$scope.edit_profile=function(){
  url=SERVICEDIRURL +"file_down.php?resize=m&tipo=profilo&file=" + $scope.Customer.image+$scope.agent.pInfoUrl
  doc={}
  doc.rotate=$scope.Customer.settings.imagerotate
  dialog.showModal();
  $timeout(function(){
    init_canvas_image('DocCanvas',url,doc)

  },500)
}

$scope.back=function(){
  precPage=JSON.parse(localStorage.getItem($scope.page.location))
  if (!isObject(precPage))
    precPage={}
  switch ($scope.page.action){
    case'add_customer_for_contract':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.pages[$scope.page.location].temp.contractor_name=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.pages[$scope.page.location].temp.contractor_id=$scope.lastid
    }
    break;
    case'add_other_for_contract':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.pages[$scope.page.location].temp.other_name=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.pages[$scope.page.location].temp.other_id=$scope.lastid
    }
    break;
    case'add_customer_for_owner':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.pages[$scope.page.location].temp.fullname=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.pages[$scope.page.location].temp.other_id=$scope.lastid
    }
    break;
    case'edit_customer_for_kyc_owner':
    $scope.pages[$scope.page.location].Owner=$scope.Customer
    break;
    case'add_customer_for_kyc_owner':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.pages[$scope.page.location].Owner=$scope.Customer
      $scope.Owner.fullname=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Owner.user_id= $scope.lastid
    }
    break;
  }
  localstorage('pages', JSON.stringify($scope.pages));
  $state.go($scope.page.location)

}
  $scope.$on('backButton', function(e) {
      $scope.main.reload=true
      $scope.back()
  });

  $scope.$on('addButton', function(e) {

  })
  $scope.$on('fileUploaded', function(e,filename) {
        if (filename==$scope.Customer.image){
          $scope.imageLoaded=true
        }


  });
  $scope.$on('updateImageDialog', function(e,args) {
    if (args.doc.changed){

          $scope.Customer.image=$scope.Customer.user_id+ "_profilo" + Math.random().toString(36).slice(-16)+'.png'
          $scope.imageLoaded=false
          var f={}
          f.name=$scope.Customer.image
          filename=f.name
          f.data=canvasDoc.toDataURL()
          data={action:"upload_document_ax",type:"profile",entity:'users',entity_key:$scope.Customer.user_id, f:f,filename:filename,pInfo:$scope.agent.pInfo}
         $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
        .then(function(data){

          $scope.imageLoaded=true
          if (data.data.RESPONSECODE=='-1'){
             localstorage('msg','Sessione Scaduta ');
             $state.go('login');;;
          }
            console.log('success');
        })
        , (function(){
            console.log('error');
        });

      }
      else {
        $scope.Customer.settings.imagerotate=args.gradi
      }


  })

  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               setDefaults($scope)
  						 $('.mdl-layout__drawer-button').hide()
  						 $scope.main.loader=false

            }, 800);
  });


})
