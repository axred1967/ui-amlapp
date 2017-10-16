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
				$scope.Company.settings=IsJsonString($scope.Company.settings)
        if (!isObject($scope.Company.settings)){
          $scope.Company.settings={}
        }
        $scope.loader=false
        $scope.imageLoaded=true

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
	    $scope.imageLoaded=false;

	    data={action:"upload_document_ax",type:"profile",entity:'company',entity_key:$scope.Company.company_id, f:f,filename:filename ,pInfo:$scope.agent.pInfo}
	    $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
	    .then(function(data){

	      $timeout(function() {
	        $scope.imageLoaded=true;
	        $scope.$broadcast('fileUploaded',data.data.image)

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
	$scope.edit_profile=function(){
	  url=SERVICEDIRURL +"file_down.php?action=file&resize=m&tipo=profilo&entity=company&entity_key="+$scope.Company.company_id+"&file=" + $scope.Company.image+$scope.agent.pInfoUrl
	  doc={}
	  doc.rotate=$scope.Company.settings.imagerotate
	  dialog.showModal();
	  $timeout(function(){
	    init_canvas_image('DocCanvas',url,doc)

	  },500)
	}
  $scope.imageurl=function(Company){
		if (Company===undefined || Company.image===undefined ||  Company.image== null || Company.image.length==0)
	  imageurl= BASEURL+ 'img/customer-listing1.png'
	  else
	  imageurl= SERVICEDIRURL +"file_down.php?tipo=profilo&entity=company&entity_key="+$scope.Company.company_id+"&file=" + $scope.Company.image +$scope.agent.pInfoUrl

	  if (!$scope.imageLoaded)
	    imageurl=BASEURL+ 'img/loading_image.gif'
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

     data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,zero:settings.zero,order:settings.order,countries:settings.countries,search:$word ,table:$table,pInfo:$scope.agent.pInfo}
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
    dbData= angular.extend({},$scope.Company);
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
		window.resolveLocalFileSystemURI(imageURI, $scope.gotFileEntry, $scope.fail);
	}
	$scope.gotFileEntry= function(fileEntry) {
		fileEntry.file( function(file) {
			var reader = new FileReader();
			reader.onloadend = function(e) {
				var data = e.target.result;
				f={}
				f.data=data
				spedat=data.split(',')
				data1=spedat[1]
				f.name=file.name
				var extn
				var ext=spedat[0].split('/')
				spedat=''
				ext=ext[1].split(';')
				extn='.' + ext[0]

				var filename=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
				f.name=filename
				$scope.$apply(function () {
					$scope.Company.image=filename
					$scope.imageLoaded=false
				})
				data={action:"upload_document_ax",type:"profile",entity:'company',entity_key:$scope.Company.company_id, f:f,filename:filename,pInfo:$scope.agent.pInfo}
				$http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
				.then(function(data){
					if (data.data.RESPONSECODE=='1'){
						$rootScope.$broadcast('fileUploaded',data.data.image);
					}
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
			reader.readAsDataURL(file);

		})



	}


  $scope.winFT=function (r)
  {
		$scope.$apply(function () {
	    $scope.imageLoaded=true
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
				$scope.pages[$scope.page.location].temp.other_id= $scope.lastid
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
	$scope.$on('updateImageDialog', function(e,args) {
		if (args.doc.changed){

					$scope.Company.image=$scope.Company.user_id+ "_profilo" + Math.random().toString(36).slice(-16)+'.png'
					$scope.imageLoaded=false
					var f={}
					f.name=$scope.Company.image
					filename=f.name
					f.data=canvasDoc.toDataURL()
					data={action:"upload_document_ax",type:"profile",entity:'company',entity_key:$scope.Company.company_id, f:f,filename:filename,pInfo:$scope.agent.pInfo}
				 $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
				.then(function(data){

					$scope.imageLoaded=true
					if (data.data.RESPONSECODE=='-1'){
						 localstorage('msg','Sessione Scaduta ');
						 $state.go('login');;;
					}
						console.log('success');
				})
				, (function(){
						console.log('error');
				});

			}
			else {
				$scope.Company.settings.imagerotate=args.gradi
			}


	})
	$scope.$on('fileUploaded', function(e,filename) {
        if (filename==$scope.Company.image){
          $scope.imageLoaded=true
        }


  });
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
