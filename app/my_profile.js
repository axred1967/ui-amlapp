app2.controller('my_profile', function ($scope,$http,$state,$translate,$timeout) {
  $scope.loader=true;
  $scope.main.Back=false
  $scope.main.Add=false
  $scope.main.Search=true
  $scope.main.viewName="il mio profilo"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()

  var id=localStorage.getItem("userId");
  var agency_id=localStorage.getItem("agencyId");
  var email=localStorage.getItem("userEmail");
  data={"action":"view_Customer_Profile_info",customer_id:id,email:email,agency_id:agency_id,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}

  $http.post( SERVICEURL2,  data )
  .then(function(responceData) {
    $('#loader_img').hide();
    if(responceData.data.RESPONSECODE=='1') 			{
      data=responceData.data.RESPONSE;
      $scope.Customer =  data;
      settings=IsJsonString($scope.Customer.settings)
      if (settings!==false && isObject(settings) ){
        $scope.agent.settings=settings
      }
      $scope.Customer.doc_name="Immagine Profilo"
      $scope.Customer.IMAGEURI=BASEURL+"uploads/user/small/"
      $scope.oldSign  = $scope.Customer.sign

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
    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    $http.post( LOG,  {data:BASEURL+"service.php?action=upload_user_image&userid="+userid})
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_user_image&userid="+userid), $scope.winFT, $scope.failFT, options);

    //          ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per), $scope.winFT, $scope.failFT, options,true);



  }
  $scope.winFT=function (r)
  {
    var review_info   =JSON.parse(r.response);
    $scope.Customer.image=review_info.response
    $scope.$apply()

  }
  $scope.failFT =function (error)
  {
    $("#loader_img").hide()

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
    lang=localStorage.getItem('language');
    var usertype = localStorage.getItem('userType');
    $('#loader_img').show();
    data={ "action":'saveProfileAx',id:id, lang:lang, dbData: $scope.Customer,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      $('#loader_img').hide();
      if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.lastid
        localstorage("userType",$scope.Customer.user_type);
        localstorage("userEmail",$scope.Customer.email);
        //alert(data.agencyId);
        localstorage("Name",$scope.Customer.fullname);
        localstorage("Profileimageagencyuser",$scope.Customer.image);
        $scope.agent.user_type=localStorage.getItem('userType');
        $scope.agent.name=localStorage.getItem('Name');
        $scope.agent.email=localStorage.getItem('userEmail');
        $scope.agent.image=localStorage.getItem('Profileimageagencyuser');

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
            , (function(e){
                console.log('error');
            });
        };
        r.readAsDataURL(f);

  }
  $scope.imageurl=function(Customer){

    if (Customer===undefined || Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
    imageurl= '../img/customer-listing1.png'
    else
    imageurl= BASEURL+ "file_down.php?action=file&file=" + Customer.image +"&profile=1&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie
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
      data={"action":"Password",id:id,email:email,currentPassword:current_password,newPassword:new_password,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}},
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

  if (( $word  !== "undefined" && $word.length>0 &&  $word!=$scope.oldWord)){

   data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
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
$scope.addWord=function($search,$word,countries){
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
  if (countries){
    $scope.word['countries']=[]
  }
}
});
