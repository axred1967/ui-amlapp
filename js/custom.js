var SITE_TITLE = 'Amlapp';
var SITE_KEYWORD = 'Amlapp';
var SITE_DESCRIPTION = 'Amlapp';
document.title = SITE_TITLE;
//var BASEURL = "http://192.168.0.5/Deve02/amlapp/";
//var SERVICEURL = "http://192.168.0.5/Deve02/amlapp/service.php";
//var SERVICEURL2 = "http://192.168.0.5/Deve02/amlapp/service2.php";
//test su euriskoformazion
/*
var BASEURL = "http://www.euriskoformazione.com/amlapp/";
var SERVICEURL = "http://www.euriskoformazione.com/amlapp/service.php";
var SERVICEURL2 = "http://www.euriskoformazione.com/amlapp/service.php";
var LOG = "http://www.euriskoformazione.com/amlapp/log.php";
*/
// su amlapp
/* Ambiente sviluppo
var BASEURL = "https://amlapp.euriskoformazione.com/dev";
var SERVICEURL = "https://amlapp.euriskoformazione.com/dev/service.php";
var SERVICEURL2 = "https://amlapp.euriskoformazione.com/dev/service.php";
var LOG = "https://amlapp.euriskoformazione.com/dev/log.php";
*/
/* Ambiente produzione */
var BASEURL = "https://amlapp.euriskoformazione.com/";
var SERVICEURL = "https://amlapp.euriskoformazione.com/service.php";
var SERVICEURL2 = "https://amlapp.euriskoformazione.com/service.php";
var LOG = "https://amlapp.euriskoformazione.com/log.php";



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
   document.location.href = url,true;
    //exit();
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

                                //$('#Profileimageagencyuser').attr("src",BASEURL+"uploads/user/small/"+image);
                                //$('#view_profile_image').attr("src",BASEURL+"uploads/user/small/"+image);
                                //$('#Profileimageagencyuseremail').html(email);
                            }
                        }
                        $('#Profileimageagencyusername').html(data.NAME);

            }
        });

     var image = localStorage.getItem("Profileimageagencyuser");





}
function baseName(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1);
    if(base.lastIndexOf(".") != -1)
        base = base.substring(0, base.lastIndexOf("."));
   return base;
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
    if (typeof input !== "object") {
      if (typeof input === "string" && (match = value.match(regexIso8601))) {
          var milliseconds = Date.parse(match[0])
          if (!isNaN(milliseconds)) {
              input = new Date(milliseconds);
          }
      }
      return input;

    }

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
            //convertDateStringsToDates(value);
        }
    }
    return input
}

function convertDatestoStrings(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object" || toString.call(input) == '[object Date]') {
      if (toString.call(input) == '[object Date]') {
          input=(new Date()).toISOString().substring(0, 19)
      }
      return input;
    }

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if ((toString.call(value)) == '[object Date]') {
            input[key]=(new Date()).toISOString().substring(0, 19)
        }
        else if (typeof value === "object") {
            // Recurse into object
            convertDatestoStrings(value);
        }
    }
    return input
}

function onBackKeyDown(evt) {
//  alert('back');
//alert("previous url is: " + window.history.previous.href);
  console.log('indietro')
  if (localStorage.getItem('stack')!=null) {
    stack=JSON.parse(localStorage.getItem('stack'))
    if (stack.lenght>0) {
    lastkey= Object.keys($scope.stack).pop() ;
    back=lastkey
    delete stack[back]
    redirect(back)
    return
    }
  }
  if(window.history.previous!==undefined)
    window.history.back();
}
function base_name(path) {
   url=String(window.location).split('/').reverse()[0]
   return url.split('?')[0];
}
function IsJsonString(str,isa) {
    try {
        var js=JSON.parse(str);
        $('input[type="date"]').each(function(){
         d=$(this).attr('ng-model')
         var res=d.split('.')
         if (js[res.slice(-1)[0]]!=undefined  && js[res.slice(-1)[0]]!==null){
           js[res.slice(-1)[0]]=new Date(js[res.slice(-1)[0] ])

         }
          if (js[res.slice(-1)[0]]===null ){
            js[res.slice(-1)[0]]=new Date()
          }



       })
        if (!isObject(js)){
          js=IsJsonString(js)
        }
    } catch (e) {
      if (isa)
        x=[]
      else
        x={}
        return x;
      };


    return js;
}
function exit( status ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brettz9.blogspot.com)
    // +      input by: Paul
    // +   bugfixed by: Hyam Singer (http://www.impact-computing.com/)
    // +   improved by: Philip Peterson
    // +   bugfixed by: Brett Zamir (http://brettz9.blogspot.com)
    // %        note 1: Should be considered expirimental. Please comment on this function.
    // *     example 1: exit();
    // *     returns 1: null

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}
function isObject (item) {
  return ((typeof item === "object" || Array.isArray(item)) && item !== null);
}
function getCountryList(){

  countryList=IsJsonString(localStorage.getItem('countryList'))
  if (isObject(countryList))
  return countryList
  else
  $.ajax ({
    type: "POST",
    async:false,
    url: SERVICEURL,
    data: {"action":"countryList",agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")},
    crossDomain: true,
    success:function(responceData){
      //  alert(data);
      data=JSON.parse(responceData);
      localstorage('countryList',JSON.stringify(data.countryList))
    }
  });
  countryList=IsJsonString(localStorage.getItem('countryList'))
  return countryList

}
function resize_img(){
    $('.demo-card-image img.loadImg').each(function() {
      var maxHeight = $(this).parent().height();    // Max height for the image
      var maxWidth = $(this).parent().width();    // Max height for the image
      var height = $(this).height();  // Current image height
      var width = $(this).width();    // Current image width
      var height = $(this).height();  // Current image height
      var ratio_ori = width/height;  // Used for aspect ratio
      var ratio_height = height/maxHeight;  // Used for aspect ratio
      var ratio_width = width/maxWidth;  // Used for aspect ratio
      //$(this).show()

      // Check if the current width is larger than the max

      // Check if current height is larger than max
      if(height > maxHeight){
        $(this).css("height", maxHeight);   // Set new height
        $(this).css("width", width*1/ratio_height );   // Set new height
      }

      if(width > maxWidth){
        $(this).css("width", maxWidth);   // Set new height
        $(this).css("height", height*1/ratio_width);   // Set new height
      }
/*
      var maxWidth = $('.demo-card-image').width(); // Max width for the image
      var maxHeight = $('.demo-card-image').width();    // Max height for the image
      var ratio = 1/1;  // Used for aspect ratio
			var maxHeight = $('.demo-card-image').width()*1/1;    // Max height for the image
      var width = $(this).width();    // Current image width
      var height = $(this).height();  // Current image height
      $(this).show()

      // Check if the current width is larger than the max
      if(width > maxWidth){
        ratio = maxWidth / width;   // get ratio for scaling image
        $(this).css("width", maxWidth); // Set new width
        $(this).css("height", height * ratio);  // Scale height based on ratio
        $(this).css("backgroud-size",  maxWidth +'px' + height*ratio+'px' );  // Scale height based on ratio
        height = height * ratio;    // Reset height to match scaled image
        width = width * ratio;    // Reset width to match scaled image
      }else {
				$(this).css("width", maxWidth);

			}

      // Check if current height is larger than max
      if(height > maxHeight){
        ratio = maxHeight / height; // get ratio for scaling image
        $(this).css("height", maxHeight);   // Set new height
        $(this).css("width", width * ratio);    // Scale width based on ratio
        $(this).css("backgroud-size",  width * ratio +'px' + maxheight+'px' );  // Scale height based on ratio
        $(this).css("backgroud-size",  width * ratio +'px' + maxheight+'px' );  // Scale height based on ratio
        width = width * ratio;    // Reset width to match scaled image
        height = height * ratio;    // Reset height to match scaled image
      }
			else {
				$(this).css("height", maxHeight);
			}
*/

    });
}
function setDefaults($scope){
  $('input').each(
    function(index){
      if ($(this).hasClass('mdl-textfield__input')){
        $(this).parent('div.mdl-textfield').addClass('is-dirty');
        $(this).parent('div.mdl-textfield').removeClass('is-invalid');
      }

      ngm=$(this).attr('ng-model')
      if (ngm===undefined){
        ngm=$(this).attr('modelAx')
      }
      if (typeof ngm !== typeof undefined && ngm !== false){
        var $val
        s = ngm.split(".")
        switch (s.length){
          case 1:
          if ( $scope[s[0]]!==undefined)
          $val= $scope[s[0]]
          break;
          case 2:
          if ( $scope[s[0]]!==undefined)
          if ( $scope[s[0]][s[1]]!==undefined)
          $val= $scope[s[0]][s[1]]
          break;
          case 3:
          if ( $scope[s[0]]!==undefined)
          if ( $scope[s[0]]!==undefined)
          if ( $scope[s[0]][s[1]][s[2]]!==undefined)
          $val= $scope[s[0]][s[1]][s[2]]
          break;
          case 4:
          if ( $scope[s[0]]!==undefined)
          if ( $scope[s[0]]!==undefined)
          if ( $scope[s[0]][s[1]][s[2]]!==undefined)
          if ( $scope[s[0]][s[1]][s[2]][s[3]]!==undefined)
          $val= $scope[s[0]][s[1]][s[2]][s[3]]
          break;
       }
       if ($(this).hasClass('mdl-radio__button') && $val!==undefined){
         if ( $(this).attr('type')=="radio" && $val==$(this).attr('value') && document.getElementById($(this).attr('id')).parentNode.MaterialRadio!==undefined)
           document.getElementById($(this).attr('id')).parentNode.MaterialRadio.check()

       }
       if ($(this).hasClass('mdl-checkbox__input') && $val!==undefined){
            //$(this).parentNode.MaterialRadio.check()
          if ($(this).attr('type')=="checkbox" && $val==$(this).attr('value') && document.getElementById($(this).attr('id')).parentNode.MaterialCheckbox!==undefined)
           document.getElementById($(this).attr('id')).parentNode.MaterialCheckbox.check()
      }
      attr=$(this).attr('ng-model')
      if (typeof attr !== typeof undefined && attr !== false){
        d=$(this).attr('ng-model')
        res=d.split('.')

      }

      if ($(this).attr('type')=="date"){
        if ($scope[res[0]]!==undefined  ){
          dom=$scope[res[0]][res.slice(-1)[0]]
          if (dom===undefined || dom===null || dom=="" ||  (dom instanceof Date && isNaN(dom.valueOf())) )
            $scope[res[0]][res.slice(-1)[0]]=new Date()
          else if (!isObject($scope[res[0]][res.slice(-1)[0]]))
            $scope[res[0]][res.slice(-1)[0]]=new Date($scope[res[0]][res.slice(-1)[0]])

      }
      }
      attr=$(this).attr('def-setting')
      if (typeof attr !== typeof undefined && attr !== false){
        if ($scope[res[0]]!==undefined ){
        if ($scope[res[0]][res.slice(-1)[0]]===undefined || $scope[res[0]][res.slice(-1)[0]]===null || $scope[res[0]][res.slice(-1)[0]]=="" )
          $scope[res[0]][res.slice(-1)[0]]=$scope.agent.settings[$(this).attr('def-setting')]
        }
      }
    }



  //                $(this).parentNode.MaterialCheckbox.check()



  })

}
function checkImage(imageSrc, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = imageSrc;
}
