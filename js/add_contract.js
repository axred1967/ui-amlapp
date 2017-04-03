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

};
function getChkLogin()
{

        chkloggedin();

}


/*
function add_contract(action)
{

    var langfileloginchk = localStorage.getItem("language");


    if(langfileloginchk == 'en' )
    {
        var scopemsg ="Please enter Scope of Contract";

       var naturemsg ="Please enter Nature of Contract";
       var customermsg ="Please enter customer";
       var datamsg = "Please enter date of contract"
       var eovmsg = "Please enter end of validity of contract"
       var other_idmsg = "Inserire soggetto delegante"
       var role_for_othermsg = "Inserire ruolo soggeto delegato"

    }
    else
    {
      var scopemsg ="Inserire scopo del contratto";

     var naturemsg ="Inserire Natura del contratto";
     var customermsg ="Inserire Firmatario del contratto";
     var datamsg = "Inserire data contratto"
     var eovmsg = "Inserire scadenza contratto"
     var other_idmsg = "Inserire soggetto delegante"
     var role_for_othermsg = "Inserire ruolo soggeto delegato"

    }
    var  appData ={
      id :localStorage.getItem("userId"),
      usertype: localStorage.getItem('userType')
    }
    dbData = {
      agent_id :localStorage.getItem("userId"),
      scope_contract: $.trim($('#scope_contract').val()),
      nature_contract: $.trim($('#nature_contract').val()),
      contract_date: $.trim($('#ContractDate').val()),
      contract_eov : $.trim($('#ContractEOV').val()),
      contract_value: $.trim($('#ContractValue').val()),
      contractor_id: $.trim($('#Contractor').val()),
      act_for_other: $.trim($('input[name=act_for]:checked').val()),
      role_for_other:$.trim($('#role_for_other').val()),
      contractor_id: $.trim($('#Contractor').val()),
    }

    switch(dbData.act_for_other){
        case "1":
          dbData.other_id= $.trim($('#Company').val());
          dbData.role_for_other= $.trim($('#role_for_other').val())
          if(dbData.other_id=="") swal("",other_idmsg);
          if(dbData.role_for_other=="") swal("",role_for_othermsg);
        break;
        case "2":
        dbData.other_id= $.trim($('#other_id').val());
        dbData.role_for_other=$.trim( $('#role_for_other').val())
        if(dbData.other_id=="") swal("",other_idmsg);
        if(dbData.role_for_other=="") swal("",role_for_othermsg);
        break;
        default:
        dbData.other_id= -1;
        dbData.role_for_other=-1;
    }



    if(dbData.scope_contract=="") swal("",scopemsg);

    else if(dbData.nature_contract=="") swal("",naturemsg);

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
            data: {"action":"addcontract",appData,dbData,edit:action},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#save_button_cust').show();
                    $('#cancel_button_cust').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{

                           $('#scope_contract').val('');
                           $('#nature_contract').val('');
                            $('#nature_of_contract').val('');
                            $('#ContractDate').val('');
                            $('#ContractEOV').val('');
                            $('#ContractValue').val('');
                            swal("",data.RESPONSE);
                            if (action=="edit"){
                                redirect(back)

                            }





			}
			else
			{
                            swal("",data.RESPONSE);
			}

            }
        });
    }
}
*/
setTimeout(function(){
       checkthesidebarinfouser();
}, 800);
