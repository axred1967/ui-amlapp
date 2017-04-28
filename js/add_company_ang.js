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
app2.filter('uppercase', function() {
  return function(input, $scope) {
    if ( input !==undefined && input.length>0)
    return input.toUpperCase();
    else
    return input

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
  $scope.word={};
  $scope.page={}
  $scope.loader=true

 $scope.curr_page=base_name()
 page=localStorage.getItem($scope.curr_page)
 if ( page!= null && page.length >0 ){
   $scope.page=JSON.parse(page)
   $scope.action=$scope.page.action

 }

  $scope.loadItem=function(){
    var CompanyID=localStorage.getItem("CompanyID");
    var email=localStorage.getItem("userEmail");
    data= {"action":"show_edit_company",company_id:CompanyID}
    $scope.loader=true
    $http.post( SERVICEURL2,  data)
    .success(function(responceData)
    {
      if(responceData.RESPONSECODE=='1') 			{
        data=responceData.RESPONSE;
        $scope.Company=data;
        convertDateStringsToDates($scope.Company)
        if (!isObject($scope.Company.Docs)){
          $scope.Company.Docs=[{}]
          $scope.newDocs=true
        }
        $scope.loader=false
        $scope.Company.IMAGEURI=BASEURL+"uploads/company/small/"
        $('input.mdl-textfield__input').each(
          function(index){
            $(this).parent('div.mdl-textfield').addClass('is-dirty');
            $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
        );
      }
      else
      {
        console.log('no customer')
      }

    })

  }
  switch ($scope.action){
    case 'add_company_for_contract':
    $scope.viewName="Inserisci Società"
    $scope.action="add_company"
    $scope.Company={}
    $scope.Company.Docs=[{}]
    $scope.Company.IMAGEURI=BASEURL+"uploads/company/small/"
    $scope.newDocs=true;
    break;
    case 'edit_company':
    $scope.viewName="Modifica Società"
    $scope.action="edit_company"
    break;
    default:
    $scope.Company={}
    $scope.Company.Docs=[{}]
    $scope.Company.IMAGEURI=BASEURL+"uploads/company/small/"
    $scope.newDocs=true;
    $scope.action="add_company"
    $scope.viewName="Inserisci Società"
  }


  if ($scope.page.editDoc) {
    $scope.Company=JSON.parse(localStorage.getItem('Company'))
    convertDateStringsToDates($scope.Company)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Company.Docs[Doc.indice]=Doc

  }
  else if ($scope.page.addDoc){
    $scope.Company=JSON.parse(localStorage.getItem('Company'))
    convertDateStringsToDates($scope.Company)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    if ($scope.Company.Docs.length!==undefined|| $scope.Company.Docs.length>0 ){
      $scope.Company.Docs[$scope.Company.Docs.length]=Doc
    }
    else {
      $scope.Company.Docs={}
      $scope.Company.Docs[0]=Doc
    }

  }
  else {
    if ($scope.action=="edit_company")
    $scope.loadItem()
  }
  $scope.countryList=getCountryList()

  // autocomplete parole
  $scope.showAC=function($search,$table){
    var id=localStorage.getItem("userId");
    var usertype = localStorage.getItem('userType');

    if ((typeof $($search.currentTarget).val()  !== "undefined" && $($search.currentTarget).val().length>3 &&  $($search.currentTarget).val()!=$scope.oldWord)){
      $word=$($search.currentTarget).attr('id');
      data={ "action":"ACWord", id:id,usertype:usertype, name:$scope.searchContractor, search:$($search.currentTarget).val() ,word:$word ,table:$table}
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        if(data.RESPONSECODE=='1') 			{
          $word=$($search.currentTarget).attr('id');
          $scope.word[$word]=data.RESPONSE;
        }
      })
      .error(function() {
        console.log("error");
      });
    }
    $scope.oldWord= $($search.currentTarget).val()
  }
  $scope.addWord=function($e,word){
    $('#'+$e).val(word);

    $scope.word[$e]=[]
  }
  $scope.add_company= function (){
    var langfileloginchk = localStorage.getItem("language");
    if ($scope.form.$invalid) {
      angular.forEach($scope.form.$error, function(field) {
        angular.forEach(field, function(errorField) {
          errorField.$setTouched();
        })
      });
      $scope.formStatus = "Dati non Validi.";
      console.log("Form is invalid.");
      return
    } else {
      //$scope.formStatus = "Form is valid.";
      console.log("Form is valid.");
      console.log($scope.data);
    }

    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var usertype = localStorage.getItem('userType');
    $scope.loader=true
    dbData= $scope.Company
    data={ "action":$scope.action, id:id,email:email,usertype:usertype,lang:langfileloginchk, dbData:dbData}
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
        $scope.loader=false
        swal("",data.RESPONSE);
      }
    })
    .error(function() {
      $scope.loader=false
      console.log("error");
    });

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
    company_id=$scope.Compnay.company_id
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
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_company_image&company_id="+company_id), $scope.winFT, $scope.failFT, options);

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
  $scope.add_document=function(Doc,per_id){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document.html',JSON.stringify({action:"add_document_for_company",per_id:$scope.Company.company_id,location:$scope.curr_page}))
    Doc.doc_name=""
    Doc.doc_type="Documento Società"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='company'
    if ($scope.Company.company_id===undefined && Company.company_id>0)
    Doc.per_id=Company.company_id;
    Doc.id=null
    Doc.image_name=null
    Doc.indice=$scope.Company.Docs.length
    localstorage('Doc',JSON.stringify(Doc))
    localstorage('Company',JSON.stringify($scope.Company))

    redirect('add_document.html')
    return;
  }
  $scope.edit_doc=function(Doc,indice){
    localstorage('add_document.html',JSON.stringify({action:"edit_document_for_company",location:$scope.curr_page}))
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.doc_type="Documento Società"
    Doc.per='customer'
    if ($scope.Company.company_id===undefined && Company.company_id>0)
    Doc.per_id=Company.company_id;
    Doc.indice=indice
    localstorage('Doc',JSON.stringify(Doc))
    localstorage('Company',JSON.stringify($scope.Company))

    redirect('add_document.html')
    return;
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
      case'add_company_for_contract':
      if ($scope.lastid!==undefined && $scope.lastid>0 ){
        $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
        $scope.Contract.name=$scope.Company.name
        $scope.Contract.company_id= $scope.lastid
        localstorage('Contract', JSON.stringify($scope.Contract));
      }
      break;
    }
    redirect($scope.page.location)
  }
  $scope.loader=false

})
