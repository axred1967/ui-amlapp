
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
            data: {"action":"show_kyc_profile4",customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
            {
                var dropdown ='';
                $('#user_role_with_company').val(data.RESPONSE.user_role_with_company);
                $('#company_name').val(data.RESPONSE.company_name);
                $('#company_address').val(data.RESPONSE.company_address);
                $('#comany_fiscal_id').val(data.RESPONSE.comany_fiscal_id);
                $('#company_authorised_by').val(data.RESPONSE.company_authorised_by);
                $('#company_authorisation_date').val(data.RESPONSE.company_authorisation_date);
                $('#fiscal_budget').val(data.RESPONSE.fiscal_budget);

                if(data.RESPONSE.compnay_doc_image != null)
                {
                    $("#compnay_doc").attr("src",BASEURL+"uploads/company/resize/"+data.RESPONSE.compnay_doc_image);
                }
                if(data.RESPONSE.company_lisence_image != null)
                {
                    $("#compnay_doc_imagelicensew").attr("src",BASEURL+"uploads/company/resize/"+data.RESPONSE.company_lisence_image);
                }
                       //setTimeout(function(){ $('#customer_id_type').val(data.RESPONSE.customer_id_type); }, 800);
                 if(data.RESPONSE.image != null)
                        {
                            $('#view_profile_image_plus').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.image);
                        }


            }
        }
        });

}

app2.controller('personCtrl', function ($scope) {
                $scope.datalang = DATALANG;
            });

function save_kyc(type)
{

    var langfileloginchk = localStorage.getItem("language");

    if(langfileloginchk == 'en' )
    {
        var user_role_with_companymsg ="Please enter User Role in company";


    }
    else
    {
       var user_role_with_companymsg ="Inserisci il ruolo utente nell'azienda";

    }



    var customer_id = localStorage.getItem("CustomerProfileId");

   var customer_type = localStorage.getItem("Customertype");
   var user_role_with_company = $('#user_role_with_company').val();

    if(user_role_with_company=="") swal("", user_role_with_companymsg)
    else
    {
        $('#kyc_button1').hide();
        $('#kyc_button2').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"savekyc4",customer_id:customer_id,user_role_with_company:user_role_with_company},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#kyc_button1').show();
                    $('#kyc_button2').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{
                            if(type == 2)
                            {
                                redirect("kycstep05.html");
                            }
                            else
                            {
                                redirect("owners_list.html");
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

//
//function uploadfromgallery()
//{
//   // alert('cxccx');
//   navigator.camera.getPicture(uploadPhoto,
//        function(message) {
//            //alert('get picture failed');
//        },
//        {
//            quality: 50,
//            destinationType: navigator.camera.DestinationType.FILE_URI,
//            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
//        }
//    );
//}
//
//function uploadPhoto(imageURI)
//{
//   $("#agent_image").hide();
//   $('#profileimgloader').show();
//
//     var customer_id = localStorage.getItem("CustomerProfileId");
//
//    var options = new FileUploadOptions();
//    options.fileKey="file";
//    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
//    options.mimeType="text/plain";
//
//    var params = new Object();
//
//    options.params = params;
//    var ft = new FileTransfer();
//    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image&userid="+customer_id), win, fail, options);
//}
//
//function win(r)
//{
//
//  // alert(r.responseCode); alert(r.response);
//   // alert(r.responseCode);
//    //var userid = localStorage.getItem("userId");
//    var review_info   =JSON.parse(r.response);
//    var id = review_info.id;
//    var customer_id = localStorage.getItem("CustomerProfileId");
//    $('#image_document').val(review_info.response);
//   // var review_selected_image  =  review_info.review_id;
//    //$('#review_id_checkin').val(review_selected_image);
//    $.ajax ({
//        type: "POST",
//        url: BASEURL+"service.php",
//        data: {"action":"get_document_image_name","id":id},
//        crossDomain: true,
//        success:function(responceData){
//            //alert(responceData);
//            data=JSON.parse(responceData);
//            if(data.RESPONSECODE==1)
//            {
//
//                $("#agent_image").show();
//                $('#profileimgloader').hide();
//                localstorage("image",data.RESPONSE);
//                $('#agent_image').show();
//                $("#agent_image").attr("src",BASEURL+"uploads/document/user_"+customer_id+"/resize/"+data.RESPONSE);
//            }
//        }
//    });
//}
//
//function fail(error)
//{
//    $("#agent_image").show();
//    $('#profileimgloader').hide();
//
//}
