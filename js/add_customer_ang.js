var app2 = angular.module('myApp',['pascalprecht.translate','fieldMatch']);
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
// create angular controller

app2.filter('capitalize', function() {
  return function(input, $scope) {
      if ( input !==undefined && input.length>0)
      return input.substring(0,1).toUpperCase()+input.substring(1);
      else
      return input

}
});

app2.controller('personCtrl', function ($scope,$http,$translate) {
    $scope.Customer={}
/*    $scope.Customer.name=" "
    $scope.Customer.surname=" "
    $scope.Customer.email="x "
    $scope.Customer.mobile= " "
*/
	$scope.page={}

	page=localStorage.getItem('add_customer.html')
	if ( page!= null && page.length >0 ){
		$scope.page=JSON.parse(page)
		$scope.action=$scope.page.action

	}
	    switch ($scope.stack[$scope.lastkey].action){
        case 'add_customer':
            $scope.viewName="Inserisci Cliente"
            $scope.action="addcustomer"
            break;
        case 'update_customer':
          var id=localStorage.getItem("CustomerProfileId");
        	var email=localStorage.getItem("userEmail");
          data= {"action":"view_Customer_Profile_info",customer_id:id,email:email}


          $http.post( SERVICEURL2,  data )
              .success(function(responceData) {
                        $('#loader_img').hide();
                        if(responceData.RESPONSECODE=='1') 			{
                          data=responceData.RESPONSE;
                          $scope.Customer =  data;
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
               });            $scope.viewName="Modifica Cliente"
            $scope.action="saveProfileCustomer"
            break;
        case 'add_customer_for_owners':
                $scope.viewName="Inserisci Titolare Effettivo"
                $scope.action="addcustomer"
                break;
        default:
            $scope.viewName="Inserisci Cliente"


    }

    $scope.add_customer= function (){
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
      lang=localStorage.getItem('language');
    	var usertype = localStorage.getItem('userType');
        $('#loader_img').show();
        data={ "action":$scope.action, id:id,email:email,usertype:usertype,lang:lang, dbData: $scope.Customer}
        $http.post( SERVICEURL2,  data )
            .success(function(data) {
                      $('#loader_img').hide();
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
    }
		redirect($scope.page.location)

  }
})
