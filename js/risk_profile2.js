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
                     if(data.RESPONSE.risk_activity_activity  == 1 )
                     {
                        $('#risk_activity_activity1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_activity_activity  == 0)
                     {
                         $('#risk_activity_activity2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_activity_movements  == 1 )
                     {
                        $('#risk_activity_movements1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_activity_movements  == 0)
                     {
                         $('#risk_activity_movements2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_activity_financing  == 1 )
                     {
                        $('#risk_activity_financing1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_activity_financing  == 0)
                     {
                         $('#risk_activity_financing2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_activity_funds  == 1 )
                     {
                        $('#risk_activity_funds1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_activity_funds  == 0)
                     {
                         $('#risk_activity_funds2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_activity_cash  == 1 )
                     {
                        $('#risk_activity_cash1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_activity_cash  == 0)
                     {
                         $('#risk_activity_cash2').attr("checked","checked");    
                     }
                     $('#risk_activity_other').val(data.RESPONSE.risk_activity_other);  
            }
        }
        });
	  
	  
			
}
function  agent_profile2(type)
{
    var customer_id = localStorage.getItem("CustomerProfileId");
    var risk_activity_activity='';
    var risk_activity_movements='';
    var risk_activity_financing='';
    var risk_activity_funds ='';
    var risk_activity_cash ='';
    var risk_activity_other = $.trim($('#risk_activity_other').val());
     var customer_type = localStorage.getItem("Customertype");
    if($('#risk_activity_activity1').is(':checked')) 
    {
        risk_activity_activity =1;
    }
    else if($('#risk_activity_activity2').is(':checked'))
    {
        risk_activity_activity =0;
    }
    if($('#risk_activity_movements1').is(':checked')) 
    {
        risk_activity_movements =1;
    }
    else if($('#risk_activity_movements2').is(':checked'))
    {
        risk_activity_movements =0;
    }
    if($('#risk_activity_financing1').is(':checked')) 
    {
        risk_activity_financing =1;
    }
    else if($('#risk_activity_financing2').is(':checked'))
    {
        risk_activity_financing =0;
    }
    if($('#risk_activity_funds1').is(':checked')) 
    {
        risk_activity_funds =1;
    }
    else if($('#risk_activity_funds2').is(':checked'))
    {
        risk_activity_funds =0;
    }
    if($('#risk_activity_cash1').is(':checked')) 
    {
        risk_activity_cash =1;
    }
    else if($('#risk_activity_cash2').is(':checked'))
    {
        risk_activity_cash =0;
    }
    $('#risk_button1').hide();
        $('#risk_button2').hide();
        $('#loader_img').show();
    $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"customer_risk_profile2",customer_id :customer_id ,risk_activity_activity:risk_activity_activity,risk_activity_movements:risk_activity_movements,risk_activity_funds:risk_activity_funds,risk_activity_financing:risk_activity_financing,risk_activity_cash:risk_activity_cash,risk_activity_other:risk_activity_other},
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
                                   redirect("risk_profile3.html"); 
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



