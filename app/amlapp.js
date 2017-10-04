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
var autocomplete_table_focus=''
var first_autocomplete_table_focus=false


var app2 = angular.module('myApp', ['ui.router','pascalprecht.translate','ngSanitize','ng-currency','fieldMatch','infinite-scroll','textAngular','tmh.dynamicLocale']);

app2.config(function ($translateProvider, tmhDynamicLocaleProvider,$sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://amlapp.euriskoformazione.com/**'
  ]);
  // Enable escaping of HTML
  $translateProvider.useStaticFilesLoader({
                    prefix: BASEURL+ '/localization/',
                    suffix: '.json'
                })
                .preferredLanguage('it-IT')

  tmhDynamicLocaleProvider.localeLocationPattern(BASEURL+'/localization/angular-locale_{{locale}}.js');

  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
});

app2.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================

        .state('home', {
            url: '/home?action&agency_id&codeCli',
            templateUrl: BASEURL+ 'templates/my_contract.html',
            controller: 'my_contract'
        })
        .state('login', {
            url: '/login?action&agency_id&codeCli',
            templateUrl: BASEURL+ 'templates/login.html',
            controller: 'login'
        })
        .state('language', {
            url: '/language',
            templateUrl: BASEURL+ 'templates/language.html',
            controller: 'language'
        })
        .state('view_contract', {
            url: '/view_contract',
            templateUrl: BASEURL+ 'templates/view_contract.html',
            controller: 'view_contract',
            params: {pages: null}
        })
        .state('add_contract', {
            url: '/contract',
            templateUrl: BASEURL+ 'templates/add_contract.html',
            controller: 'add_contract',
            params: {pages: null}
        })
        .state('add_customer', {
            url: '/customer',
            params: {pages: null},
            views: {
                '': {
                      templateUrl: BASEURL+ 'templates/add_customer.html',
                      controller: 'add_customer',
                    },
                'customer_fields@add_customer':   {
                  templateUrl: BASEURL+ 'templates/add_customer_field.html',
                  },
                }


        })
        .state('my_customer', {
            url: '/my_customer',
            templateUrl: BASEURL+ 'templates/my_customer.html',
            controller: 'my_customer',
            params: {pages: null}
        })
        .state('my_company', {
            url: '/company',
            templateUrl: BASEURL+ 'templates/my_company.html',
            controller: 'my_company',
            params: {pages: null}
        })
        .state('my_agent', {
            url: '/agent',
            templateUrl: BASEURL+ 'templates/my_agent.html',
            controller: 'my_agent',
            params: {pages: null}
        })
        .state('owners_list', {
            url: '/owners_list',
            templateUrl: BASEURL+ 'templates/owners_list.html',
            controller: 'owners_list',
            params: {pages: null}

        })
        .state('my_document', {
            url: '/document',
            templateUrl: BASEURL+ 'templates/my_document.html',
            controller: 'my_document',
            params: {pages: null}
        })
        .state('add_document', {
            url: '/add_document',
            templateUrl: BASEURL+ 'templates/add_document.html',
            controller: 'add_document',
            params: {pages: null}
        })
        .state('add_owners', {
            url: '/add_owners',
            params: {pages: null},
            views: {
                '': {
                  templateUrl: BASEURL+ 'templates/add_owners.html',
                  controller: 'add_owners',
                    },
                'customer_fields@add_owners':   {
                  templateUrl: BASEURL+ 'templates/owner_field.html',
                  },
                }
        })
        .state('add_owners.kyc', {
            url: '/add_owners_kyc',
            params: {pages: null},
            views: {
                '': {
                  templateUrl: BASEURL+ 'templates/add_owners.html',
                  controller: 'add_owners',
                    },
                'customer_fields@add_owners':   {
                  templateUrl: BASEURL+ 'templates/add_TEField.html',
                  },
                }
        })
        .state('add_company', {
            url: '/add_company',
            templateUrl: BASEURL+ 'templates/add_company.html',
            controller: 'add_company',
            params: {pages: null}
        })
        .state('kyc_contractor', {
            url: '/contractorData',
            params: {pages: null},
            views: {
                '': {
                  templateUrl: BASEURL+ 'templates/kyc_contractor.html',
                  controller: 'kyc_contractor',
                  },
                }
            })
            .state('kyc_contractor.01', {
              url: '/contractorData1',
              views: {
                 '01@kyc_contractor':   {
                     templateUrl: BASEURL+ 'templates/kyc_contractor01.html',
                     },
                 }
            })
             .state('kyc_contractor.02', {
               url: '/contractorData2',
               views: {
                  '02@kyc_contractor':   {
                      templateUrl: BASEURL+ 'templates/kyc_contractor02.html',
                      },
                  }
             })

        .state('kyc_company', {
          url: '/kyc_company',
          params: {pages: null},
          views: {
            '': {
              templateUrl: BASEURL+ 'templates/kyc_company.html',
              controller: 'kyc_company',
            },
            '01@kyc_company':   {
              templateUrl: BASEURL+ 'templates/kyc_company_field.html',

            }

          },
        })

        .state('kyc_owners', {
            url: '/kyc_owners',
            templateUrl: BASEURL+ 'templates/kyc_owners.html',
            controller: 'kyc_owners',
            params: {pages: null}
        })
        .state('kyc_document', {
            url: '/kyc_document',
            templateUrl: BASEURL+ 'templates/kyc_document.html',
            controller: 'kyc_document',
            params: {pages: null}
        })
        .state('kyc_signature', {
            url: '/kyc_signature',
            templateUrl: BASEURL+ 'templates/kyc_signature.html',
            controller: 'kyc_signature',
            params: {pages: null}
        })
        .state('risk_profile01', {
            url: '/risk_profile01',
            templateUrl: BASEURL+ 'templates/risk_profile01.html',
            controller: 'risk_profile01',
            params: {pages: null}
        })
        .state('risk_profile02', {
            url: '/risk_profile02',
            templateUrl: BASEURL+ 'templates/risk_profile02.html',
            controller: 'risk_profile02',
            params: {pages: null}
        })
        .state('risk_profile03', {
            url: '/risk_profile03',
            templateUrl: BASEURL+ 'templates/risk_profile03.html',
            controller: 'risk_profile03',
            params: {pages: null}
        })
        .state('risk_profile04', {
            url: '/risk_profile04',
            templateUrl: BASEURL+ 'templates/risk_profile04.html',
            controller: 'risk_profile04',
            params: {pages: null}
        })
        .state('risk_profile05', {
            url: '/risk_profile05',
            templateUrl: BASEURL+ 'templates/risk_profile05.html',
            controller: 'risk_profile05',
            params: {pages: null}
        })
        .state('risk_final', {
            url: '/risk_final',
            templateUrl: BASEURL+ 'templates/risk_final.html',
            controller: 'risk_final',
            params: {pages: null}
        })
        .state('my_profile', {
            url: '/my_profile',
            templateUrl: BASEURL+ 'templates/my_profile.html',
            controller: 'my_profile',
            params: {pages: null}
        })
        .state('risk_profile01_sm', {
            url: '/risk_profile01_sm',
            templateUrl: BASEURL+ 'templates/risk_profile01_sm.html',
            controller: 'risk_profile01_sm',
            params: {pages: null}
        })
        .state('risk_profile02_sm', {
            url: '/risk_profile02_sm',
            templateUrl: BASEURL+ 'templates/risk_profile02_sm.html',
            controller: 'risk_profile02_sm',
            params: {pages: null}
        })
        .state('risk_final_sm', {
            url: '/risk_final_sm',
            templateUrl: BASEURL+ 'templates/risk_final_sm.html',
            controller: 'risk_final_sm',
            params: {pages: null}
        })
        .state('risk_profile01_4d', {
            url: '/risk_profile01_4d',
            templateUrl: BASEURL+ 'templates/risk_profile01_4d.html',
            controller: 'risk_profile01_4d',
            params: {pages: null}
        })
        .state('risk_profile02_4d', {
            url: '/risk_profile02_4d',
            templateUrl: BASEURL+ 'templates/risk_profile02_4d.html',
            controller: 'risk_profile02_4d',
            params: {pages: null}
        })
        .state('risk_profile03_4d', {
              url: '/risk_profile03_4d',
              templateUrl: BASEURL+ 'templates/risk_profile03_4d.html',
              controller: 'risk_profile03_4d',
              params: {pages: null}
          })
          .state('risk_profile04_4d', {
                url: '/risk_profile04_4d',
                templateUrl: BASEURL+ 'templates/risk_profile04_4d.html',
                controller: 'risk_profile04_4d',
                params: {pages: null}
            })
            .state('risk_final_4d', {
                  url: '/risk_final_4d',
                  templateUrl: BASEURL+ 'templates/risk_final_4d.html',
                  controller: 'risk_final_4d',
                  params: {pages: null}
              })
              .state('agg_kyc', {
                    url: '/agg_kyc',
                    templateUrl: BASEURL+ 'templates/agg_kyc.html',
                    controller: 'agg_kyc',
                    params: {pages: null}
                })
                .state('agg_risk', {
                      url: '/agg_risk',
                      templateUrl: BASEURL+ 'templates/agg_risk.html',
                      controller: 'agg_risk',
                      params: {pages: null}
                  })
// share
          .state('share', {
              url: '/share',
              params: {pages: null},
              views: {
                  '': {
                    templateUrl: BASEURL+ 'templates/share.html',
                    controller: 'share',
                      },
                  'agency_list@share':   {
                    templateUrl: BASEURL+ 'templates/agency_list.html',
                    },
                  }
          })
        .state('logout', {
            url: '/logout',
            controller: 'logout',
            params: {pages: null}
        })
// Amministrazione
        .state('my_agencies', {
            url: '/my_agency',
            templateUrl: BASEURL+ 'templates/my_agencies.html',
            controller: 'my_agencies',
            params: {pages: null}
        })
        .state('add_agency', {
            url: '/add_agency',
            templateUrl: BASEURL+ 'templates/add_agency.html',
            controller: 'add_agency',
            params: {pages: null}
        })
        .state('my_plan', {
            url: '/my_plan',
            templateUrl: BASEURL+ 'templates/my_plan.html',
            controller: 'my_plan',
            params: {pages: null}
        })
        .state('add_plan', {
            url: '/add_plan',
            templateUrl: BASEURL+ 'templates/add_plan.html',
            controller: 'add_plan',
            params: {pages: null}
        })
        .state('email_templates', {
            url: '/email_templates',
            templateUrl: BASEURL+ 'templates/email_templates.html',
            controller: 'email_templates',
            params: {pages: null}
        })
        .state('add_email_template', {
            url: '/add_email_template',
            templateUrl: BASEURL+ 'templates/add_email_template.html',
            controller: 'add_email_template',
            params: {pages: null}
        })


        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
          url: '/view_contract',
          templateUrl: BASEURL+ 'view_contract.html'
        });

});
app2.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')'

            });
        });
    };
});
app2.directive('uploadmfiles', ['$http','$timeout', function($http) {
  return {
    restrict: 'A',

    scope: {
      dirAgent: '=dirAgent',
      docs: '=docs',
      doc: '=doc',
      dirText: '@',
      preUploaded:'&',
      uploadedMFile:'&'
    },
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
      element.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
      element.on('dragenter', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
      var uploadmfiles = function(files) {
        var nfile=files.length
        var $i=0;
        var image_type=['.png','.gif','.png','.tif','.bmp','.jpg','.jpeg']
        angular.forEach(files, function(value){
          var f = value
          r = new FileReader();
          var file=f
          r.onloadend = function(e) {
            var data = e.target.result;
            f={}
            f.data=data
            f.name=file.name
            var extn = "." +f.name.split(".").pop();
            filename=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn

            if (scope.docs[$i]===undefined){
              scope.docs[$i]={}
            }
            scope.docs[$i].doc_name=file.name;
            scope.docs[$i].loaded=false
            scope.docs[$i].per=scope.doc.per
            scope.docs[$i].per_id=scope.doc.per_id
            scope.docs[$i].indice=scope.doc.indice+$i
            scope.docs[$i].doc_image=filename
            scope.docs[$i].file_type=extn;
            if(image_type.indexOf(scope.docs[$i].file_type) === -1) {
              scope.docs[$i].isImage=false
            }
            else {
              scope.docs[$i].isImage=true
            }
            data={action:"upload_document_ax",userid:scope.doc.per_id,for:scope.doc.per, filename:filename,indice:scope.doc.indice+$i,f:f,pInfo:scope.dirAgent}
            $i++;
            if ($i>=nfile)
              scope.preUploaded({args:scope.docs})


            $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
            .then(function(data){
              if (data.data.RESPONSECODE=='1'){
                scope.uploadedMFile({args:data.data.response})
              }
              if (data.data.RESPONSECODE=='-1'){
                localstorage('msg','Sessione Scaduta ');
                $state.go('login');;;
              }
              console.log('success');
            })
            , (function(){
              console.log('error');
            });
          };
          r.readAsDataURL(f);


        });

        //              data.append("objectId", ngModel.$viewValue);

      };

      element.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.originalEvent.dataTransfer){
          if (e.originalEvent.dataTransfer.files.length > 0) {
            uploadmfiles(e.originalEvent.dataTransfer.files);
          }
        }
        return false;
      });          // Code goes here

    }
  };
}]);
/*
app2.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
      });
   };
});
*/
app2.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app2.directive('tooltip', function(){
    return {
        restrict: 'A',
        scope : {
            id : '@',
        },
        link: function(scope, element, attrs){
            $(element).on('mouseenter',function(){
                // on mouseenter
                o=$("span[for='" +scope.id+"']")
                o.addClass('is-active');
                o.show();
                offset=$(element).offset()
                o.offset({top:offset.top+30, left:offset.left});
              })
            $(element).on('mouseleave', function(){
                // on mouseleave
                $("span[for='" +scope.id+"']").removeClass('is-active');
                $("span[for='" +scope.id+"']").hide();
            });
        }
    };
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
//direttiva per il valore di default
/*
app2.directive('defSetting', function(){
  return {
      restrict : 'A',
      scope : {
          ngModel : '=',
          defSetting : '='
      },
      link: function (scope) {

          if ( scope.ngModel===undefined || scope.ngModel===null  )
          scope.ngModel = scope.defSetting


      }
  }
});
*/
//direttiva per trasformare stringe in oggetti data
/*
app2.directive('dateInput', function(){
    return {
        restrict : 'A',
        scope : {
            ngModel : '=',
            id : '@'
        },
        link: function (scope) {
          scope.$watch('ngModel', function(newValue, oldValue) {
                          if (newValue===undefined && oldValue!==undefined){
                                scope.ngModel =oldValue
                            return
                          }
                          if (newValue && ! isObject(newValue)){
                            scope.ngModel = new Date(newValue);
                            return

                          }
                          if (!isObject(newValue)){
                            scope.ngModel = new Date()
                            return
                          }
                      });
        }
    }
});
*/
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
  $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error){

      if(error === "Not Authorized"){
          $state.go("notAuthorizedPage");
      }
    })
    $rootScope.convertDateStringsToDates=function(input) {


          var value = input;
          var match;
          // Check for string properties which look like dates.
          if (typeof value === "string" && (match = value.match(regexIso8601))) {
              var milliseconds = Date.parse(match[0])
              if (!isNaN(milliseconds)) {
                  input = new Date(milliseconds);
              }
          }
      return input

    }
});
app2.filter('dateToISO', function() {
  return function(input) {
    if (isObject(input) || input===undefined) return input
    return new Date(input).toISOString();
  };
});
app2.filter('capitalize', function() {
  return function(input, $scope) {
    if ( input !==undefined && input.length>0)
    return input.substring(0,1).toUpperCase()+input.substring(1);
    else
    return input

  }
});

app2.service('AutoComplete',function($http,$state){
  this.showAC=function($search,$word, settings) {

    var id=localStorage.getItem("userId");
    var usertype = localStorage.getItem('userType');
    res = $search.split(".")
    $search=res[1]
    $word=$('#'+$word).val()
    $table=res[0].toLowerCase()
    if (( $word  !== undefined && $word.length>0 &&  $word!=this.oldWord) || settings.zero){
     data={ "action":"ACWord",   word:res[1] ,settings:settings,search:$word ,table:$table,pInfo:settings.pInfo}
     return $http.post( SERVICEURL2,  data )
    }
    this.oldWord= $($search.currentTarget).val()

  }
})



app2.controller('personCtrl', function ($scope, $state,$stateParams,tmhDynamicLocale,$translate,$sce,$timeout,$location,$window,$http) {
  var isapp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
  var forceSSL = function () {
      if ( $location.protocol() !== 'https') {
          $window.location.href = $location.absUrl().replace('http', 'https');
      }
  };
  if (!isapp)
    forceSSL();
  $sce.trustAsResourceUrl('https://amlapp.euriskoformazione.com')
  $scope.agent={}
  $scope.agentList={}
  if ($scope.agent.name===undefined){
    $scope.agent.name=localStorage.getItem('Name');
    $scope.agent.email=localStorage.getItem('userEmail');
    $scope.agent.id=localStorage.getItem('agentId');
    $scope.agent.user_id=localStorage.getItem('userId');
    $scope.agent.agency_id=localStorage.getItem('agencyId');
    $scope.agent.user_type=localStorage.getItem('userType');
    $scope.agent.priviledge=localStorage.getItem('priviledge');

    $scope.agent.cookie=localStorage.getItem('cookie');
    $scope.agent.image=localStorage.getItem('image');
    $scope.agent.settings=IsJsonString(localStorage.getItem('userSettings'));
    $scope.agent.pInfo={user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}
    $scope.agent.pInfoUrl="&" +jQuery.param({pInfo:$scope.agent.pInfo})

    if ($scope.agent.image===undefined ||  $scope.agent.image === null ||  $scope.agent.image == 'null' || $scope.agent.image.length==0)
      $scope.agent.imageurl= ''
    else
      $scope.agent.imageurl= SERVICEDIRURL +"file_down.php?tipo=profilo&file=" + $scope.agent.image +"profile=1"+ $scope.agent.pInfoUrl

    $scope.agent.paese= localStorage.getItem("paese");
    $scope.agent.tipo_cliente= localStorage.getItem("tipo_cliente");
  }
// Carico Lista agentdi
$scope.loadAgentList=function(){
    settings={table:'agent',id:'agent_id',
              fields:{
                'j1.name':'name',
                'j1.surname':'surname',
              'uno.agent_id':'agent_id'
              },
              join:{
                'j1':{'table':'users',
                      'condition':'uno.user_id=j1.user_id '
                    }
              },
                  where: {
                'uno.agency_id':$scope.agent.agency_id

              }, limit:100
            }
    data= {"action":"ListObjs",settings:settings,pInfo:$scope.agent.pInfo}
    $http.post(SERVICEURL2,  data )
    .then(function(responceData)  {
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE
        $scope.agentList=data;
      }
      else   {
        if (responceData.data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          $state.go('login');;;
        }
      }})
      , (function() {
        console.log("error");
      });


}

$scope.loadAgentList();



  // fisso preferenze nomi
      paese = $scope.agent.paese;
      tipo_cliente = $scope.agent.tipo_cliente;
      switch (paese){
        case 'italia':
        case 'san marino':
        tmhDynamicLocale.set('it');
        switch (tipo_cliente){
          case 'agenzia assicurazioni':
            $translate.use('it-IT'); // translati   ons-en-US.json
            break;
          case 'studio commercialisti':
          $translate.use('it-IT-comm'); // translati   ons-en-US.json
          break;
          default:
            $translate.use('it-IT'); // translati   ons-en-US.json

        }
        break;
        case'stati uniti' :
          break;
        default:
        $translate.use('it-IT'); // translati   ons-en-US.json
        tmhDynamicLocale.set('it');

      }

  $scope.load=false
  $scope.main={}
  if ($scope.agent.user_type==3)
  $scope.main.Cm="dati personali"
  else
  $scope.main.Cm="Le mie Persone"
  $scope.main.Sidebar=true
  $scope.main.Add=true
  $scope.main.Back=true
  $scope.main.Search=false
  $scope.main.viewName=""
  $scope.main.other_data=false
  var isapp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
  if ( isapp ) {
    $scope.main.web=false
  } else {
    $scope.main.web=true
  }
  $scope.back=function(){
    $scope.$broadcast('backButton')


  }
  $scope.add=function(){
    $scope.$broadcast('addButton')


  }
  $scope.search=function(){
    $scope.$broadcast('searchButton')


  }
  if ($stateParams.action=='signup'){
    localstorage('add_agency',JSON.stringify({action:'complete_signup',location:'login'}))
    $state.go("add_agency");

  }

  var chksession = localStorage.getItem('userId');
  var typesi = localStorage.getItem('userType');
  var langfile = localStorage.getItem("language");
  if (!chksession)
  {
      $state.go('login')
  }
    //checkthesidebarinfouser();

    $scope.updateImageDialog=function(gradi,indice){
      $scope.$broadcast('updateImageDialog',{gradi:gradi,doc:docPassed})

    }


})
window.addEventListener('keydown', function (evt) {
  if ($(evt.target)===undefined && $(evt.target).get(0) ===undefined){
    return
  }
  if ($(evt.target).is('[autocomplete]') && $(evt.target).get(0).tagName.toLowerCase()=="input"){
    if (evt.keyCode == 40){
      evt.preventDefault()
      autocomplete_table_focus=evt.target.id
      $('table[autocomplete="'+autocomplete_table_focus+'"] tbody tr:first').addClass('material_row_selected')
      $('table[autocomplete="'+autocomplete_table_focus+'"] tbody tr:first').focus()
    }
    return
  }
  if ($(evt.target)!==undefined && $(evt.target).get(0) !==undefined && $(evt.target).get(0).tagName.toLowerCase()=="tr" ){

    if (evt.keyCode == 38  && $('table[autocomplete="'+autocomplete_table_focus+'"] tbody tr.material_row_selected').is(':focus') ) { // up
      evt.preventDefault()
      $('table[autocomplete="'+autocomplete_table_focus+'"] tbody tr:not(:first).material_row_selected').removeClass('material_row_selected').prev().addClass('material_row_selected')
      $('table[autocomplete="'+autocomplete_table_focus+'"] tbody tr.material_row_selected').focus();
    }
    if (evt.keyCode == 40  && $('table[autocomplete="'+autocomplete_table_focus+'"] tbody tr.material_row_selected').is(':focus') ) { // down
      evt.preventDefault()
      $('table[autocomplete="'+autocomplete_table_focus+'"] tbody tr:not(:last).material_row_selected').removeClass('material_row_selected').next().addClass('material_row_selected')
      $('table[autocomplete="'+autocomplete_table_focus+'"] tbody tr.material_row_selected').focus();
    }

  }

})


$(document).ready(function() {
  resize_img();


});
app2.controller('logout', function ($scope, $state) {
  $scope.agent={}
  localStorage.removeItem('userId');
  localStorage.removeItem('userType');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('agencyId');
  localStorage.removeItem('agencyId');
  localStorage.removeItem('Profileimageagencyuser');
  localStorage.removeItem('usersettings');
  $state.go('login')
});
