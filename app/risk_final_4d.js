app2.controller('risk_final_4d', function ($scope,$http,$state,$translate,$timeout,textAngularManager,$stateParams,$interval) {
  //gestisco lo state parameter
	  $scope.curr_page=$state.current.name
	  $scope.pages=$stateParams.pages
		if ($scope.pages===null || $scope.pages===undefined){
			$scope.pages=JSON.parse(localStorage.getItem('pages'));
		}
		$scope.page=$scope.pages[$state.current.name]
    $scope.back=function(passo){
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
  $scope.main.viewName="Assegnazione del rischio"
  $scope.main.loader=true
  switch ($scope.page.action){
    default:
    $scope.Contract=$scope.pages[$scope.page.location].Contract
    appData=$scope.Contract
    data={"action":"riskAx",appData:appData,kyc:true,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      $('#loader_img').hide();
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        $scope.Kyc=responceData.data.kyc;
        if ($scope.Kyc!== undefined && $scope.Kyc.contractor_data!==undefined)
        $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
        $scope.Risk=data;
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
        //convertDateStringsToDates($scope.Risk)
        //convertDateStringsToDates($scope.Risk.risk_data)
        angular.forEach($scope.Risk.risk_data,function(value,key) {
        if (!(key=="AspConnCli" || key=="aspConnOpe" ||key=="riskCalculated" || key=="riskAssigned" ||  key=="riskDescription" ||  key=="notes"))
            $scope.Risk.risk_data[key]=null
        })

        var $risk=0
        $risk=$scope.subTotRisk($scope.Risk.risk_data)
        $scope.Risk.risk_data.riskCalculated="Limitato";
        if ($risk>70){
          $scope.Risk.risk_data.riskCalculated="Alto";

        }
        if ($risk>30 && risk <71){
          $scope.Risk.risk_data.riskCalculated="Medio";
        }
        if ($risk<31 && $risk>10 ){
          $scope.Risk.risk_data.riskCalculated="Basso";
        }
        if ($scope.Kyc !==undefined && $scope.Kyc.contractor_data.check_pep==1){
          $scope.Risk.risk_data.riskCalculated="Alto";
					if ($scope.Risk.risk_data.riskDescription!==undefined)
          $scope.Risk.risk_data.riskDescription+="Il Cliente o alcuni titolari effettivi sono PEP"
					else
					$scope.Risk.risk_data.riskDescription="Il Cliente o alcuni titolari effettivi sono PEP"


        }
        if ($scope.Kyc.contractor_data.check_pep!==undefined && $scope.Kyc.contractor_data.check_pep==1  ){
          $scope.PEP="il Cliente si è dichiarato PEP"

        }


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
    $scope.viewName="Profilo Soggettivo"


  }
  $scope.save_risk= function (passo){
    if ($scope.form.$invalid) {
      angular.forEach($scope.form.$error, function(field) {
        angular.forEach(field, function(errorField) {
          errorField.$setTouched();
        })
      });
      swal("","riempire form corretamente");
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
   data={ "action":"saveRiskAx", appData:$scope.Contract,dbData:dbData,final:true,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      $('#loader_img').hide();
      if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.lastid
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)

        $scope.back(passo)

      }
      else
      {
        if (responceData.data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          $state.go('login');;;
        }
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
        console.log('error');
        swal("",data.data.RESPONSE);
      }
    })
    , (function() {
      $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
      console.log("error");
    });


  }

  $scope.subTotRisk= function (ob){
    var subt=0;
    angular.forEach(ob,function(value,key) {
      if (isObject(value)){
        subt+=$scope.subTotRisk(value);
      }
      else{
        if (value>0)
          subt+=value;

      }
    })
    return subt
  }
  $scope.lastAnalysis= function (){
    if ($scope.Risk!==undefined && $scope.Risk.status!=1){
      return "Non Ancora Completata"
    }

    if ($scope.Risk!==undefined && $scope.Risk.date_of_analisys){
      return $scope.Risk.date_of_analisys
    }
  }
  $scope.color= function (val){
    if (val==0){
      return "Alto"
    }
    return "Basso"
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




   $scope.check_risk=function (partial){
    if   ($scope.Risk.risk_data.partial===undefined )
      $scope.Risk.risk_data.partial={}
   $scope.Risk.risk_data.partial[partial]="Basso"

     angular.forEach($scope.Risk.risk_data[partial], function(value, key) {
       if (value==1 || value.length>5){
          $scope.Risk.risk_data.partial[partial]="Alto"
          return

       }

     });


   }
   $scope.$on('backButton', function(e) {
       $scope.back()
   });

   $scope.$on('addButton', function(e) {
   })
   $scope.$on('$viewContentLoaded',
            function(event){
              $timeout(function() {
                $('.mdl-radio,.mdl-textfield,.mdl-checkbox').each(
                  function(index){
                    $(this).addClass('is-dirty');
                    $(this).removeClass('is-invalid');
                  })
                $scope.main.loader=false
             }, 5);
   });
})
