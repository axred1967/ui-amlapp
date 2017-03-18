var app2 = angular.module('myApp', []);

app2.controller('personCtrl', function ($scope,$http) {
    $scope.datalang = DATALANG;
    var id=localStorage.getItem("CustomerProfileId");
  	var email=localStorage.getItem("userEmail");
    data= {"action":"view_Customer_Profile_info",customer_id:id,email:email}


    $http.post( SERVICEURL2,  data )
        .success(function(responceData) {
                  $('#loader_img').hide();
                  if(responceData.RESPONSECODE=='1') 			{
                    data=responceData.RESPONSE;
                     $scope.Customer=data;
                    $('#edit_button_agent').show()                     
                   }
                   else
                   {
                     console.log('error');
                   }
         })
        .error(function() {
                 console.log("error");
         });
})
