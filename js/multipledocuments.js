i = 0;
var app = {
    initialize: function () {
        this.bind();
    },
    bind: function () {
        document.addEventListener('deviceready', getChkLogin(), false);
    },
    deviceready: function () {
        // This is an event handler function, which means the scope is the event.
        // So, we must explicitly called `app.report()` instead of `this.report()`.		
        app.report('deviceready');
    },
    report: function (id) {
        // Report the event in the console
        console.log("Report: " + id);
    }
};
function getChkLogin()
{

    chkloggedin();
    var customer_id = localStorage.getItem("CustomerProfileId");
    ;

    $.ajax({
        type: "POST",
        url: SERVICEURL,
        data: {"action": "show_kyc_profile6", customer_id: customer_id},
        crossDomain: true,
        success: function (responceData) {
            $('#loader_img').hide();
            data = JSON.parse(responceData);
            var data2 = '';
            if (data.RESPONSECODE == '1')
            {
               var i = 1;
                $.each(data.RESPONSE, function (field, value){
                    data2 += '<div  class="mdl-cell mdl-cell--12-col"><div class="mdl-card imaged mdl-shadow--2dp"> <div class="mdl-card__title"> <a href="javascript:;">';
                    data2 += '<section id="focal_'+i+'"><div class="parent"><div class="panzoom"><img style="height:250px;" src="' + BASEURL + 'uploads/document/user_' + customer_id + '/resize/' + value["doc_image"] + '" id="image_id' + i + '" alt=""></div></div></section>';
                    // $("#agent_image").attr("src",BASEURL++data.RESPONSE);
                    var title;
                    if (value['doc_name'].length > 19){
                        title = value['doc_name'].substring(0, 19);
                        title += "...";
                    } else {
                        title = value['doc_name'];
                    }

                    data2 += '<span style="padding:2px; margin-left:10px; background-color:rgba(255, 255, 255, 0.7);text-transform: capitalize;color:black;" class="mdl-card__title-text">' + title + '</span></a>   <a onclick="deleteimage(' + value['id'] + ','+i+')" style="bottom: 0px;" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">close</i> </a></div></div></div>';
                    // $("#image_id"+i+"").attr("src",BASEURL+"uploads/document/user_"+customer_id+"/resize/"+value["doc_image"]);

                 //  panzoom_i(i);
                    i++;
                });



            } else
            {
                data2 += '<div class="mdl-cell mdl-cell--12-col"> <div class="mdl-card amazing mdl-shadow--2dp"><div class="mdl-card__supporting-text mdl-color-text--grey-600"><div class="card-author">';
                data2 += '<span><strong>No Documents Record Found</strong></span>';
                //data1 += '<span>'+value['mobile_number']+'</span><br> <span class="long-email">'+value['email']+'</span>';
                data2 += '</div></div></div></div>';

            }

            $('#list_customer').html(data2);



        }
    });

}

/*function panzoom_i(i){
          (function(){
          var $section = $('#focal_'+i);
          var $panzoom = $section.find('.panzoom').panzoom();
          $panzoom.parent().on('mousewheel.focal', function( e ){
            e.preventDefault();
            console.log('helo');
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
              animate: false,
              focal: e
            });
          });
        })();
    
} */
 
 
         
  

            
            
 




setTimeout(function () {
    checkthesidebarinfouser();
}, 800);

function upload_documents()
{
    redirect("add_document.html");
}

function deleteimage(id,div)
{
    var langfileloginchk = localStorage.getItem("language");
    
    if(langfileloginchk == 'en' )
    {
        var deletemsgdocu ="Are you sure to delete the document ?";
        var deletemsgsucss ="Documents deleted sucessfully";
    }
    else
    {
        var deletemsgdocu ="Sei sicuro di voler eliminare il documento ?";
        var deletemsgsucss ="Documenti eliminati con successo";
    } 
    
    
    var customer_id = localStorage.getItem("CustomerProfileId");
    if (confirm(deletemsgdocu))
    {
        $.ajax({
            type: "POST",
            url: SERVICEURL,
            data: {"action": "deletecustimage", id: id, cust_id: customer_id},
            crossDomain: true,
            success: function (responceData) {
                $('#loader_img').hide();
                $('#save_button_cust').show();
                $('#cancel_button_cust').show();
                $('#focal_'+div).remove();
                data = JSON.parse(responceData);
                if (data.RESPONSECODE == '1')
                {
                    swal("", deletemsgsucss);
                    setTimeout(function () {

                        location.reload();
                    }, 1000);

                    // redirect("my_customer.html");

                } else
                {
                    swal("", data.RESPONSE);
                }

            }
        });
    }
}