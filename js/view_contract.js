var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', getChkLogin, false);
    },
    deviceready: function() {
        // This is an event handler function, which means the scope is the event.
        // So, we must explicitly called `app.report()` instead of `this.report()`.
        app.report('deviceready');
        document.addEventListener("backbutton", onBackKeyDown, false);
    },
    report: function(id) {
        // Report the event in the console
        console.log("Report: " + id);
    },

};
function getChkLogin()
{
        //document.addEventListener("backbutton", onBackKeyDown, false);

        chkloggedin();

}
function edit_risk_account()
{
  localstorage("back","view_contract.html");

  localstorage("Customertype",1);
    redirect('risk_profile1.html');
}

function edit_user_kycform()
{
    localstorage("back","view_contract.html");
    redirect('kyc.html');
}

function contract_company()
{
    localstorage("back","view_contract.html");
    redirect('contract_form.html');
}
function edit_info(id)
{
   localstorage("CustomerProfileId",id);
   localstorage("back","view_contract.html");
   redirect('edit_customer.html');

}

  function edit_docu()
  {
       localstorage("back","view_contract.html");
       redirect('multipledocuments.html');
  }



setTimeout(function(){
       checkthesidebarinfouser();
}, 800);
