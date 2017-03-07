 var app2 = angular.module('myApp', []);
            

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
            data: {"action":"show_contract",customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
            { 
			 if(data.RESPONSE.actofperson==1)
				{
					$('#actofperson').attr('checked', true);
					$("#act").css('display','');
				}
               
               
                $('#pr_of_service_contract').val(data.RESPONSE.pr_of_service_contract);
                $('#scope_contract').val(data.RESPONSE.scope_contract);
                $('#nature_contract').val(data.RESPONSE.nature_contract);
                $('#name_person_company').val(data.RESPONSE.name_person_company);
                $('#economic_value').val(data.RESPONSE.economic_value);
				
				$('#act_first_name').val(data.RESPONSE.act_name);
				$('#act_last_name').val(data.RESPONSE.act_surname);
				$('#act_email').val(data.RESPONSE.act_email);
				$('#act_mobile').val(data.RESPONSE.act_mobile);
				$('#act_address').val(data.RESPONSE.act_address);
				
                if(data.RESPONSE.image != null)
                {
                    $('#view_profile_image_plus').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                }
                $('#risk_defined').val(data.RESPONSE.risk_defined);
                $('#number_of_doc_with_validity').val(data.RESPONSE.number_of_doc_with_validity);
                $('#company_person_name').val(data.RESPONSE.company_person_name);
                
                
                  $('#act_name').val(data.RESPONSE.act_name);
                $('#act_surname').val(data.RESPONSE.act_surname);
                $('#act_username').val(data.RESPONSE.act_username);
                $('#act_email').val(data.RESPONSE.act_email);
                $('#act_mobile').val(data.RESPONSE.act_mobile);
                $('#act_address').val(data.RESPONSE.act_address);
                
                
                $('#act_password').val(data.RESPONSE.act_password);
                $('#act_nationality').val(data.RESPONSE.act_nationality);
                $('#act_docu_identity').val(data.RESPONSE.act_docu_identity);
                $('#act_authority_realesed_doc').val(data.RESPONSE.act_authority_realesed_doc);
                $('#act_realase_date').val(data.RESPONSE.act_realase_date);
	        $('#act_validity_date').val(data.RESPONSE.act_validity_date);
                $('#act_profession').val(data.RESPONSE.act_profession);
                $('#act_telephone').val(data.RESPONSE.act_telephone);
                $('#act_fax').val(data.RESPONSE.act_fax);
                $('#act_domi_address').val(data.RESPONSE.act_domi_address);
                $('#act_ficscal_no').val(data.RESPONSE.act_ficscal_no);
                $('#act_ficscal_no').val(data.RESPONSE.act_ficscal_no);
                $('#act_annual_income').val(data.RESPONSE.act_annual_income);
                $('#act_dob').val(data.RESPONSE.act_dob);
                $('#act_fax').val(data.RESPONSE.act_fax);
               
                $('#act_ficscal_no').val(data.RESPONSE.act_ficscal_no);
                
                
                var dropdown ='';              
                dropdown +='<option value="0" > Select Residence Country  </option>';
                $.each(data.countrylist, function( index, value ) {
                        dropdown +='<option value="'+value['country_id']+'" > '+value['country_name']+' </option>'; 
                 });
                 $('#act_resi_country').html(dropdown);
                  $('#act_resi_country').val(data.RESPONSE.act_resi_country);
                  var dropdown2 ='';              
                dropdown2 +='<option value="0" > Select Domicile Country  </option>';
                $.each(data.countrylist, function( index, value ) {
                        dropdown2 +='<option value="'+value['country_id']+'" > '+value['country_name']+' </option>'; 
                 });
                 $('#act_domi_country').html(dropdown2);
                 $('#act_domi_country').val(data.RESPONSE.act_domi_country);
                 var dropdown3 ='';              
                dropdown3 +='<option value="0" > Country where Birth  </option>';
                $.each(data.countrylist, function( index, value ) {
                        dropdown3 +='<option value="'+value['country_id']+'" > '+value['country_name']+' </option>'; 
                 });
                 $('#act_country_birth').html(dropdown3);
		$('#act_country_birth').val(data.RESPONSE.act_country_birth);
                $('#image_document').val(data.RESPONSE.act_customer_id_image);		
		$('#image_document1').val(data.RESPONSE.act_image);			
				
                if(data.RESPONSE.act_customer_id_image != '')
                {
                    //$('#view_profile_image_plus').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                    $("#agent_image").attr("src",BASEURL+"uploads/contractform/small/"+data.RESPONSE.act_customer_id_image);
                } 
                 if(data.RESPONSE.act_image != '')
                {
                    //$('#view_profile_image_plus').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                    $("#agent_image1").attr("src",BASEURL+"uploads/contractform/small/"+data.RESPONSE.act_image);
                }
            }
        }
        });
				
}

app2.controller('personCtrl', function ($scope) {
                $scope.datalang = DATALANG;
            });

function contract_form()
{
    var langfileloginchk = localStorage.getItem("language");
    
    if(langfileloginchk == 'en' )
    {
       var firstnamemsg ="Please enter First Name";
       var lastnamemsg = "Please enter Last Name";
       var emailmsg ="Please enter Email"; 
       var mobilemsg ="Please enter Mobile Number";
       var progressiveservicecontractmsg ="Please enter Progressive of Service Contract";
       var scopeofcontratctmsg ='Please enter Scope of Contract';
       var natureofcontractmsg ="Please enter Nature of Contract";
       var econimic_valuemsg ='Please enter Economic Value if Determinable';
       var nameoremailmsg ='Please provide Enter Name of Person or Companies';
        var validmessageaddrees = "Please enter Address ";
        var number_of_doc_with_validitymsg ="Please enter Number and Validity of ID Documents";
        var riskdefinedmsg ='Please provide Enter Risk Defined';
        var namemsgown ='Please provide Name';
       
    }
    else
    {
        var firstnamemsg ="Si prega di inserire Nome";
       var lastnamemsg = "Si prega di digitare il cognome";
       var emailmsg ="Inserisci e-mail"; 
       var mobilemsg ="Si prega di inserire numero di cellulare";
        var progressiveservicecontractmsg ="Si prega di inserire progressiva del Contratto di Servizio";
       var scopeofcontratctmsg ='Si prega di inserire Ambito di contratto';
       var natureofcontractmsg ="Si prega di inserire Natura del contratto";
       var econimic_valuemsg ='Inserisci il valore economico se determinabile';
       var nameoremailmsg ='Si prega di fornire Immettere il nome della persona o della società';
       var validmessageaddrees = "Inserisci indirizzo ";
       var number_of_doc_with_validitymsg ="Si prega di inserire il codice e la validità dei documenti d'identità";
        var riskdefinedmsg ='Si prega di fornire Inserisci rischio definiti';
        var namemsgown ='Si prega di fornire nome';
    }
    
    var id=localStorage.getItem("userId");
    var customer_id = localStorage.getItem("CustomerProfileId");
   
    var email=localStorage.getItem("userEmail");
    var pr_of_service_contract = $.trim($('#pr_of_service_contract').val());
    var scope_contract = $.trim($('#scope_contract').val());
    var nature_contract = $.trim($('#nature_contract').val());
    var name_person_company = $.trim($('#name_person_company').val());
    var number_of_doc_with_validity = $.trim($('#number_of_doc_with_validity').val());
    var risk_defined = $.trim($('#risk_defined').val());
    var company_person_name = $.trim($('#company_person_name').val());
    var economic_value = $.trim($('#economic_value').val());
    var usertype = localStorage.getItem('userType');
    
	    var actofperson = $.trim($('#actofperson').val());
            
            
             if($('#actofperson').is(":checked"))
    {
        var actofperson=1;	
        var act_name = $.trim($('#act_name').val());
        var act_surname = $.trim($('#act_surname').val());
       
        var act_email = $.trim($('#act_email').val());
        var act_mobile = $.trim($('#act_mobile').val());
        var act_resi_country = $.trim($('#act_resi_country').val());
        var act_address = $.trim($('#act_address').val());
        var act_domi_country = $.trim($('#act_domi_country').val());
        var act_domi_address = $.trim($('#act_domi_address').val());
        var act_nationality = $('#act_nationality').val();
        var act_ficscal_no = $.trim($('#act_ficscal_no').val());
        var act_dob = $.trim($('#act_dob').val());
        var act_country_birth = $.trim($('#act_country_birth').val());
        var act_docu_identity = $.trim($('#act_docu_identity').val());
        var act_authority_realesed_doc = $('#act_authority_realesed_doc').val();
        var act_realase_date = $.trim($('#act_realase_date').val());
        var act_validity_date = $.trim($('#act_validity_date').val());
        var act_profession = $.trim($('#act_profession').val());
        var act_telephone = $('#act_telephone').val();
        var act_fax = $.trim($('#act_fax').val());
        var act_annual_income = $('#act_annual_income').val();
        var act_password = $('#act_password').val();
        var image_document = $('#image_document').val();
        var imagename = $('#image_document1').val();
       
        
    }
    else
    {
        var actofperson=0;
        var act_name = '';
        var act_surname = '';
        
        var act_email = '';
        var act_mobile = '';
        var act_resi_country = '';
        var act_address = '';
        var act_domi_country = '';
        var act_domi_address ='';
        var act_nationality = '';
        var act_ficscal_no = '';
        var act_dob = '';
        var act_country_birth = '';
        var act_docu_identity = '';
        var act_authority_realesed_doc = '';
        var act_realase_date = '';
        var act_validity_date = '';
        var act_profession = '';
        var act_telephone = '';
        var act_fax = '';
        var act_annual_income = '';
        var act_password = '';
        image_document ='';
        imagename ='';
    }
    
	 if( pr_of_service_contract=="") swal("",progressiveservicecontractmsg);
    else if(scope_contract == '') swal("",scopeofcontratctmsg);
    else if(nature_contract =="") swal("",natureofcontractmsg);
    else if(economic_value=='') swal("",econimic_valuemsg );
    else if(name_person_company== '' )swal("",nameoremailmsg);
    else if(number_of_doc_with_validity== '' )swal("",number_of_doc_with_validitymsg)
    else if(risk_defined== '' )swal("",riskdefinedmsg)
    else if(company_person_name== '' )swal("",namemsgown)
    else
    {
        $('#save_button_cust').hide();
        $('#cancel_button_cust').hide();
        $('#loader_img').show();
		
		
		
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"contract_form_owner",id:id,customer_id:customer_id,pr_of_service_contract:pr_of_service_contract,scope_contract:scope_contract,nature_contract:nature_contract,name_person_company:name_person_company,economic_value:economic_value,number_of_doc_with_validity:number_of_doc_with_validity,risk_defined:risk_defined,company_person_name:company_person_name,'act_first_name':act_name,'act_last_name':act_surname,'act_email':act_email,'act_mobile':act_mobile,'act_address':act_address,'actofperson':actofperson,act_resi_country:act_resi_country,act_domi_country:act_domi_country,act_domi_address:act_domi_address,act_nationality :act_nationality,act_ficscal_no:act_ficscal_no,act_dob:act_dob,act_country_birth:act_country_birth,act_docu_identity:act_docu_identity,act_authority_realesed_doc:act_authority_realesed_doc,act_realase_date:act_realase_date,act_validity_date:act_validity_date,act_profession:act_profession,act_telephone:act_telephone,act_fax:act_fax,act_annual_income:act_annual_income,act_password:act_password,image_document:image_document,imagename:imagename    },
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#save_button_cust').show();
                    $('#cancel_button_cust').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{ 
                            
                           swal("",data.RESPONSE); 
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

function acks()
	{
		if ($('#actofperson').is(":checked"))
		{
			$("#act").css("display","");
		}
		else
		{
		    $("#act").css("display","none");
		}
	}


setTimeout(function(){ 
        checkthesidebarinfouser();
}, 800);


function uploadfromgallery()
{
   // alert('cxccx');
   navigator.camera.getPicture(uploadPhoto,
        function(message) { 
            //alert('get picture failed'); 
        },
        { 
            quality: 50, 
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY 
        }
    );
}

function uploadPhoto(imageURI) 
{
   $("#agent_image").hide();
   $('#profileimgloader').show(); 
    
     var customer_id = localStorage.getItem("CustomerProfileId");
   
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";

    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_imagecontract&userid="+customer_id), win, fail, options);
}

function win(r) 
{ 
    var review_info   =JSON.parse(r.response); 
    var imagename = review_info.response;
    
    $('#image_document').val(imagename);
    

   $('#profileimgloader').hide(); 
   $('#agent_image').show();
   $("#agent_image").attr("src",BASEURL+"uploads/contractform/small/"+imagename);
          
}

function fail(error) 
{ 
    $("#agent_image").show();
    $('#profileimgloader').hide(); 
   
} 



function uploadfromgallery1()
{
   // alert('cxccx');
   navigator.camera.getPicture(uploadPhoto1,
        function(message) { 
            //alert('get picture failed'); 
        },
        { 
            quality: 50, 
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY 
        }
    );
}

function uploadPhoto1(imageURI) 
{
   $("#agent_image1").hide();
   $('#profileimgloader1').show(); 
    
     var customer_id = localStorage.getItem("CustomerProfileId");
   
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";

    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_imagecontract&userid="+customer_id), win1, fail1, options);
}

function win1(r) 
{ 
    var review_info   =JSON.parse(r.response); 
    var imagename = review_info.response;
    
    $('#image_document1').val(imagename);
    

   $('#profileimgloader1').hide(); 
   $('#agent_image1').show();
   $("#agent_image1").attr("src",BASEURL+"uploads/contractform/small/"+imagename);
          
}

function fail1(error) 
{ 
    $("#agent_image1").show();
    $('#profileimgloader1').hide(); 
   
} 