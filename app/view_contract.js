app2.controller('view_contract', function ($scope,$http,$translate,$state,$rootScope) {
		$scope.main.Back=true
		$scope.main.Add=true
		$scope.main.AddPage="add_contract"
		$scope.main.action="add_contract"
		$scope.main.Search=false
		$scope.main.Sidebar=false
		$('.mdl-layout__drawer-button').hide()
	  $scope.main.viewName="Contratto"

	  $scope.curr_page="view_contract"
		page=localStorage.getItem($scope.curr_page)
	  if ( page!= null && page.length >0 ){
	    $scope.page=JSON.parse(page)
	    $scope.action=$scope.page.action

	  }
		$scope.main.location=$scope.page.location


		console.log('action'+$scope.action);
    var id=localStorage.getItem("userId");
  	var email=localStorage.getItem("userEmail");
    var contract_id = localStorage.getItem("contract_id");
    data= {"action":"view_Contract_info",id:id,email:email,contract_id:contract_id}
		$scope.loader=true;
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
										 $scope.main.viewName="Contratto " + $scope.Contract.CPU
										 $scope.loader=false;

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
		localstorage('add_contract',JSON.stringify({action:'edit',location:'view_contract'}))
    localstorage('Contract', JSON.stringify($scope.Contract));
    $state.go('add_contract')
 };
  $scope.edit_profile = function(){
		localstorage('add_customer',JSON.stringify({action:'update_customer',location:'view_contract'}))
    localstorage("CustomerProfileId",$scope.Contract.contractor_id);
    $state.go('add_customer')
 };
 $scope.edit_docu = function(){
	 localstorage('my_document',JSON.stringify({action:'list_from_view_contract',location:'view_contract'}))
	 localstorage('Contract', JSON.stringify($scope.Contract));
	 $state.go('my_document')
};
 $scope.edit_kyc = function(){
	 localstorage('kycstep01',JSON.stringify({action:'edit_kyc',location:'view_contract'}))
   localstorage('Contract',JSON.stringify($scope.Contract))
   $state.go('kycstep01')
};
$scope.edit_risk = function(){
	localstorage('risk_profile01',JSON.stringify({action:'',location:'view_contract'}))
	localstorage('Contract',JSON.stringify($scope.Contract))
	$state.go('risk_profile01')
};
$scope.print_kyc = function(){
	localstorage('contract_form',JSON.stringify({action:'',location:'view_contract'}))
	localstorage('Contract',JSON.stringify($scope.Contract))
	$state.go('contract_form')
};
$scope.owners = function(){
	localstorage('owners_list',JSON.stringify({action:'owner_from_contract',location:'view_contract'}))
	localstorage('Contract',JSON.stringify($scope.Contract))
	$state.go('owners_list')
};
$scope.add_contract = function(){
	localstorage('add_contract',JSON.stringify({action:'add_contract',location:$scope.curr_page}))
	$state.go('add_contract')
};

 $scope.back = function(d){
       $state.go($scope.page.location)
 }
 $scope.$on('backButton', function(e) {
		 $scope.back()
 });

 $scope.$on('addButton', function(e) {
	 $scope.add_contract()
 })

})
