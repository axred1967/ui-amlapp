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
}

setTimeout(function(){
        checkthesidebarinfouser();
}, 800);



function tocustomer(d)
{
    localstorage("back",'my_customer.html');

   localstorage("CustomerProfileId",d.user_id);
    localstorage("Customertype",1);
    window.location = 'edit_customer.html';
}


function redirecttoowners(id)
{
    localstorage("CompanyId",id);

    redirect("owners_list.html");
}
