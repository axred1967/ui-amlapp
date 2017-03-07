var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', getChkLogin(), false);
    },
    deviceready: function() {
        app.report('deviceready');
    },
    report: function(id) {
        console.log("Report: " + id);
    }
};
function getChkLogin()
{
        
 	 ///chkloggedin();
    				
			
}


function clang(lang)
{
    localstorage("language",lang);
    redirect("login.html");
	   
}
  


