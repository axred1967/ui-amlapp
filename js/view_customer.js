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
	var id=localStorage.getItem("userId");
	var email=localStorage.getItem("userEmail");
        var customer_id = localStorage.getItem("CustomerProfileId");

	  $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"view_Customer_Profile_info",id:id,email:email,customer_id:customer_id},
            crossDomain: true,
            success:function(responceData){
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
			{
                            $('#name_agent').html(data.RESPONSE.name);
                            $('#name_agent1').html(data.RESPONSE.name);
                            $('#email_agent').html(data.RESPONSE.email);
                            $('#mobile_number').html(data.RESPONSE.mobile_number);
                            if(data.RESPONSE.imagename != null)
                            {
                                $('#img_agent').attr("src",BASEURL+"uploads/user/small/"+data.RESPONSE.imagename);
                            }
			}
			else
			{

			}
            }
        });



}




function edit_risk_account()
{
    redirect('risk_profile1.html');
}

function edit_user_kycform()
{
    redirect('kyc.html');
}

function contract_company()
{
    redirect('contract_form.html');
}
function edit_info()
{
   redirect('edit_customer.html');

}

  function edit_docu()
  {
       redirect('multipledocuments.html');
  }



setTimeout(function(){
       checkthesidebarinfouser();
}, 800);
