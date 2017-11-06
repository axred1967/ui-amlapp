app2.controller('add_owners', function ($scope,$http,$state,$translate,$timeout,$interval,$stateParams,AutoComplete,$filter) {
  /* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]
	if ($scope.page.location.substr(0,3)=='kyc')
		$scope.searchKyc=true;

  $scope.main.loader=true
  $scope.main.Back=true
  $scope.main.Add=false
	//$scope.main.AddPage="add_document"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $scope.main.viewName="Nuovo TE"
	$scope.add_customer=false
	$scope.findPerson="Cerca Titolare Effettivo"
  $scope.word={};
  $scope.Owner={}
	$scope.Customer={}
	$scope.settings={}
  //localstorage("back","view_contract");
		switch ($scope.page.action){
    case 'edit_owners' :
	    $scope.Owner=$scope.page.Owner
			//convertDateStringsToDates($scope.Owner)
			$scope.Customer=angular.extend({},$scope.Owner)
	    $scope.action='edit_owners'
	    $scope.main.viewName="Modifica TE"
			$scope.pages['add_customer']={action:'update_customer', user_id:$scope.Owner.user_id,location:$state.current.name,temp:null}
	    localstorage('pages',JSON.stringify($scope.pages))
			$scope.add_edit="Modifica i dati del Titolare Effettivo"
	    break;
    case 'edit_owner_from_contract' :
	    $scope.Owner=$scope.page.Owner
			$scope.Customer=angular.extend({},$scope.Owner)
	    $scope.Contract=$scope.page.Contract
	    $scope.action='edit_owners'
	    $scope.main.viewName="Modifica TE"
	    $scope.page.type="owners"
			$scope.add_edit="Modifica i dati del Titolare Effettivo"
	    break;
    case 'edit_customer_for_kyc_owner' :
	    $scope.Owner=$scope.page.Owner
			$scope.Customer=angular.extend({},$scope.Owner)
	    $scope.Contract=$scope.page.Contract
	    $scope.main.viewName="Modifica TE"
			$scope.add_edit="Modifica i dati del Titolare Effettivo"
			$scope.findPerson="Cerca il titolare effettivo fra i clienti censiti"
			$scope.add_customer=true
    	break;
			case 'edit_customer_for_kyc_role' :
//				$scope.page.type=""
		    $scope.Owner=$scope.page.Owner
				$scope.Customer=angular.extend({},$scope.Owner)
		    $scope.Contract=$scope.page.Contract
		    $scope.main.viewName="Modifica Dati Ruolo"
				$scope.add_edit="Modifica i dati della persona che esercita il ruolo"
				$scope.findPerson="Cerca la persona che detentrice del ruolo"
				$scope.add_customer=true
	    	break;

				case 'edit_role' :
		//				$scope.page.type=""
					$scope.Owner=$scope.page.Owner
					$scope.Customer=angular.extend({},$scope.Owner)
					$scope.Contract=$scope.page.Contract
					$scope.findPerson="Cerca la persona che detentrice del ruolo"
					$scope.main.viewName="Modifica Ruolo Sociale"
					$scope.add_edit="Modifica i dati della persona che esercita il ruolo"
					$scope.add_customer=true
					break;
					case 'add_role' :
						$scope.settings.action="add"
				    $scope.Owner={}
			//			$scope.page.type="owners"
				    $scope.main.viewName="Nuovo Ruolo Sociale"
						$scope.findPerson="Cerca la persona che detentrice del ruolo"
				    $scope.Owner.company_id=$scope.page.company_id
						$scope.Owner.tipo="ROLE"
						$scope.add_edit="Inserisci i dati della persona che esercita il ruolo"

				    break;
						case 'add_customer_for_kyc_role' :
							$scope.settings.action="add"
					    $scope.Owner={}
				//			$scope.page.type="owners"
					    $scope.main.viewName="Nuovo Ruolo Sociale"
							$scope.findPerson="Cerca la persona che detentrice del ruolo"
					    $scope.Owner.company_id=$scope.page.company_id
							$scope.Owner.tipo="ROLE"
							$scope.add_edit="Inserisci i dati della persona che esercita il ruolo"

					    break;

	    case 'add_customer_for_kyc_owner' :
				$scope.settings.action="add"
		    $scope.Owner={}
		    $scope.main.viewName="Nuovo TE"
		    $scope.Owner.company_id=$scope.page.company_id
				$scope.findPerson="Cerca il titolare effettivo fra i clienti censiti"
				$scope.add_edit="Inserisci i dati del Titolare Effettivo"
		    break;
    case 'add_owner_from_contract' :
			$scope.settings.action="add"
	    $scope.Owner={}
	    $scope.Contract=$scope.page.Contract
	    $scope.action='add_owners'
	    $scope.main.viewName="Nuovo TE"
	    $scope.Owner.company_id=$scope.Contract.company_id
	    $scope.Owner.contract_id=$scope.Contract.contract_id
			$scope.add_edit="Inserisci i dati del Titolare Effettivo"
    break;
    default :
	    if($scope.page.load!==undefined && $scope.page.load)
			$scope.settings.action="add"
	    $scope.main.viewName="Nuovo TE"
	    $scope.action='add_owners'
	    $scope.Owner.company_id=$scope.page.company_id
			$scope.Owner.user_type=3
			$scope.Owner.password=Math.random().toString(36).slice(-8)
			$scope.add_edit="Inserisci i dati del Titolare Effettivo"
			$scope.Owner.company_id=$scope.page.company_id
	    break;
  }


  $scope.showContractorList=function(){
    if ((typeof $scope.Owner.fullname !== "undefined" && $scope.oldContrator!=$scope.Owner.fullname)){
     data={ "action":"ACCustomerList", name:$scope.Owner.fullname,kyc:$scope.searchKyc,pInfo:$scope.agent.pInfo}
      $http.post( SERVICEURL2,  data )
      .then(function(data) {
        if(data.data.RESPONSECODE=='1') 			{
          $scope.list=data.data.RESPONSE;
        }
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
      })
      , (function() {
        console.log("error");
      });
    }
    $scope.oldContrator=$scope.searchContractor
  }
  $scope.addContractorItem=function(id, name){
    $scope.list=[];
    $scope.Owner.fullname=name;
    $scope.Owner.user_id=id;
		$scope.loadItem()
  };
  $scope.add_owner=function(){
		if ($scope.form.$invalid) {
			var errof=''
	    angular.forEach($scope.form.$error, function(field) {
	      angular.forEach(field, function(errorField) {
	        errorField.$setTouched();
					errof+=" " +errorField.$name
	      })
	    });
	  } else {
	    //$scope.formStatus = "Form is valid.";
	    console.log("Form is valid.");
	    console.log($scope.data);
	  }



    dbData=angular.extend($scope.Owner,$scope.Customer)
		if ($scope.page.type=='owners' ){
			appData=$scope.Contract
		}
		else {
			var  appData ={
				id :$scope.agent.id,
				usertype: $scope.agent.user_type
			}

		}
		dbData.agent_id=$scope.agent.id
		if ($scope.page.other_data && dbData.state!==undefined){
			dbData.state.kyc=true
		}
		if ($scope.page.action=="add_customer_for_kyc_owner" || $scope.page.action=="edit_customer_for_kyc_owner" || $scope.page.action=="add_customer_for_kyc_role" || $scope.page.action=="edit_customer_for_kyc_role"){
			$scope.pages[$scope.page.location].newOb={}
			$scope.pages[$scope.page.location].newOb=dbData
			if ($scope.pages[$scope.page.location].newOb.state===undefined || $scope.pages[$scope.page.location].newOb.state===null )
				$scope.pages[$scope.page.location].newOb.state={}
			$scope.pages[$scope.page.location].newOb.state.kyc=true
			$scope.pages[$scope.page.location].edit=$scope.page.edit
			$scope.pages[$scope.page.location].indice=$scope.page.indice
			$scope.back()
	    return;
		}

		if ($scope.action=="add_owners" ){
			if (!$scope.add_customer){
				$scope.settings.action="add"
				$scope.settings.table="company_owners"
				$scope.settings.id="id"
				$scope.Owner.agency_id=$scope.agent.agency_id
			}
			else{
				$scope.Owner.agency_id=$scope.agent.agency_id
				$scope.settings.action="add"
				$scope.settings.other_table=[]
		    $scope.settings.other_table[0]={}
		    $scope.settings.other_table[0].table="users"
		    $scope.settings.other_table[0].id="user_id"
				$scope.settings.table="company_owners"
				$scope.settings.id="id"
			}
		} else {
			$scope.settings.other_table=[]
	    $scope.settings.other_table[0]={}
	    $scope.settings.other_table[0].table="users"
	    $scope.settings.other_table[0].id="user_id"
			$scope.settings.table="company_owners"
			$scope.settings.id="id"

		}


    $scope.loader=true
    data={"action":"saveOb",settings:$scope.settings,dbData:dbData,pInfo:$scope.agent.pInfo}
		$scope.main.loader=true
    $http.post(SERVICEURL2,data)
    .then(function(data){
      if(data.data.RESPONSECODE=='1')
      {
        //swal("",data.data.RESPONSE);
        $scope.back()

      }
      else      {
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
				$scope.main.loader=false
        swal("",data.data.RESPONSE);
      }
    })
    , (function(){
			$scope.main.loader=false
      console.log('error');
    })
  }
  $scope.back=function(){
    switch($scope.page.action){
      case'edit_customer_for_kyc_owner':
				$scope.pages[$scope.page.location].edit=true
				$scope.pages[$scope.page.location].Owner=$scope.Owner
			break;
			case'add_customer_for_kyc_owner':

      break;

    }
    //       windows.histoery.back()
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go($scope.page.location,{pages:$scope.pages})
  }

  $scope.new_customer=function(){
    $scope.add_customer=true;
		$scope.Customer={};
  }
  $scope.$on('backButton', function(e) {
    $scope.back()
  });

  $scope.$on('addButton', function(e) {

  })
  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
							 setDefaults($scope)
               $scope.main.loader=false
            }, 15);
  });

// gestisco i dati complessivi del Cliente


$scope.loadItem=function(){
	data={"action":"view_Customer_Profile_info",customer_id:$scope.Owner.user_id,kyc:$scope.searchKyc,pInfo:$scope.agent.pInfo}
	$scope.main.loader=true
	$http.post( SERVICEURL2,  data )
	.then(function(responceData) {
		$scope.main.loader=false
		if(responceData.data.RESPONSECODE=='1') 			{
			var data=responceData.data.RESPONSE;
			$.each(data, function(key, value){
				if (value === null){
					delete data[key];
				}
			});

			$scope.Customer =  data;
			$scope.Customer.IMAGEURI=UPLOADSURL +"user/small/"
			//$rootScope.$broadcast('show')
			$scope.loader=false
			$scope.Customer.Docs=IsJsonString($scope.Customer.Docs)
			if (!isObject($scope.Customer.Docs)){
					$scope.Customer.Docs=[{}]
					$scope.newDocs=true;

			}
			//convertDateStringsToDates($scope.Customer)
			setDefaults($scope)

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
$scope.showAC=function($search,$word, settings){
	settings.pInfo=$scope.agent.pInfo
	AutoComplete.showAC($search,$word, settings)
		.then(function(data) {
			if(data.data.RESPONSECODE=='1') 			{
				//$word=$($search.currentTarget).attr('id');
				$search=res[1]
				$scope.word[$search]=data.data.RESPONSE;
			}
		 if (data.data.RESPONSECODE=='-1'){
				localstorage('msg','Sessione Scaduta ');
				$state.go('login');;;
		 }
		})
		, (function() {
			console.log("error");
		});
}
$scope.resetAC=function(){
	$scope.word={}
	$scope.list={}
	$scope.listOther={}
	$scope.listCompany={}


}
$scope.addWord=function($search,$word,par){
	res = $search.split(".")
	switch(res.length){
		case 2:
		$scope[res[0]][res[1]]=$word
		$scope.word[res[1]]=[]
		break;
		case 3:
		$scope[res[0]][res[1]][res[2]]=$word
		$scope.word[res[2]]=[]
		break;

	}
	if (par.id!==undefined){
		$('#'+par.id).parent('div.mdl-textfield').addClass('is-dirty');
		$('#'+par.id).parent('div.mdl-textfield').addClass('ng-touched');
		$('#'+par.id).parent('div.mdl-textfield').removeClass('is-invalid');

	}

	if (par.countries){
		$scope.word['countries']=[]
	}
}




$scope.setEov=function(){
		oggi=new Date()
		if ($scope.Customer!==undefined && $scope.Customer.id_release_date!==undefined && ( $scope.Contract.id_validity===null)) {
			Object.assign(oggi,$scope.Customer.id_release_date)
			oggi.setFullYear(oggi.getFullYear()+5)
			$scope.Contract.id_validity=oggi
		}

	
}
$scope.other=function(){
  if($scope.page.other_data)
  $scope.page.other_data=false
  else
  $scope.page.other_data=true
  $scope.arrow=($scope.page.other_data!== undefined || $scope.page.other_data) ? 'arrow_drop_up' : 'arrow_drop_down';

}
$scope.$on('$viewContentLoaded',
function(event){
	$timeout(function() {
			setDefaults($scope)
			$scope.main.loader=false
			//nascondo menu
			$('.mdl-layout__drawer-button').hide()
		}, 100);
	});

}
)
