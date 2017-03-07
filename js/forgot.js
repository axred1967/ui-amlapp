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
    
}



function forgot()
{
    
    var langfileloginchk = localStorage.getItem("language");
    
    if(langfileloginchk == 'en' )
    {
        var emailmsg ="Please enter Email"; 
       var valid_emailmsg = "Please provide a valid Email ID";
       var waitbutton ="Wait..";
       var forgotbutdbutton = "Forgot Password";
       
    }
    else
    {
       var emailmsg ="Inserisci e-mail"; 
       var valid_emailmsg = "Si prega di fornire un ID e-mail valido";
       var waitbutton ="Aspetta..";
      var forgotbutdbutton = "Ha dimenticato la password";
    } 
    
    /*get all the fields*/
    var email=$.trim($("#email").val());
   	
    if(email=="") swal("",emailmsg);
    else if(!isValidEmailAddress(email) )swal("",valid_emailmsg);
		
    else
    {
		$("#submitbtn").html(waitbutton);
	    $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"Forgot","email":email},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            	if(data.RESPONSECODE==1)
                {
                    $("#email").val('');
	            swal("",data.RESPONSE);
                     $("#submitbtn").html(''+forgotbutdbutton+' <span class="mdl-button__ripple-container"><span style="width: 270.147px; height: 270.147px; transform: translate(-50%, -50%) translate(29px, 22px);" class="mdl-ripple is-animating"></span></span>');
		}
                else
                {
                    swal("",data.RESPONSE);
                     $("#submitbtn").html(''+forgotbutdbutton+' <span class="mdl-button__ripple-container"><span style="width: 270.147px; height: 270.147px; transform: translate(-50%, -50%) translate(29px, 22px);" class="mdl-ripple is-animating"></span></span>');
                }
            }
        });
    }
    return false;

}
