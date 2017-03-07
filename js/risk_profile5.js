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
        var customer_type = localStorage.getItem("Customertype");
        if(customer_type == 1)
        {
            redirect("my_customer.html");
        }
	
	  $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"show_risk_profile2",customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
			{ 
                     if(data.RESPONSE.risk_ownership_compreensive  == 1 )
                     {
                        $('#risk_ownership_compreensive1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_ownership_compreensive  == 0)
                     {
                         $('#risk_ownership_compreensive2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_ownership_link  == 1 )
                     {
                        $('#risk_ownership_link1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_ownership_link  == 0)
                     {
                         $('#risk_ownership_link2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_ownership_country  == 1 )
                     {
                        $('#risk_ownership_country1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_ownership_country  == 0)
                     {
                         $('#risk_ownership_country2').attr("checked","checked");    
                     }
                     
                     $('#risk_ownership_other').val(data.RESPONSE.risk_ownership_other);  
            }
        }
        });
	  
	  
			
}
function  agent_profile5(type)
{
    var customer_id = localStorage.getItem("CustomerProfileId");
    var risk_ownership_compreensive='';
    var risk_ownership_link='';
    var risk_ownership_country='';
    var risk_ownership_other = $('#risk_ownership_other').val();  
   
    
    if($('#risk_ownership_compreensive1').is(':checked')) 
    {
        risk_ownership_compreensive =1;
    }
    else if($('#risk_ownership_compreensive2').is(':checked'))
    {
        risk_ownership_compreensive =0;
    }
    if($('#risk_ownership_link1').is(':checked')) 
    {
        risk_ownership_link =1;
    }
    else if($('#risk_ownership_link2').is(':checked'))
    {
        risk_ownership_link =0;
    }
    if($('#risk_ownership_country1').is(':checked')) 
    {
        risk_ownership_country =1;
    }
    else if($('#risk_ownership_country2').is(':checked'))
    {
        risk_ownership_country =0;
    }
    
    $('#risk_button1').hide();
        $('#risk_button2').hide();
        $('#loader_img').show();
   
    $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"customer_risk_profile5",customer_id:customer_id,risk_ownership_compreensive:risk_ownership_compreensive,risk_ownership_link:risk_ownership_link,risk_ownership_country:risk_ownership_country,risk_ownership_other:risk_ownership_other},
            crossDomain: true,
            success:function(responceData){
                         $('#loader_img').hide();
                        $('#risk_button1').show();
                        $('#risk_button2').show();
			data=JSON.parse(responceData);
                        if(data.RESPONSECODE=='1')
			{ 
                             //swal("",data.RESPONSE);
                             if(type == '2' )
                              {
                                 redirect("risk_profile4.html"); 
                                  
                              }
                              else
                              {
                                  redirect("owners_list.html");
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



