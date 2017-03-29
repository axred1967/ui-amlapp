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
         var langchkvarlang = localStorage.getItem("language");
         if(langchkvarlang == null)
         {
               redirect("language.html");
         }
        var id=localStorage.getItem("userId");
        if(!id)
        {
            redirect("login.html");
        }
        else
        {
            redirect("my_contract.html");
        }



}

setTimeout(function(){
        var id=localStorage.getItem("userId");
	      var email=localStorage.getItem("userEmail");
        var usertype = localStorage.getItem('userType');
         var name = localStorage.getItem("Name");

         var image = localStorage.getItem("Profileimageagencyuser");

        if(image != null)
        {
            if(image !='null')
            {

                $('#Profileimageagencyuser').attr("src",BASEURL+"uploads/user/small/"+image);
            }
        }


        $('#Profileimageagencyusername').html(name);
        $('#Profileimageagencyuseremail').html(email);
}, 800);
