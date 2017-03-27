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
  document.addEventListener("backbutton", onBackKeyDown, true);

    chkloggedin();

}


setTimeout(function(){
        checkthesidebarinfouser();
}, 800);



function tocontract(d)
{
    localstorage("contract_id",d.contract_id);
    localstorage("customer_id",d.contractor_id);
    localstorage("Customertype",1);
    window.location = 'view_contract.html';
}
