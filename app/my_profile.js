app2.controller('my_profile', function ($scope,$http,$state,$translate,$timeout,AutoComplete,$stateParams,$interval) {
  /* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]

  $scope.loader=true;
  $scope.main.Back=true
  $scope.main.Add=false
  $scope.main.Search=false
  $scope.main.viewName="il mio profilo"
  $scope.main.Sidebar=false

  data={"action":"view_Customer_Profile_info",customer_id:$scope.agent.user_id,pInfo:$scope.agent.pInfo}

  $http.post( SERVICEURL2,  data )
  .then(function(responceData) {
    if(responceData.data.RESPONSECODE=='1') 			{
      data=responceData.data.RESPONSE;
      $scope.Customer =  data;
      settings=IsJsonString($scope.Customer.settings)
      if (settings!==false && isObject(settings) ){
        $scope.agent.settings=settings
      }
      if (!isObject($scope.agent.settings)){
        $scope.agent.settings={}
      }
      $scope.Customer.doc_name="Immagine Profilo"
      $scope.Customer.IMAGEURI=UPLOADSURL +"user/small/"
      $scope.oldSign  = $scope.Customer.sign
			$scope.Customer.imageLoaded=true;


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
  , (function(error) {
    console.log("error");
  });

  $scope.deleteDoc=function()
  {
    $scope.Doc.doc_image=""
  }

  $scope.uploadfromgallery=function()
  {
    $("#loader_img").show()
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
    userid=localStorage.getItem("userId")
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";
    options.chunkedMode = false;
		$scope.$apply(function () {
      var extn = "." +options.fileName.split(".").pop();
      filename=baseName(options.fileName).substr(0,20) + Math.random().toString(36).slice(-16) + extn
      //f.name=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
      $scope.Customer.image=filename
			$scope.Customer.imageLoaded=false
    });

    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
		var url=SERVICEURL +"?action=upload_document_ax&profile=1"+$scope.agent.pInfoUrl
    ft.upload(imageURI, url, $scope.winFT, $scope.failFT, options,true);
  }
  $scope.winFT=function (r)
  {
		$scope.$apply(function () {
			$scope.Customer.imageLoaded=true
		});
  }
  $scope.failFT =function (error)
  {
		console.log('error loading image');
  }
  $scope.signature_ready=function(){
    clearButton = document.querySelector("#clearCanvas")

    var wrapper = document.getElementById("signature-pad"),
    savePNGButton = wrapper.querySelector("[data-action=save-png]"),
    canvas = wrapper.querySelector("canvas"),
    signaturePad;

    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
      var Canvas2 = $("#canvas2")[0];
      $('#sig').val(Canvas2.toDataURL())
      var ratio =  Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      ratiox=canvas.offsetWidth/canvas.width
      canvas.height = canvas.offsetHeight * ratio;
      ratioy=canvas.offsetHeight/canvas.height
      var image = new Image();
      image.src = $('#sig').val();
      canvas.getContext("2d").scale(ratio, ratio);
      //canvas.getContext("2d").translate(canvas.width/2,canvas.height/2);
      canvas.getContext("2d").drawImage(image,0,0);
      //canvas.getContext("2d").translate(-canvas.width/2,-canvas.height/2)
    }

    window.onresize = resizeCanvas;
    resizeCanvas();

    signaturePad = new SignaturePad(canvas);

    clearButton.addEventListener("click", function (event) {
      signaturePad.clear();
    });
  };
  $scope.signature_ready();
  $scope.showCanvas=function(){
    $scope.oldSign="change"
    $('#canvas2').attr('height','300px')
  }

  $scope.saveimg=function(){
      $('#sign').show();
      vals=$('#sig').val();
      if(vals != '')
      {
        $('#sign').attr('src',vals);
      }


  }
  $scope.save_profile= function (){
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
    var Canvas2 = $("#canvas2")[0];
    var blank = $("#blank")[0];
    if (Canvas2.toDataURL()==blank.toDataURL())
        $scope.Customer.sign=""
    else if ($scope.oldSign!= null && $scope.oldSign!==undefined && $scope.oldSign.length<10)
        $scope.Customer.sign=Canvas2.toDataURL()

    $scope.Customer.settings=JSON.stringify($scope.agent.settings);
    data={ "action":'saveProfileAx', dbData: $scope.Customer,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.lastid
        localstorage("userEmail",$scope.Customer.email);
        //alert(data.agencyId);
        localstorage("Name",$scope.Customer.fullname);
        localstorage("Profileimageagencyuser",$scope.Customer.image);
        localstorage("userSettings",$scope.Customer.settings);
        $scope.agent.name=$scope.Customer.fullnam;
        $scope.agent.email=$scope.Customer.email;
        $scope.agent.image=$scope.Customer.image;
        $scope.agent.image=$scope.Customer.settings

        $state.go('home')
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
						$scope.Customer.image=filename;
						$scope.Customer.imageLoaded=false;

            data={action:"upload_document_ax",type:"profile", f:f,filename:filename,pInfo:$scope.agent.pInfo}
            $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
            .then(function(data){

              $timeout(function() {
								$scope.Customer.imageLoaded=true;
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
    imageurl= SERVICEDIRURL +"file_down.php?action=file&file=" + Customer.image +"&profile=1"+ $scope.agent.pInfoUrl

		if (!Customer.imageLoaded)
      imageurl='../img/loading_image.gif'
    //
    //  Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   imageurl

  }

  $scope.changepasswordpopup=function()
  {
    $scope.chpassword=true
  }
  $scope.change_password=function()
  {
    var langfileloginchk = localStorage.getItem("language");

    if(langfileloginchk == 'en' )
    {
      var current_passwordMsg ="Please enter Curent Password";
      var new_passwordmsg ="Please enter new password";
      var re_new_passwordmsg ="Please enter Confirm Password";
      var re_new_passwordmsgnotmatch  ="New Password doesn't match with Confirm Password ";
      var pswdleng ="minimum  Password length is 6";


    }
    else
    {
      var current_passwordMsg ="Si prega di inserire la password attuale";
      var new_passwordmsg ="Si prega di inserire una nuova password";
      var re_new_passwordmsg ="Si prega di inserire conferma password";
      var re_new_passwordmsgnotmatch  ="Nuova password non corrisponde con conferma password ";
      var pswdleng ="lunghezza minima della password è di 6";

    }


    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var current_password = $.trim($('#current_password').val());
    var new_password = $.trim($('#new_password').val());
    var re_new_password = $.trim($('#re_new_password').val());

    if(current_password=="") swal("", current_passwordMsg);

    else if(new_password=="") swal("",new_passwordmsg);
    else if(re_new_password=="") swal("",re_new_passwordmsg);
    else if(new_password.length < 6) swal("",pswdleng);
    else if(re_new_password.length < 6) swal("",pswdleng);
    else if(new_password != re_new_password) swal("",re_new_passwordmsgnotmatch);
    else
    {
      data={"action":"Password",id:id,email:email,currentPassword:current_password,newPassword:new_password,pInfo:$scope.agent.pInfo},
      $http.post( SERVICEURL2,  data )
      .then(function(data) {
        if(data.data.RESPONSECODE=='1')
        {
          $('#current_password').val('');
          $('#new_password').val('');
          $('#re_new_password').val('');
          swal("",data.data.RESPONSE);
          $scope.chpassword=false

        }
        else
        {
          if (data.data.RESPONSECODE=='-1'){
            localstorage('msg','Sessione Scaduta ');
            $state.go('login');;;
          }
          swal("",data.data.RESPONSE);
        }


    });
  }
}
$scope.showAC=function($search,$word, settings){
  settings.pInfo=$scope.agent.pInfo
  AutoComplete.showAC($search,$word, settings)
    .then(function(data) {
      if(data.data.RESPONSECODE=='1') 			{
        //$word=$($search.currentTarget).attr('id');
        $search=res[1]
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
    $('#'+par.id).parent('div.mdl-textfield').addClass('ng-touched');
    $('#'+par.id).parent('div.mdl-textfield').removeClass('is-invalid');

  }

  if (par.countries){
    $scope.word['countries']=[]
  }
}
$scope.back=function(){
  $state.go('home')
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


             $scope.main.loader=false
          }, 200);
});


});
