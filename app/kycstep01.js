app2.controller('kycstep01', function ($scope,$http,$state,$translate,$timeout) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Dati Cliente"
  $scope.page={}
  $scope.curr_page='kycstep01'
 page=localStorage.getItem($scope.curr_page)
 if ( page!= null && page.length >0 ){
   $scope.page=JSON.parse(page)
   $scope.action=$scope.page.action

 }
 $scope.main.location=$scope.page.location




 switch ($scope.action){
      default:
          var id=localStorage.getItem("CustomerProfileId");
        	var email=localStorage.getItem("userEmail");
          $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
          appData=$scope.Contract
          data={"action":"kycAx",appData:appData,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
          $scope.main.loader=true
          $scope.loader=true
          $http.post( SERVICEURL2,  data )
              .then(function(responceData) {
                        if(responceData.data.RESPONSECODE=='1') 			{
                           data=responceData.data.RESPONSE;
                           $scope.Kyc=data;
                           $scope.Kyc.contract_data=IsJsonString($scope.Kyc.contract_data)
                           $scope.Kyc.contract_data.Docs=IsJsonString($scope.Kyc.contract_data.Docs)
                           $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
                           $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
                           $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
                           convertDateStringsToDates($scope.Kyc)
                           convertDateStringsToDates($scope.Kyc.contract_data)
                           convertDateStringsToDates($scope.Kyc.contract_data.Docs)
                           convertDateStringsToDates($scope.Kyc.contractor_data)
                           convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
                           convertDateStringsToDates($scope.Kyc.company_data)
                           convertDateStringsToDates($scope.Kyc.owner_data)
                           //aggiorno i valori del contratto
                           $scope.Kyc.contract_data=$scope.Contract
                           $scope.Kyc.contract_data.agent_id=$scope.agent.id

                           $scope.main.loader=false
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
                           $scope.main.loader=false
                           console.log('error');
                         }
               })
              , (function() {
                       console.log("error");
               });

            $scope.action="saveKyc"


    }
    $scope.save_kyc= function (passo){
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
      dbData=$scope.Kyc
      $scope.main.loader=true
      dbData.contract_data=JSON.stringify(dbData.contract_data)
      dbData.contractor_data=JSON.stringify(dbData.contractor_data)
      dbData.company_data=JSON.stringify(dbData.company_data)
      dbData.owner_data=JSON.stringify(dbData.owner_data)
     data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
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
          dbData.contract_data=IsJsonString(dbData.contract_data)
          dbData.contractor_data=IsJsonString(dbData.contractor_data)
          dbData.company_data=IsJsonString(dbData.company_data)
          dbData.owner_data=IsJsonString(dbData.owner_data)
          $scope.main.loader=false
        }
      })
      , (function() {
        console.log("error");
        dbData.contract_data=IsJsonString(dbData.contract_data)
        dbData.contractor_data=IsJsonString(dbData.contractor_data)
        dbData.company_data=IsJsonString(dbData.company_data)
        dbData.owner_data=IsJsonString(dbData.owner_data)
        $scope.main.loader=false
      });


    }


  $scope.back=function(passo){
    if (passo>0){
        localstorage('kycstep0'+passo+'',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
        $state.go('kycstep0'+passo+'')
        return;
    }
    if (passo==-1){
        history.back()
        return;
    }
    $state.go($scope.page.location)

  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_contract()
  })
  $scope.main.loader=false

})
