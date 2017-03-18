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
    data= {"action":"CustomerList",id:id,email:email,usertype:usertype,priviledge:priviledge}

    $http.post(
      SERVICEURL2,  data
      )
        .success(function(responceData)
                 {
                  $('#loader_img').hide();
                  if(responceData.RESPONSECODE=='1') 			{
                    data=responceData.RESPONSE;

                    $scope.Customers=data;



                   }
                   else
                   {
                      console.log('no customer')
                   }

         })
        .error(function() {
                 console.log("error");
         });
         $scope.tocustomer = function(d){
            tocustomer(d)
          };
      console.log($scope.Contracts);
});
