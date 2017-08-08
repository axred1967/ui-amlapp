app2.controller('kyc_company', function ($scope,$http,$state,$translate,$timeout) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuova Società"
  $scope.main.loader=true
  $scope.page={}

  $scope.curr_page='kyc_company'
  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.main.location=$scope.page.location

  $scope.loadItem=function(){
    var id=localStorage.getItem("CustomerProfileId");
    var email=localStorage.getItem("userEmail");
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    appData=$scope.Contract
    data={"action":"kycAx",appData:appData,country:true,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      $('#loader_img').hide();
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        $scope.Kyc=data;
        $scope.countryList=responceData.countrylist
        if ($scope.Kyc.date_of_identification===undefined || $scope.Kyc.date_of_identification)
        $scope.Kyc.date_of_identification=new Date()
        $scope.Kyc.contract_data=IsJsonString($scope.Kyc.contract_data)
        $scope.Kyc.contract_data.Docs=IsJsonString($scope.Kyc.contract_data.Docs)
        $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
        $scope.Kyc.Docs=IsJsonString($scope.Docs)
        $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
        $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
        convertDateStringsToDates($scope.Kyc)
        convertDateStringsToDates($scope.Kyc.Docs)
        convertDateStringsToDates($scope.Kyc.contractor_data)
        convertDateStringsToDates($scope.Kyc.company_data)
        convertDateStringsToDates($scope.Kyc.owner_data)
        convertDateStringsToDates($scope.Kyc.contractor_data)

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
  switch ($scope.action){
    default:
    $scope.action="saveKyc"
    $scope.main.viewName="Dati Soggetto Giuridico"
  }

  if ($scope.page.editDoc) {
    $scope.countryList=JSON.parse(localStorage.getItem('countryList'))
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    convertDateStringsToDates($scope.Kyc)
    convertDateStringsToDates($scope.Kyc.contract_data)
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
    convertDateStringsToDates($scope.Kyc.contract_data)
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
    $scope.loadItem()
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
      $scope.main.loader=false
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
      $scope.main.loader=true
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

    if (par.countries && $scope.word['countries']!==undefined){
      $scope.word['countries']=[]
    }
  }
  $scope.uploadfromgallery=function(Doc,index)
  {
    Doc.index=index
    localstorage('Doc', JSON.stringify(Doc));
     // alert('cxccx');
     navigator.camera.getPicture($scope.uploadPhoto,
          function(message) {
              alert('get picture failed');
          },
          {
              quality: 50,
              destinationType: navigator.camera.DestinationType.FILE_URI,
              sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
          }
      );
  }
  $scope.add_photo=function(Doc, index)
  {
    Doc.index=index
    localstorage('Doc', JSON.stringify(Doc));
     // alert('cxccx');
     navigator.camera.getPicture($scope.uploadPhoto,
          function(message) {
              alert('get picture failed');
          },
          {
              quality: 50,
              destinationType: navigator.camera.DestinationType.FILE_URI,
              sourceType: navigator.camera.PictureSourceType.CAMERA
          }
      );
  }

  $scope.uploadPhoto=function(imageURI){
    $("#loader_img").show()
    $scope.Doc=JSON.parse(localStorage.getItem('Doc'))

     var options = new FileUploadOptions();
     options.fileKey="file";
     options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
     options.mimeType="text/plain";
     options.chunkedMode = false;
     var params = new Object();

     options.params = params;
     var ft = new FileTransfer();
     ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per), $scope.winFT, $scope.failFT, options,true);



  }
  $scope.winFT=function (r)
  {
    Doc=JSON.parse(localStorage.getItem('Doc'))
    var review_info   =JSON.parse(r.response);
    var id = review_info.id;
      $('#doc_image').val(review_info.response);
     // var review_selected_image  =  review_info.review_id;
      //$('#review_id_checkin').val(review_selected_image);
     data={ "action":"get_document_image_name_multi", id:id,DocId: $scope.Doc.id,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
      $http.post( SERVICEURL2,  data )
          .then(function(data) {
                    if(data.data.RESPONSECODE=='1') 			{
                      //$word=$($search.currentTarget).attr('id');
                      $scope.Cotnract.Docs[Doc.index].doc_image=data.data.RESPONSE;
                      $("#loader_img").hide()
                    }
                    if (data.data.RESPONSECODE=='-1'){
                       localstorage('msg','Sessione Scaduta ');
                       $state.go('login');;;
                    }
           })
          , (function() {
            $("#loader_img").hide()
             console.log("error");
           });
  }
  $scope.failFT =function (error)
  {
    $("#loader_img").hide()

  }


  $scope.add_document=function(Doc){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document',JSON.stringify({action:"add_document_for_kyc_id",location:$scope.curr_page,per_id:$scope.Kyc.company_data.company_id}))
    Doc.doc_name="Documenti Società"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='contract'
    if ($scope.Kyc.contract_id===undefined && $scope.Kyc.contract_id>0)
      Doc.per_id=$scope.Kyc.contract_id;
    Doc.id=null
    Doc.image_name=null
    Doc.showOnlyImage=false
    Doc.indice=$scope.Kyc.contractor_data.Docs.length

    localstorage('Doc',JSON.stringify(Doc))
    //localstorage('Contract',JSON.stringify($scope.Contract))
    $state.go('add_document')
   }
   $scope.back=function(passo){
     if (passo>0){
         localstorage('kyc_owners',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
         $state.go('kyc_owners')
         return;
     }
     if (passo==-1){
       $state.go($scope.page.prev_page)
         return;
     }
     $state.go('view_contract')
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
             }, 20);
   });

})
