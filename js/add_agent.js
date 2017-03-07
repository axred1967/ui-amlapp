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
	
    chkloggedin();
    var usertype = localStorage.getItem('userType');
     
    if(usertype ==  2 )
    {
       redirect("my_customer.html");    
    }   
           
         
				
}



function add_agent()
{
    
    var langfileloginchk = localStorage.getItem("language");
    
    if(langfileloginchk == 'en' )
    {
        var namemsg ="Please enter Name";
      
       var emailmsg ="Please enter Email"; 
       var mobilemsg ="Please enter Mobile Number";
       var mobilevalidmsg ="Please enter valid mobile number";
       var valid_emailmsg = "Please provide a valid Email ID";
       var chkmobileaccpt ="Only 10 digit Mobile Number accepted";
       
    }
    else
    {
        var namemsg ="Si prega di inserire nome";
       
       var emailmsg ="Inserisci e-mail"; 
       var mobilemsg ="Si prega di inserire numero di cellulare";
       var mobilevalidmsg ="Si prega di inserire il numero di cellulare valido";
       var valid_emailmsg = "Si prega di fornire un ID e-mail valido";
       var chkmobileaccpt ="Solo 10 cifre numero di cellulare accettato";
    } 
    
   // checkconnection();
    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var agent_name = $.trim($('#agent_name').val());
    var agent_email = $.trim($('#agent_email').val());
    var agent_mobile_number = $.trim($('#agent_mobile_number').val());
    
    var agent_username = $.trim($('#agent_username').val());
    var usertype = localStorage.getItem('userType');
    
    if(agent_name=="") swal("",namemsg);
	
    else if( agent_email=="") swal("",emailmsg);
    
    else if(agent_mobile_number =="") swal("",mobilemsg);
     else if(isNaN(agent_mobile_number))swal("",mobilevalidmsg);
    else if(!isValidEmailAddress(agent_email) )swal("",valid_emailmsg);
    
    else
    {
        $('#save_button_agent').hide();
        $('#cancel_button_agent').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"addagent",id:id,email:email,usertype:usertype,agent_name:agent_name,agent_email:agent_email,agent_mobile_number:agent_mobile_number},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#save_button_agent').show();
                    $('#cancel_button_agent').show();
                    
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{ 
                            
                            $('#agent_name').val('');
                            $('#agent_email').val('');
                            $('#agent_mobile_number').val('');
                            
                            $('#agent_username').val('');  
                           // swal("",data.RESPONSE);
                           swal("",data.RESPONSE);
                           setTimeout(function(){ 
                                    
                                   // redirect("my_agent.html");
                                   localstorage("agentProfileId",data.ID);
                                   window.location = 'view_agent.html';
                            }, 2000);
                            
                             
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