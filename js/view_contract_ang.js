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
    if (localStorage.getItem('stack')!=null) {
      $scope.stack=JSON.parse(localStorage.getItem('stack'))
      $scope.lastkey= Object.keys($scope.stack).pop() ;
    }


    var id=localStorage.getItem("userId");
  	var email=localStorage.getItem("userEmail");
    var contract_id = localStorage.getItem("contract_id");
    data= {"action":"view_Contract_info",id:id,email:email,contract_id:contract_id}

    $http.post( SERVICEURL2,  data )
        .success(function(responceData) {
                  $('#loader_img').hide();
                  if(responceData.RESPONSECODE=='1') 			{
                    data=responceData.RESPONSE;
                    data.owner=data.fullname;
                   if (data.name !== null && data.name.length>0)
                      data.owner=data.name
                   if (data.other_name !== null && data.other_name.length>0)
                      data.owner=data.other_name
                      //data=convertDateStringsToDates(data)
                     $scope.Contract=data;

                   }
                   else
                   {
                     console.log('error');
                   }
         })
        .error(function() {
                 console.log("error");
         });
   $scope.risk_analisys = function(id){
      edit_risk_account(id)
  };
  $scope.edit_contract = function(){
    $scope.stack['view_contract.html']={}
    $scope.stack['view_contract.html'].action="edit"
    localstorage('stack',JSON.stringify($scope.stack))
    localstorage('Contract', JSON.stringify($scope.Contract));
    redirect('add_contract.html')
 };
  $scope.edit_profile = function(){
    $scope.stack['view_contract.html']={}
    $scope.stack['view_contract.html'].action="update_customer"
    localstorage('stack',JSON.stringify($scope.stack))
    localstorage("CustomerProfileId",$scope.Contract.contractor_id);
    redirect('add_customer.html')
 };
 $scope.edit_docu = function(){
	 $scope.stack['view_contract.html']={}
	 $scope.stack['view_contract.html'].action="list_from_view_contract"
	 localstorage('stack',JSON.stringify($scope.stack))
	 localstorage('Contract', JSON.stringify($scope.Contract));
	 redirect('my_document.html')
};
 $scope.edit_kyc = function(){
   $scope.stack['view_contract.html']={}
   $scope.stack['view_contract.html'].action="edit_kyc"
   localstorage('stack',JSON.stringify($scope.stack))
   localstorage('Contract',JSON.stringify($scope.Contract))
   redirect('kyc.html')
};

 $scope.back = function(d){
   back=$scope.lastkey
   delete $scope.stack[back]
   localstorage('stack',JSON.stringify($scope.stack))
   redirect(back)
 }
})
