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
  $scope.Company=[];
  $scope.Owner=[];
  $scope.Company.name=localStorage.getItem("Company_name");
  var id=localStorage.getItem("userId");
  var CompanyID=localStorage.getItem("CompanyID");
  var email=localStorage.getItem("userEmail");
  $('#loader_img').hide();
  var usertype = localStorage.getItem('userType');
  var image = localStorage.getItem("Profileimageagencyuser");
  var priviledge = localStorage.getItem("priviligetype");
  if(priviledge == 0 && usertype  == '2'  )
  {
    redirect("my_profile_agent_noprve.html");
  }
  if(image != null)
  {
    $('#Profileimageagencyuser').attr("src",BASEURL+"uploads/user/small/"+image);

  }
  $('#Profileimageagencyusername').html(name);
  $('#Profileimageagencyuseremail').html(email);
  data= {"action":"OwnersList",company_id:CompanyID, id:id,email:email,usertype:usertype,priviledge:priviledge}
  $http.post(
    SERVICEURL2,  data
  )
  .success(function(responceData)
  {
    $('#loader_img').hide();
    if(responceData.RESPONSECODE=='1') 			{
      data=responceData.RESPONSE;
      $scope.Owners=data;
    }
    else
    {
      //swal("", 'no customer')
      $scope.Owners=[];

    }

  })
  .error(function() {
    swal("", 'Errore')
    console.log("error");
  });

  $scope.add_owner=function(Owner){
    localstorage('add_owners.html',JSON.stringify({action:'',location:'owners_list.html'}))
    redirect('add_owners.html')

  }
  $scope.edit_owner=function(Owner){
    localstorage('add_owners.html',JSON.stringify({action:'edit_owners',load:true,location:'owners_list.html'}))

    localstorage('Owner',JSON.stringify(Owner))
    redirect('add_owners.html')

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
