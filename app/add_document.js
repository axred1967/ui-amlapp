
app2.controller('add_document', function ($scope,$http,$translate,$state) {
  $scope.loader=true

  $scope.main.Back=true
  $scope.main.Add=false
	$scope.main.AddPage="add_document"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuovo Documento"
  $scope.Doc={}
  $scope.word={};
  $scope.page={}
  $scope.curr_page='add_document'
  page=localStorage.getItem($scope.curr_page)

  if (page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.main.location=$scope.page.location

  //localstorage("back","view_contract");
  switch ($scope.action){
    case 'edit' :
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Doc=Doc
    $scope.action='edit'
    $scope.viewName="Modifica Documento"
    dbData=$scope.Doc
    $scope.loaded=true
    data={ "action":"documentList", dbData:dbData}
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


    break;
    case 'edit_document_for_contract' :
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.loaded=true
    $scope.Doc=Doc
    $scope.action='edit'
    $scope.viewName="Modifica Documento"
    break;

    case 'add_document_for_contract' :
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Doc=Doc
    $scope.Doc.doc_date=new Date()
    $scope.action='add'
    $scope.viewName="Aggiungi Documento"
    $scope.loaded=false

    break;
    case 'edit_document_for_contract' :
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.loaded=true
    $scope.Doc=Doc
    $scope.action='edit'
    $scope.viewName="Modifica Documento"
    break;

    case 'add_document_for_customer' :
    $scope.Customer=JSON.parse(localStorage.getItem('Customer'))
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Doc=Doc
    $scope.Doc.doc_date=new Date()
    $scope.action='add'
    $scope.viewName="Aggiungi Documento"
    $scope.loaded=false

    break;
    case 'edit_document_for_customer' :
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.loaded=true
    $scope.Doc=Doc
    $scope.action='edit'
    $scope.viewName="Modifica Documento"
    break;

    case 'add_document_for_company' :
    $scope.Company=JSON.parse(localStorage.getItem('Company'))
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Doc=Doc
    $scope.Doc.doc_date=new Date()
    $scope.action='add'
    $scope.viewName="Aggiungi Documento"
    $scope.loaded=false

    break;

    case 'add_document_for_kyc_id' :
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Doc=Doc
    $scope.Doc.doc_date=new Date()
    $scope.action='add'
    $scope.viewName="Aggiungi Documento"
    $scope.loaded=false
    break;
    case 'edit_document_for_kyc_id' :
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.loaded=true
    $scope.Doc=Doc
    $scope.action='edit'
    $scope.viewName="Modifica Documento"
    break;
    case 'edit_document_for_company' :
    $scope.Company=JSON.parse(localStorage.getItem('Company'))
    Doc=JSON.parse(localStorage.getItem('Doc'))
    convertDateStringsToDates(Doc)
    $scope.Doc=Doc
    $scope.loaded=true
    $scope.action='edit'
    $scope.viewName="Modifica Documento"
    break;

    default :
    $scope.Doc.image_name=""
    $scope.Doc.doc_date=new Date()
    $scope.viewName="Nuovo Documento"
    break;
  }
  $scope.image_type=['.png','.gif','.png','.tif','.bmp']
  $scope.Doc.isImage=true
  if($scope.image_type.indexOf($scope.Doc.file_type) === -1) {
    $scope.Doc.isImage=false
  }

  /*
  var fd = new FormData();
          fd.append('file', data);
          fd.append('file_name',$scope.f.name.name);
          fd.append('action',"upload_document_ax")
          fd.append('userid',$scope.Doc.per_id)
          fd.append('for',$scope.Doc.per)

  */
  $scope.uploadfileweb=function(){
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
            data= {action:"upload_document_ax",userid:$scope.Doc.per_id,for:$scope.Doc.per, f:f}
            $http.post(SERVICEURL2,data,{
            headers: {'Content-Type': undefined}
        })
            .success(function(data){
              $scope.Doc.doc_image=data.response;
              $scope.Doc.IMAGEURI=BASEURL+'uploads/document/'+$scope.Doc.per+'_'+$scope.Doc.per_id +'/resize/'
              $scope.loaded=true
              $scope.Doc.file_type=data.file_type
              $scope.Doc.isImage=true
              if($scope.image_type.indexOf($scope.Doc.file_type) === -1) {
                $scope.Doc.isImage=false
              }
              $("#loader_img_int").hide()
                console.log('success');
            })
            .error(function(){
                console.log('error');
            });
        };
        r.readAsDataURL(f);

  }





  $scope.showAC=function($search,$table){
    var id=localStorage.getItem("userId");
    var usertype = localStorage.getItem('userType');
    res = $search.split(".")
    $search=res[1]
    $word=$scope[res[0]][res[1]]
    if ($table===undefined)
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
  $scope.deleteDoc=function()
  {
    $scope.Doc.doc_image=""
  }

  $scope.uploadfromgallery=function()
  {
    $("#loader_img_int").show()
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
    $("#loader_img").show()
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

    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";
    options.chunkedMode = false;
    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    //$http.post( LOG,  {data:BASEURL+"service.php?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per})

    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per), $scope.winFT, $scope.failFT, options,true);



  }
  $scope.winFT=function (r)
  {
    var review_info   =JSON.parse(r.response);
    var id = review_info.id;
    $http.post( LOG,  {r:r,Doc:$scope.Doc})
    //$('#review_id_checkin').val(review_selected_image);
    data={ "action":"get_document_image_name_multi", id:id}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      if(data.RESPONSECODE=='1') 			{
        $scope.Doc.doc_image=data.RESPONSE;
        $scope.Doc.IMAGEURI=BASEURL+'uploads/document/'+$scope.Doc.per+'_'+$scope.Doc.per_id +'/resize/'
        $scope.loaded=true
        $("#loader_img_int").hide()
        //  $http.post( LOG,  {dt:data.RESPONSE ,doc:$scope.Doc})

      }
    })
    .error(function() {
      $("#loader_img_int").hide()
      console.log("error");
    });
  }
  $scope.failFT =function (error)
  {
    $("#loader_img_int").hide()

  }

  $scope.add_document=function(){
    if ($scope.form.$invalid) {
      angular.forEach($scope.form.$error, function(field) {
        angular.forEach(field, function(errorField) {
          errorField.$setTouched();
        })
      });
      $scope.formStatus = "Dati non Validi.";
      console.log("Form is invalid.");
      return
    } else {
      //$scope.formStatus = "Form is valid.";
      console.log("Form is valid.");
      console.log($scope.data);
    }

    var  appData ={
      id :localStorage.getItem("userId"),
      usertype: localStorage.getItem('userType')
    }
    dbData=$scope.Doc

    var langfileloginchk = localStorage.getItem("language");
    data= {"action":"savedocument",type:$scope.action, dbData:dbData}
    $http.post(SERVICEURL2,data)
    .success(function(data){
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1')
      {
        //$scope.Doc=data
        //swal("",data.RESPONSE);
        if (data.lastid !==undefined && data.lastid>0)
        $scope.lastid=data.lastid
        $scope.back()
      }
      else      {
        swal("",data.RESPONSE);
      }
    })
    .error(function(){
      console.log('error');
    })
  }
  $scope.addWord=function($search,$word){
    res = $search.split(".")
    $scope[res[0]][res[1]]=$word
    $scope.word[res[1]]=[]
  }
  $scope.back=function(){
    switch ($scope.page.action){
      case 'add_document_for_contract':
      if ($scope.lastid!== undefined && $scope.lastid>0){
        $scope.Doc.id=$scope.lastid
        $scope.Doc.per="contract"
        $scope.Doc.per_id=$scope.Contract.contract_id

        localstorage('Doc',JSON.stringify($scope.Doc))
        precPage=JSON.parse(localStorage.getItem($scope.page.location))
        precPage.addDoc=true
        localstorage($scope.page.location,JSON.stringify(precPage))

      }
      break;
      case 'add_document_for_kyc_id':
      if ($scope.lastid!== undefined && $scope.lastid>0){
        $scope.Doc.id=$scope.lastid
        $scope.Doc.per="contract"
        if ($scope.page.per_id!== undefined && $scope.page.per_id>0)
          $scope.Doc.per_id=$scope.page.per_id
        else
          $scope.Doc.per_id=$scope.Contract.contract_id
        localstorage('Doc',JSON.stringify($scope.Doc))
        precPage=JSON.parse(localStorage.getItem($scope.page.location))
        precPage.addDoc=true
        localstorage($scope.page.location,JSON.stringify(precPage))
        break;

      }
      case 'add_document_for_customer':
      if ($scope.lastid!== undefined && $scope.lastid>0){
        $scope.Doc.id=$scope.lastid
        $scope.Doc.per="customer"
        $scope.Doc.per_id=$scope.Customer.user_id
        localstorage('Doc',JSON.stringify($scope.Doc))
        precPage=JSON.parse(localStorage.getItem($scope.page.location))
        precPage.addDoc=true
        localstorage($scope.page.location,JSON.stringify(precPage))

      }
      break;
      case 'add_document_for_company':
      if ($scope.lastid!== undefined && $scope.lastid>0){
        $scope.Doc.id=$scope.lastid
        $scope.Doc.per="company"
        $scope.Doc.per_id=$scope.Company.company_id
        localstorage('Doc',JSON.stringify($scope.Doc))
        precPage=JSON.parse(localStorage.getItem($scope.page.location))
        precPage.addDoc=true
        localstorage($scope.page.location,JSON.stringify(precPage))
        break;

      }

      case 'edit_document_for_kyc_id':
      if ($scope.lastid!== undefined && $scope.lastid>0){
        localstorage('Doc',JSON.stringify($scope.Doc))
        precPage=JSON.parse(localStorage.getItem($scope.page.location))
        precPage.editDoc=true
        localstorage($scope.page.location,JSON.stringify(precPage))
        break;
      }
      case 'edit_document_for_customer':
      if ($scope.lastid!== undefined && $scope.lastid>0){
        localstorage('Doc',JSON.stringify($scope.Doc))
        precPage=JSON.parse(localStorage.getItem($scope.page.location))
        precPage.editDoc=true
        localstorage($scope.page.location,JSON.stringify(precPage))
        break;
      }
      case 'edit_document_for_company':
      if ($scope.lastid!== undefined && $scope.lastid>0){
        localstorage('Doc',JSON.stringify($scope.Doc))
        precPage=JSON.parse(localStorage.getItem($scope.page.location))
        precPage.editDoc=true
        localstorage($scope.page.location,JSON.stringify(precPage))
        break;
      }
      case 'edit_document_for_contract':
      if ($scope.lastid!== undefined && $scope.lastid>0){
        localstorage('Doc',JSON.stringify($scope.Doc))
        precPage=JSON.parse(localStorage.getItem($scope.page.location))
        precPage.editDoc=true
        localstorage($scope.page.location,JSON.stringify(precPage))
        break;
      }

    }
    history.back()
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {

  })

  $scope.loader=false

})
