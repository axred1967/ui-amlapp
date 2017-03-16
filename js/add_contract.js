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

}



function add_contract()
{

    var langfileloginchk = localStorage.getItem("language");


    if(langfileloginchk == 'en' )
    {
        var scopemsg ="Please enter Scope of Contract";

       var naturemsg ="Please enter Nature of Contract";
       var customermsg ="Please enter customer";
       var datamsg = "Please enter date of contract"
       var eovmsg = "Please enter end of validity of contract"

    }
    else
    {
      var scopemsg ="Inserire scopo del contratto";

     var naturemsg ="Inserire Natura del contratto";
     var customermsg ="Inserire Firmatario del contratto";
     var datamsg = "Inserire data contratto"
     var eovmsg = "Inserire scadenza contratto"

    }
    var  appData ={
      id :localStorage.getItem("userId"),
      usertype: localStorage.getItem('userType')
    }
    dbData = {
      agent_id :localStorage.getItem("userId"),
      scope_contract: $.trim($('#scope_of_contract').val()),
      nature_contract: $.trim($('#nature_of_contract').val()),
      contract_date: $.trim($('#ContractDate').val()),
      contract_eov : $.trim($('#ContractEOV').val()),
      contract_value: $.trim($('#ContractValue').val()),
      contractor_id: $.trim($('#Contractor').val()),
      act_for_other: $('input[name=act_for]:checked').val(),
    }
    if ($('input[name=act_for]:checked').val()==1){
        dbData.other_id=$.trim($('#Company').val())
        dbData.role_for_other=$.trim($('#company_role').val())
    }
    if ($('input[name=act_for]:checked').val()==2){
        dbData.other_id=$.trim($('#Other').val())
        dbData.role_for_other=$.trim($('#user_role').val())
    }

    if(dbData.scope_of_contract=="") swal("",scopemsg);

    else if(dbData.nature_of_contract=="") swal("",naturemsg);

    else if(dbData.contract_date =="") swal("",datamsg);
    else if(dbData.contract_eov=='') swal("",eov);

    else
    {
        $('#save_button_cust').hide();
        $('#cancel_button_cust').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL2,
            data: {"action":"addcontract",appData,dbData},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#save_button_cust').show();
                    $('#cancel_button_cust').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{

                           $('#scope_of_contract').val('');
                           $('#nature_of_contract').val('');
                            $('#nature_of_contract').val('');
                            $('#ContractDate').val('');
                            $('#ContractEOV').val('');
                            $('#ContractValue').val('');
                            swal("",data.RESPONSE);
                           setTimeout(function(){
                                var priviledge = localStorage.getItem("priviligetype");
                                if(priviledge == 0 && usertype == 2  )
                                {
                                    redirect("my_profile_agent_noprve.html");
                                }
                                else
                                {

                                    if(actedcompnay == 1 )
                                    {
                                        localstorage("CustomerProfileId",data.ID);
                                        localstorage("actforcompany",1);
                                        localstorage("Customertype",1);
                                        redirect("add_company.html");
                                    }
                                    else
                                    {
                                        localstorage("CustomerProfileId",data.ID);

                                        localstorage("Customertype",1);
                                        redirect("view_contract.html");
                                    }

                                }
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
