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
                       if (data[key].name !== null && data[key].name.length>0)
                           data[key].fullname=data[key].name
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
         $scope.tocontract = function(d){
           $scope.stack={}
           $scope.stack['my_contract.html']={}
           $scope.stack['my_contract.html'].action="view"
           localstorage('stack',JSON.stringify($scope.stack))
           localstorage("contract_id",d.contract_id);
           localstorage("customer_id",d.contractor_id);
           localstorage("Customertype",1);
           localstorage('Contract', JSON.stringify(d));
           redirect('view_contract.html')
          };
          $scope.add_contract = function(){
            $scope.stack={}
            $scope.stack['my_contract.html']={}
            $scope.stack['my_contract.html'].action="add_contract"
            localstorage('stack',JSON.stringify($scope.stack))
            redirect('add_contract.html')
           };
          $scope.back = function(d){
            back=$scope.lastkey
            delete $scope.stack[$scope.lastkey]
            localstorage('stack',JSON.stringify($scope.stack))
            redirect(back)
          }
      console.log($scope.Contracts);


});
