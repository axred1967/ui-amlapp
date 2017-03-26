var app = {
    initialize: function(){
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
            data: {"action":"viewkyc5",customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
            {


                var dropdown ='';
                $('#customer_fiscal_number').val(data.RESPONSE.customer_fiscal_number);
                $('#customer_address_resi').val(data.RESPONSE.customer_address_resi);
                $('#customer_domecile_address_residence').val(data.RESPONSE.customer_domecile_address_residence);
                $('#customer_main_nationality').val(data.RESPONSE.customer_main_nationality);
                 if((data.RESPONSE.dob !='0000-00-00') && (data.RESPONSE.dob !='1970-01-01') && (data.RESPONSE.dob !='2069-12-31'))
                {
                    $('#dob').val(data.RESPONSE.dob);
                }
                if(data.RESPONSE.customer_check_pep  == 1 )
                {
                    $('#radio1').attr("checked","checked");
                }
                else if(data.RESPONSE.customer_check_pep  == 0)
                {
                    $('#radio2').attr("checked","checked");
                }


                if(data.RESPONSE.customer_pep_domestic  == 1 )
                {
                    $('#radio3').attr("checked","checked");
                }
                else if(data.RESPONSE.customer_pep_domestic  == 0)
                {
                    $('#radio4').attr("checked","checked");
                }




                dropdown +='<option value="0" > Select place of birth *  </option>';
                $.each(data.countrylist, function( index, value ) {
                       dropdown +='<option value="'+value['country_id']+'" > '+value['country_name']+' </option>';
                        });
                        $('#customer_birth_country').html(dropdown);
                        if(data.RESPONSE.customer_birth_country != null  )
                        {
                             $('#customer_birth_country').val(data.RESPONSE.customer_birth_country);
                        }



                        setTimeout(function(){ $('#customer_id_type').val(data.RESPONSE.customer_id_type); }, 800);
                       if(data.RESPONSE.image != null)
                        {
                            $('#view_profile_image_plus').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                        }


            }
        }
        });

}



function save_kyc(type)
{


    var langfileloginchk = localStorage.getItem("language");

    if(langfileloginchk == 'en' )
    {
       var customer_resi_countrymsg ="Please enter Residence Country";
       var customer_address_resimsg ="Please enter Residence Address";
       var customer_address_resimsgvalid ="Please enter only Letters in Main Nationality";
       var  placeofbirthvalidte = "please select place of birth";

    }
    else
    {
       var customer_resi_countrymsg ="Si prega di inserire residenza di campagna";
       var customer_address_resimsg ="Si prega di inserire Residence Indirizzo";
       var customer_address_resimsgvalid ="Si prega di inserire solo lettere a Nazionalità principale";
       var  placeofbirthvalidte = "please select place of birth";
    }


    var customer_id = localStorage.getItem("CustomerProfileId");
    var customer_type = localStorage.getItem("Customertype");


    var customer_address_resi = $.trim($('#customer_address_resi').val());

    var customer_main_nationality = $.trim($('#customer_main_nationality').val());

   var customer_resi_country = $.trim($('#customer_resi_country').val());


   if($('#check_residence').prop("checked") == true){
       var  customer_domecile_country  = $('#customer_domecile_country').val();
       var customer_domecile_address_residence = $.trim($('#customer_domecile_address_residence').val());
    }else{
        var  customer_domecile_country = $.trim($('#customer_resi_country').val());
        var customer_domecile_address_residence = $.trim($('#customer_address_resi').val());
   }


    var dob = $('#dob').val();
    var customer_birth_country  = $('#customer_birth_country').val();
    var customer_fiscal_number = $.trim($('#customer_fiscal_number').val());
    var customer_check_pep='';
    if($('#radio1').is(':checked'))
    {
        customer_check_pep =1;
    }
    else if($('#radio2').is(':checked'))
    {
        customer_check_pep =0;
    }



    var customer_pep_domestic='';
    if($('#radio3').is(':checked'))
    {
        customer_pep_domestic =1;
    }
    else if($('#radio4').is(':checked'))
    {
         customer_pep_domestic =0;
    }

    if(customer_check_pep == 0){
        customer_pep_domestic = 2;
    }


    if( customer_birth_country == 0 ) swal("",placeofbirthvalidte);
   // else if(customer_address_resi== '') swal("",customer_address_resimsg);
   // else if(!checkletteronly(customer_main_nationality) && customer_main_nationality !='' )  swal("",customer_address_resimsgvalid)

    else
    {
        $('#kyc_button1').hide();
        $('#kyc_button2').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"savekyc5",customer_id:customer_id,dob:dob,customer_birth_country:customer_birth_country,customer_fiscal_number:customer_fiscal_number,customer_check_pep:customer_check_pep,customer_pep_domestic:customer_pep_domestic},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#kyc_button1').show();
                    $('#kyc_button2').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{
                           //swal("",data.RESPONSE);
                          // redirect("my_customer.html");
                          if(type ==2)
                          {
                                if(customer_type == 1)
                                {
                                    redirect("kycstep06.html");
                                }
                                else if(customer_type == 2)
                                {
                                    redirect("kycstep06.html");
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
}


setTimeout(function(){
        checkthesidebarinfouser();
}, 800);
