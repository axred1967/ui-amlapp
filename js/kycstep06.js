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
        var customer_id = localStorage.getItem("CustomerProfileId");;
        
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"show_kyc_profile2",customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
            { 
                        // $('#customer_fiscal_number').val(data.RESPONSE.customer_fiscal_number);
                $('#economic_value_of_service').val(data.RESPONSE.economic_value_of_service);
                $('#nature_of_service').val(data.RESPONSE.nature_of_service);
                $('#scope_of_service').val(data.RESPONSE.scope_of_service);
                if(data.RESPONSE.image != null)
                {
                    $('#view_profile_image_plus').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                }
                
                if(data.RESPONSE.sign != '')
                             {
                                 $('#sign').show();
				$('#sign').attr('src',data.RESPONSE.sign);
                             }
                    
            }
        }
        });
				
}



function savekyc()
{
    
    
    var langfileloginchk = localStorage.getItem("language");
    
    if(langfileloginchk == 'en' )
    {
        var economic_value_of_servicemsg ="Please enter Economic value of service";
        var nature_of_servicemsg ="Please enter Nature of service";
        var scope_of_servicemsg ="Please enter Scope of service";
      
    }
    else
    {
       var economic_value_of_servicemsg ="Si prega di inserire il valore economico del servizio";
       var nature_of_servicemsg ="Si prega di inserire la natura del servizio";
       var scope_of_servicemsg ="Si prega di inserire Ambito di servizio";
       
    } 
    
    
    
    var id=localStorage.getItem("userId");
    var customer_id = localStorage.getItem("CustomerProfileId");
 
    var email=localStorage.getItem("userEmail");
    
    
    var economic_value_of_service = $.trim($('#economic_value_of_service').val());
    var nature_of_service = $.trim($('#nature_of_service').val());
    var scope_of_service = $.trim($('#scope_of_service').val());
    var cust_type = localStorage.getItem("Customertype");
   
    
    if( economic_value_of_service=="") swal("",economic_value_of_servicemsg);
    else if(nature_of_service == '') swal("",nature_of_servicemsg);
    else if(scope_of_service =="") swal("",scope_of_servicemsg);
    
    
    else
    {
        $('#save_button_cust').hide();
        $('#cancel_button_cust').hide();
        $('#loader_img').show();
		
		 //alert($("#sig").val());
		
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"kycstep05",id:id,customer_id:customer_id,economic_value_of_service:economic_value_of_service,nature_of_service:nature_of_service,scope_of_service:scope_of_service,'sign':$("#sig").val()},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#save_button_cust').show();
                    $('#cancel_button_cust').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{ 
                            
                           swal("",data.RESPONSE); 
                           if(cust_type == 1 )
                           {
                                setTimeout(function(){ 
                                         redirect("my_customer.html");
                                        }, 3000);
                              
                           }
                           else if(cust_type == 2)
                           {
                               setTimeout(function(){ 
                                         redirect("owners_list.html");
                                        }, 3000);
                               
                           }
                           // redirect("my_customer.html");
                             
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