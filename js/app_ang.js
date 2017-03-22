var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/my_customer.html');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/my_customer.html',
            templateUrl: '/templates/my_contract.html',
            controller:"my_contract"
        })

        .state('view_contract', {
            url: '/add_contract.html',
            templateUrl: '/templates/add_contract.html',
            controller:"add_contract"
        })
});

routerApp.controller('my_contract', function($scope, $http) {
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
              tocontract(d)
            };
        console.log($scope.Contracts);
  });
