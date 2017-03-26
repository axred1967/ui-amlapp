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
    },
    onDeviceReady: function() {
       document.addEventListener("backbutton", onBackKeyDown, true);
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
                     if(data.RESPONSE.risk_frequency_business  == 1 )
                     {
                        $('#risk_frequency_business1').attr("checked","checked");
                     }
                     else if(data.RESPONSE.risk_frequency_business  == 0)
                     {
                         $('#risk_frequency_business2').attr("checked","checked");
                     }
                     if(data.RESPONSE.risk_frequency_duration  == 1 )
                     {
                        $('#risk_frequency_duration1').attr("checked","checked");
                     }
                     else if(data.RESPONSE.risk_frequency_duration  == 0)
                     {
                         $('#risk_frequency_duration2').attr("checked","checked");
                     }
                     if(data.RESPONSE.risk_frequency_consistency_relation  == 1 )
                     {
                        $('#risk_frequency_consistency_relation1').attr("checked","checked");
                     }
                     else if(data.RESPONSE.risk_frequency_consistency_relation  == 0)
                     {
                         $('#risk_frequency_consistency_relation2').attr("checked","checked");
                     }
                     if(data.RESPONSE.risk_frequency_consistency_dimension  == 1 )
                     {
                        $('#risk_frequency_consistency_dimension1').attr("checked","checked");
                     }
                     else if(data.RESPONSE.risk_frequency_consistency_dimension  == 0)
                     {
                         $('#risk_frequency_consistency_dimension2').attr("checked","checked");
                     }

                     $('#risk_frequency_other').val(data.RESPONSE.risk_frequency_other);
                     $('#risk_frequency_consistency_other').val(data.RESPONSE.risk_frequency_consistency_other);
            }
        }
        });



}
function  agent_profile4(type)
{
    var customer_id = localStorage.getItem("CustomerProfileId");
    var customer_type = localStorage.getItem("Customertype");

    var risk_frequency_business='';
    var risk_frequency_duration='';
    var risk_frequency_consistency_relation ='';
    var risk_frequency_consistency_dimension ='';
    var customer_type = localStorage.getItem("Customertype");
   var risk_frequency_other = $.trim($('#risk_frequency_other').val());
   var risk_frequency_consistency_other = $('#risk_frequency_consistency_other').val();
    if($('#risk_frequency_business1').is(':checked'))
    {
        risk_frequency_business =1;
    }
    else if($('#risk_frequency_business2').is(':checked'))
    {
        risk_frequency_business =0;
    }
    if($('#risk_frequency_duration1').is(':checked'))
    {
        risk_frequency_duration =1;
    }
    else if($('#risk_frequency_duration2').is(':checked'))
    {
        risk_frequency_duration =0;
    }
    if($('#risk_frequency_consistency_relation1').is(':checked'))
    {
        risk_frequency_consistency_relation =1;
    }
    else if($('#risk_frequency_consistency_relation2').is(':checked'))
    {
        risk_frequency_consistency_relation =0;
    }
    if($('#risk_frequency_consistency_dimension1').is(':checked'))
    {
        risk_frequency_consistency_dimension =1;
    }
    else if($('#risk_frequency_consistency_dimension2').is(':checked'))
    {
        risk_frequency_consistency_dimension =0;
    }

    $('#risk_button1').hide();
        $('#risk_button2').hide();
        $('#loader_img').show();

    $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"customer_risk_profile4",customer_id:customer_id,risk_frequency_business:risk_frequency_business,risk_frequency_duration:risk_frequency_duration,risk_frequency_consistency_relation:risk_frequency_consistency_relation,risk_frequency_consistency_dimension:risk_frequency_consistency_dimension,risk_frequency_other:risk_frequency_other,risk_frequency_consistency_other:risk_frequency_consistency_other},
            crossDomain: true,
            success:function(responceData){
                         $('#loader_img').hide();
                        $('#risk_button1').show();
                        $('#risk_button2').show();
			data=JSON.parse(responceData);
                        if(data.RESPONSECODE=='1')
			{

                             swal("",data.RESPONSE);
                                if(type == '2' )
                                {
                                    if(customer_type == 2 )
                                    {
                                        setTimeout(function(){
                                        redirect("owners_list.html");
                                        }, 3000);
                                    }
                                    else if(customer_type == 1)
                                    {
                                         setTimeout(function(){
                                         redirect("my_customer.html");
                                          }, 3000);
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
