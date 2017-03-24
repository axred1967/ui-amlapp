
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
    $scope.datalang = DATALANG;
    $scope.Companies= [];
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
    $scope.addMoreItems =function(){
      last=99999999999
      if ( $scope.Customers!==undefined){
        lastkey= Object.keys($scope.Customers).pop() ;
         last=$scope.Customers[lastkey].user_id;
      }

      data= {"action":"CompanyList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last}
      $http.post(SERVICEURL2,  data )
          .success(function(responceData)  {
                    $('#loader_img').hide();
                    if(responceData.RESPONSECODE=='1') 			{
                      data=responceData.RESPONSE;
                      if (last==99999999999)
                        $scope.Companies=data;
                      else
                      $scope.Companies=$scope.Companies.concat(data);
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


         $scope.tocompany = function(d){
           $scope.stack={}
           localstorage("CompanyID",d.company_id);
           $scope.stack['my_company.html']={}
           $scope.stack['my_company.html'].action="edit_company"
           localstorage('stack',JSON.stringify($scope.stack))
           redirect('add_company.html')
         };
         $scope.add_company = function(){
           $scope.stack={}
           $scope.stack['my_company.html']={}
           $scope.stack['my_company.html'].action="add_company"
           localstorage('stack',JSON.stringify($scope.stack))
           redirect('add_company.html')
         };
          $scope.toowners = function(d){
            $scope.stack={}
            localstorage("Company_name",d.name);
            localstorage("CompanyID",d.company_id);
            $scope.stack['my_company.html']={}
            $scope.stack['my_company.html'].action="owners_list"
            localstorage('stack',JSON.stringify($scope.stack))
            redirect('owners_list.html')
           };


      console.log($scope.Contracts);
});
