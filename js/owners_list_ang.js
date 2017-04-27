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
app2.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')'

            });
        });
    };
});

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
  switch ($scope.action){
    case "owner_from_contract":
      $scope.Contract=IsJsonString(localStorage.getItem('Contract'))
      if ($scope.Contract.act_for_other==2){
        $scope.company_id=$scope.Contract.company_id;
        $scope.Company_name="CPU:" + $scope.Contract.CPU + " Deleganti"
      }
      else{
        $scope.company_id=$scope.Contract.company_id;
        $scope.Company_name=$scope.Contract.name

      }
    break;
    case "ownwe_from_compnay":
      $scope.company_id=localStorage.getItem("CompanyID")
      $scope.Company_name=localStorage.getItem("Company_name")
    break;
    default:
      $scope.company_id=localStorage.getItem("CompanyID")
      $scope.Company_name=localStorage.getItem("Company_name")

  }
  $scope.Company={};
  $scope.Owner={};
  //$scope.Company.name=localStorage.getItem("Company_name");

  $scope.addMoreItems =function(){
    if (isObject($scope.Contract))
      appData=$scope.Contract
    else
      appData=[]

    last=99999999999

    data= {"action":"OwnersList",company_id:$scope.company_id,last:last,appData:appData}
    $scope.loader=true
    $http.post( SERVICEURL2,  data  )
    .success(function(responceData){
      if(responceData.RESPONSECODE=='1') 			{
        data=responceData.RESPONSE;
        if (last==99999999999)
          $scope.Owners=data;
        else
          $scope.Owners=$scope.Contracts.concat(data);
        //$scope.Customers=data;
        $scope.loaded=data.length
        $scope.loader=false
       }
      else
      {
        //swal("", 'no customer')
        $scope.Owners={};
        $scope.loader=false
      }
    })
    .error(function() {
      swal("", 'Errore')
      console.log("error");
    });
  }
  $scope.addMoreItems()

  $scope.add_owner=function(Owner){
    if ($scope.page.action=='owner_from_contract'){
      localstorage('Contract',JSON.stringify($scope.Contract))
      localstorage('add_owners.html',JSON.stringify({action:'add_owner_from_contract',location:'owners_list.html'}))

    }else {
      localstorage('add_owners.html',JSON.stringify({action:'',location:'owners_list.html'}))

    }

    redirect('add_owners.html')

  }
  $scope.edit_owner=function(Owner,indice){
    if ($scope.page.action=='owner_from_contract'){
      localstorage('Contract',JSON.stringify($scope.Contract))
      localstorage('add_customer.html',JSON.stringify({action:'edit_customer_for_kyc_owner',location:curr_page,owners:true}))
      localstorage('Owner',JSON.stringify(Owner))

    }else {
      localstorage('add_customer.html',JSON.stringify({action:'edit_customer_for_kyc_owner',location:curr_page}))
      localstorage('Owner',JSON.stringify(Owner))
    }
    Owner.indice=indice
    localstorage('Owner',JSON.stringify(Owner))
    redirect('add_customer.html')

  }
  $scope.deleteOwn= function (Own,index){
    owner_id=Own.user_id
    $('#loader_img').show();
    data={ "action":"deleteOwner", appData:$scope.Contract,user_id:owner_id}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1') 			{
        swal("",data.RESPONSE);
        $scope.Kyc.Contract.splice(index,index);

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
    if (Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
      Customer.imageurl= '../img/customer-listing1.png'
    else
      Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   Customer.imageurl

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

  console.log($scope.Contracts);
});
