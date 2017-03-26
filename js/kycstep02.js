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
            data: {"action":"show_kyc_profile2",customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
            {

                var dropdown ='';
                $('#customer_id_authority_name').val(data.RESPONSE.customer_id_authority_name);

                $('#placeofidentification').val(data.RESPONSE.place_of_identification);


               if((data.RESPONSE.date_of_identification !='0000-00-00') && (data.RESPONSE.date_of_identification !='1970-01-01') && (data.RESPONSE.date_of_identification !='2069-12-31'))
                {
                $('#dateofidentification').val(data.RESPONSE.date_of_identification);
                }





                if((data.RESPONSE.customer_id_release_date !='0000-00-00') && (data.RESPONSE.customer_id_release_date !='1970-01-01') && (data.RESPONSE.customer_id_release_date !='2069-12-31'))
                {
                $('#customer_id_release_date').val(data.RESPONSE.customer_id_release_date);
                }

                 if((data.RESPONSE.customer_id_validity !='0000-00-00') && (data.RESPONSE.customer_id_validity !='1970-01-01') && (data.RESPONSE.customer_id_validity !='2069-12-31'))
                {
                $('#customer_id_validity').val(data.RESPONSE.customer_id_validity);
                }



                $('#customer_annual_income').val(data.RESPONSE.customer_annual_income);
                 $('#image_document').val(data.RESPONSE.customer_id_image);

                if(data.RESPONSE.customer_id_image != null)
                {
                    $("#agent_image").attr("src",BASEURL+"uploads/document/user_"+customer_id+"/resize/"+data.RESPONSE.customer_id_image);
                }
                       $('#customer_id_type').val(data.RESPONSE.customer_id_type);
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
        var customer_id_typemsg ="Please enter any Id";
       var imagenamemsg ="Please enter document Image";
       var customer_id_release_datemsg ="Please Select Release date";
       var customer_id_validitymsg ="Please Select validity date";
       var placeofidentification_validitymsg = "Please Enter Place Of Identification";
       var dateofidentification_validitymsg =  "Please Select Date Of Identification";

    }
    else
    {
        var customer_id_typemsg ="Si prega di inserire qualsiasi Id";
       var imagenamemsg ="Inserisci il documento di immagine";
       var customer_id_release_datemsg ="Seleziona la data di rilascio";
       var customer_id_validitymsg ="Seleziona la data di validità";
       var placeofidentification_validitymsg = "Please Enter Place Of Identification";
       var dateofidentification_validitymsg =  "Please Select Date Of Identification";



    }


    var customer_id = localStorage.getItem("CustomerProfileId");

    var customer_id_authority_name = $.trim($('#customer_id_authority_name').val());
    var customer_id_type = $.trim($('#customer_id_type').val());
    var customer_id_release_date = $.trim($('#customer_id_release_date').val());
    var customer_id_validity = $.trim($('#customer_id_validity').val());
    var customer_annual_income = $.trim($('#customer_annual_income').val());
    var placeofidentification = $.trim($('#placeofidentification').val());
    var dateofidentification = $.trim($('#dateofidentification').val());


    var imagename = $('#image_document').val();
    var cust_type = localStorage.getItem("Customertype");




    if(customer_id_type=="") swal("",customer_id_typemsg)
    else if(imagename == '') swal("",imagenamemsg)
    else if(customer_id_release_date == '') swal("",customer_id_release_datemsg)
    else if(customer_id_validity =="")swal("",customer_id_validitymsg)
    else if(placeofidentification == "")swal("",placeofidentification_validitymsg)
    else if(dateofidentification == "")swal("",dateofidentification_validitymsg)


    else
    {
         $('#kyc_button1').hide();
        $('#kyc_button2').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"savekyc2",customer_id:customer_id,customer_id_authority_name:customer_id_authority_name,customer_id_type:customer_id_type,customer_id_release_date:customer_id_release_date,customer_id_validity:customer_id_validity,customer_annual_income:customer_annual_income,imagename:imagename,placeofidentification:placeofidentification,dateofidentification:dateofidentification},
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
                              redirect("kycstep03.html");
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
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image&userid="+customer_id), win, fail, options);
}

function win(r)
{

  // alert(r.responseCode); alert(r.response);
   // alert(r.responseCode);
    //var userid = localStorage.getItem("userId");
    var review_info   =JSON.parse(r.response);
    var id = review_info.id;
    var customer_id = localStorage.getItem("CustomerProfileId");
    $('#image_document').val(review_info.response);
   // var review_selected_image  =  review_info.review_id;
    //$('#review_id_checkin').val(review_selected_image);
    $.ajax ({
        type: "POST",
        url: BASEURL+"service.php",
        data: {"action":"get_document_image_name","id":id},
        crossDomain: true,
        success:function(responceData){
            //alert(responceData);
            data=JSON.parse(responceData);
            if(data.RESPONSECODE==1)
            {

                $("#agent_image").show();
                $('#profileimgloader').hide();
                localstorage("image",data.RESPONSE);
                $('#agent_image').show();
                $("#agent_image").attr("src",BASEURL+"uploads/document/user_"+customer_id+"/resize/"+data.RESPONSE);
            }
        }
    });
}

function fail(error)
{
    $("#agent_image").show();
    $('#profileimgloader').hide();

}
setTimeout(function(){
        checkthesidebarinfouser();
}, 800);
