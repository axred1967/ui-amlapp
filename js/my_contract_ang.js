var app2 = angular.module('myApp', ['pascalprecht.translate','ng-currency','fieldMatch']);
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

app2.controller('personCtrl', function ($scope,$http) {
//alert(window.location.pathname.replace(/^\//, ''));
   curr_page= window.location.pathname.replace(/^\//, '');
  page=localStorage.getItem(curr_page)
  if (page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }

    $scope.loaded=-1;
    $scope.addMoreItems =function(){
      var id=localStorage.getItem("userId");
      var email=localStorage.getItem("userEmail");
      var usertype = localStorage.getItem('userType');
       var priviledge = localStorage.getItem("priviligetype");
      last=99999999999
      if ( $scope.Contracts!==undefined && $scope.Contracts.length>0){
        lastkey= Object.keys($scope.Contracts).pop() ;
         last=$scope.Contracts[lastkey].contract_id;

      }
      $('#loader_img').show()
      data= {"action":"ContractList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last}
      $http.post(SERVICEURL2,  data )
          .success(function(responceData)  {
                    $('#loader_img').hide();
                    if(responceData.RESPONSECODE=='1') 			{
                      data=responceData.RESPONSE;
                      $scope.loaded=data.length
                      $http.post( LOG,  {r:"dopo caricamento",data:data})
                      angular.forEach(data,function(value,key) {
                        if (data[key].name !== null && data[key].name.length>0)
                            data[key].fullname=data[key].name
                        if (data[key].other_name !== null && data[key].other_name.length>0)
                          data[key].fullname=data[key].other_name
                      })
                      if (last==99999999999)
                        $scope.Contracts=data;
                      else
                        $scope.Contracts=$scope.Contracts.concat(data);
                      //$scope.Customers=data;
                     }
                     else   {
                        console.log('no customer')
                     }
           })
          .error(function() {
                   console.log("error");
           });


    }
   $scope.addMoreItems()
   $scope.tocontract = function(d){
     localstorage('view_contract.html',JSON.stringify({action:'view',location:curr_page}))
     localstorage("contract_id",d.contract_id);
     localstorage("customer_id",d.contractor_id);
     localstorage("Customertype",1);
     localstorage('Contract', JSON.stringify(d));
     redirect('view_contract.html')
    };
    $scope.add_contract = function(){
      localstorage('add_contract.html',JSON.stringify({action:'add_contract',location:curr_page}))
      redirect('add_contract.html')
     };
    $scope.back = function(d){
       redirect($scope.page.location)
         }


});
