
var app2 = angular.module('myApp', []);

app2.controller('personCtrl', function ($scope,$http) {
    $scope.datalang = DATALANG;

    var id=localStorage.getItem("userId");
  	var email=localStorage.getItem("userEmail");
    $('#loader_img').hide();


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
          data= {"action":"ContractList",id:id,email:email,usertype:usertype,priviledge:priviledge}
          $http.post(
            SERVICEURL2,  data
            )
              .success(function(responceData)
                       {
                        $('#loader_img').hide();
                        if(responceData.RESPONSECODE=='1') 			{
                          data=responceData.RESPONSE;

                           angular.forEach(data,function(value,key) {
                             if (data[key].company_name !== null && data[key].company_name.length>0)
                                 data[key].fullname=data[key].company_name
                             if (data[key].other_name !== null && data[key].other_name.length>0)
                               data[key].fullname=data[key].other_name
                           })
                           $scope.Contracts=data;


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

               })
              .error(function() {
                       console.log("error");
               });
               $scope.tocontract = function(id){
                  tocontract(id)
                };
/*    $.ajax ({
            type: "POST",
            url: SERVICEURL2,
            data: {"action":"ContractList",id:id,email:email,usertype:usertype,priviledge:priviledge},
            async:false,
            crossDomain: true,
            success:function(responceData){
                         $('#loader_img').hide();
                         data=JSON.parse(responceData);
                         if(data.RESPONSECODE=='1') 			{
                           var array =[];
                            angular.forEach(data.RESPONSE,function(value,key) {
                              console.log(value);
                              //if(value.email.indexOf($scope.searcCustomer)!=-1) {
                                array.push(data.RESPONSE[key]);
                              //}
                            })
                            $scope.Contracts=array;
                            $scope.$digest();

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
            */
            console.log($scope.Contracts);
});
