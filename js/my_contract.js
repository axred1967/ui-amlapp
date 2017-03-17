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


setTimeout(function(){
        checkthesidebarinfouser();
}, 800);



function tocontract(id)
{
    localstorage("contract_id",id);
    localstorage("Customertype",1);
    window.location = 'view_contract.html';
}
