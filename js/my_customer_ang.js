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
app2.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')'

            });
        });
    };
});

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
  $scope.loader=false;
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

  $scope.imageurl=function(Customer){
    Customer.IMAGEURI=BASEURL+"uploads/user/small/"
    if (Customer.image===undefined || Customer.image.length==0)
      Customer.imageurl= '../img/customer-listing1.png'
    else
      Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   Customer.imageurl

  }

  $scope.addMoreItems =function(){
    $scope.loader=true
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
        $scope.loader=false
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
  $scope.deleteCustomer=function(Customer,index )
  {
    navigator.notification.confirm(
        'Vuoi cancellare il Contratto!', // message
        function(button) {
         if ( button == 1 ) {
             $scope.deleteCustomer(Customer,index);
         }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
        );

  }
  $scope.deleteCustomer=function(Customer,index){
    $http.post(SERVICEURL2,{action:'delete',table:'users','primary':'id',id:Customer.user_id })
    $scope.Customer.splice(index,1);
  }
  console.log($scope.Contracts);
});
function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
      $scope.deleteDoc(doc)
}
