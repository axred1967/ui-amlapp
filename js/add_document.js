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



}
app2.controller('personCtrl', function ($scope) {
                $scope.datalang = DATALANG;
            });


function save_kyc(type)
{


    var langfileloginchk = localStorage.getItem("language");

    if(langfileloginchk == 'en' )
    {
        var doc_namemsg ="Please enter Document Title";
       var imagenamemsg = "Please enter Document Image";
       var docuemtmsgsucedss ="Document Added Successfully";


    }
    else
    {
        var doc_namemsg ="Si prega di inserire Titolo del documento";
       var imagenamemsg = "Si prega di inserire Documento Immagine";
       var docuemtmsgsucedss ="Documento Aggiunto con successo";

    }


    var customer_id = localStorage.getItem("CustomerProfileId");

    var doc_name = $.trim($('#doc_name').val());

    var imagename = $('#doc_image').val();




    if(doc_name=="") swal("",doc_namemsg)
    else if(imagename == '') swal("",imagenamemsg)



    else
    {
        $('#kyc_button1').hide();
        $('#kyc_button2').hide();
        $('#loader_img').show();
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"savedocument",customer_id:customer_id,doc_name:doc_name,imagename:imagename},
            crossDomain: true,
            success:function(responceData){
                    $('#loader_img').hide();
                    $('#kyc_button1').show();
                    $('#kyc_button2').show();
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{
                           swal("",docuemtmsgsucedss);
                                setTimeout(function(){
                                redirect("multipledocuments.html");
                                }, 1000);
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
            alert('get picture failed');
        },
        {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        }
    );
}
function add_photo()
{
   // alert('cxccx');
   navigator.camera.getPicture(uploadPhoto,
        function(message) {
            alert('get picture failed');
        },
        {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.CAMERA
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
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image_multi&userid="+customer_id), win, fail, options);
}

function win(r)
{

  // alert(r.responseCode); alert(r.response);
   // alert(r.responseCode);
    //var userid = localStorage.getItem("userId");
    var review_info   =JSON.parse(r.response);
    var id = review_info.id;
    var customer_id = localStorage.getItem("CustomerProfileId");
    $('#doc_image').val(review_info.response);
   // var review_selected_image  =  review_info.review_id;
    //$('#review_id_checkin').val(review_selected_image);
    $.ajax ({
        type: "POST",
        url: BASEURL+"service.php",
        data: {"action":"get_document_image_name_multi","id":id},
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
