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
app2.controller('personCtrl', function ($scope,$http,$translate) {
  $scope.page={}

  curr_page=base_name()
  page=localStorage.getItem(curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }

  console.log('action'+$scope.action);
  $scope.addMoreItems =function(){
    last=99999999999
    if ( $scope.Contracts!==undefined && $scope.Contracts.length>0){
      lastkey= Object.keys($scope.Contracts).pop() ;
      last=$scope.Contracts[lastkey].id;
    }
    dbData=$scope.Docload
    data={ "action":"documentList", dbData:dbData}
    $('#loader_img').show();
    $http.post(SERVICEURL2,  data )
    .success(function(responceData)  {
      $('#loader_img').hide();
      if(responceData.RESPONSECODE=='1') 			{
        data=responceData.RESPONSE;
        angular.forEach(data,function(value,key) {
          data[key].IMAGEURI=BASEURL+'uploads/document/'+data[key].per+'_'+data[key].per_id +'/resize/'

        })
        $scope.loaded=data.length
        if (last==99999999999)
        $scope.Docs=data;
        else
        $scope.Docs=$scope.Docs.concat(data);
        //$scope.Customers=data;

      }

      else   {
        console.log('no docs')
      }
    })
    .error(function() {
      console.log("error");
    });


  }
  $scope.Docload={}
  switch ($scope.action){
    case 'list_from_view_contract' :
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    convertDateStringsToDates($scope.Contract)
    $scope.DocFor="CPU Contratto: " + $scope.Contract.CPU
    $scope.viewName="Documenti Contratto"
    $scope.Docload.per_id=$scope.Contract.contract_id
    $scope.Docload.per="contract"

    break;
    case 'list_from_my_company' :
    $scope.Company=JSON.parse(localStorage.getItem('Company'))
    convertDateStringsToDates($scope.Company)
    $scope.DocFor=$scope.Compnay.name;
    $scope.Docload.per_id=$scope.Company.company_id
    $scope.Docload.per="company"


    break;
    case 'list_from_my_customer' :
    $scope.Customer=JSON.parse(localStorage.getItem('Customer'))
    convertDateStringsToDates($scope.Customer)
    $scope.DocFor=$scope.Customer.fullname;
    $scope.viewName="Documenti persona"
    $scope.Docload.per_id=$scope.Customer.user_id
    $scope.Docload.per="customer"


    break;
    default :
    $scope.viewName="Documenti Contratto"
    break;
  }
  if ($scope.page.editDoc) {
    $scope.Docs=JSON.parse(localStorage.getItem('Docs'))
    convertDateStringsToDates($scope.Docs)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Kyc.contractor_data.Docs[Doc.indice]=Doc

  }
  else if ($scope.page.addDoc){
    $scope.Docs=JSON.parse(localStorage.getItem('Docs'))
    convertDateStringsToDates($scope.Docs)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    if ($scope.Docs.length!==undefined|| $scope.Docs.length>0 ){
      $scope.Docs[$scope.Kyc.contractor_data.Docs.length]=Doc
    }
    else {
      $scope.Kyc.contractor_data.Docs={}
      $scope.Kyc.contractor_data.Docs[0]=Doc
    }

  }
  else {

    $scope.addMoreItems()

  }






  $scope.deleteDoc=function(Doc )
  {
    navigator.notification.confirm(
      'Vuoi cancellare il Documento!', // message
      function(button) {
        if ( button == 1 ) {
          $scope.deleteDoc2(Doc);
        }
      },            // callback to invoke with index of button pressed
      'Sei sicuro?',           // title
      ['Si','No']     // buttonLabels
    );

  }
  $scope.deleteDoc2=function(Doc,index){
    $http.post(SERVICEURL2,{action:'delete',table:'documents','primary':'id',id:Doc.id })
    $scope.Docs.splice(index,1);
  }


  $scope.add_document=function(){
    localstorage('Docs',JSON.stringify($scope.Docs))

    switch($scope.page.action){
      case 'list_from_my_customer':
      localstorage('add_document.html',JSON.stringify({action:"add_document_for_customer",location:curr_page}))
      Doc={agency_id:localStorage.getItem('agencyId'),per_id:$scope.Customer.user_id,per:'customer'}
      localstorage('Doc',JSON.stringify(Doc))
      break
      case 'list_from_my_company':
      localstorage('add_document.html',JSON.stringify({action:"add_document_for_customer",location:curr_page}))
      Doc={agency_id:localStorage.getItem('agencyId'),per_id:$scope.Customer.user_id,per:'customer'}
      localstorage('Doc',JSON.stringify(Doc))
      break
      case 'list_from_view_contract' :
      localstorage('add_document.html',JSON.stringify({action:"add_document_for_contract",location:curr_page}))
      Doc={agency_id:localStorage.getItem('agencyId'),per_id:$scope.Contract.contract_id,per:'contract'}
      localstorage('Doc',JSON.stringify(Doc))
      break;
      default:
    }
    redirect('add_document.html')
  }
  $scope.edit_doc=function(Doc,Index){
    localstorage('add_document.html',JSON.stringify({action:"edit_document_for_customer",location:"my_document.html"}))
    Doc.indice=index
    localstorage('Doc',JSON.stringify(Doc))
    redirect('add_document.html')


  }

  $scope.back=function(){
    redirect($scope.page.location)
  }

})
function onConfirm(buttonIndex,$scope,doc) {
  if (buttonIndex=1)
  $scope.deleteDoc(doc)
}
