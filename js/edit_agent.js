
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
	var id= localStorage.getItem("agentProfileId");
	var email=localStorage.getItem("userEmail");
	
	  $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"view_Agent_Profile_info",agent_id:id,email:email},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
			{ 
                            $('#name').val(data.RESPONSE.name);
                            $('#email').val(data.RESPONSE.email);
                            $('#mobile_number').val(data.RESPONSE.mobile_number);
                            if(data.RESPONSE.imagename !=null)
                            {
                                $('#agent_image').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.imagename);
                            } 
                           
                            $('#agent_previledge').val(data.RESPONSE.agent_previledge);
			}
			else
			{
                            
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
function update_profile()
{
    
   var langfileloginchk = localStorage.getItem("language");
    
    if(langfileloginchk == 'en' )
    {
        var namemsg ="Please enter Name";
       var mobilemsg ="Please enter Mobile Number";
       var mobilevalidmsg ="Please enter valid mobile number";
       var chkmobileaccpt ="Only 10 digit Mobile Number accepted";
       
    }
    else
    {
        var namemsg ="Si prega di inserire nome";
      var mobilemsg ="Si prega di inserire numero di cellulare";
       var mobilevalidmsg ="Si prega di inserire il numero di cellulare valido";
       var chkmobileaccpt ="Solo 10 cifre numero di cellulare accettato";
    }  
    
    
   var id=localStorage.getItem("agentProfileId");
   var email=localStorage.getItem("userEmail");
   
   var mobile_number = $.trim($('#mobile_number').val());
    var name = $.trim($('#name').val());
    var agent_previledge = $('#agent_previledge').val();
    
    if(name=="") swal("",namemsg);
	
    else if(mobile_number=="") swal("",mobilemsg);
    else if(isNaN(mobile_number))swal("",mobilevalidmsg);
    
    else
    {
	
	  $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"saveProfileAgent",id:id,email:email,name:name,mobile_number:mobile_number,agent_previledge:agent_previledge},
            crossDomain: true,
            success:function(responceData){
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{ 
                            swal("",data.RESPONSE);
                             
			}
			else
			{
                            swal("",data.RESPONSE);
			}
            
            }
        });
    }
}

function changepasswordpopup()
{
   $(".fancybox").fancybox(); 
   $("#popup3").click();
}
function change_password()
{
    var id=localStorage.getItem("userId");
   var email=localStorage.getItem("userEmail");
    var current_password = $.trim($('#current_password').val());
    var new_password = $.trim($('#new_password').val());
    var re_new_password = $.trim($('#re_new_password').val());
    
    if(current_password=="") swal("","Please enter Curent Password");
	
    else if(new_password=="") swal("","Please enter new password");
    else if(re_new_password=="") swal("","Please enter Confirm Password");
    else if(new_password != re_new_password) swal("","New Password doesn't match with Confirm Password ");
    else
    {
        $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"Password",id:id,email:email,currentPassword:current_password,newPassword:new_password},
            crossDomain: true,
            success:function(responceData){
                    data=JSON.parse(responceData);
			if(data.RESPONSECODE=='1')
			{ 
                            $('#current_password').val('');
                            $('#new_password').val('');
                            $('#re_new_password').val('');
                            swal("",data.RESPONSE);
                            $.fancybox.close(); 
                             
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
  // $("#agent_image").hide();
  // $('#profileimgloader').show(); 
   $("#agent_image").attr("src","img/load.gif");
    
    var userid = localStorage.getItem("agentProfileId");
   
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
    options.mimeType="text/plain";

    var params = new Object();

    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_user_image&userid="+userid), win, fail, options);
}

function win(r) 
{ 
    
  // alert(r.responseCode); alert(r.response);
   // alert(r.responseCode);
    var userid = localStorage.getItem("agentProfileId");
   // var review_info   =JSON.parse(r.response); 
   // var review_selected_image  =  review_info.review_id; 
    //$('#review_id_checkin').val(review_selected_image);
    $.ajax ({
        type: "POST",
        url: BASEURL+"service.php",
        data: {"action":"get_user_image_name","userid":userid},
        crossDomain: true,
        success:function(responceData){
            //alert(responceData);
            data=JSON.parse(responceData);
            if(data.RESPONSECODE==1)
            { 
               
                //$("#agent_image").show();
               // $('#profileimgloader').hide(); 
                localstorage("image",data.RESPONSE);
               // $('#agent_image').show();
                $("#agent_image").attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE);
            }
        }
    });
}

function fail(error) 
{ 
    $("#agent_image").attr("src","img/add-account.png");
   // $('#profileimgloader').hide(); 
   
}  

setTimeout(function(){ 
        checkthesidebarinfouser();
}, 800);


