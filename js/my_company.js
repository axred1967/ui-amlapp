var back=localStorage.getItem("back");
if (back!==undefined && back.length>0){
//  localstorage("back","");
}
else {
back="my_company.html";
}
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
function tocompany(d)
{
    localstorage("CompanyId",d.company_id);
    localstorage("back","my_company.html");

    redirect("edit_company.html");
}
function add_company()
{
    redirect("add_company.html");
}

function redirecttoowners(id)
{
    localstorage("CompanyId",id);

    redirect("owners_list.html");
}





/*
setTimeout(function(){
        checkthesidebarinfouser();
}, 800);
*/
