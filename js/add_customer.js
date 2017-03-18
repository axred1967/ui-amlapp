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



function add_customer()
{

    var langfileloginchk = localStorage.getItem("language");


    if(langfileloginchk == 'en' )
    {
        var namemsg ="Please enter Name";
        var surnamemsg ="Please enter Surname";

       var emailmsg ="Please enter Email";
       var mobilemsg ="Please enter Mobile Number";
       var mobilevalidmsg ="Please enter valid mobile number";
       var valid_emailmsg = "Please provide a valid Email ID";
       var chkmobileaccpt ="Only 10 digit Mobile Number accepted";
       var validmessageaddrees = "Please enter Address of residence";

    }
    else
    {
        var namemsg ="Si prega di inserire nome";
        var surnamemsg ="Si prega di inserire cognome";

       var emailmsg ="Inserisci e-mail";
       var mobilemsg ="Si prega di inserire numero di cellulare";
       var mobilevalidmsg ="Si prega di inserire il numero di cellulare valido";
       var valid_emailmsg = "Si prega di fornire un ID e-mail valido";
       var chkmobileaccpt ="Solo 10 cifre numero di cellulare accettato";
       var validmessageaddrees = "Si prega di inserire indirizzo di residenza";

    }

    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var customer_name = $.trim($('#customer_name').val());
    var customer_email = $.trim($('#customer_email').val());
    var customer_mobile_number = $.trim($('#customer_mobile_number').val());
    var customer_address_resi = $.trim($('#customer_address_resi').val());
   // var actedcompnay = $('#actofcompany').val();
    if($('#actofcompany').is(":checked"))
    {
        var actedcompnay = 1;
    }
    else
    {
       var actedcompnay = 0;
    }
    //alert(actedcompnay); exit;
    var usertype = localStorage.getItem('userType');

    if(customer_name=="") swal("",namemsg);
    if(customer_surname=="") swal("",surnamemsg);

    else if(customer_email=="") swal("",emailmsg);

    else if(customer_mobile_number =="") swal("",mobilemsg);
    else if(isNaN(customer_mobile_number))swal("",mobilevalidmsg);
    else if(customer_address_resi=='') swal("",validmessageaddrees);
    else if(!isValidEmailAddress(customer_email) )swal("",valid_emailmsg);

    else
    {
        $('#save_button_cust').hide();
        $('#cancel_button_cust').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL2,
            data: {"action":"addcustomer",id:id,email:email,usertype:usertype,customer_name:customer_name,customer_surname:customer_surname,customer_email:customer_email,customer_mobile_number:customer_mobile_number,customer_address_resi:customer_address_resi,actedcompnay:actedcompnay},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#save_button_cust').show();
                    $('#cancel_button_cust').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{

                           $('#customer_name').val('');
                           $('#customer_email').val('');
                            $('#customer_mobile_number').val('');
                            $('#customer_address_resi').val('');
                            $('#customer_username').val('');
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
                                        redirect("view_customer.html");
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
