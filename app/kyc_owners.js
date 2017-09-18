app2.controller('kyc_owners', function ($scope,$http,$state,$translate,$timeout,$stateParams,$interval) {
  //gestisco lo state parameter
	  $scope.curr_page=$state.current.name
	  $scope.pages=$stateParams.pages
		if ($scope.pages===null || $scope.pages===undefined){
			$scope.pages=JSON.parse(localStorage.getItem('pages'));
		}
		$scope.page=$scope.pages[$state.current.name]
    $scope.back=function(passo){
      if (passo>0){
        $scope.pages['kyc_document' ]={action:'',location:$scope.page.location,prev_page:$state.current.name,agg:$scope.page.agg}
        localstorage('pages', JSON.stringify($scope.pages));
        $state.go('kyc_document' ,{pages:$scope.pages})
        return;
      }
      if (passo==-1){
         $state.go($scope.page.prev_page)
         return;
      }
      $state.go($scope.page.location)
    }

  $scope.main.Back=true
  $scope.main.Add=true
	$scope.main.AddPage="add_owners"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.loader=true
  $scope.deleted=0
	$scope.Kyc={}



	$scope.loadItem=function(){
    appData=$scope.Contract
    data={"action":"kycAx",appData:appData,agg:$scope.page.agg,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      $('#loader_img').hide();
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        $scope.Kyc=data;
				$scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data,true)
				if ( $scope.Kyc.owner_data.length===undefined || $scope.Kyc.owner_data.length==0){
					$scope.Kyc.owner_data=[]
				}
      $('input.mdl-textfield__input').each(
          function(index){
            $(this).parent('div.mdl-textfield').addClass('is-dirty');
            $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
        );
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

  switch ($scope.page.action){
    default:
		$scope.Contract=$scope.pages[$scope.page.location].Contract
		$scope.action="saveKyc"
		if  ($scope.Contract.act_for_other==1){
			$scope.main.viewName="TE Persona Giuridica"

		}
		else {
			$scope.main.viewName="Deleganti"

		}
  }

	$scope.saveOwner= function (passo){
		dbData={}
		dbData.owner_data=JSON.stringify($scope.Kyc.owner_data )
    $scope.main.loader=true;

   data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      if(data.data.RESPONSECODE=='1') 			{
				$scope.main.loader=false;
        //swal("",data.data.RESPONSE);
      }
      else
      {
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        console.log('error');
        swal("",data.data.RESPONSE);
      }
    })
    , (function() {
      console.log("error");
    });


  }
	if (isObject($scope.page.newOb)){
		$scope.Kyc.owner_data=$scope.page.owner_data
		if ($scope.page.edit){
			$scope.Kyc.owner_data[$scope.page.indice]=$scope.page.newOb
		}
		else{
			$scope.Kyc.owner_data[$scope.Kyc.owner_data.length]=$scope.page.newOb
		}
		$scope.saveOwner()
		$scope.pages[$state.current.name].newOb=1
		localstorage('pages',JSON.stringify($scope.pages))
	}
	else{
			$scope.loadItem()
	}


  $scope.deleteOwn=function(ob,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare il Titolare Effettivo?");
      if (r == true) {
        $scope.deleteOwn2(ob,index);
      }
    }
    else{
      navigator.notification.confirm(
        "Vuoi Cancellare il Titolare Effettivo?", // message
        function(button) {
          if ( button == 1 ) {
            $scope.deleteOwn2(ob,index);
          }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
    );
    }

  }
  $scope.deleteOwn2=function(ob,index){
		//delete $scope.Kyc['owner_data'][index]
		$scope.Kyc['owner_data'].splice(index,1)
		$scope.saveOwner()

  }




  $scope.save_kyc= function (passo){
		dbData={}
		dbData.owner_data=JSON.stringify($scope.Kyc.owner_data )
    $scope.main.loader=true;

   data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
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
      }
    })
    , (function() {
      console.log("error");
    });


  }


  $scope.showAC=function($search,$word){
    var id=localStorage.getItem("userId");
    var usertype = localStorage.getItem('userType');
    res = $search.split(".")
    $search=res[1]
    if ($word===undefined){
      $word=$scope[res[0]][res[1]]
    }
    else {
      $word=$('#'+$word).val()
    }
    $table=res[0].toLowerCase()

    if (( $word  !== "undefined" && $word.length>3 &&  $word!=$scope.oldWord)){

     data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
      $http.post( SERVICEURL2,  data )
      .then(function(data) {
        if(data.data.RESPONSECODE=='1') 			{
          //$word=$($search.currentTarget).attr('id');
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
    $scope.oldWord= $($search.currentTarget).val()
  }
  $scope.resetAC=function(){
    $scope.word={}
    $scope.list={}
    $scope.listOther={}
    $scope.listCompany={}


  }
  $scope.addWord=function($search,$word){
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
  }



  $scope.add_owner=function(Owner){
		if ($scope.Contract.act_for_other==1){
			type="companyTE"
		}
		else {
			type="otherPersonTE"

		}
		$scope.pages['add_owners.kyc']={action:'add_customer_for_kyc_owner',type:type,company_id:$scope.Contract.other_id,location:$state.current.name,other_data:true,owners:true}
		$scope.pages[$state.current.name].owner_data=$scope.Kyc.owner_data
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_owners.kyc',{pages:$scope.pages})


  }
  $scope.edit_owner=function(Owner,indice){
		if ($scope.Contract.act_for_other==1){
			type="companyTE"
		}
		else {
			type="otherPersonTE"

		}
		$scope.pages['add_owners.kyc']={action:'edit_customer_for_kyc_owner', location:$state.current.name,other_data:true,owners:true,type:type,kyc:$scope.Kyc,Owner:Owner,edit:true,indice:indice}
		$scope.pages[$state.current.name].owner_data=$scope.Kyc.owner_data
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_owners.kyc',{pages:$scope.pages})


  }


  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    localstorage('Contract',JSON.stringify($scope.Kyc.contract_data))
    $scope.add_owner()
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

});
