var app = {
  initialize: function() {
    this.bind();
  },
  bind: function() {
    document.addEventListener('deviceready', getChkLogin(), false);
  },
  deviceready: function() {
    // This is an event handler function, which means the scope is the event.
    // So, we must explicitly called `app.report()` instead of `this.report()`.
    app.report('deviceready');
  },
  report: function(id) {
    // Report the event in the console
    console.log("Report: " + id);
  }
};
function getChkLogin()
{

  var langchkvarlang = localStorage.getItem("language");
  if(langchkvarlang == null)
  {
    redirect("language.html");
  }

  var id=localStorage.getItem("userId");
  if(id != null)
  {
    //redirect("index.html");
  }


}
$(document).ready(function(){
  msg=localStorage.getItem("msg");
  if (msg.length>0){
    swal('',msg)
    localstorage('msg','');
  }
  
})


function login()
{
  /*get all the fields*/
  var username=$.trim($("#username").val());
  var password = $.trim($("#password").val());
  var langfileloginchk = localStorage.getItem("language");

  if(langfileloginchk == 'en' )
  {
    var usernamemsg = "Please enter Email Id";
    var passwordmsg ="Please Enter Password";

    var chkemailpassw ="Email Id / Password mismatch";
    var waitbutton ="Wait..";
    var loginbutdbutton = "Login";
    var valid_emailmsg = "Please provide a valid Email ID";
  }
  else
  {
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
  else
  {
    $("#submitbtn").html(waitbutton);
    $.ajax ({
      type: "POST",
      url: SERVICEURL,
      data: {"action":"login","username":username,"password":password},
      crossDomain: true,
      success:function(responceData){
        data=JSON.parse(responceData);
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
              redirect("index.html");
            }
          }
          else
          {
            redirect("index.html");
          }

        }
        else
        {
          swal("",chkemailpassw,"error");
          $("#submitbtn").html(''+loginbutdbutton +' <span class="mdl-button__ripple-container"><span style="width: 270.147px; height: 270.147px; transform: translate(-50%, -50%) translate(29px, 22px);" class="mdl-ripple is-animating"></span></span>');
        }
      }
    });
  }
  return false;

}
