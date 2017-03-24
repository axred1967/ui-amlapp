var SITE_TITLE = 'Amlapp';
var SITE_KEYWORD = 'Amlapp';
var SITE_DESCRIPTION = 'Amlapp';
document.title = SITE_TITLE;
//var BASEURL = "http://192.168.0.5/Deve02/amlapp/";
//var SERVICEURL = "http://192.168.0.5/Deve02/amlapp/service.php";
//var SERVICEURL2 = "http://192.168.0.5/Deve02/amlapp/service2.php";
var BASEURL = "http://www.euriskoformazione.com/amlapp/";
var SERVICEURL = "http://www.euriskoformazione.com/amlapp/service.php";
var SERVICEURL2 = "http://www.euriskoformazione.com/amlapp/service.php";

function chkloggedin()
{
    var chksession = localStorage.getItem('userId');
    var typesi = localStorage.getItem('userType');
    var langfile = localStorage.getItem("language");
    if (!chksession)
    {
         window.location = "login.html";
    }
    else
    {

        if(typesi==2)
        {
            var priviledgevalue = localStorage.getItem("priviligetype");
            if(priviledgevalue == 0 )
            {
                $('#sidebar_agency').load("sidebar_agent_no_"+langfile+ " .html");
            }
            else
            {
                $('#sidebar_agency').load("sidebar_agent_"+langfile+ ".html");
            }
        }
        else
        {
        $('#sidebar_agency').load("sidebar_"+langfile+ ".html");
        }
            //setTimeout(function(){$("#loginName").html(localStorage.getItem("userName"));}, 1000);
    }
}

function chklogin()
{
   var chksession = localStorage.getItem('userId');

    if (!chksession && chksession!=0)
    {
        window.location = "login.html";
    }
    else
    {
        window.location = "index.html";

    }
}
function logout()
{
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("userEmail");
    window.localStorage.removeItem("userType");
    window.localStorage.removeItem("Name");
    window.localStorage.removeItem("CustomerProfileId");
    window.localStorage.removeItem("Customertype");
    window.localStorage.removeItem("CompanyId");
    window.localStorage.removeItem("priviligetype");
    redirect("login.html");
}

/*show notification*/
function showAlert(msg)
{
    alert(msg);
}
/*define local storage*/
function localstorage(key,value)
{
    window.localStorage.setItem(key,value);
}
/*remove local storage*/
function removestorage(key)
{
    window.localStorage.removeItem(key);
}
function redirect(url)
{
    window.location = url;
}

function getItem(key)
{
    return localStorage.getItem(key);
}
function backpage()
{
    window.history.back()
}

function showMessage(message, callback, title, buttonName) {
    title = title || "default title";
    buttonName = buttonName || 'OK';
    if(navigator.notification && navigator.notification.alert) {
        navigator.notification.alert(
            message,    // message
            callback,   // callback
            title,      // title
            buttonName  // buttonName
        );
    } else {
        alert(message);
    }
}

function checkthesidebarinfouser()
{
    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var usertype = localStorage.getItem('userType');
    var name = localStorage.getItem("Name");

     $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"fetchuserimage",id:id},
            crossDomain: true,
            success:function(responceData){
                      //  alert(data);
                        data=JSON.parse(responceData);
                        var image =data.RESPONSE;
			if(image != null)
                        {
                            if(image !='null')
                            {

                                $('#Profileimageagencyuser').attr("src",BASEURL+"uploads/user/small/"+image);
                                $('#view_profile_image').attr("src",BASEURL+"uploads/user/small/"+image);
                            }
                        }
                        $('#Profileimageagencyusername').html(data.NAME);

            }
        });

     var image = localStorage.getItem("Profileimageagencyuser");





    $('#Profileimageagencyuseremail').html(email);
}


function isValidEmailAddress(emailAddress)
{
	  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	  return pattern.test(emailAddress);
};


function checkconnection()
{

    var networkState = navigator.connection && navigator.connection.type;
    setTimeout(function(){
        networkState = navigator.connection && navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
        if(states[networkState]=='No network connection')
        {
			alert('Net Off');
           // window.plugins.toast.show('Please check your network connection', 'long', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})

        }


    }, 500);

}

function letterNumber(inputtxt)
{
   var letterNumberval = /^[0-9a-zA-Z]+$/;
   return letterNumberval.test(inputtxt);
}

function checkletteronly(inputvalue)
{
    var lettercheck = /^[a-zA-Z]+$/;
    return lettercheck.test(inputvalue);
}


var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            var milliseconds = Date.parse(match[0])
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
    return input
}

function convertDatestoStrings(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if ((toString.call(value)) == 'Date') {
            input[key]=(new Date()).toISOString().substring(0, 19)
        }
    }
    return input
}
