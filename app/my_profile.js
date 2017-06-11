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
  data={"action":"view_Customer_Profile_info",customer_id:id,email:email,agency_id:agency_id,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}

  $http.post( SERVICEURL2,  data )
  .success(function(responceData) {
    $('#loader_img').hide();
    if(responceData.RESPONSECODE=='1') 			{
      data=responceData.RESPONSE;
      $scope.Customer =  data;

      $scope.Customer.doc_name="Immagine Profilo"
      $scope.Customer.IMAGEURI=BASEURL+"uploads/user/small/"
      $('input.mdl-textfield__input').each(
        function(index){
          $(this).parent('div.mdl-textfield').addClass('is-dirty');
          $(this).parent('div.mdl-textfield').removeClass('is-invalid');
        }
      );

    }
    else
    {
      if (responceData.RESPONSECODE=='-1'){
        localstorage('msg','Sessione Scaduta ');
        redirect('login.html');
      }
      console.log('error');
    }
  })
  .error(function() {
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
    lang=localStorage.getItem('language');
    var usertype = localStorage.getItem('userType');
    $('#loader_img').show();
   data={ "action":'saveProfileAx',id:id, lang:lang, dbData: $scope.Customer,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1') 			{
        swal("",data.RESPONSE);
        $scope.lastid=data.lastid
        localstorage("userType",data.usertype);
        localstorage("userEmail",$scope.Customer.email);
        //alert(data.agencyId);
        localstorage("Name",$scope.Customer.fullname);
        localstorage("Profileimageagencyuser",$scope.Customer.image);
        $scope.agent.name=localStorage.getItem('Name');
        $scope.agent.email=localStorage.getItem('userEmail');
        $scope.agent.image=localStorage.getItem('Profileimageagencyuser');

        $state.go('home')
      }
      else
      {
        if (data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          redirect('login.html');
        }
        console.log('error');
        swal("",data.RESPONSE);
      }
    })
    .error(function() {
      console.log("error");
    });
  }
  $scope.imageurl=function(Customer){

    if (Customer===undefined || Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
    imageurl= '../img/customer-listing1.png'
    else
    imageurl= BASEURL+ "file_down.php?file=" + Customer.image +"&profile=1"
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
      data={"action":"Password",id:id,email:email,currentPassword:current_password,newPassword:new_password,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")},
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        if(data.RESPONSECODE=='1')
        {
          $('#current_password').val('');
          $('#new_password').val('');
          $('#re_new_password').val('');
          swal("",data.RESPONSE);
          $scope.chpassword=false

        }
        else
        {
          if (data.RESPONSECODE=='-1'){
            localstorage('msg','Sessione Scaduta ');
            redirect('login.html');
          }
          swal("",data.RESPONSE);
        }


    });
  }
}
});
