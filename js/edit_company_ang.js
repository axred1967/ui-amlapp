var app2 = angular.module('myApp', []);


app2.controller('personCtrl', function ($scope,$http) {
    $scope.datalang = DATALANG;
    $scope.Companies= [];
    var CompanyID=localStorage.getItem("CompanyID");
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
    data= {"action":"show_edit_company",company_id:CompanyID}

    $http.post(
      SERVICEURL2,  data
      )
        .success(function(responceData)
                 {
                  $('#loader_img').hide();
                  if(responceData.RESPONSECODE=='1') 			{
                    data=responceData.RESPONSE;

                    $scope.Companies=data;



                   }
                   else
                   {
                      console.log('no customer')
                   }

         })
        .error(function() {
                 console.log("error");
         });
         $scope.tocompany = function(d){
            tocompany(d)
          };
      console.log($scope.Contracts);
});
