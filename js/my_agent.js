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
    },
    onDeviceReady: function() {
       document.addEventListener("backbutton", onBackKeyDown, true);
   }
};
function getChkLogin()
{

    chkloggedin();
     var usertype = localStorage.getItem('userType');
    if(usertype ==  2 )
     {
        redirect("my_customer.html");
     }
	var id=localStorage.getItem("userId");
	var email=localStorage.getItem("userEmail");
        var usertype = localStorage.getItem('userType');

	  $.ajax ({
            type: "POST",
            url: SERVICEURL,
            data: {"action":"AgentList",id:id,email:email,usertype:usertype},
            crossDomain: true,
            success:function(responceData){
                 $('#loader_img').hide();
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
			{
                             var data1 = '';
                             var i=1;
                        $.each(data.RESPONSE,function(field,value) {

                               if(value['image'] != null)
                               {
                                   data1+='<style>.customer-listing'+i+' { background-image: url("'+BASEURL+'uploads/user/'+value['image']+'"); margin-right: 8px; } </style>';
                               }
                               else
                               {
                                   data1+='<style>.customer-listing'+i+' { background-image: url("./img/customer-listing2.png"); margin-right: 8px; } </style>';

                               }
                               data1 +='<div class="mdl-cell mdl-cell--12-col"> <div class="mdl-card amazing mdl-shadow--2dp"><div class="mdl-card__supporting-text mdl-color-text--grey-600"><div style="cursor:pointer;" onclick="redirecttoagent('+value['user_id']+')" class="minilogo customer-listing'+i+'"></div><div class="card-author">';
                               data1 += '<span style="cursor:pointer;" onclick="redirecttoagent('+value['user_id']+')"><strong class="first_letter_cap">'+value['name']+'</strong></span>';
                               data1 += '<span style="cursor:pointer;" onclick="redirecttoagent('+value['user_id']+')" >'+value['mobile_number']+'</span><br> ';
                               data1 +='</div><div class="card-author customer-email"><span style="cursor:pointer;" onclick="redirecttoagent('+value['user_id']+')">'+value['email']+'</span></div></div></div></div>';
                            i++;
                            });
                                $('#list_customer').html(data1);
			}
			else
			{
                            var data1='';
				data1 +='<div class="mdl-cell mdl-cell--12-col"> <div class="mdl-card amazing mdl-shadow--2dp"><div class="mdl-card__supporting-text mdl-color-text--grey-600"><div class="card-author">';
                               data1 += '<span><strong>No Agent Record Found</strong></span>';
                               //data1 += '<span>'+value['mobile_number']+'</span><br> <span class="long-email">'+value['email']+'</span>';
                               data1 +='</div></div></div></div>';

                                $('#list_customer').html(data1);
			}
            }
        });



}
function redirecttoagent(id)
{
    localstorage("agentProfileId",id);
    window.location = 'view_agent.html';
}

setTimeout(function(){
        checkthesidebarinfouser();
}, 800);
