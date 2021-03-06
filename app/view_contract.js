app2.controller('view_contract', function ($scope,$http,$translate,$state,$rootScope,$timeout,$stateParams,$filter) {
	/* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]
	if ($scope.page===undefined || $scope.page.Contract===undefined){
 	 $state.go('home');
  }
	$scope.Contract=$scope.page.Contract
	$scope.main.viewName=$filter('translate')('Scheda Contratto')

	$scope.main.Back=true
	$scope.main.Add=true
	$scope.main.AddPage="add_contract"
	$scope.main.AddLabel="Nuova AV"
	$scope.main.action="add_contract"
	$scope.main.Search=false
	$scope.main.Sidebar=false
	$scope.main.loader=true
	$scope.curr_page="view_contract"
  $scope.Contract=$scope.page.Contract
	$scope.main.state=$state.current.name
	if($scope.Contract===undefined){
		swal({
			title: $filter('translate')("Problema"),
			text: $filter('translate')("la APP non riesce a caridare i dati del Contratto, ritorna alla home!"),
			icon: "error",
			buttons: {
			'procedi':{text:$filter('translate')('Procedi'),value:true},

			},

		})
		.then((Value) => {
			if (Value) {
				$scope.back()
			}
		})
	}

	$scope.loadItem=function(){

		data= {"action":"view_Contract_info",contract_id:$scope.pages.currentObId,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
		$scope.loader=true;
		$http.post( SERVICEURL2,  data )
		.then(function(responceData) {
			$('#loader_img').hide();
			if(responceData.data.RESPONSECODE=='1') 			{
				var data=responceData.data.RESPONSE;
				if (data.firmatario===undefined || data.firmatario==null || data.firmatario.trim().length==0){
					data.firmatario=data.fullname
				}
				data.fullname=data.firmatario
				data.Owner=data.firmatario
				data.contractor_name=data.firmatario
				if (data.act_for_other==1){
					if (data.owner===undefined || data.owner==null || data.owner.trim().length==0){
						data.owner=data.name
					}
					data.fullname=data.owner
					data.Owner=data.owner
				}
				if (data.act_for_other==2){
					if (data.owner===undefined || data.owner==null || data.owner.trim().length==0){
						data.owner=data.other_name
					}
					data.fullname=data.owner
					data.Owner=data.owner
				}

        data.kyc_update=IsJsonString(data.kyc_update)
				data.risk_update=IsJsonString(data.risk_update)
				$scope.Contract=data;
				$scope.pages[$state.current.name].Contract=$scope.Contract

				$scope.loader=false;

			}
			else
			{
				if (responceData.data.RESPONSECODE=='-1'){
					localstorage('msg','Sessione Scaduta ');
					$state.go('login');;;
				}

				console.log('error');
			}
		})
		, (function() {
			console.log("error");
		});

	}
	$scope.loadItem()
	$scope.risk_analisys = function(id){
		edit_risk_account(id)
	};
	$scope.edit_contract = function(){
		$scope.pages['add_contract']={action:'edit', location:$state.current.name,prev_page:$state.current.name,temp:$scope.Contract,view:true}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_contract',{pages:$scope.pages})
	};
	$scope.edit_profile = function(){
		$scope.pages['kyc_contractor.01']={action:'', user_id:$scope.Contract.contractor_id,location:$state.current.name,temp:null,view:true}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('kyc_contractor.01',{pages:$scope.pages})
	};
	$scope.be = function(){
		$scope.pages['add_customer']={action:'update_customer', user_id:$scope.Contract.other_id,location:$state.current.name,temp:null}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_customer',{pages:$scope.pages})
	};
	$scope.edit_docu = function(){
		$scope.pages['kyc_document']={action:'', user_id:$scope.Contract.contractor_id,location:$state.current.name,Contract:$scope.Contract,view:true}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('kyc_document',{pages:$scope.pages})
	};
	$scope.edit_kyc = function(){
		$scope.pages['kyc_contractor.01']={action:'edit_kyc', passo:1, user_id:$scope.Contract.contractor_id,location:$state.current.name,Contract:$scope.Contract}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('kyc_contractor.01',{pages:$scope.pages})
	};
	$scope.agg_kyc = function(){
		$scope.pages['agg_kyc']={action:'',location:$state.current.name,Contract:$scope.Contract}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('agg_kyc',{pages:$scope.pages})
	};
	$scope.owners = function(){

		$scope.pages['kyc_owners']={action:'', company_id:$scope.Contract.company_id,location:$state.current.name,Contract:$scope.Contract,view:true}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('kyc_owners',{pages:$scope.pages})
	};
	$scope.role = function(){
		$scope.pages['kyc_role']={action:'', company_id:$scope.Contract.company_id,location:$state.current.name,Contract:$scope.Contract,view:true}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('kyc_role',{pages:$scope.pages})
	};
	$scope.edit_company = function(){
		$scope.pages['kyc_company']={action:'', user_id:$scope.Contract.contractor_id,location:$state.current.name,
		company_id:$scope.Contract.company_id,Contract:$scope.Contract, view:true}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('kyc_company',{pages:$scope.pages})
	};
	$scope.add_contract = function(){
		pages={'kyc_contractor.01':{action:'add_contract', location:$state.current.name},currentOb:'contract'}
		localstorage('pages',JSON.stringify(pages))
		$state.go('kyc_contractor.01',{pages:pages})
		//localstorage('add_contract',JSON.stringify({action:'add_contract',location:$scope.curr_page}))
		/*
		$scope.pages['add_contract']={action:'add_contract', location:'home',temp:null}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_contract',{pages:$scope.pages})
		*/
	};

	$scope.edit_risk = function(){
		if ($scope.agent.settings.risk_type==1){
			$scope.pages['risk_profile01_sm']={action:'', location:$state.current.name,temp:null,Contract:$scope.Contract}
			localstorage('pages',JSON.stringify($scope.pages))
			$state.go('risk_profile01_sm',{pages:$scope.pages})
			return
		}
		if ($scope.agent.settings.risk_type==2){
			$scope.pages['risk_profile01_4d']={action:'', location:$state.current.name,temp:null,Contract:$scope.Contract}
			localstorage('pages',JSON.stringify($scope.pages))
			$state.go('risk_profile01_4d',{pages:$scope.pages})
			return
		}
		else{
			$scope.pages['risk_profile01']={action:'', location:$state.current.name,temp:null,Contract:$scope.Contract}
			localstorage('pages',JSON.stringify($scope.pages))
			$state.go('risk_profile01',{pages:$scope.pages})
		}
	};
	$scope.agg_risk = function(){
		$scope.pages['agg_risk']={action:'',location:$state.current.name,Contract:$scope.Contract}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('agg_risk',{pages:$scope.pages})
	};
	$scope.print_kyc=function(){
		url=PDFURL +'kyc.php?id='+$scope.Contract.contract_id+"&download=Y"+$scope.agent.pInfoUrl
		if ($scope.main.web){


				var anchor = angular.element('<a/>');
				angular.element(document.body).append(anchor);
				var ev = document.createEvent("MouseEvents");
				ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				anchor.attr({
					href: url,
					target: '_blank',
					download: 'kyc'+$scope.Contract.contract_id+ '-'+$scope.agent.id+'.pdf'
				})[0].dispatchEvent(ev);

		}
		else {
			var fileTransfer = new FileTransfer();
	//		var uri = encodeURI(url);
	  		var uri = url;

			fileTransfer.download(
				uri,
				cordova.file.externalApplicationStorageDirectory+'download/MyPdf.pdf',
				function(entry) {
					cordova.plugins.SitewaertsDocumentViewer.viewDocument(
						cordova.file.externalApplicationStorageDirectory+'download/MyPdf.pdf', 'application/pdf');

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
			url=PDFURL +'risk.php?id='+$scope.Contract.contract_id+$scope.agent.pInfoUrl
			if ($scope.main.web){
				var anchor = angular.element('<a/>');
				angular.element(document.body).append(anchor);
				var ev = document.createEvent("MouseEvents");
				ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				anchor.attr({
					href: url,
					target: '_blank',
					download: 'Risk'+$scope.Contract.contract_id+ '-'+$scope.agent.id+'.pdf'
				})[0].dispatchEvent(ev);

			}
			else {
				var fileTransfer = new FileTransfer();
//				var uri = encodeURI(url);
	  			var uri = url;

				fileTransfer.download(
					uri,
					cordova.file.externalApplicationStorageDirectory+'download/MyPdf.pdf',
					function(entry) {
						cordova.plugins.SitewaertsDocumentViewer.viewDocument(
							cordova.file.externalApplicationStorageDirectory+'download/MyPdf.pdf', 'application/pdf');

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
						setDefaults($scope)
						$scope.main.loader=false
						//nascondo menu
						$('.mdl-layout__drawer-button').hide()
					}, 100);
				});
			})
