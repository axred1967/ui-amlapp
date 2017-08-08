app2.controller('kycstep03', function ($scope,$http,$state,$translate,$timeout) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Residenza e Fisco"
  $scope.main.loader=true
  $scope.countryList=getCountryList()
   $scope.page={}

  $scope.curr_page='kycstep03'
  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.main.location=$scope.page.location

  if ($scope.page.editDoc) {
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Kyc.contractor_data.Docs[Doc.indice]=Doc
  }
  else if ($scope.page.addDoc){
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    if ($scope.Kyc.contractor_data.Docs.length!==undefined|| $scope.Kyc.contractor_data.Docs.length>0 ){
      $scope.Kyc.contractor_data.Docs[$scope.Kyc.contractor_data.Docs.length]=Doc
    }
    else {
      $scope.Kyc.contractor_data.Docs=[]
      $scope.Kyc.contractor_data.Docs[0]=Doc
    }

  }
  else {


    switch ($scope.action){
      default:
      var id=localStorage.getItem("CustomerProfileId");
      var email=localStorage.getItem("userEmail");
      $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
      appData=$scope.Contract
      data={"action":"kycAx",appData:appData,country:true,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
      $scope.main.loader=true
      $http.post( SERVICEURL2,  data )
      .then(function(responceData) {
        if(responceData.data.RESPONSECODE=='1') 			{
          data=responceData.data.RESPONSE;
          $scope.Kyc=data;
          if ($scope.Kyc.date_of_identification===undefined || $scope.Kyc.date_of_identification)
          $scope.Kyc.date_of_identification=new Date()
          $scope.Kyc.contract_data=IsJsonString($scope.Kyc.contract_data)
          $scope.Kyc.contract_data.Docs=IsJsonString($scope.Kyc.contract_data.Docs)
          $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
          $scope.Kyc.contractor_data.Docs=IsJsonString($scope.Kyc.contractor_data.Docs)
          $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
          $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
          convertDateStringsToDates($scope.Kyc)
          convertDateStringsToDates($scope.Kyc.contract_data)
          convertDateStringsToDates($scope.Kyc.contract_data.Docs)
          convertDateStringsToDates($scope.Kyc.contractor_data)
          convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
          convertDateStringsToDates($scope.Kyc.company_data)
          convertDateStringsToDates($scope.Kyc.owner_data)
          if($scope.Kyc.contractor_data.check_pep===undefined || $scope.Kyc.contractor_data.check_pep==null)
            $scope.Kyc.contractor_data.check_pep=0
          if (! $scope.agent.settings.country!==undefined && ($scope.Kyc.contractor_data.resi_country==null ||$scope.Kyc.contractor_data.resi_country.length==0) ){
            $scope.Kyc.contractor_data.resi_country=$scope.agent.settings.country;
          }
          if (! $scope.agent.settings.country!==undefined && ($scope.Kyc.contractor_data.main_activity_country==null ||$scope.Kyc.contractor_data.main_activity_country.length==0) ){
            $scope.Kyc.contractor_data.main_activity_country=$scope.agent.settings.country;
          }

          if ($scope.Kyc.contractor_data.check_residence)
            document.querySelector('#ckres').MaterialCheckbox.check();
          if ($scope.Kyc.contractor_data.check_pep==1)
            document.querySelector('#lpep1').MaterialRadio.check();
          if ($scope.Kyc.contractor_data.check_pep==0)
            document.querySelector('#lpep0').MaterialRadio.check();
            if ($scope.Kyc.contractor_data.pep_domestic==1)
              document.querySelector('#lpepdom1').MaterialRadio.check();
            if ($scope.Kyc.contractor_data.pep_domestic==0)
              document.querySelector('#lpepdom0').MaterialRadio.check();



          $('input.mdl-textfield__input').each(
            function(index){
              $(this).parent('div.mdl-textfield').addClass('is-dirty');
              $(this).parent('div.mdl-textfield').removeClass('is-invalid');
            }
          );
          $scope.main.loader=false

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
    $scope.action="saveKyc"
    $scope.viewName="Informazioni personali"
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
    dbData.contract_data=JSON.stringify(dbData.contract_data)
    dbData.contractor_data=JSON.stringify(dbData.contractor_data)
    dbData.company_data=JSON.stringify(dbData.company_data)
    dbData.owner_data=JSON.stringify(dbData.owner_data)
    $scope.main.loader=true
   data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
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


  $scope.showAC=function($search,$word, settings){
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

    if (( $word  !== "undefined" && $word.length>0 &&  $word!=$scope.oldWord) || settings.zero){

     data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,zero:settings.zero,order:settings.order,countries:settings.countries,search:$word ,table:$table,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
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
      $('#'+par.id).parent('div.mdl-textfield').removeClass('is-invalid');

    }

    if (par.countries){
      $scope.word['countries']=[]
    }
  }



  $scope.add_document=function(Doc){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document',JSON.stringify({action:"add_document_for_kyc_id",location:$scope.curr_page}))
    Doc.doc_name="Documento di Identità"
    Doc.doc_type="Documento di Identità"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='contract'
    if ($scope.Kyc.contract_id===undefined && $scope.Kyc.contract_id>0)
    Doc.per_id=$scope.Kyc.contract_id;
    Doc.id=null
    Doc.image_name=null
    Doc.showOnlyImage=true
    if ($scope.Kyc.contractor_data.Docs.length!==undefined|| $scope.Kyc.contractor_data.Docs.length>0 ){
      Doc.indice=$scope.Kyc.contractor_data.Docs.length
    }
    else {
      Doc.indice=0
    }

    localstorage('Doc',JSON.stringify(Doc))
    localstorage('Contract',JSON.stringify($scope.Kyc.contractor_data))
    $state.go('add_document')
  }

  $scope.back=function(passo){
    $scope.Kyc.contract_data=IsJsonString($scope.Kyc.contract_data)

    if (passo>0){
      switch($scope.Kyc.contract_data.act_for_other){
        case '0':
        localstorage('kyc_signature',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
        $state.go('kyc_signature')
        return;
        break;
        case '1':
        localstorage('kyc_company',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
        $state.go('kyc_company')
        return;
        break;
        case '2':
        localstorage('kyc_owners',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
        $state.go('kyc_owners')
        return;
        default:
        localstorage('kyc_signature',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
        $state.go('kyc_signature')
        return;

      }
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

$scope.console=function(){
  console.log("xxx". $scope.Kyc.contractor_data.check_pep);

}
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
