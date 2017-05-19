var app = {
  initialize: function() {
    this.bind();
  },
  bind: function() {
    document.addEventListener('deviceready', getChkLogin, false);
  },
  deviceready: function() {
    // This is an event handler function, which means the scope is the event.
    // So, we must explicitly called `app.report()` instead of `this.report()`.
    app.report('deviceready');
  },
  report: function(id) {
    // Report the event in the console
    console.log("Report: " + id);
  },
};

function getChkLogin()
{

}



var app2 = angular.module('myApp', ['ui.router','pascalprecht.translate','ng-currency','fieldMatch','infinite-scroll']);
app2.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'templates/my_contract.html',
            controller: 'my_contract'
        })
        .state('view_contract', {
            url: '/view_contract',
            templateUrl: 'templates/view_contract.html',
            controller: 'view_contract'
        })
        .state('add_contract', {
            url: '/contract',
            templateUrl: 'templates/add_contract.html',
            controller: 'add_contract'
        })
        .state('add_customer', {
            url: '/customer',
            templateUrl: 'templates/add_customer.html',
            controller: 'add_customer'
        })
        .state('my_customer', {
            url: '/customer',
            templateUrl: 'templates/my_customer.html',
            controller: 'my_customer'
        })
        .state('my_company', {
            url: '/company',
            templateUrl: 'templates/my_company.html',
            controller: 'my_company'
        })
        .state('my_agent', {
            url: '/agent',
            templateUrl: 'templates/my_agent.html',
            controller: 'my_agent',
            params: {Company:{},Contract:{}}
        })
        .state('owners_list', {
            url: '/owners_list',
            templateUrl: 'templates/owners_list.html',
            controller: 'owners_list'
        })
        .state('my_document', {
            url: '/document',
            templateUrl: 'templates/my_document.html',
            controller: 'my_document'
        })
        .state('add_document', {
            url: '/add_document',
            templateUrl: 'templates/add_document.html',
            controller: 'add_document'
        })
        .state('add_owners', {
            url: '/add_owners',
            templateUrl: 'templates/add_owners.html',
            controller: 'add_owners'
        })
        .state('add_company', {
            url: '/add_company',
            templateUrl: 'templates/add_company.html',
            controller: 'add_company'
        })
        .state('kycstep01', {
            url: '/kycstep01',
            templateUrl: 'templates/kycstep01.html',
            controller: 'kycstep01'
        })
        .state('kycstep02', {
            url: '/kycstep02',
            templateUrl: 'templates/kycstep02.html',
            controller: 'kycstep02'
        })
        .state('kycstep03', {
            url: '/kycstep03',
            templateUrl: 'templates/kycstep03.html',
            controller: 'kycstep03'
        })
        .state('kyc_company', {
            url: '/kyc_company',
            templateUrl: 'templates/kyc_company.html',
            controller: 'kyc_company'
        })
        .state('kyc_owners', {
            url: '/kyc_owners',
            templateUrl: 'templates/kyc_owners.html',
            controller: 'kyc_owners'
        })
        .state('kyc_signature', {
            url: '/kyc_signature',
            templateUrl: 'templates/kyc_signature.html',
            controller: 'kyc_signature'
        })
        .state('risk_profile01', {
            url: '/risk_profile01',
            templateUrl: 'templates/risk_profile01.html',
            controller: 'risk_profile01'
        })
        .state('risk_profile02', {
            url: '/risk_profile02',
            templateUrl: 'templates/risk_profile02.html',
            controller: 'risk_profile02'
        })
        .state('risk_profile03', {
            url: '/risk_profile03',
            templateUrl: 'templates/risk_profile03.html',
            controller: 'risk_profile03'
        })
        .state('risk_profile04', {
            url: '/risk_profile04',
            templateUrl: 'templates/risk_profile04.html',
            controller: 'risk_profile04'
        })
        .state('risk_profile05', {
            url: '/risk_profile05',
            templateUrl: 'templates/risk_profile05.html',
            controller: 'risk_profile05'
        })
        .state('risk_final', {
            url: '/risk_final',
            templateUrl: 'templates/risk_final.html',
            controller: 'risk_final'
        })        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
          url: '/view_contract',
          templateUrl: 'view_contract.html'
        });

});

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





app2.controller('personCtrl', function ($scope, $state) {
  $scope.load=false
  $scope.main={}
  $scope.main.Sidebar=true
  $scope.main.Add=true
  $scope.main.Back=true
  $scope.main.Search=false
  $scope.main.viewName=""
  $scope.main.other_data=false

  $scope.back=function(){

    history.back()


  }
  $scope.add=function(){
    localstorage($scope.main.AddPage+'.html',JSON.stringify({action:$scope.main.action,location:$scope.main.AddPage}))
    $state.go($scope.main.AddPage)


  }
  var langchkvarlang = localStorage.getItem("language");
  if(langchkvarlang == null)
  {
    redirect("language.html");
  }
  var chksession = localStorage.getItem('userId');
  var typesi = localStorage.getItem('userType');
  var langfile = localStorage.getItem("language");
  if (!chksession)
  {
    window.location = "login.html";
  }
    checkthesidebarinfouser();



})

$(document).ready(function() {
  function resize_img(){
    $('.demo-card-image img.load').each(function() {

      var maxWidth = $('.demo-card-image').width(); // Max width for the image
      var maxHeight = $('.demo-card-image').width();    // Max height for the image
      var ratio = 16/9;  // Used for aspect ratio
      var width = $(this).width();    // Current image width
      var height = $(this).height();  // Current image height
      $(this).show()

      // Check if the current width is larger than the max
      if(width > maxWidth){
        ratio = maxWidth / width;   // get ratio for scaling image
        $(this).css("width", maxWidth); // Set new width
        $(this).css("height", height * ratio);  // Scale height based on ratio
        $(this).css("backgroud-size",  maxWidth +'px' + height*ratio+'px' );  // Scale height based on ratio
        height = height * ratio;    // Reset height to match scaled image
        width = width * ratio;    // Reset width to match scaled image
      }

      // Check if current height is larger than max
      if(height > maxHeight){
        ratio = maxHeight / height; // get ratio for scaling image
        $(this).css("height", maxHeight);   // Set new height
        $(this).css("width", width * ratio);    // Scale width based on ratio
        $(this).css("backgroud-size",  width * ratio +'px' + maxheight+'px' );  // Scale height based on ratio
        $(this).css("backgroud-size",  width * ratio +'px' + maxheight+'px' );  // Scale height based on ratio
        width = width * ratio;    // Reset width to match scaled image
        height = height * ratio;    // Reset height to match scaled image
      }
      //$(this).parent( ".demo-card-image").css('background-image','url('+$(this).attr('src')+')')
      //$(this).parent( ".demo-card-image").attr('width',$(this).width())
      //$(this).parent( ".demo-card-image").attr('height',$(this).height())
      //$(this).parent( ".demo-card-image").css('background-size',$(this).width()  +'px' + $(this).height()  +'px')
      //$(this).hide()


    });
  }
  resize_img();
});
