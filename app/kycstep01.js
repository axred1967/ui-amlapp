app2.controller('kycstep01', function ($scope,$http,$state,$translate) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Dati Cliente"
  $scope.main.loader=true
  $scope.page={}

  $scope.curr_page='kycstep01.html'
 page=localStorage.getItem($scope.curr_page)
 if ( page!= null && page.length >0 ){
   $scope.page=JSON.parse(page)
   $scope.action=$scope.page.action

 }



 switch ($scope.action){
      default:
          var id=localStorage.getItem("CustomerProfileId");
        	var email=localStorage.getItem("userEmail");
          $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
          appData=$scope.Contract
          data= {"action":"kycAx",appData:appData}
          $scope.loader=true
          $http.post( SERVICEURL2,  data )
              .success(function(responceData) {
                        if(responceData.RESPONSECODE=='1') 			{
                           data=responceData.RESPONSE;
                           $scope.Kyc=data;
                           $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
                           $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
                           $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
                           convertDateStringsToDates($scope.Kyc)
                           convertDateStringsToDates($scope.Kyc.contractor_data)
                           convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
                           convertDateStringsToDates($scope.Kyc.company_data)
                           convertDateStringsToDates($scope.Kyc.owner_data)
                           $scope.loader=false
                           $('input.mdl-textfield__input').each(
                             function(index){
                               $(this).parent('div.mdl-textfield').addClass('is-dirty');
                               $(this).parent('div.mdl-textfield').removeClass('is-invalid');
                             }
                           );
                         }
                         else
                         {
                           $scope.loader=false
                           console.log('error');
                         }
               })
              .error(function() {
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
      dbData.contractor_data=JSON.stringify(dbData.contractor_data)
      dbData.company_data=JSON.stringify(dbData.company_data)
      dbData.owner_data=JSON.stringify(dbData.owner_data)
      $scope.loader=true
      data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData}
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        //$scope.loader=false
        if(data.RESPONSECODE=='1') 			{
          swal("",data.RESPONSE);
          $scope.lastid=data.lastid

          $scope.back(passo)

        }
        else
        {
          console.log('error');
          swal("",data.RESPONSE);
          $scope.loader=false
        }
      })
      .error(function() {
        console.log("error");
        $scope.loader=false
      });


    }


  $scope.back=function(passo){
    if (passo>0){
        localstorage('kycstep0'+passo+'.html',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
        $state.go('kycstep0'+passo+'.html')
        return;
    }
    if (passo==-1){
        history.back()
        return;
    }
    history.back()
  }
})
