app2.controller('view_contract', function ($scope,$http,$translate,$state,$rootScope,$timeout) {
		$scope.main.Back=true
		$scope.main.Add=true
		$scope.main.AddPage="add_contract"
		$scope.main.action="add_contract"
		$scope.main.Search=false
		$scope.main.Sidebar=false
		$('.mdl-layout__drawer-button').hide()
	  $scope.main.viewName="Contratto"
		$scope.main.loader=true
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
    data= {"action":"view_Contract_info",id:id,email:email,contract_id:contract_id,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
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
										 if (responceData.RESPONSECODE=='-1'){
						           localstorage('msg','Sessione Scaduta ');
						           $state.go('login');;;
						         }

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
$scope.print_kyc=function(){
	url=BASEURL + 'pdfgeneration/kyc.php?id='+$scope.Contract.contract_id+"&agent="+ $scope.agent.id+"&cookie="+$scope.agent.cookie
	if ($scope.main.web){
			$http.get(url, {
					responseType: "arraybuffer"
				})
				.success(function(data) {
					var anchor = angular.element('<a/>');
					var blob = new Blob([data]);
					anchor.attr({
						href: window.URL.createObjectURL(blob),
						target: '_blank',
						download: 'kyc'+$scope.Contract.contract_id+ "-"+$scope.agent.id+".pdf"
					})[0].click();
				})

	}
	else {
		var fileTransfer = new FileTransfer();
	    var uri = encodeURI(url);

	    fileTransfer.download(
	          uri,
	          fileSystem.root.fullPath+"/download/MyPdf.pdf",
	          function(entry) {
							cordova.plugins.SitewaertsDocumentViewer.viewDocument(
							    fileSystem.root.fullPath+"/download/MyPdf.pdf", 'application/pdf');

	            console.log("download complete: " + entry.fullPath);
	          },
	          function(error) {
	                console.log("download error source " + error.source);
	                console.log("download error target " + error.target);
	                console.log("upload error code" + error.code);
	          }
	      );

	}

}

$scope.print_risk=function(){
	url=BASEURL + 'pdfgeneration/risk.php?id='+$scope.Contract.contract_id+"&agent="+ $scope.agent.id+"&cookie="+$scope.agent.cookie
	if ($scope.main.web){
			$http.get(url, {
					responseType: "arraybuffer"
				})
				.success(function(data) {
					var anchor = angular.element('<a/>');
					var blob = new Blob([data]);
					anchor.attr({
						href: window.URL.createObjectURL(blob),
						target: '_blank',
						download: 'kyc'+$scope.Contract.contract_id+ "-"+$scope.agent.id+".pdf"
					})[0].click();
				})

	}
	else {
		var fileTransfer = new FileTransfer();
	    var uri = encodeURI(url);

	    fileTransfer.download(
	          uri,
	          fileSystem.root.fullPath+"/download/MyPdf.pdf",
	          function(entry) {
							cordova.plugins.SitewaertsDocumentViewer.viewDocument(
							    fileSystem.root.fullPath+"/download/MyPdf.pdf", 'application/pdf');

	            console.log("download complete: " + entry.fullPath);
	          },
	          function(error) {
	                console.log("download error source " + error.source);
	                console.log("download error target " + error.target);
	                console.log("upload error code" + error.code);
	          }
	      );

	}

}
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
 $scope.$on('$viewContentLoaded',
					function(event){
						$timeout(function() {
							$('input.mdl-textfield__input').each(
								function(index){
									$(this).parent('div.mdl-textfield').addClass('is-dirty');
									$(this).parent('div.mdl-textfield').removeClass('is-invalid');
								})
							$scope.main.loader=false
					 }, 5);
 });

})
