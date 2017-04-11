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



 switch ($scope.action){
      default:
          var id=localStorage.getItem("CustomerProfileId");
        	var email=localStorage.getItem("userEmail");
          $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
          data= {"action":"viewkyc",contract_id:$scope.Contract.contract_id}
          $http.post( SERVICEURL2,  data )
              .success(function(responceData) {
                        $('#loader_img').hide();
                        if(responceData.RESPONSECODE=='1') 			{
                           data=responceData.RESPONSE;
                           $scope.Kyc=data;
                           angular.forEach($scope.Contract, function(value, key) {
                             if (!value.length>0 && $scope.Kyc[key].length>0 )
                              $scop.kyc[key]=$scope.Customer[key]

                            })
                         }
                         else
                         {
                           console.log('error');
                         }
               })
              .error(function() {
                       console.log("error");
               });

            $scope.action="saveKyc"
            $scope.viewName="Informazioni personali"


    }
    $scope.save_kyc= function (passo){
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

      var langfileloginchk = localStorage.getItem("language");



      dbData=$scope.Kyc


      $('#loader_img').show();
      data={ "action":$scope.action, contract_id:$scope.Contract.contract_id, dbData: $scope.Kyc,lang:langfileloginchk}
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        $('#loader_img').hide();
        if(data.RESPONSECODE=='1') 			{
          swal("",data.RESPONSE);
          $scope.lastid=data.lastid
          $scope.back(passo)

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


  $scope.back=function(passo){
    back=$scope.lastkey
    action=$scope.stack[back].action
    delete $scope.stack[back]
    switch (passo){
      case 1:
          break;
      case 2:
          $scope.stack['view_contract.html']={}
          $scope.stack['view_contract.html'].action="edit_kyc"
          localstorage('stack',JSON.stringify($scope.stack))
          redirect('kycstep02.html')
          return
          break;

      default:

    }

    localstorage('stack',JSON.stringify($scope.stack))
    redirect(back)
  }
})
