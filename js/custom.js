

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

          //$('#Profileimageagencyuser').attr("src",UPLOADSURL +'user/small/"+image);
          //$('#view_profile_image').attr("src",UPLOADSURL +'user/small/"+image);
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
  if (str===undefined || str===null)
    return {}
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
function getAgentList(agentListI,agent){
  var agentList=false
  agentList=localStorage.getItem('agentList')
  if (agentList!==null && agentList.length>0){
    agentList=IsJsonString(agentList)
    agentListI=IsJsonString(localStorage.getItem('agentListI'))
    return agentList

  }
  else{
    settings={table:'agent',id:'agent_id',
              fields:{
                'j1.name':'name',
                'j1.surname':'surname',
              'uno.agent_id':'agent_id'
              },
              join:{
                'j1':{'table':'users',
                      'condition':'uno.user_id=j1.user_id '
                    }
              },
                  where: {
                'uno.agency_id':agent.agency_id

              }, limit:100
            }
    $.ajax ({
      type: "POST",
      async:false,
      url: SERVICEURL,
      data: {"action":"ListObjs",settings:settings,pInfo:agent.pInfo},
      crossDomain: true,
      success:function(data){
        //  alert(data);
        data=JSON.parse(data);
        agentList=data.RESPONSE
        angular.forEach(agentList,function(value,key) {
          agentListI[agentList[key]['agent_id']]=agentList[key]
        })
        localstorage('agentList',JSON.stringify(agentList))
        localstorage('agentListI',JSON.stringify(agentListI))

      }
    });
    return agentList

  }



}
function createTempContract(agent,contract){
   var contract
    $.ajax ({
      type: "POST",
      async:false,
      url: SERVICEURL,
      data: {"action":"add_temp_contract",settings:settings,contract:contract,pInfo:agent.pInfo},
      crossDomain: true,
      success:function(data){
        //  alert(data);
        data=JSON.parse(data);
        contract=data.RESPONSE

      }
    });
    return contract




}
function resize_img(){
  /*    $('.demo-card-image img.loadImg').each(function() {
  $(this).removeAttr('style');
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
/*
});
*/
}
function resize_single_img(id){
  setTimeout(function(){
    $('#'+id).each(function() {
      $(this).removeAttr('style');
      var maxHeight = $(this).parent().height();    // Max height for the image
      var maxWidth = $(this).parent().width();    // Max height for the image
      var height = $(this).height();  // Current image height
      var width = $(this).width();    // Current image width
      var height = $(this).height();  // Current image height
      var ratio_ori = width/height;  // Used for aspect ratio
      var ratio_height = height/maxHeight;  // Used for aspect ratio
      var ratio_width = width/maxWidth;  // Used for aspect ratio
      if(height > maxHeight){
        $(this).css("height", maxHeight);   // Set new height
        $(this).css("width", width*1/ratio_height );   // Set new height
      }

      if(width > maxWidth){
        $(this).css("width", maxWidth);   // Set new height
        $(this).css("height", height*1/ratio_width);   // Set new height
      }

    });

  }
  , 3000);
}
function setDefaults($scope){

  $('input').each(
    function(index){
      if ($(this).hasClass('mdl-textfield__input')){
        if ($(this).attr('excludeDirty')===undefined){
          $(this).parent('div.mdl-textfield').addClass('is-dirty');
          $(this).parent('div.mdl-textfield').removeClass('is-invalid');

        }
      }
      ngm=$(this).attr('modelAx')
      if (ngm===undefined){
        ngm=$(this).attr('ng-model')
      }


      if (typeof ngm !== typeof undefined && ngm !== false){
        var $val
        res = ngm.split(".")
        s=res

        attr=$(this).attr('def-setting')
        if (typeof attr !== typeof undefined && attr !== false){
          if ($scope[res[0]]!==undefined ){
            if ($scope[res[0]][res.slice(-1)[0]]===undefined || $scope[res[0]][res.slice(-1)[0]]===null || $scope[res[0]][res.slice(-1)[0]]=="" ){
              if ($(this).attr('type')=='date')
              $scope[res[0]][res.slice(-1)[0]]=new Date()
              else
              $scope[res[0]][res.slice(-1)[0]]=$scope.agent.settings[$(this).attr('def-setting')]

            }
          }
        }
        //if (s.length==1){
        //  s=$(this).attr('modelAx').split(".")
        //}
        switch (res.length){
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
          i=1
        }

        if ($(this).attr('type')=="date"){
          if ($scope[res[0]]!==undefined  ){
            dom=$scope[res[0]][res.slice(-1)[0]]
            if (dom===undefined || dom===null || dom=="" ||  (dom instanceof Date && isNaN(dom.valueOf())) )
            $scope[res[0]][res.slice(-1)[0]]=null
            //i=1
            else if (!isObject($scope[res[0]][res.slice(-1)[0]]))
            $scope[res[0]][res.slice(-1)[0]]=new Date($scope[res[0]][res.slice(-1)[0]])

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
  function extToMime(ext){
    $mime_types = {
      'txt' :'text/plain',
      'htm' :'text/html',
      'html' :'text/html',
      'php' :'text/html',
      'css' :'text/css',
      'js' :'application/javascript',
      'json' :'application/json',
      'xml' :'application/xml',
      'swf' :'application/x-shockwave-flash',
      'flv' :'video/x-flv',

      // images
      'png' :'image/png',
      'jpe' :'image/jpeg',
      'jpeg' :'image/jpeg',
      'jpg' :'image/jpeg',
      'gif' :'image/gif',
      'bmp' :'image/bmp',
      'ico' :'image/vnd.microsoft.icon',
      'tiff' :'image/tiff',
      'tif' :'image/tiff',
      'svg' :'image/svg+xml',
      'svgz' :'image/svg+xml',

      // archives
      'zip' :'application/zip',
      'rar' :'application/x-rar-compressed',
      'exe' :'application/x-msdownload',
      'msi' :'application/x-msdownload',
      'cab' :'application/vnd.ms-cab-compressed',

      // audio/video
      'mp3' :'audio/mpeg',
      'qt' :'video/quicktime',
      'mov' :'video/quicktime',

      // adobe
      'pdf' :'application/pdf',
      'psd' :'image/vnd.adobe.photoshop',
      'ai' :'application/postscript',
      'eps' :'application/postscript',
      'ps' :'application/postscript',

      // ms office
      'doc' :'application/msword',
      'rtf' :'application/rtf',
      'xls' :'application/vnd.ms-excel',
      'ppt' :'application/vnd.ms-powerpoint',

      // ms office
      'docx' :'application/msword',
      'xlsx' :'application/vnd.ms-excel',
      'pptx' :'application/vnd.ms-powerpoint',
      // open office
      'odt' :'application/vnd.oasis.opendocument.text',
      'ods' :'application/vnd.oasis.opendocument.spreadsheet'

    }
    return $mime_types[ext]


  }
  var canvasDoc = null;
  var ctx = null;
  var gkhead =null
  var degrees=0
  var lastX=0; var lastY=0;lastXd=0;lastYd=0;
  var rotateX=0;var rotateY=0
  var docPassed={}
  var crop_canvas
  function trackTransforms(ctx){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function(){
      savedTransforms.push(xform.translate(0,0));
      return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function(){
      xform = savedTransforms.pop();
      return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx,sy){
      xform = xform.scaleNonUniform(sx,sy);
      return scale.call(ctx,sx,sy);
    };

    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
      xform = xform.rotate(radians*180/Math.PI);
      return rotate.call(ctx,radians);
    };

    var translate = ctx.translate;
    ctx.translate = function(dx,dy){

      xform = xform.translate(dx,dy);
      return translate.call(ctx,dx,dy);
    };

    var transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
      var m2 = svg.createSVGMatrix();
      m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
      xform = xform.multiply(m2);
      return transform.call(ctx,a,b,c,d,e,f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx,a,b,c,d,e,f);
    };

    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
      pt.x=x; pt.y=y;
      return pt.matrixTransform(xform.inverse());
    }
  }
  function drawRotated(gradi){
    if (gradi==undefined){
      gradi=0;
    }
    var p1 = ctx.transformedPoint(0,0);
    var p2 = ctx.transformedPoint(canvasDoc.width,canvasDoc.height);
    ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

    $(".docCanvasContainer").removeAttr('style');
    degrees+=gradi
    degrees= degrees % 360
    if ((degrees % 180)==0 ){
      var hRatio = ($('.docCanvasDialog').innerWidth()-40) / gkhead.width    ;
      var vRatio = ($('.docCanvasDialog').innerHeight()-140) / gkhead.height  ;
      var ratio  = Math.min ( hRatio, vRatio );
      if (ratio>1){
        canvasDoc.width=gkhead.width
        canvasDoc.height=gkhead.height
      }
      else {
        canvasDoc.width=gkhead.width*ratio
        canvasDoc.height=gkhead.height*ratio
      }
      rotateX=10
      rotateY=10

    }else {
      var hRatio = ($('.docCanvasDialog').innerWidth()-40) / gkhead.height    ;
      var vRatio = ($('.docCanvasDialog').innerHeight()-140) / gkhead.width  ;
      var ratio  = Math.min ( hRatio, vRatio );
      if (ratio>1){
        canvasDoc.width=gkhead.height
        canvasDoc.height=gkhead.width
      }
      else {
        canvasDoc.width=gkhead.height*ratio
        canvasDoc.height=gkhead.width*ratio
      }
      rotateX=10
      rotateY=10
    }
    if (ratio>1){
       ratio=1
     }
    crop_canvas=  document.getElementById('cropCanvas');
    crop_canvas.width = canvasDoc.width;
    crop_canvas.height =  canvasDoc.height ;
    jcrop_canvas=  $('#cropCanvas')
    jcrop_canvas.css('width', canvasDoc.width)
    jcrop_canvas.css('height', canvasDoc.height)
    jcrop_canvas.css('top',rotateY)
    jcrop_canvas.css('left',rotateX)
    jcrop_canvas.show()
    /*

    left = $('.DocCanvas').offset().left - $container.offset().left,
    top =  $('.overlay').offset().top - $container.offset().top,
    width = $('.overlay').width(),
    height = $('.overlay').height();

    crop_canvas = document.createElement('canvas');
    $(crop_canvas).addClass('cropCanvas')

    crop_canvas.width = Math.min ( canvs.width, canvas.height );
    crop_canvas.height = Math.min ( canvs.width, canvas.height );


    crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
    window.open(crop_canvas.toDataURL("image/png"));
    */


    $(".docCanvasContainer").css('width',canvasDoc.width)

    ctx.translate(canvasDoc.width/2,canvasDoc.height/2);
    ctx.rotate(degrees*Math.PI/180);

    if((degrees % 180 )==0){
      ctx.drawImage(gkhead, -canvasDoc.width/2,-canvasDoc.height/2,gkhead.width*ratio, gkhead.height*ratio);
    }else{
      ctx.drawImage(gkhead, -canvasDoc.height/2,-canvasDoc.width/2,gkhead.width*ratio, gkhead.height*ratio);
    }
    $("#containerCanvasDoc").show()
    $(".loader").hide()
  //    ctx.save()
    lastX=0;
    lastY=0;
    trackTransforms(ctx);

  }
  function cropCanvas (){
    jcrop_canvas=$('#cropCanvas')
    offset=jcrop_canvas.position()
     left=offset.left-10
     topx=offset.top-10
     width=jcrop_canvas.width();
     height=jcrop_canvas.height();

     var tempCanvas = document.createElement("canvas"),
             tCtx = tempCanvas.getContext("2d");

         tempCanvas.width =width;
         tempCanvas.height = height;

         tCtx.drawImage(canvasDoc,left, topx, width, height, 0, 0, width, height)
         ctx.clearRect(0,0,canvasDoc.width,canvasDoc.height);
         canvasDoc.width =width;
         canvasDoc.height = height;

     ctx.drawImage(tempCanvas, 0, 0,canvasDoc.width,canvasDoc.height);


  }
  function removeListerenCanvasDoc(){
    $("#containerCanvasDoc").hide()
    $(".loader").show()

  /*
      resizer=document.querySelectorAll(".resizerCanvas")
    for (var i = 0; i < resizer.length; i++) {
        resizer[i].removeEventListener('mousedown',  initResize, false);

    }
    canvasDoc.removeEventListener('mousedown', initMovePic, false);
    canvasDoc.removeEventListener('DOMMouseScroll',handleScroll,false);
    canvasDoc.removeEventListener('mousewheel',handleScroll,false);
*/
  };
  function redraw(start){
    if ((degrees % 180)==0 ){
      var hRatio = canvasDoc.width / gkhead.width    ;
      var vRatio = canvasDoc.height / gkhead.height  ;
      var ratio  = Math.min ( hRatio, vRatio );

    }else {
      var hRatio = canvasDoc.height / gkhead.width    ;
      var vRatio = canvasDoc.width / gkhead.height  ;
      var ratio  = Math.min ( hRatio, vRatio );
    }
    if (ratio>1){
       ratio=1
    }
    // Clear the entire canvas
    var p1 = ctx.transformedPoint(0,0);
    var p2 = ctx.transformedPoint(canvasDoc.width,canvasDoc.height);
    ctx.save()
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvasDoc.width,canvasDoc.height);
    ctx.restore()
    if((degrees % 180 )==0){
      ctx.drawImage(gkhead, -canvasDoc.width/2,-canvasDoc.height/2,gkhead.width*ratio, gkhead.height*ratio);
    }else{
      ctx.drawImage(gkhead, -canvasDoc.height/2,-canvasDoc.width/2,gkhead.width*ratio, gkhead.height*ratio);
    }

    docPassed.changed=true
  }

  function init_canvas_image(id,url,doc){
    if (doc.rotate==undefined){
      doc.rotate=0
    }
    docPassed=doc
    docPassed.changed=false
    canvasDoc = document.getElementById(id);
    gkhead = new Image;
    crop_canvas=document.getElementById('cropCanvas');
    gkhead.src = url;
    var w=gkhead.width;
    var h=gkhead.height;
    $("#containerCanvasDoc").hide()
    $(".loader").show()


    gkhead.onload=function(){
      //gkhead.width=gkhead.width*sizer;
      //gkhead.height=gkhead.height*sizer;

      ctx = canvasDoc.getContext('2d');
      ctx.clearRect(0,0,canvasDoc.width,canvasDoc.height);
      trackTransforms(ctx);
      drawRotated(doc.rotate)
      //    ctx.drawImage(gkhead, -canvasDoc.width/2,-canvasDoc.width/2,gkhead.width*ratio, gkhead.width*ratio);


      var dragStart,dragged,onListen;
      crop_canvas.addEventListener('mousedown', initMove, false);
      jcrop_canvas=  $('#cropCanvas')
      jcanvasDoc=  $('#cropCanvas')
      function initMove(e) {
        if (!onListen){
          window.addEventListener('mousemove', Move, false);
          window.addEventListener('mouseup', stopMove, false);
          onListen=true
        }
      }
      function Move(e) {
        p=jcrop_canvas.position()
        pC=jcanvasDoc.position()
        console.log("X",e.movementX+p.left, crop_canvas.width,rotateX)
        console.log("Y",e.movementY+p.top, crop_canvas.height,rotateY)
        if ((p.top+e.movementY)>0+10  && (p.top+e.movementY+ jcrop_canvas.height())<canvasDoc.height+10)
        jcrop_canvas.css('top',p.top+e.movementY)
        if ((p.left+e.movementX)>0+10  && (p.left+e.movementX+ jcrop_canvas.width())<canvasDoc.width +10)
        jcrop_canvas.css('left',p.left+e.movementX)
        docPassed.changed=true
      }
      function stopMove(e) {
        window.removeEventListener('mousemove', Move, false);
        window.removeEventListener('mouseup', stopMove, false);
        onListen=false
      }


resizer=document.querySelectorAll(".resizerCanvas")
for (var i = 0; i < resizer.length; i++) {
    resizer[i].addEventListener('mousedown',  initResize, false);

}

var currentResizer
function initResize(e) {
  if (!onListen){
    window.addEventListener('mousemove', Resize, false);
    window.addEventListener('mouseup', stopResize, false);
    var t = e.currentTarget;
    currentResizer=t.style
    onListen=true


  }
}
function Resize(e) {
  moltX=1;moltY=1
  if (currentResizer.top=='0px'){
    moltY*=-1
  }
  if (currentResizer.left=='0px'){
    moltX*=-1

  }

  p=jcrop_canvas.position()
  console.log(" ","emov", "top/left" ,"height/widthCRop","cont")
  console.log("X",e.movementX,p.left, jcrop_canvas.width(),canvasDoc.width)
  console.log("Y",e.movementY,p.top, jcrop_canvas.height(),canvasDoc.height)
  if (moltX==-1){
    if ( (p.left +e.movementX)>=10 && ( jcrop_canvas.width() -e.movementX )<= (canvasDoc.width+10)  && jcrop_canvas.width()-e.movementX>100){
      jcrop_canvas.css('left', p.left+e.movementX)
      jcrop_canvas.css('width', jcrop_canvas.width() -e.movementX)
    }
  }else {
    if ( (p.left+jcrop_canvas.width() +e.movementX)<=canvasDoc.width+10 && jcrop_canvas.width() +e.movementX>100)
      jcrop_canvas.css('width', jcrop_canvas.width() +e.movementX)

  }



  if (moltY==-1){
    if ( (p.top +e.movementY)>=10  && (jcrop_canvas.height() -e.movementY)<=(canvasDoc.height+10) && jcrop_canvas.height()-e.movementY>100){
      jcrop_canvas.css('top', p.top+e.movementY)
      jcrop_canvas.css('height',jcrop_canvas.height() -e.movementY)
    }

  }else {
    if ( (p.top+jcrop_canvas.height() +e.movementY)<=canvasDoc.height+10 && jcrop_canvas.height() +e.movementY>100)
      jcrop_canvas.css('height',jcrop_canvas.height() +e.movementY)

  }
  docPassed.changed=true

}
function stopResize(e) {
  window.removeEventListener('mousemove', Resize, false);
  window.removeEventListener('mouseup', stopResize, false);
  onListen=false
}
containerCanvasDoc=document.getElementById('containerCanvasDoc');
containerCanvasDoc.addEventListener('mousedown', initMovePic, false);
function initMovePic(e) {
  if (!onListen){
    containerCanvasDoc.addEventListener('mousemove', MovePic, false);
    containerCanvasDoc.addEventListener('mouseup', stopMovePic, false);
    onListen=true
    lastX = e.offsetX
    lastY = e.offsetY

    //      dragStart = ctx.transformedPoint(lastX,lastY);
    var pt = ctx.transformedPoint(lastX,lastY);
    switch ((degrees % 360)){
      case 0:
      dragStart = ctx.transformedPoint(lastX,lastY);
      break;
      case 90:
      dragStart = ctx.transformedPoint(lastY,-lastX);
      break;
      case -90:
      dragStart = ctx.transformedPoint(-lastY,lastX);
      break;
      case 180:
      dragStart = ctx.transformedPoint(-lastX,-lastY);
      break;
      case -180:
      dragStart = ctx.transformedPoint(-lastX,-lastY);
      break;
      case 270:
      dragStart = ctx.transformedPoint(-lastY,lastX);
      break;
      case -270:
      dragStart = ctx.transformedPoint(lastY,-lastX);
      break;
    }   }
  }
  function MovePic(e) {
    lastX = e.offsetX;
    lastY = e.offsetY ;
    lastTarget="DocCanvas"
    if (e.target.id=="cropCanvas"){
      lastX +=e.target.offsetLeft
      lastY += e.target.offsetTop
    }
    dragged = true;
    if (dragStart){
      var pt = ctx.transformedPoint(lastX,lastY);
      switch ((degrees % 360)){
        case 0:
        pt = ctx.transformedPoint(lastX,lastY);
        break;
        case 90:
        pt = ctx.transformedPoint(lastY,-lastX);
        break;
        case -90:
        pt = ctx.transformedPoint(-lastY,lastX);
        break;
        case 180:
        pt = ctx.transformedPoint(-lastX,-lastY);
        break;
        case -180:
        pt = ctx.transformedPoint(-lastX,-lastY);
        break;
        case 270:
        pt = ctx.transformedPoint(-lastY,lastX);
        break;
        case -270:
        pt = ctx.transformedPoint(lastY,-lastX);
        break;
      }
      DeltaX=pt.x-dragStart.x
      DeltaY=pt.y-dragStart.y
      ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
      redraw();
    }
  }
  function stopMovePic(e) {
    containerCanvasDoc.removeEventListener('mousemove', MovePic, false);
    containerCanvasDoc.removeEventListener('mouseup', stopMovePic, false);
    if (!onListen) zoom(e.shiftKey ? -1 : 1 );
    onListen=false
  }
  /*
  docCanvasContainer.addEventListener('mousedown',function(evt){
  evt.preventDefault()
  document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
  lastX = evt.offsetX
  lastY = evt.offsetY
  //      dragStart = ctx.transformedPoint(lastX,lastY);
  var pt = ctx.transformedPoint(lastX,lastY);
  switch ((degrees % 360)){
  case 0:
  dragStart = ctx.transformedPoint(lastX,lastY);
  break;
  case 90:
  dragStart = ctx.transformedPoint(lastY,-lastX);
  break;
  case -90:
  dragStart = ctx.transformedPoint(-lastY,lastX);
  break;
  case 180:
  dragStart = ctx.transformedPoint(-lastX,-lastY);
  break;
  case -180:
  dragStart = ctx.transformedPoint(-lastX,-lastY);
  break;
  case 270:
  dragStart = ctx.transformedPoint(-lastY,lastX);
  break;
  case -270:
  dragStart = ctx.transformedPoint(lastY,-lastX);
  break;
}

dragged = false;
},false);

docCanvasContainer.addEventListener('mousemove',function(evt){
evt.preventDefault()
lastX = evt.offsetX;
lastY = evt.offsetY ;
dragged = true;
if (dragStart){
var pt = ctx.transformedPoint(lastX,lastY);
switch ((degrees % 360)){
case 0:
pt = ctx.transformedPoint(lastX,lastY);
break;
case 90:
pt = ctx.transformedPoint(lastY,-lastX);
break;
case -90:
pt = ctx.transformedPoint(-lastY,lastX);
break;
case 180:
pt = ctx.transformedPoint(-lastX,-lastY);
break;
case -180:
pt = ctx.transformedPoint(-lastX,-lastY);
break;
case 270:
pt = ctx.transformedPoint(-lastY,lastX);
break;
case -270:
pt = ctx.transformedPoint(lastY,-lastX);
break;
}
DeltaX=pt.x-dragStart.x
DeltaY=pt.y-dragStart.y
ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
/*
switch ((degrees % 360)){
case 0:
ctx.translate(DeltaX,DeltaY);
break;
case 90:
ctx.translate(-DeltaY,DeltaX);
break;
case -90:
ctx.translate(DeltaY,-DeltaX);
break;
case 180:
ctx.translate(-DeltaX,-DeltaY);
break;
case -180:
ctx.translate(-DeltaX,-DeltaY);
break;
case 270:
ctx.translate(DeltaY,-DeltaX);
break;
case -270:
ctx.translate(-DeltaY,DeltaX);
break;
}

redraw();

}
},false);
*/

var scaleFactor = 1.1;

var zoom = function(clicks){
  //var pt = ctx.transformedPoint(lastX,lastY);
  //ctx.translate(pt.x,pt.y);
  var factor = Math.pow(scaleFactor,clicks);
  ctx.scale(factor,factor);
  //ctx.translate(-pt.x,-pt.y);
  redraw();
}

var handleScroll = function(evt){
  var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
  if (delta) zoom(delta);
  return evt.preventDefault() && false;
};

canvasDoc.addEventListener('DOMMouseScroll',handleScroll,false);
canvasDoc.addEventListener('mousewheel',handleScroll,false);

}
// resize img to fit in the canvas
// You can alternately request img to fit into any specified width/height
};



// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint

function scalePreserveAspectRatio(imgW,imgH,maxW,maxH){
  return(Math.min((maxW/imgW),(maxH/imgH)));
}
