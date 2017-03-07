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
    var langfileloginchk = localStorage.getItem("language");
    
    if(langfileloginchk == 'en' )
    {
        var ownerbuttoname ="Owners";
       
       
    }
    else
    {
         var ownerbuttoname ="Proprietari";
       
    }
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
            url: SERVICEURL2,
            data: {"action":"CompanyList",id:id,email:email,usertype:usertype},
            crossDomain: true,
            success:function(responceData){
                 $('#loader_img').hide();
			data=JSON.parse(responceData);
            if(data.RESPONSECODE=='1')
			{ 
                             var data1 = '';
                             var i=1;
                        $.each(data.RESPONSE,function(field,value) {
                           
                             if(value['compnay_doc_image'] != null)
                               {
                                   data1+='<style>.customer-listing'+i+' { background-image: url("'+BASEURL+'uploads/company/resize/'+value['compnay_doc_image']+'"); margin-right: 8px; } </style>';
                               }
                               else
                               {
                                   data1+='<style>.customer-listing'+i+' { background-image: url("./img/customer-listing2.png"); margin-right: 8px; } </style>';
                               
                               }    
                               data1 +='<div class="mdl-cell mdl-cell--12-col"> <div class="mdl-card amazing mdl-shadow--2dp"><div class="mdl-card__supporting-text mdl-color-text--grey-600"><div style="cursor:pointer;" onclick="redirecttoeditcompany('+value['company_id']+')" class="minilogo customer-listing'+i+'"></div><div class="card-author">';
                               data1 += '<span style="cursor:pointer;" onclick="redirecttoeditcompany('+value['company_id']+')"><strong class="first_letter_cap" >'+value['company_name']+'</strong></span>';
                               data1 += '<span style="cursor:pointer;" onclick="redirecttoeditcompany('+value['company_id']+')">'+value['comany_fiscal_id']+'</span><br> <span style="cursor:pointer;" onclick="redirecttoeditcompany('+value['company_id']+')" class="long-email">'+value['company_address']+'</span>';
                               data1 +='</div><div class="share mr-top-22px"><div>';
                               
                                data1 += '</div><div><span class="status-header" style="padding-right:30px;"><a onclick="redirecttoowners('+value['company_id']+')"  class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary">'+ownerbuttoname+'</a>&nbsp;</span>';
                                 
                               data1 +='</div></div></div></div></div>';   
                            i++;    
                            });
                                $('#list_customer').html(data1);
			}
			else
			{
                            var data1='';
				data1 +='<div class="mdl-cell mdl-cell--12-col"> <div class="mdl-card amazing mdl-shadow--2dp"><div class="mdl-card__supporting-text mdl-color-text--grey-600"><div class="card-author">';
                               data1 += '<span><strong>No Owners Record Found</strong></span>';
                               //data1 += '<span>'+value['mobile_number']+'</span><br> <span class="long-email">'+value['email']+'</span>';
                               data1 +='</div></div></div></div>';
                                
                                $('#list_customer').html(data1);
			}
            }
        });
	  
	  
			
}
function redirecttoeditcompany(id)
{
    localstorage("CompanyId",id);
    
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





setTimeout(function(){ 
        checkthesidebarinfouser();
}, 800);