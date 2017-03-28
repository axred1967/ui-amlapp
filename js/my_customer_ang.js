var app2 = angular.module('myApp', []);
app2.directive('whenScrolled', function() {
  return {

      link: function($scope, elem, attr) {
              var $myWindow = angular.element($window);
              var $myDoc = angular.element($document);

              $myWindow.bind('scroll', function() {
                  if ($myWindow.height() + $myWindow.scrollTop() >= $myDoc.height()) {
                      $scope.$apply(attr.isScrolled);
                  }
              });
          }
  }

});

app2.controller('personCtrl', function ($scope,$http) {
   $scope.page={}
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

/*
    $http.post(SERVICEURL2,  data )
        .success(function(responceData)  {
                  $('#loader_img').hide();
                  if(responceData.RESPONSECODE=='1') 			{
                    data=responceData.RESPONSE;
                    $scope.Customers=data;
                   }
                   else   {
                      console.log('no customer')
                   }
         })
        .error(function() {
                 console.log("error");
         });
*/
         $scope.addMoreItems =function(){
           last=99999999999
           if ( $scope.Customers!==undefined){
             lastkey= Object.keys($scope.Customers).pop() ;
              last=$scope.Customers[lastkey].user_id;
           }

           data= {"action":"CustomerList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last}
           $http.post(SERVICEURL2,  data )
               .success(function(responceData)  {
                         $('#loader_img').hide();
                         if(responceData.RESPONSECODE=='1') 			{
                           data=responceData.RESPONSE;
                           $scope.loaded=data.length;
                           if (last==99999999999)
                           $scope.Customers=data;
                           else
                           $scope.Customers=$scope.Customers.concat(data);
                           //$scope.Customers=data;
                          }
                          else   {
                             console.log('no customer')
                          }
                })
               .error(function() {
                        console.log("error");
                });


         }
         $scope.addMoreItems()

         $scope.tocustomer = function(d){
           localstorage('add_customer.html',JSON.stringify({action:'update_customer',location:'my_customer.html'}))
           localstorage("CustomerProfileId",d.user_id);
            localstorage("Customertype",1);
            redirect('add_customer.html')
            };

           $scope.add_customer = function(){
             localstorage('add_customer.html',JSON.stringify({action:'add_customer',location:'my_customer.html'}))
             redirect('add_customer.html')
           };
      console.log($scope.Contracts);
});
