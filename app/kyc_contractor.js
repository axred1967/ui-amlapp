app2.controller('kyc_contractor', function ($scope,$http,$state,$translate,$timeout,$interval,$stateParams,AutoComplete,textAngularManager) {
  //gestisco lo state parameter

	  $scope.curr_page=$state.current.name
	  $scope.pages=$stateParams.pages
		if ($scope.pages===null || $scope.pages===undefined){
			$scope.pages=JSON.parse(localStorage.getItem('pages'));
		}
		$scope.page=$scope.pages[$state.current.name]
		if ($state.current.name=='kyc_contractor.01'){
			$scope.passo=1
		}
		if ($state.current.name=='kyc_contractor.02'){
			$scope.passo=2
		}

    $scope.back=function(passo){
				if ($scope.passo==1 && passo>0){
				$scope.pages[$scope.page.location].Contract=$scope.Contract
        $scope.pages['kyc_contractor.02']={action:'',passo:passo, Contract:$scope.Contract,location:$scope.page.location,prev_page:$state.current.name,temp:null,view:$scope.page.view}
        localstorage('pages', JSON.stringify($scope.pages));
				$scope.main.loader=false
				$scope.passo++
        $state.go('kyc_contractor.02',{pages:$scope.pages})
				$scope.main.viewName="Dati Firmatario " + $scope.passo
				document.body.scrollTop = document.documentElement.scrollTop = 0;
	        return;
      }
			if ($scope.passo==2 && passo>0){
				next="add_contract"
				/*
				next="kyc_document"
				switch($scope.Kyc.contract_data.act_for_other){
					case '1':
					next="kyc_company"
					break;
					case '2':
					next="kyc_owners"
					default:
				}
				*/
				$scope.pages[next]={action:'add_contract_kyc',location:$scope.page.location,prev_page:$state.current.name,Contract:$scope.Contract,agg:$scope.page.agg}
				localstorage('pages', JSON.stringify($scope.pages));
				$state.go(next  ,{pages:$scope.pages})
				return;
      }

      if (passo==-1){
         $state.go($scope.pages[$state.current.name].prev_page)
				 $scope.main.loader=false
				 $scope.passo--
				 $scope.main.viewName="Adeguata Verifica"
       return;
      }
      $state.go($scope.page.location,{pages:$scope.pages})
    }
		$scope.Customer={}
		$scope.imported=[]
		$scope.kyc_data={}

  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $scope.main.viewName="Adeguata Verifica"
 $scope.searchContractor={}
 $scope.searchContractor.settings={}
 $scope.searchContractor.settings.table='users'
 $scope.searchContractor.settings.id='user_id'
 $scope.searchContractor.settings.fields={
	 'name':'concat(uno.name," " , uno.surname)',
 		'email':'uno.email',
 		'user_id':'uno.user_id',
		'fiscal_number':'uno.fiscal_number'
	}

 $scope.action="saveKyc"
 switch ($scope.page.action){
	 		case 'add_contract':
					$scope.Contract={}
					$scope.Contract.CPU="in Preparazione"
					$scope.Contract.Owner='in inserimento'
					$scope.Kyc={}
					$scope.Kyc.contractor_data={}

			break;
      default:
			$scope.Contract=$scope.page.Contract
			if ($scope.Contract===undefined){
				$scope.Contract=$scope.pages[$scope.page.location].Contract

			}


    }
    $scope.loadItem=function(){

      appData=$scope.Contract
      data={"action":"kycAx",appData:appData,agg:$scope.page.agg,pInfo:$scope.agent.pInfo}
      $scope.main.loader=true
      $scope.loader=true
      $http.post( SERVICEURL2,  data )
          .then(function(responceData) {
                    if(responceData.data.RESPONSECODE=='1') 			{
                       var data=responceData.data.RESPONSE;

											 $scope.Kyc=data;

                       $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
											 $scope.Kyc.kyc_update=IsJsonString($scope.Kyc.kyc_update)

											 $scope.Kyc.contract_data=IsJsonString($scope.Kyc.contract_data)

											 $scope.Customer=angular.extend({},$scope.Kyc.contractor_data);
											 setDefaults($scope)
											 angular.forEach($scope.Customer, function(doc,key){
								 				if ($scope.imported===undefined){
								 					$scope.imported=[]

								 				}
												if ($scope.imported[key]===undefined)
														$scope.imported[key]=false
								 			})

											 if ($scope.Kyc.contractor_data.name===undefined || $scope.Kyc.contractor_data.name===null || $scope.Kyc.contractor_data.name==null){

												 settings={table:'users',id:'user_id',
																	 fields:{'uno.name':'name',
																	 'uno.surname':'surname',
																	 'uno.email':'email',
																	 'uno.mobile':'mobile',
																	 'uno.fiscal_number':'fiscal_number'

																	 },
																	 where:{user_id:{valore:$scope.Contract.contractor_id}}
																	 }
												 data= {"action":"ListObjs",settings:settings,pInfo:$scope.agent.pInfo}
										     $http.post(SERVICEURL2,  data )
										     .then(function(responceData)  {
										       if(responceData.data.RESPONSECODE=='1') 			{
										         data=responceData.data.RESPONSE
														 $scope.Customer.name=data[0].name
														 $scope.Customer.email=data[0].email
														 $scope.Customer.surname=data[0].surname
														 $scope.Customer.mobile=data[0].mobile
														 $scope.Customer.fiscal_number=data[0].fiscal_number
														 if ($scope.kyc_data===undefined ||Object.keys($scope.kyc_data).length==0 )
			 								 			 $scope.loadKydData()

										       }
										       else   {
										         if (responceData.data.RESPONSECODE=='-1'){
										           localstorage('msg','Sessione Scaduta ');
										           $state.go('login');;;
										         }
										       }})
													 , (function() {
											       console.log("error");
											     });

											 } else {
												 if ($scope.kyc_data===undefined ||Object.keys($scope.kyc_data).length==0 )
												 $scope.loadKydData()

											 }

                       $scope.main.loader=false
                     }
                     else
                     {
                       if (responceData.data.RESPONSECODE=='-1'){
                          localstorage('msg','Sessione Scaduta ');
                          $state.go('login');;;
                       }
                       $scope.main.loader=false
                       console.log('error');
                     }
           })
          , (function() {
                   console.log("error");
           });


    }
		$scope.showContractorList=function(){
	    if ((typeof $scope.Kyc.fullname !== "undefined" && $scope.oldContrator!=$scope.Kyc.fullname)){
	     data={ "action":"ACCustomerList", name:$scope.Kyc.fullname,kyc:$scope.searchKyc,pInfo:$scope.agent.pInfo}
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
    // gestisco il salvataggio automatico
    // memorizzo i dati
/*
		$interval(function(){
			if ($scope.Kyc!==undefined && $scope.pages[$state.current.name]!==undefined){
				$scope.Kyc.contractor_data=angular.extend($scope.Kyc.contractor_data,$scope.Customer)
				temp=angular.extend({},$scope.Kyc)
				convertDatestoStrings(temp)
				$scope.pages[$state.current.name].temp=temp
				localstorage('pages',JSON.stringify($scope.pages))

			}

		},3000)
*/
/*
    if (isObject($scope.page.temp)){
      $scope.Kyc=$scope.page.temp
			$scope.Customer=angular.extend({},$scope.Kyc.contractor_data);
      //convertDateStringsToDates($scope.Kyc)

    }
    else{
      $scope.loadItem()

    }
*/
$scope.fillKycData=function(){
	$scope.imported={}
	angular.forEach($scope.kyc_data, function(doc,key){
		if ($scope.Customer[key]!=$scope.kyc_data[key] )
		if (! ($scope.Customer[key] instanceof Date && $scope.kyc_data[key] instanceof Date &&  $scope.Customer[key].getTime()===$scope.kyc_data[key].getTime() ))
				$scope.imported[key]=true;
			$scope.Customer[key]=$scope.kyc_data[key]


	})

	setDefaults($scope);

}

 $scope.loadKydData=function(){
	 if ($scope.Customer!==undefined && $scope.Customer.fiscal_number!==undefined  && $scope.Customer.fiscal_number!==null && $scope.Customer.fiscal_number.length>0){
		 settings={table:'kyc_person',id:'id',
							 where: {
								 'lower(fiscal_id)': {valore:$scope.Customer.fiscal_number.toLowerCase()},
								 agency_id: {valore:$scope.agent.agency_id}}
							 }
		 data= {"action":"ListObjs",settings:settings,pInfo:$scope.agent.pInfo}
		 $http.post(SERVICEURL2,  data )
		 .then(function(responceData)  {
			 if(responceData.data.RESPONSECODE=='1') 			{
				 data=responceData.data.RESPONSE
				 $scope.kyc_data=IsJsonString(data[0].kyc_data);
			 }
			 else   {
				 if (responceData.data.RESPONSECODE=='-1'){
					 localstorage('msg','Sessione Scaduta ');
					 $state.go('login');;;
				 }
			 }})
			 , (function() {
				 console.log("error");
			 });

	 }

 }

		if ($scope.page.action!='add_contract')
			$scope.loadItem()

		$scope.loadCustomer=function(){
			ob={}
			ob.settings={}
			ob.settings.table="users"
			ob.settings.id="user_id"
			ob.settings.where={'user_id':{opcond:'=',valore:$scope.Contract.contractor_id}}
	    data={"action":"ListObjs",settings:ob.settings,pInfo:$scope.agent.pInfo}
	    $scope.main.loader=true
	    $http.post( SERVICEURL2,  data )
	    .then(function(responceData) {
	      if(responceData.data.RESPONSECODE=='1') 			{
	        var data=responceData.data.RESPONSE;
					$('input[type="date"]').each(function(){
	         d=$(this).attr('ng-model')
	         res=d.split('.')
	         data[0][res.slice(-1)[0]]=new Date(data[0][res.slice(-1)[0] ])

	       })
	        $scope.Customer=  data[0];

					$scope.main.loader=false
	        //convertDateStringsToDates($scope.Customer)
					setDefaults($scope)
	      }
	      else
	      {
	        if (responceData.data.RESPONSECODE=='-1'){
	           localstorage('msg','Sessione Scaduta ');
	           $state.go('login');;;
	        }
					$scope.main.loader=false
	        console.log('error');
	      }
	    })
	    , (function() {
	      console.log("error");
				$scope.main.loader=false
	    });

	  }

    $scope.save_kyc= function (passo){
			event.preventDefault()
			if (passo==1){
				$scope.back(passo)
			}
      if ($scope.form.$invalid) {
        angular.forEach($scope.form.$error, function(field) {
          angular.forEach(field, function(errorField) {
            errorField.$setTouched();
						$scope.error=errorField.$name
          })
        });
        swal("","riempire form corretamente\n" +$scope.error,"warning");
        console.log("Form is invalid.");
        return
      } else {
        //$scope.formStatus = "Form is valid.";
        console.log("Form is valid.");
        console.log($scope.data);
      }
      var langfileloginchk = localStorage.getItem("language");
			if ($scope.page.action=='add_contract' && !$scope.Contract.contract_id>0){
				$scope.Contract.firmatario=$scope.Customer.name +" "+$scope.Customer.surname;
				$scope.Contract=createTempContract($scope.agent,$scope.Contract);
				$scope.Contract.Owner=$scope.Contract.firmatario
			}
			dbData={}
			dbData.place_of_identification=$scope.Kyc.place_of_identification
			dbData.date_of_identification=$scope.Kyc.date_of_identification
			dbData.kyc_update=JSON.stringify($scope.Kyc.kyc_update)

			dbData.contractor_data=JSON.stringify(angular.extend($scope.Kyc.contractor_data,$scope.Customer))
			option={}
			option.synk_user=false;
			if ($scope.passo==2){
				option.synk_user=true;
			}

     data={ "action":"saveKycAx", option:option,agg:$scope.page.agg, appData:$scope.Contract,dbData:dbData,pInfo:$scope.agent.pInfo}
      $http.post( SERVICEURL2,  data )
      .then(function(data) {
        //$scope.loader=false
        if(data.data.RESPONSECODE=='1') 			{
          //swal("",data.data.RESPONSE);
          $scope.lastid=data.lastid

          $scope.back(passo)

        }
        else
        {
          if (data.data.RESPONSECODE=='-1'){
             localstorage('msg','Sessione Scaduta ');
             $state.go('login');;;
          }
          console.log('error');
          swal("",data.data.RESPONSE);
          $scope.main.loader=false
        }
      })
      , (function() {
        console.log("error");
        $scope.main.loader=false
      });


    }

		$scope.showAC=function($search,$word, settings){
			if (settings.ob !==undefined && settings.ob.settings!==undefined){
	      settings.ob.settings.where={
	        'name':{ 'valore' :$('#'+$word).val(), 'opcond': 'like', 'pre':'%','post':'%' },
	      }
	    }
	    settings.pInfo=$scope.agent.pInfo
	    AutoComplete.showAC($search,$word, settings)
	    .then(function(data) {
	      if(data.data.RESPONSECODE=='1') 			{
	        //$word=$($search.currentTarget).attr('id');
	        $search=res[1]
	        $scope.word[$search]=data.data.RESPONSE;
	      } else {
					$scope.word[$search]={};


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
			angular.forEach(par.other,function(obj,key){
						res=par.other[key].d.split('.')
						switch(res.length){
				      case 2:
				      $scope[res[0]][res[1]]=par.other[key].s
				      break;
				      case 3:
				      $scope[res[0]][res[1]][res[2]]=par.other[key].s
				      break;
				    }
			});
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
			if (par.res!==undefined){
				$scope.word[par.res]=[]

			}

	    if (par.id!==undefined){
	      $timeout(function() {
	        $('#'+par.id).parent('div.mdl-textfield').addClass('is-dirty');
	        $('#'+par.id).parent('div.mdl-textfield').removeClass('is-invalid');
	      },10)
	    }

	    if (par.countries){
	      $scope.word['countries']=[]
	    }
	  }



		$scope.setEov=function(){
			oggi=new Date()
			if ($scope.Customer!==undefined &&    $scope.Customer.id_release_date!==undefined &&  $scope.Customer.id_release_date!==null && ( $scope.Customer.id_validity===undefined || $scope.Customer.id_validity===null)) {
				oggi = new Date($scope.Customer.id_release_date)
			  oggi.setFullYear(oggi.getFullYear()+10)
				$scope.Customer.id_validity=oggi
			}

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
			$scope.main.loader=false
			$('.mdl-layout__drawer-button').hide()
			setDefaults($scope)
			var elmnt= document.getElementById("ui-content")
			 elmnt.scrollTop=0;

		}, 1000);
	});

})
