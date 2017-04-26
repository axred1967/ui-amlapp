var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', getChkLogin, false);
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
        chkloggedin();
}

function changepasswordpopup()
{
   $(".fancybox").fancybox();
   $("#popup3").click();
}
function change_password()
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
        var current_passwordMsg ="Si prega di inserire la password Curent";
        var new_passwordmsg ="Si prega di inserire una nuova password";
        var re_new_passwordmsg ="Si prega di inserire Conferma password";
        var re_new_passwordmsgnotmatch  ="Nuova password non corrisponde con Conferma password ";
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
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"Password",id:id,email:email,currentPassword:current_password,newPassword:new_password},
            crossDomain: true,
            success:function(responceData){
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{
                            $('#current_password').val('');
                            $('#new_password').val('');
                            $('#re_new_password').val('');
                            swal("",data.RESPONSE);
                            $.fancybox.close();

			}
			else
			{
                            swal("",data.RESPONSE);
			}

            }
        });
    }
}




setTimeout(function(){
       checkthesidebarinfouser();
}, 800);
