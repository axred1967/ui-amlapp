app2.controller('login', function ($scope,$http,$translate,$rootScope,$timeout,$state,$timeout) {
  $scope.main.Back=false
  $scope.main.Add=false
  $scope.main.Search=false
  $scope.main.viewName="\n"
  $scope.main.Sidebar=false
  $scope.main.login=true
  $('.mdl-layout__drawer-button').hide()
  $scope.main.loader=true

  msg=localStorage.getItem("msg");
  if (msg!==undefined && msg.length>0){
    swal('',msg)
    localstorage('msg','');
  }
$


  $scope.loginf=function()   {
    /*get all the fields*/
    var username=$.trim($("#username").val());
    var password = $.trim($("#password").val());
    var langfileloginchk = localStorage.getItem("language");

    if(langfileloginchk == 'en' )  {
      var usernamemsg = "Please enter Email Id";
      var passwordmsg ="Please Enter Password";

      var chkemailpassw ="Email Id / Password mismatch";
      var waitbutton ="Wait..";
      var loginbutdbutton = "Login";
      var valid_emailmsg = "Please provide a valid Email ID";
    }
    else   {
      var usernamemsg = "Inserisci e-mail ";
      var passwordmsg ="Per favore, inserisci la password";

      var chkemailpassw ="Email ID / Password non corrispondente";
      var waitbutton ="Aspetta..";
      var valid_emailmsg = "Si prega di fornire un ID e-mail valido";
      var loginbutdbutton = "Accesso";
    }

    if(username=="") swal("",usernamemsg, "error");

    else if(password=="") swal("",passwordmsg, "error");
    else if(!isValidEmailAddress(username) )swal("",valid_emailmsg);
    else   {
      $("#submitbtn").html(waitbutton);
      data={"action":"login","username":username,"password":password}
      $http.post( SERVICEURL2,  data )
      .success(function(responceData) {
        data=responceData;
        if(data.RESPONSECODE==1)
        {


          localstorage("userId",data.userId);
          localstorage("userType",data.usertype);
          localstorage("userEmail",data.email);
          localstorage("agentId",data.userId);
          localstorage("agencyId",data.agencyId);
          localstorage("cookie",data.cookie);
          //alert(data.agencyId);
          localstorage("Name",data.name);
          localstorage("Profileimageagencyuser",data.image_name);
          if(data.usertype == 2)
          {
            localstorage("priviligetype",data.privilige);
            if(data.privilige == '0' )
            {

              redirect("my_profile_agent_noprve.html");
            }
            else
            {
              $state.go("home");
            }
          }
          else
          {
            $state.go("home");
          }

        }
        else
        {
          swal("",chkemailpassw,"error");
          $("#submitbtn").html(''+loginbutdbutton +' <span class="mdl-button__ripple-container"><span style="width: 270.147px; height: 270.147px; transform: translate(-50%, -50%) translate(29px, 22px);" class="mdl-ripple is-animating"></span></span>');
        }
      })
    }
    return false;
  }

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
