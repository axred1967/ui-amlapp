app2.controller('add_company', function ($scope,$http,$state,$translate,$rootScope,$timeout) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuova Società"
  $scope.main.loader=true

  $scope.word={};
  $scope.page={}
  $scope.loader=true

 $scope.curr_page='add_company'
 page=localStorage.getItem($scope.curr_page)
 if ( page!= null && page.length >0 ){
   $scope.page=JSON.parse(page)
   $scope.action=$scope.page.action

 }
 $scope.main.location=$scope.page.location

  $scope.loadItem=function(){
    var CompanyID=localStorage.getItem("CompanyID");
    var email=localStorage.getItem("userEmail");
   data={"action":"show_edit_company",company_id:CompanyID,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $scope.loader=true
    $http.post( SERVICEURL2,  data)
    .then(function(responceData)
    {
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        $scope.Company=data;
        convertDateStringsToDates($scope.Company)
        if (!isObject($scope.Company.Docs)){
          $scope.Company.Docs=[{}]
          $scope.newDocs=true
        }
        $scope.loader=false
        $scope.Company.IMAGEURI=BASEURL+"uploads/company/small/"
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

        console.log('no customer')
      }

    })

  }
  switch ($scope.action){
    case 'add_company_for_contract':
    $scope.main.viewName="Inserisci Società"
    $scope.action="add_company"
    $scope.Company={}
    $scope.Company.Docs=[{}]
    $scope.Company.IMAGEURI=BASEURL+"uploads/company/small/"
    $scope.newDocs=true;
    break;
    case 'edit_company':
    $scope.main.viewName="Modifica Società"
    $scope.action="edit_company"
    break;
    default:
    $scope.Company={}
    $scope.Company.Docs=[{}]
    $scope.Company.IMAGEURI=BASEURL+"uploads/company/small/"
    $scope.newDocs=true;
    $scope.action="add_company"
    $scope.main.viewName="Inserisci Società"
  }


  if ($scope.page.editDoc) {
    $scope.Company=JSON.parse(localStorage.getItem('Company'))
    convertDateStringsToDates($scope.Company)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Company.Docs[Doc.indice]=Doc

  }
  else if ($scope.page.addDoc){
    $scope.Company=JSON.parse(localStorage.getItem('Company'))
    convertDateStringsToDates($scope.Company)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    if ($scope.Company.Docs.length!==undefined|| $scope.Company.Docs.length>0 ){
      $scope.Company.Docs[$scope.Company.Docs.length]=Doc
    }
    else {
      $scope.Company.Docs={}
      $scope.Company.Docs[0]=Doc
    }

  }
  else {
    if ($scope.action=="edit_company")
    $scope.loadItem()
  }
  $scope.countryList=getCountryList()


  $scope.uploadprofileweb=function(){
      $("#loader_img_int").show()
        var f = document.getElementById('msds').files[0],
            r = new FileReader();
            $scope.f=f
        r.onloadend = function(e) {
            var data = e.target.result;
            console.log(data);
            f={}
            f.data=data
            f.name=$scope.f.name
            data={action:"upload_document_ax",type:"profile",id:$scope.Company.company_id, f:f,
            pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}, entity:'company',entity_key:'company_id'}
            $http.post(SERVICEURL2,data,{
            headers: {'Content-Type': undefined}
        })
            .then(function(data){
              $scope.Company.image=data.image;
              if($scope.image_type.indexOf($scope.Doc.file_type) === -1) {
                $scope.Doc.isImage=false
              }
              $("#loader_img_int").hide()
              if (data.data.RESPONSECODE=='-1'){
                 localstorage('msg','Sessione Scaduta ');
                 $state.go('login');;;
              }
                console.log('success');
            })
            , (function(){
                console.log('error');
            });
        };
        r.readAsDataURL(f);

  }

  $scope.imageurl=function(image){
    if (image===undefined ||  image== null || image.length==0)
      imageurl= ''
    else
    imageurl= BASEURL+ "file_down.php?action=file&file=" + image +"&profile=1&entity=company&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie
  //
    //  Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   imageurl
  }

  // autocomplete parole
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
  $scope.add_company= function (){
    var langfileloginchk = localStorage.getItem("language");
    if ($scope.form.$invalid) {
      $scope.invalid=""
      angular.forEach($scope.form.$error, function(field) {
        angular.forEach(field, function(errorField) {
          errorField.$setTouched();
          $scope.invalid+=errorField.$name+ " - "
        })
      });
      $scope.formStatus = "Dati non Validi.";
      swal('',"Dati non Validi:" +$scope.invalid)
      console.log("Form is invalid.");
      return
    } else {
      //$scope.formStatus = "Form is valid.";
      console.log("Form is valid.");
      console.log($scope.data);
    }

    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var usertype = localStorage.getItem('userType');
    $scope.loader=true
    dbData= $scope.Company
   data={ "action":$scope.action, id:id,email:email,usertype:usertype,lang:langfileloginchk, dbData:dbData,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.lastid
        $scope.back()
      }
      else
      {
		if (data.data.RESPONSECODE=='-1'){
		   localstorage('msg','Sessione Scaduta ');
		   $state.go('login');;;
		}

		console.log('error');
        $scope.loader=false
        swal("",data.data.RESPONSE);
      }
    })
    , (function() {
      $scope.loader=false
      console.log("error");
    });

  }
  $scope.uploadfromgallery=function()
  {
    $scope.loader=true
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
  $scope.add_photo=function()
  {
    scope.loader=true
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
    company_id=$scope.Compnay.company_id
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";
    options.chunkedMode = false;
    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    $scope.loader=true
    //$http.post( LOG,  {data:BASEURL+"service.php?action=upload_user_image&userid="+userid})
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_company_image&company_id="+company_id), $scope.winFT, $scope.failFT, options);

    //          ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per), $scope.winFT, $scope.failFT, options,true);



  }
  $scope.winFT=function (r)
  {
    var review_info   =JSON.parse(r.response);
    $scope.Customer.image=review_info.response
    $scope.loader=false
    $scope.$apply()

  }
  $scope.failFT =function (error)
  {
    $("#loader_img").hide()
    $scope.loader=false

  }
  $scope.add_document=function(Doc,per_id){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document',JSON.stringify({action:"add_document_for_company",per_id:$scope.Company.company_id,location:$scope.curr_page}))
    Doc.doc_name=""
    Doc.doc_type="Documento Società"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='company'
    if ($scope.Company.company_id===undefined && Company.company_id>0)
    Doc.per_id=Company.company_id;
    Doc.id=null
    Doc.image_name=null
    Doc.indice=$scope.Company.Docs.length
    localstorage('Doc',JSON.stringify(Doc))
    localstorage('Company',JSON.stringify($scope.Company))

    $state.go('add_document')
    return;
  }
  $scope.edit_doc=function(Doc,indice){
    localstorage('add_document',JSON.stringify({action:"edit_document_for_company",location:$scope.curr_page}))
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.doc_type="Documento Società"
    Doc.per='customer'
    if ($scope.Company.company_id===undefined && Company.company_id>0)
    Doc.per_id=Company.company_id;
    Doc.indice=indice
    localstorage('Doc',JSON.stringify(Doc))
    localstorage('Company',JSON.stringify($scope.Company))

    $state.go('add_document')
    return;
  }
  $scope.other=function(){
    if($scope.page.other_data)
    $scope.page.other_data=false
    else
    $scope.page.other_data=true
    $scope.arrow=(page.other_data!== undefined || page.other_data) ? 'arrow_drop_up' : 'arrow_drop_down';

  }
  $scope.back=function(){
    precPage=JSON.parse(localStorage.getItem($scope.page.location))
    if (!isObject(precPage))
      precPage={}

    switch ($scope.page.action){
      case'add_company_for_contract':
      if ($scope.lastid!==undefined && $scope.lastid>0 ){
        $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
        $scope.Contract.name=$scope.Company.name
        $scope.Contract.company_id= $scope.lastid
        localstorage('Contract', JSON.stringify($scope.Contract));
        precPage.add=true
      }
      break;
    }
    localstorage($scope.page.location,JSON.stringify(precPage))
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
