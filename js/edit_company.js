
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
	$('.fancybox').fancybox();
        chkloggedin();
        var company_id = localStorage.getItem('CompanyId');
        
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"show_edit_company",company_id:company_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
            { 
                var dropdown ='';
                $('#company_name').val(data.RESPONSE.company_name);
                $('#company_address').val(data.RESPONSE.company_address);
                $('#comany_fiscal_id').val(data.RESPONSE.comany_fiscal_id);
                $('#company_authorised_by').val(data.RESPONSE.company_authorised_by);
                $('#company_authorisation_date').val(data.RESPONSE.company_authorisation_date);
                $('#fiscal_budget').val(data.RESPONSE.fiscal_budget);
                $('#compnay_doc_image').val(data.RESPONSE.compnay_doc_image);
                $('#company_lisence_image').val(data.RESPONSE.company_lisence_image);
               
                if(data.RESPONSE.compnay_doc_image != null)
                {
                    $("#compnay_doc").attr("src",BASEURL+"uploads/company/resize/"+data.RESPONSE.compnay_doc_image);
                }
                 if(data.RESPONSE.company_lisence_image != null)
                {
                    $("#compnay_doc_imagelicensew").attr("src",BASEURL+"uploads/company/resize/"+data.RESPONSE.company_lisence_image);
                }       
                        
               
              
            }
        }
        });
        setTimeout(function(){ 
        $('#edit_button_agent').show();
}, 2000);
       
				
}

app2.controller('personCtrl', function ($scope) {
                $scope.datalang = DATALANG;
            });
        
function save_kyc(type)
{
    
   var langfileloginchk = localStorage.getItem("language");
    
    if(langfileloginchk == 'en' )
    {
        var company_name_msg ="Please enter  Company Name";
       var company_addressmsg = "Please enter  Company Address";
       var comany_fiscal_idmsg ="Please enter  Fiscal Id"; 
       var validcomany_fiscal_idmsg ="Please enter the valid Fiscal Id";
       var compnay_doc_image_msg ="Please enter Document Image";
       var company_lisence_image_msg = "Please enter License Image";
       var company_authorised_by_msg ="Please enter Company authorised by";
       var company_authorisation_date_msg = "Please enter  Date Of Authorization";
       var fiscal_budget_msg ="Please enter  Fiscal Budget";
       var validcomany_fiscal_idmsg ="Please enter the valid Fiscal Id";
       
    }
    else
    {
        var company_name_msg ="Si prega di inserire Nome azienda";
       var company_addressmsg = "Inserisci Azienda Indirizzo";
       var comany_fiscal_idmsg ="Si prega di inserire fiscale Id"; 
       var validcomany_fiscal_idmsg ="Si prega di inserire la validità fiscale Id";
       var compnay_doc_image_msg ="Si prega di inserire Documento Immagine";
       var company_lisence_image_msg = "Si prega di inserire licenza Immagine";
       var company_authorised_by_msg ="Si prega di inserire società autorizzata dal";
       var company_authorisation_date_msg = "Si prega di inserire data di autorizzazione";
       var fiscal_budget_msg ="Si prega di inserire Fiscal Budget";
       var validcomany_fiscal_idmsg ="Si prega di inserire la validità fiscale Id";
    }   
    
    
   var company_id =   localStorage.getItem('CompanyId');
   var company_name = $.trim($('#company_name').val());
   var company_address = $.trim($('#company_address').val());
   var comany_fiscal_id = $.trim($('#comany_fiscal_id').val());
   var company_authorised_by = $.trim($('#company_authorised_by').val());
   var company_authorisation_date = $.trim($('#company_authorisation_date').val());
   var fiscal_budget = $.trim($('#fiscal_budget').val());
   var compnay_doc_image = $('#compnay_doc_image').val();
   var company_lisence_image = $('#company_lisence_image').val();
   
    if(company_name=="") swal("",company_name_msg)
    else if(company_address=="") swal("",company_addressmsg)
     else if(comany_fiscal_id=="") swal("",comany_fiscal_idmsg)
    else if(compnay_doc_image  == "") swal("",compnay_doc_image_msg)
    else if(company_lisence_image == '' ) swal("",company_lisence_image_msg)
    else if(company_authorised_by=="") swal("",company_authorised_by_msg)
    else if(company_authorisation_date=="") swal("",company_authorisation_date_msg)
    else if(fiscal_budget=="") swal("",fiscal_budget_msg)
    else
    {
        $('#kyc_button1').hide();
        $('#kyc_button2').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"edit_company",company_id:company_id,company_name:company_name,company_address:company_address,comany_fiscal_id:comany_fiscal_id,company_authorised_by:company_authorised_by,company_authorisation_date:company_authorisation_date,fiscal_budget:fiscal_budget,company_lisence_image:company_lisence_image,compnay_doc_image :compnay_doc_image },
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#kyc_button1').show();
                    $('#kyc_button2').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{ 
                           swal("",data.RESPONSE);  
                           setTimeout(function(){  redirect("company_list.html"); }, 800);
                              
			}
			else
			{
                            swal("",data.RESPONSE);
			}
            
            }
        });
    }    
}


function openuploadoptions()
{ 
    $("#popup4").click();
    
}

function take_pic()
{
	
    $.fancybox.close();
    
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });

    function onSuccess(imageURI) {
        //alert(imageURI);
        //var image = document.getElementById('myImage');
        //image.src = imageURI;
 
       $("#compnay_doc_imagelicensew").attr("src","img/load.gif");
    
    var userid = localStorage.getItem("userId");
   
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";

    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_company_lisence_image&custid="+userid), win, fail, options);
    }

    function onFail(message) {
       //alert('Failed because: ' + message);
    }
}


function openuploadoptions1()
{ 
    $("#popup3").click();
    
}

function take_pic1()
{
	
    $.fancybox.close();
    
    navigator.camera.getPicture(onSuccess1, onFail1, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });

    function onSuccess1(imageURI) {
        //alert(imageURI);
        //var image = document.getElementById('myImage');
        //image.src = imageURI;
 
        $("#compnay_doc").attr("src","img/load.gif");

        var userid = localStorage.getItem("userId");

         var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
        options.mimeType="text/plain";

        var params = new Object();

        options.params = params;
        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_compnay_doc_image&custid="+userid), win1, fail1, options);

    }

    function onFail1(message) {
       //alert('Failed because: ' + message);
    }
}



function uploadfromgallery1()
{
   // alert('cxccx');
    $.fancybox.close();
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
  
   $("#compnay_doc").attr("src","img/load.gif");
    
    var userid = localStorage.getItem("userId");
   
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";

    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_compnay_doc_image&custid="+userid), win1, fail1, options);
}

function win1(r) 
{ 
    
  // alert(r.responseCode); alert(r.response);
   // alert(r.responseCode);
    var userid = localStorage.getItem("userId");
   // var review_info   =JSON.parse(r.response); 
   // var review_selected_image  =  review_info.review_id; 
    //$('#review_id_checkin').val(review_selected_image);
    
    var review_info   =JSON.parse(r.response); 
    var id = review_info.id;
    $.ajax ({
        type: "POST",
        url: BASEURL+"service.php",
        data: {"action":"get_compnay_doc_image_name","id":id},
        crossDomain: true,
        success:function(responceData){
            //alert(responceData);
            data=JSON.parse(responceData);
            $('#compnay_doc_image').val(data.RESPONSE);
            if(data.RESPONSECODE==1)
            { 
              
                localstorage("image",data.RESPONSE);
             
                $("#compnay_doc").attr("src",BASEURL+"uploads/company/resize/"+data.RESPONSE);
            }
        }
    });
}

function fail1(error) 
{ 
   $("#compnay_doc").attr("src","img/add-account.png");
   // $('#profileimgloader').hide(); 
   
}  


function uploadfromgallery()
{
   // alert('cxccx');
    $.fancybox.close();
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
  
   $("#compnay_doc_imagelicensew").attr("src","img/load.gif");
    
    var userid = localStorage.getItem("userId");
   
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";

    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_company_lisence_image&custid="+userid), win, fail, options);
}

function win(r) 
{ 
    
  // alert(r.responseCode); alert(r.response);
   // alert(r.responseCode);
    var userid = localStorage.getItem("userId");
   // var review_info   =JSON.parse(r.response); 
   // var review_selected_image  =  review_info.review_id; 
    //$('#review_id_checkin').val(review_selected_image);
    var review_info   =JSON.parse(r.response); 
    var id = review_info.id;
    $.ajax ({
        type: "POST",
        url: BASEURL+"service.php",
        data: {"action":"get_company_lisence_image_name","id":id},
        crossDomain: true,
        success:function(responceData){
            //alert(responceData);
            data=JSON.parse(responceData);
            $('#company_lisence_image').val(data.RESPONSE);
            if(data.RESPONSECODE==1)
            {
                
               
                //$("#agent_image").show();
               // $('#profileimgloader').hide(); 
                localstorage("image",data.RESPONSE);
               // $('#agent_image').show();
                $("#compnay_doc_imagelicensew").attr("src",BASEURL+"uploads/company/resize/"+data.RESPONSE);
            }
        }
    });
}

function fail(error) 
{ 
   $("#compnay_doc_imagelicensew").attr("src","img/add-account.png");
   // $('#profileimgloader').hide(); 
   
}  



setTimeout(function(){ 
       checkthesidebarinfouser();
}, 800);


