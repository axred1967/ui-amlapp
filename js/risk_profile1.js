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
            data: {"action":"show_risk_profile1",user_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
			{ 
                     if(data.RESPONSE.risk_information_politically  == 1 )
                     {
                        $('#risk_information_politically1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_information_politically  == 0)
                     {
                         $('#risk_information_politically2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_information_preceedings  == 1 )
                     {
                        $('#risk_information_preceedings1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_information_preceedings  == 0)
                     {
                         $('#risk_information_preceedings2').attr("checked","checked");    
                     }
                     if(data.RESPONSE.risk_information_list  == 1 )
                     {
                        $('#risk_information_list1').attr("checked","checked"); 
                     }
                     else if(data.RESPONSE.risk_information_list  == 0)
                     {
                         $('#risk_information_list2').attr("checked","checked");    
                     }
                     
                     $('#risk_information_other').val(data.RESPONSE.risk_information_other);  
                     if(data.RESPONSE.image !=null )
                     {
                         $('#my_profile_image').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                     }
                     
                     if(data.RESPONSE.image != null)
                    {
                        $('#view_profile_image_plus').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                    }
            }
        }
        });
	  
	  
			
}
function  agent_profile1(type)
{
    var customer_id = localStorage.getItem("CustomerProfileId");
    var risk_information_politically='';
    var risk_information_preceedings='';
    var risk_information_list='';
    var risk_information_other = $('#risk_information_other').val();  
     var customer_type = localStorage.getItem("Customertype");
    
    if($('#risk_information_politically1').is(':checked')) 
    {
        risk_information_politically =1;
    }
    else if($('#risk_information_politically2').is(':checked'))
    {
        risk_information_politically =0;
    }
    if($('#risk_information_preceedings1').is(':checked')) 
    {
        risk_information_preceedings =1;
    }
    else if($('#risk_information_preceedings2').is(':checked'))
    {
        risk_information_preceedings =0;
    }
    if($('#risk_information_list1').is(':checked')) 
    {
        risk_information_list =1;
    }
    else if($('#risk_information_list2').is(':checked'))
    {
        risk_information_list =0;
    }
    
    $('#risk_button1').hide();
        $('#risk_button2').hide();
        $('#loader_img').show();
   
    $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"customer_risk_profile1",customer_id:customer_id,risk_information_politically:risk_information_politically,risk_information_preceedings:risk_information_preceedings,risk_information_list:risk_information_list,risk_information_other:risk_information_other},
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
                                   redirect("risk_profile2.html");  
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



