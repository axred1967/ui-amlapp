app2.controller('add_company', function ($scope,$http,$state,$translate,$rootScope,$timeout,$interval,$stateParams) {
  /* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]

  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuova Società"
  $scope.main.loader=true

  $scope.word={};
  $scope.loader=true


  $scope.loadItem=function(){
   data={"action":"show_edit_company",company_id:$scope.page.company_id,pInfo:$scope.agent.pInfo}
    $scope.loader=true
    $http.post( SERVICEURL2,  data)
    .then(function(responceData)
    {
      if(responceData.data.RESPONSECODE=='1') 			{
        var data=responceData.data.RESPONSE;
				$('input[type="date"]').each(function(){
				 d=$(this).attr('ng-model')
				 res=d.split('.')
				 if (data[res.slice(-1)[0]]===null){
					 data[res.slice(-1)[0]]=new Date()
				 }
				 else {
					 data[res.slice(-1)[0]]=new Date(data[res.slice(-1)[0] ])
				 }
			 })
        $scope.Company=data;
        //convertDateStringsToDates($scope.Company)
        if (!isObject($scope.Company.Docs)){
          $scope.Company.Docs=[{}]
          $scope.newDocs=true
        }
        $scope.loader=false
        $scope.Company.imageLoaded=true

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
  switch ($scope.page.action){
    case 'add_company_for_contract':
    $scope.main.viewName="Inserisci Società"
    $scope.action="add_company"
    $scope.Company={}
    $scope.Company.Docs=[{}]
    $scope.Company.IMAGEURI=UPLOADSURL +"company/small/"
    break;
    case 'edit_company':
    $scope.main.viewName="Modifica Società"
    $scope.action="edit_company"
    break;
    default:
    $scope.Company={}
    $scope.Company.Docs=[{}]
    $scope.Company.IMAGEURI=UPLOADSURL +"company/small/"
    $scope.action="add_company"
    $scope.main.viewName="Inserisci Società"
  }


  if ($scope.action=="edit_company")
    $scope.loadItem()



  $scope.uploadprofileweb=function(){
		var f = document.getElementById('msds').files[0],
	  r = new FileReader();
	  $scope.f=f
	  r.onloadend = function(e) {
	    var data = e.target.result;
	    f={}
	    f.data=data
	    f.name=$scope.f.name
	    var extn = "." +f.name.split(".").pop();
	    filename=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
	    //f.name=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
	    $scope.Company.image=filename;
	    $scope.Company.imageLoaded=false;

	    data={action:"upload_document_ax",type:"profile", entity:'company',f:f,filename:filename,pInfo:$scope.agent.pInfo}
	    $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
	    .then(function(data){

	      $timeout(function() {
	        $scope.Company.imageLoaded=true;
	        $scope.$broadcast('fileUploaded',$scope.Company)

	      }
	      ,200)
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

  $scope.imageurl=function(Customer){
		if (Customer===undefined || Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
	  imageurl= '../img/customer-listing1.png'
	  else
	  imageurl= SERVICEDIRURL +"file_down.php?action=file&file=" + Customer.image +"&profile=1&entity=company"+ $scope.agent.pInfoUrl

	  if (!Customer.imageLoaded)
	    imageurl='../img/loading_image.gif'
	  //
	  //  Customer.imageurl= Customer.IMAGEURI +Customer.image
	  return   imageurl  }

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

    $scope.loader=true
    dbData= $scope.Company
    data={ "action":$scope.action,  dbData:dbData,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.data.lastid
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
/////
	$scope.$apply(function () {
		var extn = "." +options.fileName.split(".").pop();
		filename=baseName(options.fileName).substr(0,20) + Math.random().toString(36).slice(-16) + extn
		//f.name=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
		$scope.Company.image=filename
		$scope.Company.imageLoaded=false
	});

	var params = new Object();

	options.params = params;
	var ft = new FileTransfer();
	var url=SERVICEURL +"?action=upload_document_ax&profile=1&entity=company"+$scope.agent.pInfoUrl
	ft.upload(imageURI, url, $scope.winFT, $scope.failFT, options,true);


  }
  $scope.winFT=function (r)
  {
		$scope.$apply(function () {
	    $scope.Company.imageLoaded=true
	  });

  }
  $scope.failFT =function (error)
  {
		console.log('error')

  }

  $scope.other=function(){
    if($scope.page.other_data)
    $scope.page.other_data=false
    else
    $scope.page.other_data=true
    $scope.arrow=(page.other_data!== undefined || page.other_data) ? 'arrow_drop_up' : 'arrow_drop_down';

  }
  $scope.back=function(){


    switch ($scope.page.action){
      case'add_company_for_contract':
      if ($scope.lastid!==undefined && $scope.lastid>0 ){
				$scope.pages[$scope.page.location].temp.name=$scope.Company.name
				$scope.pages[$scope.page.location].temp.company_id= $scope.lastid
				localstorage('pages', JSON.stringify($scope.pages));
      }
      break;
    }
		localstorage('pages', JSON.stringify($scope.pages));
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
							 setDefaults($scope)
  						 $('.mdl-layout__drawer-button').hide()
  						 $scope.main.loader=false
  						 $timeout(function() {
  							 resize_img()
  						 },1000);
            }, 200);
  });

})
