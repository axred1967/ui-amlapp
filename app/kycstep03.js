app2.controller('kycstep03', function ($scope,$http,$state,$translate) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Residenza e Fisco"
  $scope.main.loader=true
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
      data= {"action":"kycAx",appData:appData,country:true}
      $scope.main.loader=true
      $http.post( SERVICEURL2,  data )
      .success(function(responceData) {
        if(responceData.RESPONSECODE=='1') 			{
          data=responceData.RESPONSE;
          $scope.Kyc=data;
          $scope.countryList=responceData.countrylist
          if ($scope.Kyc.date_of_identification===undefined || $scope.Kyc.date_of_identification)
          $scope.Kyc.date_of_identification=new Date()
          $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
          $scope.Kyc.contractor_data.Docs=IsJsonString($scope.Kyc.contractor_data.Docs)
          $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
          $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
          convertDateStringsToDates($scope.Kyc)
          convertDateStringsToDates($scope.Kyc.contractor_data)
          convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
          convertDateStringsToDates($scope.Kyc.company_data)
          convertDateStringsToDates($scope.Kyc.owner_data)
          if($scope.Kyc.contractor_data.check_pep===undefined || $scope.Kyc.contractor_data.check_pep==null)
            $scope.Kyc.contractor_data.check_pep=0
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
          console.log('error');
        }
      })
      .error(function() {
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
    dbData.contractor_data=JSON.stringify(dbData.contractor_data)
    dbData.company_data=JSON.stringify(dbData.company_data)
    dbData.owner_data=JSON.stringify(dbData.owner_data)
    $scope.loader=true
    data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      if(data.RESPONSECODE=='1') 			{
        //swal("",data.RESPONSE);
        $scope.lastid=data.lastid

        $scope.back(passo)

      }
      else
      {
        console.log('error');
        swal("",data.RESPONSE);
      }
    })
    .error(function() {
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

      data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table}
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        if(data.RESPONSECODE=='1') 			{
          //$word=$($search.currentTarget).attr('id');
          $scope.word[$search]=data.RESPONSE;
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
    $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)

    if (passo>0){
      switch($scope.Kyc.contractor_data.act_for_other){
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
      }
    }
    if (passo==-1){
      $state.go($scope.page.prev_page)
      return;
    }
    $state.go($sceop.page.location)
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
  })

$scope.console=function(){
  console.log("xxx". $scope.Kyc.contractor_data.check_pep);

}
$scope.main.loader=false
})
