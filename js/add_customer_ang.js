var app2 = angular.module('myApp', ['pascalprecht.translate','ng-currency','fieldMatch']);
//Field Match directive
angular.module('fieldMatch', [])
.directive('fieldMatch', ["$parse", function($parse) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var me = $parse(attrs.ngModel);
      var matchTo = $parse(attrs.fieldMatch);
      scope.$watchGroup([me, matchTo], function(newValues, oldValues) {
        ctrl.$setValidity('fieldmatch', me(scope) === matchTo(scope));
      }, true);
    }
  }
}]);


//Run material design lite
app2.directive("ngModel",["$timeout", function($timeout){
  return {
    restrict: 'A',
    priority: -1, // lower priority than built-in ng-model so it runs first
    link: function(scope, element, attr) {
      scope.$watch(attr.ngModel,function(value){
        $timeout(function () {
          if (value){
            element.trigger("change");
          } else if(element.attr('placeholder') === undefined) {
            if(!element.is(":focus"))
            element.trigger("blur");
          }
        });
      });
    }
  };
}]);

app2.run(function($rootScope, $timeout) {
  $rootScope.$on('$viewContentLoaded', function(event) {
    $timeout(function() {
      componentHandler.upgradeAllRegistered();
    }, 0);
  });
  $rootScope.render = {
    header: true,
    aside: true
  }
});

app2.filter('capitalize', function() {
  return function(input, $scope) {
    if ( input !==undefined && input.length>0)
    return input.substring(0,1).toUpperCase()+input.substring(1);
    else
    return input

  }
});

app2.controller('personCtrl', function ($scope,$http,$translate,$rootScope) {
  $scope.Customer={}
  /*    $scope.Customer.name=" "
  $scope.Customer.surname=" "
  $scope.Customer.email="x "
  $scope.Customer.mobile= " "
  */
  $scope.page={}
  $scope.loadItem=function(){
    var id=localStorage.getItem("CustomerProfileId");
    var email=localStorage.getItem("userEmail");
    var agencyId = localStorage.getItem('agencyId');
    data= {"action":"view_Customer_Profile_info",customer_id:id,email:email,agency_id:agencyId}
    $scope.loader=true
    $http.post( SERVICEURL2,  data )
    .success(function(responceData) {
      if(responceData.RESPONSECODE=='1') 			{
        data=responceData.RESPONSE;
        $.each(data, function(key, value){
          if (value === null){
            delete data[key];
          }
        });
        $scope.Customer =  data;
        $scope.Customer.IMAGEURI=BASEURL+"uploads/user/small/"
        //$rootScope.$broadcast('show')
        $scope.loader=false
        $('input.mdl-textfield__input').each(
          function(index){
            $(this).parent('div.mdl-textfield').addClass('is-dirty');
            $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
        );

      }
      else
      {
        console.log('error');
      }
    })
    .error(function() {
      console.log("error");
    });

  }

  page=localStorage.getItem('add_customer.html')
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  switch ($scope.action){
    case 'add_customer':
    $scope.viewName="Inserisci Cliente"
    $scope.action="addcustomer"
    if ($scope.page.agent){
      $scope.viewName="Inserisci Agente"
    }
    break;
    case 'update_customer':
    $scope.viewName="Modifica Cliente"
    if ($scope.page.agent){
      $scope.viewName="Modifica Agente"
    }
    $scope.action="saveProfileCustomer"
    break;
    case 'add_customer_for_owners':
    $scope.viewName="Inserisci Titolare Effettivo"
    $scope.action="addcustomer"
    break;

    case 'add_customer_for_kyc_owners':
    $scope.viewName="Inserisci Titolare Effettivo"
    $scope.action="addcustomer"
    break;

    case 'edit_customer_for_kyc_owner':
    $scope.countryList=JSON.parse(localStorage.getItem('countryList'))
    Customer=JSON.parse(localStorage.getItem('Owner'))
    convertDateStringsToDates(Customer)
    $scope.Customer=Customer

    $scope.viewName="Modifica Titolare Effettivo"
    $scope.action="saveProfileCustomer"
    break;

    default:
    $scope.viewName="Inserisci Cliente"


  }
  if ($scope.page.editDoc) {
    $scope.Customer=JSON.parse(localStorage.getItem('Customer'))
    convertDateStringsToDates($scope.Customer)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Customer.Docs[Doc.indice]=Doc

  }
  else if ($scope.page.addDoc){
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
  data={ "action":$scope.action, id:userId,email:email,usertype:usertype,lang:lang, dbData: dbData,agent:$scope.page.agent,agency_id:agencyId}
  $scope.loader=true
  $http.post( SERVICEURL2,  data )
  .success(function(data) {
    if(data.RESPONSECODE=='1') 			{
      swal("",data.RESPONSE);
      $scope.lastid=data.lastid
      $scope.back()
    }
    else
    {
      console.log('error');
      swal("",data.RESPONSE);
    }
  })
  .error(function() {
    console.log("error");
  });
}

$scope.imageurl=function(Customer){
  Customer.IMAGEURI=BASEURL+"uploads/user/small/"
  if (Customer.image===undefined || Customer.image.length==0)
  Customer.imageurl= null
  else
  Customer.imageurl= Customer.IMAGEURI +Customer.image
  return   Customer.imageurl

}


$scope.deleteDoc=function()
{
  $scope.Customer.image=""
}

$scope.uploadfromgallery=function()
{
  scope.loader=true
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
  scope.loader=true
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
$scope.showAC=function($search,$word){
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

  if (( $word  !== "undefined" && $word.length>3 &&  $word!=$scope.oldWord)){

    data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      if(data.RESPONSECODE=='1') 			{
        //$word=$($search.currentTarget).attr('id');
        $scope.word[$search]=data.RESPONSE;
      }
    })
    .error(function() {
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
$scope.addWord=function($search,$word){
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
}
$scope.other=function(){
  if($scope.page.other_data)
  $scope.page.other_data=false
  else
  $scope.page.other_data=true
  $scope.arrow=(page.other_data!== undefined || page.other_data) ? 'arrow_drop_up' : 'arrow_drop_down';

}
$scope.back=function(){

  switch ($scope.page.action){
    case'add_customer_for_contract':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
      $scope.Contract.fullname=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Contract.contractor_id= $scope.lastid
      localstorage('Contract', JSON.stringify($scope.Contract));
    }
    break;
    case'add_other_for_contract':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
      $scope.Contract.other_name=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Contract.user_id= $scope.lastid
      localstorage('Contract', JSON.stringify($scope.Contract));
    }
    break;
    case'add_customer_for_owner':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
      $scope.Owner.fullname=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Owner.user_id= $scope.lastid
      key= Object.keys($scope.stack).pop() ;
      $scope.stack[key].load=true;
      localstorage('Owner', JSON.stringify($scope.Owner));
    }
    break;
    case'edit_customer_for_kyc_owner':
    localstorage('Owner', JSON.stringify($scope.Customer));
    precPage=JSON.parse(localStorage.getItem($scope.page.location))
    precPage.edit=true
    localstorage($scope.page.location,JSON.stringify(precPage))
    break;
    case'add_customer_for_kyc_owner':
    if ($scope.lastid!==undefined && $scope.lastid>0 ){
      $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
      $scope.Owner.fullname=$scope.Customer.name +" "+$scope.Customer.surname
      $scope.Owner.user_id= $scope.lastid
      precPage=JSON.parse(localStorage.getItem($scope.page.location))
      precPage.add=true
      localstorage($scope.page.location,JSON.stringify(precPage))
      localstorage('Owner', JSON.stringify($scope.Owner));
    }
    break;

  }
  redirect($scope.page.location)

}


})
