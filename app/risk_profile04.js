
app2.controller('risk_profile04', function ($scope,$http,$state,$translate,$timeout) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Frequenza e Consistenza"
  $scope.main.loader=true
    $scope.page={}

  $scope.curr_page='risk_profile04'
  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.main.location=$scope.page.location

  $scope.Contract=JSON.parse(localStorage.getItem('Contract'))



  switch ($scope.action){
    default:
    var id=localStorage.getItem("CustomerProfileId");
    var email=localStorage.getItem("userEmail");
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    appData=$scope.Contract
   data={"action":"riskAx",appData:appData,country:true,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post( SERVICEURL2,  data )
    .success(function(responceData) {
      $('#loader_img').hide();
      if(responceData.RESPONSECODE=='1') 			{
        data=responceData.RESPONSE;
        $scope.Risk=data;
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
        convertDateStringsToDates($scope.Risk)
        convertDateStringsToDates($scope.Risk.risk_data)
        $('input.mdl-textfield__input,input.mdl-radio__button,input.mdl-checkbox').each(
          function(index){
            ngm=$(this).attr('ng-model')
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
            if ( $(this).attr('type')=="radio" && $val==$(this).attr('value'))
              document.getElementById($(this).attr('id')).parentNode.MaterialRadio.check()
                //$(this).parentNode.MaterialRadio.check()
              if ($(this).attr('type')=="checkbox" && $val==$(this).attr('value'))
              document.getElementById($(this).attr('id')).parentNode.MaterialCheckbox.check()
  //                $(this).parentNode.MaterialCheckbox.check()

            $(this).parent('div.mdl-textfield').addClass('is-dirty');
            $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
        );
      }
      else
      {
        if (responceData.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          redirect('login.html');
        }
        console.log('error');
      }
    })
    .error(function() {
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
   data={ "action":"saveRiskAx", appData:$scope.Contract,dbData:dbData,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1') 			{
        //swal("",data.RESPONSE);
        $scope.lastid=data.lastid
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)

        $scope.back(passo)

      }
      else
      {
        if (data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          redirect('login.html');
        }
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
        console.log('error');
        swal("",data.RESPONSE);
      }
    })
    .error(function() {
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

     data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        if(data.RESPONSECODE=='1') 			{
          //$word=$($search.currentTarget).attr('id');
          $scope.word[$search]=data.RESPONSE;
        }
        if (data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          redirect('login.html');
        }
      })
      .error(function() {
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
   $scope.back=function(passo){
     if (passo>0){
         if ($scope.Contract.act_for_other==1){
           localstorage('risk_profile05',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
          $state.go('risk_profile05')

         }
         else {
           localstorage('risk_final',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
           $state.go('risk_final')

         }
         return;
     }
     if (passo==-1){
       $state.go($scope.page.prev_page)
         return;
     }
     $state.go($scope.page.location)
   }
   $scope.$on('backButton', function(e) {
       $scope.back()
   });

   $scope.$on('addButton', function(e) {
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
})