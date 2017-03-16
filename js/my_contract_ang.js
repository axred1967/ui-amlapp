langfile = localStorage.getItem("language");
if (langfile == 'en')
    document.write('<scri' + 'pt src="js/enlang.js"></' + 'script>');
else
    document.write('<scri' + 'pt src="js/itlang.js"></' + 'script>');

var app2 = angular.module('myApp', []);

app2.controller('personCtrl', function ($scope) {
    $scope.datalang = DATALANG;
    var id=localStorage.getItem("userId");
  	var email=localStorage.getItem("userEmail");
          var usertype = localStorage.getItem('userType');

           var image = localStorage.getItem("Profileimageagencyuser");
           var priviledge = localStorage.getItem("priviligetype");
           if(priviledge == 0 && usertype  == '2'  )
           {
               redirect("my_profile_agent_noprve.html");
           }


          if(image != null)
          {


                  $('#Profileimageagencyuser').attr("src",BASEURL+"uploads/user/small/"+image);

          }
          $('#Profileimageagencyusername').html(name);
          $('#Profileimageagencyuseremail').html(email);

    $.ajax ({
            type: "POST",
            url: SERVICEURL2,
            data: {"action":"ContractList",id:id,email:email,usertype:usertype,priviledge:priviledge},
            crossDomain: true,
            success:function(responceData){
                         $('#loader_img').hide();
                         data=JSON.parse(responceData);
                         if(data.RESPONSECODE=='1') 			{
                            $scope.Contracts=data.RESPONSE;
                            console.log($scope.Contracts);
                            x=1;
                          }
                          else
                          {
                          var data1='';
                            data1 +='<div class="mdl-cell mdl-cell--12-col"> <div class="mdl-card amazing mdl-shadow--2dp"><div class="mdl-card__supporting-text mdl-color-text--grey-600"><div class="card-author">';
                                                   data1 += '<span><strong>No Customer Record Found</strong></span>';
                                                   //data1 += '<span>'+value['mobile_number']+'</span><br> <span class="long-email">'+value['email']+'</span>';
                                                   data1 +='</div></div></div></div>';

                                                    $('#list_customer').html(data1);
                          }
                    }
            });
});
