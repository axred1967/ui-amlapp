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
	var customer_id = localStorage.getItem("CustomerProfileId");
	
	  $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"show_risk_profile2",customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
			{ 
                     if(data.RESPONSE.risk_behaviour_collaborative  == 1 )
                     {
                        $('#risk_behaviour_collaborative1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_behaviour_collaborative  == 0)
                     {
                         $('#risk_behaviour_collaborative2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_behaviour_much_collaborative  == 1 )
                     {
                        $('#risk_behaviour_much_collaborative1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_behaviour_much_collaborative  == 0)
                     {
                         $('#risk_behaviour_much_collaborative2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_behaviour_not_collaborative  == 1 )
                     {
                        $('#risk_behaviour_not_collaborative1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_behaviour_not_collaborative  == 0)
                     {
                         $('#risk_behaviour_not_collaborative2').attr("checked","checked");    
                     }
                     
                     $('#risk_behaviour_other').val(data.RESPONSE.risk_behaviour_other);  
            }
        }
        });
	  
	  
			
}
function  agent_profile3(type)
{
    var customer_id = localStorage.getItem("CustomerProfileId");
    var risk_behaviour_collaborative='';
    var risk_behaviour_much_collaborative='';
    var risk_behaviour_not_collaborative='';
    var risk_behaviour_other = $('#risk_behaviour_other').val();  
    var customer_type = localStorage.getItem("Customertype");
    
    if($('#risk_behaviour_collaborative1').is(':checked')) 
    {
        risk_behaviour_collaborative =1;
    }
    else if($('#risk_behaviour_collaborative2').is(':checked'))
    {
        risk_behaviour_collaborative =0;
    }
    if($('#risk_behaviour_much_collaborative1').is(':checked')) 
    {
        risk_behaviour_much_collaborative =1;
    }
    else if($('#risk_behaviour_much_collaborative2').is(':checked'))
    {
        risk_behaviour_much_collaborative =0;
    }
    if($('#risk_behaviour_not_collaborative1').is(':checked')) 
    {
        risk_behaviour_not_collaborative =1;
    }
    else if($('#risk_behaviour_not_collaborative2').is(':checked'))
    {
        risk_behaviour_not_collaborative =0;
    }
    
     $('#risk_button1').hide();
        $('#risk_button2').hide();
        $('#loader_img').show();
   
    $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"customer_risk_profile3",customer_id:customer_id,risk_behaviour_collaborative:risk_behaviour_collaborative,risk_behaviour_much_collaborative:risk_behaviour_much_collaborative,risk_behaviour_not_collaborative:risk_behaviour_not_collaborative,risk_behaviour_other:risk_behaviour_other},
            crossDomain: true,
            success:function(responceData){
                        $('#loader_img').hide();
                        $('#risk_button1').show();
                        $('#risk_button2').show();
			data=JSON.parse(responceData);
                        if(data.RESPONSECODE=='1')
			{ 
                            // swal("",data.RESPONSE);
                             if(type == '2' )
                              {
                                  
                                  if(customer_type == 1 )
                                  {                                  
                                     redirect("risk_profile4.html"); 
                                  }
                                  else if(customer_type == 2)
                                    {
                                        redirect("risk_profile5.html");
                                    }
                              }
                              else
                              {
                                 
                                    if(customer_type == 1 )
                                    {
                                        redirect("my_customer.html");
                                    }
                                    else if(customer_type == 2)
                                    {
                                        redirect("owners_list.html");
                                    }
                              }
                             
			}
			else
			{
                            swal("",data.RESPONSE); 
			}
           
            }
        });
}

setTimeout(function(){ 
        checkthesidebarinfouser();
}, 800);



