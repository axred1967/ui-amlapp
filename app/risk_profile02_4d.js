app2.controller('risk_profile02_4d', function ($scope,$http,$state,$translate,$timeout,$stateParams,$interval) {
  //gestisco lo state parameter
	  $scope.curr_page=$state.current.name
	  $scope.pages=$stateParams.pages
		if ($scope.pages===null || $scope.pages===undefined){
			$scope.pages=JSON.parse(localStorage.getItem('pages'));
		}
		$scope.page=$scope.pages[$state.current.name]
    $scope.back=function(passo){
      if (passo>0){
        $scope.pages['risk_profile0'+ passo +'_4d']={action:'',location:$scope.page.location,prev_page:$state.current.name,agg:$scope.page.agg}
        localstorage('pages', JSON.stringify($scope.pages));
        $state.go('risk_profile0'+ passo +'_4d' ,{pages:$scope.pages})
        return;
      }
      if (passo==-1){
         $state.go($scope.page.prev_page)
         return;
      }
      $state.go($scope.page.location)
    }

  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Aspetti Connessi al Cliente 2"
  $scope.main.loader=true



  switch ($scope.page.action){
    default:
    $scope.Contract=$scope.pages[$scope.page.location].Contract
    appData=$scope.Contract
    data={"action":"riskAx",appData:appData,kyc:true,agg:$scope.page.agg,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      $('#loader_img').hide();
      if(responceData.data.RESPONSECODE=='1') 			{
        $scope.Kyc=responceData.data.kyc;
        data=responceData.data.RESPONSE;
        $scope.Risk=data;
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
        if ($scope.kyc!==undefined)
          $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
        //convertDateStringsToDates($scope.Risk)
        //convertDateStringsToDates($scope.Risk.risk_data)
        if ($scope.Risk.risk_data.AspConnCli===undefined || ! isObject($scope.Risk.risk_data.AspConnCli)){
          $scope.Risk.risk_data.AspConnCli={}
          $scope.Risk.risk_data.AspConnCli.a1={}
          $scope.Risk.risk_data.AspConnCli.a2={}
          $scope.Risk.risk_data.AspConnCli.a3={}
          $scope.Risk.risk_data.AspConnCli.a4={}


        }
        if ($scope.Kyc!== undefined &&  $scope.Kyc.contractor_data.check_pep!==undefined && $scope.Kyc.contractor_data.check_pep==1  ){
          $scope.PEP="il Cliente si è dichiarato PEP"

        }
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

    $scope.action="saveKyc"



  }
  $scope.subTotRisk= function (ob){
    var subt=0;
    angular.forEach(ob,function(value,key) {
      if (isObject(value)){
        angular.forEach(value,function(value1,key) {
          subt+=value1;
        })
      }
      else{
        subt+=value;

      }
    })
    return subt
  }
  $scope.color= function (val){
    if (val==0){
      return "Alto"
    }
    return "Basso"
  }
  $scope.save_risk= function (passo){
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
      console.log($scope.data);
    }
    var langfileloginchk = localStorage.getItem("language");
    dbData=$scope.Risk

    dbData.risk_data=JSON.stringify(dbData.risk_data)

    $('#loader_img').show();
    data={ "action":"saveRiskAx",agg:$scope.page.agg, appData:$scope.Contract,dbData:dbData,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      $('#loader_img').hide();
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
             }, 500);
   });

})
