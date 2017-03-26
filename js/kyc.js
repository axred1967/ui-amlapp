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
/*        var customer_id = localStorage.getItem("CustomerProfileId");
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"show_kyc_profile1",customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){

			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
            {
                var dropdown ='';
                $('#namekyc').val(data.RESPONSE.name);
                $('#surname').val(data.RESPONSE.surname);
                $('#email').val(data.RESPONSE.email);
                $('#customer_profession').val(data.RESPONSE.customer_profession);
                $('#mobile').val(data.RESPONSE.mobile_number);
                $('#customer_tel').val(data.RESPONSE.customer_tel);
                $('#customer_fax').val(data.RESPONSE.customer_fax);
               /* dropdown +='<option value="0" > Select Country  </option>';
                $.each(data.countrylist, function( index, value ) {
                       dropdown +='<option value="'+value['country_id']+'" > '+value['country_name']+' </option>';
                        });
                        $('#customer_resi_country').html(dropdown);
                        if(data.RESPONSE.customer_resi_country != null  )
                        {
                              $('#customer_resi_country').val(data.RESPONSE.customer_resi_country);
                        }
                        if(data.RESPONSE.image != null)
                        {
                            $('#view_profile_image_plus').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                        }


            }
        }
        });
*/
}



function save_kyc(type)
{
    var langfileloginchk = localStorage.getItem("language");

    if(langfileloginchk == 'en' )
    {
        var namemsg ="Please enter Name";
       var mobilemsg ="Please enter Mobile Number";
       var mobilevalidmsg ="Please enter valid mobile number";
       var chkmobileaccpt ="Only 10 digit Mobile Number accepted";
       var validmessageaddrees = "Please enter Address of residence";

    }
    else
    {
        var namemsg ="Si prega di inserire nome";
       var mobilemsg ="Si prega di inserire numero di cellulare";
       var mobilevalidmsg ="Si prega di inserire il numero di cellulare valido";
        var chkmobileaccpt ="Solo 10 cifre numero di cellulare accettato";
       var validmessageaddrees = "Si prega di inserire indirizzo di residenza";
    }



    var customer_id = localStorage.getItem("CustomerProfileId");

    var namekyc = $.trim($('#namekyc').val());
    var surname = $.trim($('#surname').val());
    var customer_profession = $.trim($('#customer_profession').val());
    var mobile = $.trim($('#mobile').val());
    var customer_tel = $.trim($('#customer_tel').val());
    var customer_fax = $.trim($('#customer_fax').val());
   // var customer_resi_country = $('#customer_resi_country').val();
    var cust_type = localStorage.getItem("Customertype");

    if(namekyc=="") swal("",namemsg);
    else if(mobile=="") swal("",mobilemsg);
    else if(isNaN(mobile))swal("",mobilevalidmsg);



   // else if(customer_resi_country=='') swal("",validmessageaddrees);


    else
    {
         $('#kyc_button1').hide();
        $('#kyc_button2').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"savekyc1",customer_id:customer_id,namekyc:namekyc,surname:surname,customer_profession:customer_profession,mobile:mobile,customer_tel:customer_tel,customer_fax:customer_fax},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#kyc_button1').show();
                    $('#kyc_button2').show();

                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{
                             //swal("",data.RESPONSE);
                             if(type == 2)
                             {
                                    redirect("kycstep02.html");

                             }
                            else
                            {
                                if(cust_type == 1 )
                                {
                                    redirect("my_customer.html");
                                }
                                else if(cust_type == 2)
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

}
