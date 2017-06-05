app2.controller('kycstep02', function ($scope,$http,$state,$translate) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Informazioni Personalie"
  $scope.main.loader=true
   $scope.page={}

  $scope.curr_page='kycstep02'
  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.main.location=$scope.page.location

  if ($scope.page.editDoc) {
    $scope.countryList=JSON.parse(localStorage.getItem('countryList'))
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    convertDateStringsToDates($scope.Kyc)
    convertDateStringsToDates($scope.Kyc.contractor_data)
    convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
    convertDateStringsToDates($scope.Kyc.company_data)
    convertDateStringsToDates($scope.Kyc.owner_data)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Kyc.contractor_data.Docs[Doc.indice]=Doc

  }
  else if ($scope.page.addDoc){
    $scope.countryList=JSON.parse(localStorage.getItem('countryList'))
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    convertDateStringsToDates($scope.Kyc)
    convertDateStringsToDates($scope.Kyc.contractor_data)
    convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
    convertDateStringsToDates($scope.Kyc.company_data)
    convertDateStringsToDates($scope.Kyc.owner_data)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    if ($scope.Kyc.contractor_data.Docs.length!==undefined|| $scope.Kyc.contractor_data.Docs.length>0 ){
      $scope.Kyc.contractor_data.Docs[$scope.Kyc.contractor_data.Docs.length]=Doc
    }
    else {
      $scope.Kyc.contractor_data.Docs={}
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
      $scope.main.loader=true;
      $http.post( SERVICEURL2,  data )
      .success(function(responceData) {
        if(responceData.RESPONSECODE=='1') 			{
          data=responceData.RESPONSE;
          $scope.Kyc=data;
          $scope.countryList=responceData.countrylist
          localstorage('countrylist',JSON.stringify($scope.countryList))
          if ($scope.Kyc.date_of_identification===undefined || $scope.Kyc.date_of_identification)
          $scope.Kyc.date_of_identification=new Date()
          $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
          $scope.Kyc.contractor_data.Docs=IsJsonString($scope.Kyc.contractor_data.Docs)
          if (!isObject($scope.Kyc.contractor_data.Docs)){
              $scope.Kyc.contractor_data.Docs=[{}]
              $scope.newDocs=true;

          }

          $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
          $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
          convertDateStringsToDates($scope.Kyc)
          convertDateStringsToDates($scope.Kyc.contractor_data)
          convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
          convertDateStringsToDates($scope.Kyc.company_data)
          convertDateStringsToDates($scope.Kyc.owner_data)
          console.log($scope.Kyc.contractor_data.Docs)

          $scope.main.loader=false;

          $('input.mdl-textfield__input').each(
            function(index){
              $(this).parent('div.mdl-textfield').addClass('is-dirty');
              $(this).parent('div.mdl-textfield').removeClass('is-invalid');
            }
          );
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
      $scope.loader=false
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


  $scope.add_document=function(Doc,per_id){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document',JSON.stringify({action:"add_document_for_kyc_id",per_id:$scope.Kyc.contractor_data.contractor_id,location:$scope.curr_page}))
    Doc.doc_name=""
    Doc.doc_type="Documento di Identità"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='contract'
    if ($scope.Kyc.contract_id===undefined && $scope.Kyc.contract_id>0)
    Doc.per_id=$scope.Kyc.contract_id;
    Doc.id=null
    Doc.image_name=null
    Doc.showOnlyImage=false
    Doc.indice=$scope.Kyc.contractor_data.Docs.length
    localstorage('Doc',JSON.stringify(Doc))
    localstorage('Kyc',JSON.stringify($scope.Kyc))

    $state.go('add_document')
    return;
  }
  $scope.edit_doc=function(Doc,indice){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document',JSON.stringify({action:"edit_document_for_kyc_id",location:$scope.curr_page}))
    Doc.doc_name="Documento di Identità"
    Doc.doc_type="Documento di Identità"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='contract'
    if ($scope.Kyc.contract_id===undefined && $scope.Kyc.contract_id>0)
    Doc.per_id=$scope.Kyc.contract_id;
    Doc.indice=indice
    localstorage('Doc',JSON.stringify(Doc))
    localstorage('Kyc',JSON.stringify($scope.Kyc))

    $state.go('add_document')
    return;
  }
  $scope.deleteDoc=function(Doc )
  {
    navigator.notification.confirm(
        'Vuoi cancellare il Documento!', // message
        function(button) {
         if ( button == 1 ) {
             $scope.deleteDoc2(Doc);
         }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
        );

  }
  $scope.deleteDoc2=function(Doc,indice){
    $http.post(SERVICEURL2,{action:'delete',table:'documents','primary':'id',id:Doc.id })
    //Doc.deleted=true;
    $scope.Kyc.contractor_data.Docs.splice(indice,indice);

  }

  $scope.back=function(passo){
    if (passo>0){
      localstorage('kycstep0'+passo+'',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
      $state.go('kycstep0'+passo)
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
    $scope.add_contract()
  })

  $scope.main.loader=false
})
function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
      $scope.deleteDoc(doc)
}
