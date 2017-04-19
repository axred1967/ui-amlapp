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
  page=localStorage.getItem('add_owners.html')
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.word={};
  $scope.Owner={}
  //localstorage("back","view_contract.html");
  switch ($scope.action){
    case 'edit_owners' :
    $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    $scope.action='edit_owners'
    $scope.viewName="Modifica TE"
    break;
    case 'add_customer_for_kyc_owner' :
    $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    $scope.action='add_owners'
    $scope.viewName="Nuovo TE"
    break;
    default :
    if($scope.page.load!==undefined && $scope.page.load)
    $scope.Owner=JSON.parse(localStorage.getItem('Owner'))

    $scope.viewName="Nuovo TE"
    $scope.action='add_owners'
    $scope.Owner.company_id=localStorage.getItem("CompanyID");
    break;
  }

  if($scope.page.load!==undefined && $scope.page.load)
  $scope.Owner=JSON.parse(localStorage.getItem('Owner'))


  $scope.showContractorList=function(){
    if ((typeof $scope.Owner.fullname !== "undefined" && $scope.Owner.fullname.length>4 && $scope.oldContrator!=$scope.Owner.fullname)){
      data={ "action":"ACCustomerList", name:$scope.Owner.fullname}
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        if(data.RESPONSECODE=='1') 			{
          $scope.list=data.RESPONSE;
        }
      })
      .error(function() {
        console.log("error");
      });
    }
    $scope.oldContrator=$scope.searchContractor
  }
  $scope.addContractorItem=function(id, name){
    $scope.list=[];
    $scope.Owner.fullname=name;
    $scope.Owner.user_id=id;
  };
  $scope.add_owner=function(){
    //       add_contract($scope.action);
    var langfileloginchk = localStorage.getItem("language");
    if ($scope.form.$invalid) {
      angular.forEach($scope.form.$error, function(field) {
        angular.forEach(field, function(errorField) {
          errorField.$setTouched();
        })
      });
      swal("riempire form corretamente");
      console.log("Form is invalid.");
      return
    } else {
      //$scope.formStatus = "Form is valid.";
      console.log("Form is valid.");
      console.log($scope.data);
    }
    if ($scope.page.action=='add_customer_for_kyc_owner'){
      appData=$scope.Contract
    }
    else {
      var  appData ={
        id :localStorage.getItem("userId"),
        usertype: localStorage.getItem('userType')
      }
    }

    dbData=$scope.Owner
    dbData.agent_id=appData.id


    $('#loader_img').show();
    data= {"action":$scope.action,appData:appData,dbData: dbData}
    $http.post(SERVICEURL2,data)
    .success(function(data){
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1')
      {
        $scope.contract=[]
        swal("",data.RESPONSE);
        $scope.back()

      }
      else      {
        swal("",data.RESPONSE);
      }
    })
    .error(function(){
      console.log('error');
    })
    $scope.word[$e]=[]
  }
  $scope.back=function(){
    switch($scope.pèace.action){
      case 'add_customer_for_kyc_owner':

      break;

    }
    //       windows.histoery.back()
    redirect($scope.page.location)
  }

  $scope.add_customer=function(){
    localstorage('add_customer.html',JSON.stringify({action:'add_customer_for_owner',location:'add_owners.html'}))
    localstorage('Owner',JSON.stringify($scope.Owner))
    redirect('add_customer.html')
  }

})
