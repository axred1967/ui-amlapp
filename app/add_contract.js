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
			 if ($scope.Contract!==undefined && $scope.Contract.contract_date!==undefined &&  $scope.Contract.contract_eov.setHours(0,0,0,0)==oggi.setHours(0,0,0,0)) {
				 Object.assign(d,$scope.Contract.contract_date)
		     d.setFullYear(d.getFullYear()+10)
		     $scope.Contract.contract_eov=d
			 }

	   }

		 $scope.toogle=function(o){
			 o = o.split(".")
			 switch (o.length){
				 case 1:
				 $val= $scope[o[0]]
				 if ($val==1){
					 $scope[o[0]]=0;
				 }
				 else{
					 $scope[o[0]]=1;
				 }
				 break;
				 case 2:
				 $val= $scope[o[0]][o[1]]
				 if ($val==1){
					 $scope[o[0]][o[1]]=0;
				 }
				 else{
					 $scope[o[0]][o[1]]=1;
				 }
				 break;
				 case 3:
				 $val= $scope[o[0]][o[1]][o[2]]
				 if ($val==1){
					 $scope[o[0]][o[1]][o[2]]=0
				 }
				 else{
					 $scope[o[0]][o[1]][o[2]]=1;
				 }
				 break;
				 case 4:
				 $val= $scope[o[0]][o[1]][o[2]][o[3]]
				 if ($val==1){
					 $scope[o[0]][o[1]][o[2]][o[3]]=0
				 }
				 else{
					 $scope[o[0]][o[1]][o[2]][o[3]]=1;
				 }
				 break;

			 }


		 }
		 $scope.changeProcura=function(){
			 if ($scope.Contract.procura){
				 $scope.$broadcast('procuratore')
			 }
		 }
		 /*
		 $scope.$on('$viewContentLoaded',
	            function(event){
								$timeout(function() {
									$('input.mdl-textfield__input,input.mdl-radio__button,input.mdl-checkbox__input').each(
						 			 function(index){
						 				 ngm=$(this).attr('ng-model')
										 if (ngm===undefined){
											 ngm=$(this).attr('modelAx')
										 }
											 s = ngm.split(".")
											 switch (s.length){
												 case 1:
												 $val= $scope[s[0]]
												 break;
												 case 2:
												 $val= $scope[s[0]][s[1]]
												 break;
												 case 3:
												 $val= $scope[s[0]][s[1]][s[2]]
												 break;
												 case 4:
												 $val= $scope[s[0]][s[1]][s[2]][s[3]]
												 break;
 										 	}


							 				 if ( $(this).attr('type')=="radio" && $val==$(this).attr('value') && document.getElementById($(this).attr('id')).parentNode.MaterialRadio!==undefined)
							 					 document.getElementById($(this).attr('id')).parentNode.MaterialRadio.check()
							 						 //$(this).parentNode.MaterialRadio.check()
							 					 if ($(this).attr('type')=="checkbox" && $val==$(this).attr('value') && document.getElementById($(this).attr('id')).parentNode.MaterialCheckbox!==undefined)
							 					  document.getElementById($(this).attr('id')).parentNode.MaterialCheckbox.check()
							 //                $(this).parentNode.MaterialCheckbox.check()



						 				 $(this).parent('div.mdl-textfield').addClass('is-dirty');
						 				 $(this).parent('div.mdl-textfield').removeClass('is-invalid');
						 			 }
						 		 );
								 if (! $scope.agent.settings.country!==undefined && ($scope.Contract.activity_country==null || $scope.Contract.activity_country.lenght==0) ){
	 								$scope.Contract.activity_country=$scope.agent.settings.country;
	 							}

								 $scope.main.loader=false

						    }, 5);
	            });
							*/
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
       if (( $scope.oldCompany!=$scope.Contract.name)){

        data={ "action":"ACCompanyList", name:$scope.Contract.name,pInfo:$scope.agent.pInfo}
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
       $scope.Contract.name=company.name;
       $scope.Contract.company_id=company.company_id;
     };
     $scope.addOtherItem=function(other){
       $scope.listOther=[];
       $scope.Contract.other_name=other.fullname;
       $scope.Contract.user_id=other.user_id;
     };




  $scope.add_contract=function(){
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
        $lastid=data.lastid

        $scope.back()

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






		$scope.back=function(){
	    $state.go($scope.page.location)
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

	            }, 905);
	  });

  	})

  function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
    $scope.deleteDoc(doc)
  }
