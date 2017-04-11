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
     $scope.page={}
     curr_page=base_name()
   	page=localStorage.getItem(curr_page)
   	if ( page!= null && page.length >0 ){
   		$scope.page=JSON.parse(page)
   		$scope.action=$scope.page.action

   	}
//    $scope.datalang = DATALANG;

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
           $scope.toDocs = function(d){
          	 localstorage('my_document.html',JSON.stringify({action:'list_from_my_customer',location:curr_page}))
             localstorage("customerId",d.user_id);
             localstorage("customer_name",d.fullname);
          	 redirect('my_document.html')
          };

      console.log($scope.Contracts);
});
