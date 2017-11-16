app2.controller('add_contract', function ($scope,$http,$translate,$rootScope,$timeout,$state,$timeout,AutoComplete,$stateParams,$interval) {
	//gestisco lo state parameter
	  $scope.curr_page=$state.current.name
	  $scope.pages=$stateParams.pages
		if ($scope.pages===null || $scope.pages===undefined){
			$scope.pages=JSON.parse(localStorage.getItem('pages'));
		}
		$scope.page=$scope.pages[$state.current.name]

		//console.log($scope.agent)
		$scope.main.Back=true
		$scope.main.Add=false
//		$scope.main.AddPage="add_contract"
		$scope.main.Search=false
		$scope.main.Sidebar=false
	  $scope.main.viewName="Nuovo  Contratto"
    $scope.main.loader=true
		$scope.aggKyc=false;
		$scope.showContOcc=true
		$scope.agentList=getAgentList($scope.agentListI,$scope.agent)

// memorizzo i dati
		$interval(function(){
			if ($scope.Contract!==undefined && $scope.pages[$state.current.name]!==undefined){
				$scope.pages[$state.current.name].temp=$scope.Contract
				localstorage('pages',JSON.stringify($scope.pages))

			}

		},3000)

		 $scope.word={};

     //localstorage("back","view_contract");
     switch ($scope.page.action){
       case 'edit' :
       $scope.action='edit'

       $scope.main.viewName="Modifica Contratto"
       break;

       case 'add_contract' :
       $scope.action='add'
       $scope.main.viewName="Nuovo Contratto"
       $scope.Contract={}
       break;
			 case 'add_contract_kyc' :
       $scope.action='edit'
			 $scope.mode="kyc"
       $scope.main.viewName="Adeguata Verifica"
       $scope.Contract=$scope.page.Contract
       break;
       default :
       $scope.main.viewName="Nuovo Contratto"
       $scope.action='add'
       break;
     }

		 if ($scope.page.temp!==undefined && $scope.page.temp!==null){
			 $scope.Contract=$scope.page.temp
			 setDefaults($scope)
			 ////convertDateStringsToDates($scope.Contract)
		 }
		 if ($scope.agent.tipo_cliente.toLowerCase()=='agenzia assicurazioni'){
 			$scope.showContOcc=false
			$scope.Contract.tipo_contratto=0


 		}
		 switch($scope.Contract.act_for_other){
			 case "1":
			 $scope.Contract.company_id= $scope.Contract.other_id
			 break;
			 case "2":
			 $scope.Contract.user_id= $scope.Contract.other_id
			 break;
		 }
		 $scope.setEoC=function(){
			 oggi=new Date()
			 if ($scope.Contract!==undefined &&    $scope.Contract.contract_date!==undefined &&    $scope.Contract.contract_date!==null && ( scope.Contract.contract_eov===undefined || $scope.Contract.contract_eov===null)) {
				 Object.assign(oggi,$scope.Contract.contract_date)
		     oggi.setFullYear(oggi.getFullYear()+10)
		     $scope.Contract.contract_eov=oggi
			 }

	   }


		 $scope.changeProcura=function(){
			 if ($scope.Contract.procura){
				 $scope.$broadcast('procuratore')
			 }
		 }

		 $scope.showContractorList=function(){
       if (( $scope.oldContrator!=$scope.Contract.contractor_name)){

        data={ "action":"ACCustomerList", name:$scope.Contract.contractor_name,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
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
     $scope.showCompanyList=function(){
       if (( $scope.oldCompany!=$scope.Contract.owner)){

        data={ "action":"ACCompanyList", name:$scope.Contract.owner,pInfo:$scope.agent.pInfo}
         $http.post( SERVICEURL2,  data )
         .then(function(data) {
           if(data.data.RESPONSECODE=='1') 			{
             $scope.listCompany=data.data.RESPONSE;
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
       $scope.oldCompany=$scope.searchCompany;
     }
     $scope.showOtherList=function(){
       if ((   $scope.Contract.other_name!=$scope.oldOther)){
        data={ "action":"ACCustomerList", name:$scope.Contract.other_name,pInfo:$scope.agent.pInfo}
         $http.post( SERVICEURL2,  data )
         .then(function(data) {
           if(data.data.RESPONSECODE=='1') 			{
             $scope.listOther=data.data.RESPONSE;
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
       $scope.oldOther=$scope.searchOther
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

     $scope.addContractorItem=function(id, name){
       $scope.list=[];
       $scope.Contract.contractor_name=name;
       $scope.Contract.contractor_id=id;
     };
     $scope.addCompanyItem=function(company){
       $scope.listCompany=[];
       $scope.Contract.owner=company.owner;
       $scope.Contract.company_id=company.company_id;
     };
     $scope.addOtherItem=function(other){
       $scope.listOther=[];
       $scope.Contract.other_name=other.fullname;
       $scope.Contract.user_id=other.user_id;
     };




  $scope.add_contract=function(passo){
		event.preventDefault()
    //       add_contract($scope.action);
    var langfileloginchk = localStorage.getItem("language");
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
      //console.log($scope.data);
    }

    var  appData ={
      id :localStorage.getItem("userId"),
      usertype: localStorage.getItem('userType')
    }
    // aggiorno il campo blog per contenere Json

    dbData=$scope.Contract
    // metto i documenti in json
    //dbData.Docs=JSON.parse($scope.Contract.Docs)
    switch(dbData.act_for_other){
      case "1":
      dbData.other_id= $scope.Contract.company_id
      break;
      case "2":
      dbData.other_id= $scope.Contract.user_id
      break;
    }


    $scope.main.loader=true
   data={"action":"addcontract",appData:appData,dbData:dbData,aggKyc:$scope.aggKyc,edit:$scope.action,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post(SERVICEURL2,data)
    .then(function(data){
      $('#loader_img').hide();
      if(data.data.RESPONSECODE=='1')
      {
        $scope.contract=[]
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.data.lastid
				if ($scope.Contract.CPU=='in preparazione'){
					$scope.Contract.CPU=data.data.CPU
				}

        $scope.back(passo)

      }
      else      {
				$scope.main.loader=false
		if (data.data.RESPONSECODE=='-1'){
		   localstorage('msg','Sessione Scaduta ');
		   $state.go('login');;;
		}

        swal("",data.data.RESPONSE);
      }
    })
    , (function(){
			$scope.main.loader=false
      console.log('error');
    })
  }


  $scope.add_customer=function(){
		$scope.pages['add_customer']={action:'add_customer_for_contract', location:$state.current.name,temp:null}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_customer',{pages:$scope.pages})

  }
  $scope.add_company=function(){

		$scope.pages['add_company']={action:'add_company_for_contract', location:$state.current.name,temp:null}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_company',{pages:$scope.pages})

  }
  $scope.add_other=function(){
		$scope.pages['add_customer']={action:'add_other_for_contract', location:$state.current.name,temp:null}
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_customer',{pages:$scope.pages})

  }

  $scope.deleteDoc=function(Doc )
  {
    navigator.notification.confirm(
      'Vuoi cancellare il Documento!', // message
      function(button) {
        if ( button == 1 ) {
          $scope.deleteDoc2(Doc);
        }
      },            // callback to invoke with index of button pressed
      'Sei sicuro?',           // title
      ['Si','No']     // buttonLabels
    );

  }
  $scope.deleteDoc2=function(Doc){
	data={action:'delete',table:'documents','primary':'id',id:Doc.id ,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post(SERVICEURL2,data)
    Doc.deleted=true;
  }






		$scope.back=function(passo){
			if ($scope.mode=="kyc"  ){

				$scope.pages[$scope.page.location].Contract=$scope.Contract
			switch (passo){
				case 0:
					$state.go($scope.page.location,{pages:$scope.pages})
					return
				break
				case -1:
				$scope.pages['kyc_contractor.02']={action:'',location:$scope.page.location,prev_page:'kyc_contractor.01',Contract:$scope.Contract,agg:$scope.page.agg}
				localstorage('pages', JSON.stringify($scope.pages));
				$state.go('kyc_contractor.02'  ,{pages:$scope.pages})
				return;
				break;
				case 1:
				next="kyc_document"
				switch($scope.Contract.act_for_other){
					case '1':
					next="kyc_company"
					break;
					case '2':
					next="kyc_owners"
					default:
				}
				$scope.pages.currentObId=$scope.Contract.contract_id
				$scope.pages[next]={action:'',location:$scope.page.location,prev_page:$state.current.name,Contract:$scope.Contract,agg:$scope.page.agg}
				localstorage('pages', JSON.stringify($scope.pages));
				$state.go(next  ,{pages:$scope.pages})
				return
				break;
			}
		}

/*
			if (passo==1 && $scope.page.action=="add_contract"){
				$scope.pages={currentObId:$scope.lastid,currentOb:'contract'}
				$scope.pages['view_contract']={action:'view', location:"my_contract",Contract:$scope.Contract}
				$scope.pages['kyc_contractor.01']={action:'', user_id:$scope.Contract.contractor_id,location:'view_contract',temp:null}
				localstorage('pages',JSON.stringify($scope.pages))
				$state.go('kyc_contractor.01',{pages:$scope.pages})
				return
			}
			if ( $scope.page.action=="add_contract"){
				$scope.pages={currentObId:$scope.lastid,currentOb:'contract'}
				$scope.pages['view_contract']={action:'view', location:$state.current.name,Contract:$scope.Contract}
				localstorage('pages',JSON.stringify($scope.pages))
				$state.go('view_contract',{pages:$scope.pages})
				return
			}
*/
	    $state.go($scope.page.location,{pages:$scope.pages})
	  }
		$scope.$on('backButton', function(e) {
	      $scope.back()
	  });
		$scope.$on('procuratore', function(e) {
	      $scope.Contract.role_for_other="Procuratore"
	  });

	  $scope.$on('addButton', function(e) {
		})
		$scope.$on('$viewContentLoaded',
	           function(event){
	             $timeout(function() {
								 setDefaults($scope)

								 $scope.main.loader=false
								 $('.mdl-layout__drawer-button').hide()

	            }, 300);
	  });

  	})

  function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
    $scope.deleteDoc(doc)
  }
