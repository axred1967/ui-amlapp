var app2 = angular.module('myApp', ['pascalprecht.translate','ng-currency','fieldMatch']);
//Field Match directive
angular.module('fieldMatch', [])
   .directive('fieldMatch', ["$parse", function($parse) {
       return {
           require: 'ngModel',
           link: function(scope, elem, attrs, ctrl) {
               var me = $parse(attrs.ngModel);
               var matchTo = $parse(attrs.fieldMatch);
               scope.$watchGroup([me, matchTo], function(newValues, oldValues) {
                   ctrl.$setValidity('fieldmatch', me(scope) === matchTo(scope));
               }, true);
           }
       }
   }]);
//Run material design lite
app2.directive("ngModel",["$timeout", function($timeout){
            return {
                restrict: 'A',
                priority: -1, // lower priority than built-in ng-model so it runs first
                link: function(scope, element, attr) {
                    scope.$watch(attr.ngModel,function(value){
                        $timeout(function () {
                            if (value){
                                element.trigger("change");
                            } else if(element.attr('placeholder') === undefined) {
                                if(!element.is(":focus"))
                                    element.trigger("blur");
                            }
                        });
                    });
                }
            };
        }]);

app2.run(function($rootScope, $timeout) {
   $rootScope.$on('$viewContentLoaded', function(event) {
       $timeout(function() {
           componentHandler.upgradeAllRegistered();
       }, 0);
   });
   $rootScope.render = {
       header: true,
       aside: true
   }
});

app2.filter('capitalize', function() {
    return function(input, $scope) {
        if ( input !==undefined && input.length>0)
        return input.substring(0,1).toUpperCase()+input.substring(1);
        else
        return input

    }
});


app2.controller('personCtrl', function ($scope,$http,$translate) {
    //$scope.datalang = DATALANG;
    $scope.page={}
    curr_page=base_name()
  	page=localStorage.getItem(curr_page)
  	if ( page!= null && page.length >0 ){
  		$scope.page=JSON.parse(page)
  		$scope.action=$scope.page.action

  	}


    $scope.Companies= {};
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
    $scope.addMoreItems =function(){
      last=99999999999
      if ( $scope.Companies!==undefined   && $scope.Companies.length>0){
        lastkey= Object.keys($scope.Companies).pop() ;
         last=$scope.Companies[lastkey].company_id;
      }

      data= {"action":"CompanyList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last}
      $scope.loader=true;
      $http.post(SERVICEURL2,  data )
          .success(function(responceData)  {
                    if(responceData.RESPONSECODE=='1') 			{
                      data=responceData.RESPONSE;
                      $scope.loaded=data.length
                      if (last==99999999999)
                        $scope.Companies=data;
                      else
                      $scope.Companies=$scope.Companies.concat(data);
                      //$scope.Customers=data;
                      $scope.loader=false;

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
           localstorage("CompanyID",d.company_id);
           localstorage('add_company.html',JSON.stringify({action:'edit_company',location:curr_page}))
           redirect('add_company.html')
         };
         $scope.add_company = function(){
           localstorage('add_company.html',JSON.stringify({action:'add_company',location:curr_page}))
           redirect('add_company.html')
         };
          $scope.toowners = function(d){
            localstorage('owners_list.html',JSON.stringify({action:'owners_list',location:curr_page}))
            localstorage("Company_name",d.name);
            localstorage("CompanyID",d.company_id);
            redirect('owners_list.html')
           };
           $scope.toDocs = function(d){
          	 localstorage('my_document.html',JSON.stringify({action:'list_from_my_company',location:curr_page}))
             localstorage("CompanyID",d.company_id);
             localstorage("Company_name",d.name);
          	 redirect('my_document.html')
          };
          console.log($scope.Contracts);
});
