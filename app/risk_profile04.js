app2.controller('risk_profile04', function ($scope,$http,$state,$translate,$timeout,$interval,$stateParams) {
  $scope.curr_page=$state.current.name
  $scope.pages=$stateParams.pages
  if ($scope.pages===null || $scope.pages===undefined){
    $scope.pages=JSON.parse(localStorage.getItem('pages'));
  }
  $scope.page=$scope.pages[$state.current.name]
  $scope.back=function(passo){

    if (passo>0){
      if ($scope.Contract.act_for_other==1){
        $scope.pages['risk_profile05']={action:'',location:$scope.page.location,prev_page:$state.current.name,agg:scope.page.agg}
        localstorage('pages', JSON.stringify($scope.pages));
        $state.go('risk_profile05' ,{pages:$scope.pages})

      }
      else {
        $scope.pages['risk_final']={action:'',location:$scope.page.location,prev_page:$state.current.name,agg:$scope.page.agg}
        localstorage('pages', JSON.stringify($scope.pages));
        $state.go('risk_final' ,{pages:$scope.pages})

      }

      return;
    }
    if (passo==-1){
       $state.go($scope.page.location)
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
  $scope.main.viewName="Frequenza e Consistenza"
  $scope.main.loader=true




  switch ($scope.action){
    default:
    $scope.Contract=$scope.pages[$scope.page.location].Contract
    appData=$scope.Contract
   data={"action":"riskAx",appData:appData,agg:$scope.page.agg,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      $('#loader_img').hide();
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        $scope.Risk=data;
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
        //convertDateStringsToDates($scope.Risk)
        //convertDateStringsToDates($scope.Risk.risk_data)
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
   data={ "action":"saveRiskAx", appData:$scope.Contract,dbData:dbData,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
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
        if (data.data.RESPONSECODE=='-1'){
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



  $scope.add_document=function(Doc){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document',JSON.stringify({action:"add_document_for_risk_id",location:$scope.curr_page}))
    Doc.doc_name="Documento di Identità"
    Doc.doc_type="Documento di Identità"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='contract'
    if ($scope.Kyc.contract_id===undefined && $scope.Kyc.contract_id>0)
      Doc.per_id=$scope.Kyc.contract_id;
    Doc.id=null
    Doc.image_name=null
    Doc.showOnlyImage=true
    Doc.indice=$scope.Kyc.contractor_data.Docs.length

    localstorage('Doc',JSON.stringify(Doc))
    //localstorage('Contract',JSON.stringify($scope.Contract))
    $state.go('add_document')
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
                setDefaults($scope)
                $scope.main.loader=false
             }, 5);
   });
})
