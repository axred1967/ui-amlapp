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
    },
    report: function(id) {
        // Report the event in the console
        console.log("Report: " + id);
    }
};
function getChkLogin()
{
  $http.post( LOG,  {r:"prima di login"})


    chkloggedin();
    $http.post( LOG,  {r:"passato login"})

}


setTimeout(function(){
        checkthesidebarinfouser();
}, 800);
