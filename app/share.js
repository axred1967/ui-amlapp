app2.controller('share', function ($scope,$http,$state,$translate,$timeout,$interval,$stateParams) {
  /* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]
  $scope.main.loader=true
  $scope.main.Back=true
  $scope.main.Add=false
	//$scope.main.AddPage="add_document"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuovo TE"
	$scope.add_customer=false
  $scope.word={};
  $scope.Owner={}
	$scope.Customer={}
	$scope.settings={}
  //localstorage("back","view_contract");
		switch ($scope.page.action){
    default :
	    if($scope.page.load!==undefined && $scope.page.load)
			$scope.settings.action="add"
	    $scope.main.viewName="Nuovo TE"
	    $scope.action='add_owners'
	    $scope.Owner.company_id=$scope.page.company_id
			$scope.add_edit="Inserisci i dati del Titolare Effettivo"
			$scope.Owner.company_id=$scope.page.company_id
	    break;
  }



  $scope.add_owner=function(){
		if ($scope.form.$invalid) {
	    angular.forEach($scope.form.$error, function(field) {
	      angular.forEach(field, function(errorField) {
	        errorField.$setTouched();
	      })
	    });
	    $scope.formStatus = "Dati non Validi.";
	    swal('','Dati non validi')
	    console.log("Form is invalid.");
	    return
	  } else {
	    //$scope.formStatus = "Form is valid.";
	    console.log("Form is valid.");
	    console.log($scope.data);
	  }

    if ($scope.page.type=='owners' ){
      appData=$scope.Contract
    }
    else {
      var  appData ={
        id :$scope.agent.id,
        usertype: $scope.agent.user_type
      }
    }

    dbData=angular.extend($scope.Customer,$scope.Owner)



    dbData.agent_id=appData.id
		if ($scope.action=="add_owners" ){
			if (!$scope.add_customer){
				$scope.settings.action="add"
				$scope.settings.table="company_owners"
				$scope.settings.id="id"
				$scope.Owner.agency_id=$scope.agent.agency_id
			}
			else{
				$scope.Owner.agency_id=$scope.agent.agency_id
				$scope.settings.action="add"
				$scope.settings.other_table=[]
		    $scope.settings.other_table[0]={}
		    $scope.settings.other_table[0].table="users"
		    $scope.settings.other_table[0].id="user_id"
				$scope.settings.table="company_owners"
				$scope.settings.id="id"
			}
		} else {
			$scope.settings.other_table=[]
	    $scope.settings.other_table[0]={}
	    $scope.settings.other_table[0].table="users"
	    $scope.settings.other_table[0].id="user_id"
			$scope.settings.table="company_owners"
			$scope.settings.id="id"

		}


    $scope.loader=true
    data={"action":"saveOb",settings:$scope.settings,dbData:dbData,pInfo:$scope.agent.pInfo}
		$scope.main.loader=true
    $http.post(SERVICEURL2,data)
    .then(function(data){
      if(data.data.RESPONSECODE=='1')
      {
        //swal("",data.data.RESPONSE);
        $scope.back()

      }
      else      {
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
				$scope.main.loader=false
        swal("",data.data.RESPONSE);
      }
    })
    , (function(){
			$scope.main.loader=false
      console.log('error');
    })
  }
  $scope.back=function(){
    switch($scope.page.action){
      case'edit_customer_for_kyc_owner':
				$scope.pages[$scope.page.location].edit=true
				$scope.pages[$scope.page.location].Owner=$scope.Owner
			break;
			case'add_customer_for_kyc_owner':
			if ($scope.lastid!==undefined && $scope.lastid>0 ){
				$scope.Owner.id= $scope.lastid
				$scope.pages[$scope.page.location].add=true
				$scope.pages[$scope.page.location].Owner=$scope.Owner

				}
      break;

    }
    //       windows.histoery.back()
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go($scope.page.location,{pages:$scope.pages})
  }

  $scope.new_customer=function(){
    $scope.add_customer=true;
		$scope.Customer={};
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
               $scope.main.loader=false
            }, 5);
  });

// gestisco i dati complessivi del Cliente

$scope.loadItem=function(){
	data={"action":"view_Customer_Profile_info",customer_id:$scope.Owner.user_id,pInfo:$scope.agent.pInfo}
	$scope.main.loader=true
	$http.post( SERVICEURL2,  data )
	.then(function(responceData) {
		$scope.main.loader=false
		if(responceData.data.RESPONSECODE=='1') 			{
			data=responceData.data.RESPONSE;
			$.each(data, function(key, value){
				if (value === null){
					delete data[key];
				}
			});
			$scope.Customer =  data;
			$scope.Customer.IMAGEURI=UPLOADSURL +"user/small/"
			//$rootScope.$broadcast('show')
			$scope.loader=false
			$scope.Customer.Docs=IsJsonString($scope.Customer.Docs)
			if (!isObject($scope.Customer.Docs)){
					$scope.Customer.Docs=[{}]
					$scope.newDocs=true;

			}
			//convertDateStringsToDates($scope.Customer)

			setDefaults($scope)

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
$scope.loadItem()
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
          data={action:"upload_document_ax",type:"profile",id:$scope.Customer.user_id, f:f,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
          $http.post(SERVICEURL2,data,{
          headers: {'Content-Type': undefined}
      })
          .then(function(data){
            $scope.Customer.image=data.image;
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
  imageurl= SERVICEDIRURL +"file_down.php?action=file&file=" + image +"&profile=1&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie
//
  //  Customer.imageurl= Customer.IMAGEURI +Customer.image
  return   imageurl

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
  $scope.loader=true
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
  userid=$scope.Customer.user_id
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
  options.mimeType="text/plain";
  options.chunkedMode = false;
  var params = new Object();

  options.params = params;
  var ft = new FileTransfer();
  $scope.loader=true
  //$http.post( LOG,  {data:SERVICEURL +"?action=upload_user_image&userid="+userid})
  ft.upload(imageURI, encodeURI(SERVICEURL +"?action=upload_user_image&userid="+userid), $scope.winFT, $scope.failFT, options);

  //          ft.upload(imageURI, encodeURI(SERVICEURL +"?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per), $scope.winFT, $scope.failFT, options,true);



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

   data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,settings:settings,search:$word ,table:$table,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
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
$scope.other=function(){
  if($scope.page.other_data)
  $scope.page.other_data=false
  else
  $scope.page.other_data=true
  $scope.arrow=($scope.page.other_data!== undefined || $scope.page.other_data) ? 'arrow_drop_up' : 'arrow_drop_down';

}

})
