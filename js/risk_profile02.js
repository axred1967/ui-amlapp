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

  chkloggedin();

}

setTimeout(function(){
  checkthesidebarinfouser();
}, 800);

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



  switch ($scope.action){
    default:
    var id=localStorage.getItem("CustomerProfileId");
    var email=localStorage.getItem("userEmail");
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    appData=$scope.Contract
    data= {"action":"riskAx",appData:appData,country:true}
    $http.post( SERVICEURL2,  data )
    .success(function(responceData) {
      $('#loader_img').hide();
      if(responceData.RESPONSECODE=='1') 			{
        $scope.Kyc=responceData.kyc;
        data=responceData.RESPONSE;
        $scope.Risk=data;
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
        convertDateStringsToDates($scope.Risk)
        convertDateStringsToDates($scope.Risk.risk_data)
        if ($scope.Risk.risk_data.mainActivity===undefined || ! isObject($scope.Risk.risk_data.mainActivity))
          $scope.Risk.risk_data.mainActivity={}
          if ($scope.Risk.risk_data.Residence===undefined || ! isObject($scope.Risk.risk_data.Residence))
            $scope.Risk.risk_data.Residence={}

//        $scope.Risk.risk_data.partial=IsJsonString($scope.Risk.risk_data.partial)
        $('input.mdl-textfield__input').each(
          function(index){
            $(this).parent('div.mdl-textfield').addClass('is-dirty');
            $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
        );
      }
      else
      {
        console.log('error');
      }
    })
    .error(function() {
      console.log("error");
    });

    $scope.action="saveKyc"
    $scope.viewName="Profilo Soggettivo"


  }
  $scope.save_risk= function (passo){
    if ($scope.form.$invalid) {
      angular.forEach($scope.form.$error, function(field) {
        angular.forEach(field, function(errorField) {
          errorField.$setTouched();
        })
      });
      swal("riempire form corretamente");
      console.log("Form is invalid.");
      return
    } else {
      //$scope.formStatus = "Form is valid.";
      console.log("Form is valid.");
      console.log($scope.data);
    }
    var langfileloginchk = localStorage.getItem("language");
    dbData=$scope.Risk
    dbData.risk_data=JSON.stringify(dbData.risk_data)

    $('#loader_img').show();
    data={ "action":"saveRiskAx", appData:$scope.Contract,dbData:dbData}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1') 			{
        swal("",data.RESPONSE);
        $scope.lastid=data.lastid

        $scope.back(passo)

      }
      else
      {
        console.log('error');
        $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
        swal("",data.RESPONSE);
      }
    })
    .error(function() {
      $scope.Risk.risk_data=IsJsonString($scope.Risk.risk_data)
      console.log("error");
    });


  }


  $scope.showAC=function($search,$word){
    var id=localStorage.getItem("userId");
    var usertype = localStorage.getItem('userType');
    res = $search.split(".")
    $search=res[1]
    if ($word===undefined){
      $word=$scope[res[0]][res[1]]
    }
    else {
      $word=$('#'+$word).val()
    }
    $table=res[0].toLowerCase()

    if (( $word  !== "undefined" && $word.length>3 &&  $word!=$scope.oldWord)){

      data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table}
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        if(data.RESPONSECODE=='1') 			{
          //$word=$($search.currentTarget).attr('id');
          $scope.word[$search]=data.RESPONSE;
        }
      })
      .error(function() {
        console.log("error");
      });
    }
    $scope.oldWord= $($search.currentTarget).val()
  }
  $scope.resetAC=function(){
    $scope.word={}
    $scope.list={}
    $scope.listOther={}
    $scope.listCompany={}


  }
  $scope.addWord=function($search,$word){
    res = $search.split(".")
    switch(res.length){
      case 2:
      $scope[res[0]][res[1]]=$word
      $scope.word[res[1]]=[]
      break;
      case 3:
      $scope[res[0]][res[1]][res[2]]=$word
      $scope.word[res[2]]=[]
      break;

    }
  }



  $scope.add_document=function(Doc){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document.html',JSON.stringify({action:"add_document_for_risk_id",location:curr_page}))
    Doc.doc_name="Documento di Identità"
    Doc.doc_type="Documento di Identità"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='contract'
    if ($scope.Kyc.contract_id===undefined && $scope.Kyc.contract_id>0)
      Doc.per_id=$scope.Kyc.contract_id;
    Doc.id=null
    Doc.image_name=null
    Doc.showOnlyImage=true
    Doc.indice=$scope.Kyc.contractor_data.Docs.length

    localstorage('Doc',JSON.stringify(Doc))
    //localstorage('Contract',JSON.stringify($scope.Contract))
    redirect('add_document.html')
   }

   $scope.check_risk=function (partial){
   if   ($scope.Risk.risk_data.partial===undefined|| $scope.Risk.risk_data.partial==false)
      $scope.Risk.risk_data.partial={}
   $scope.Risk.risk_data.partial[partial]="Basso"

     angular.forEach($scope.Risk.risk_data[partial], function(value, key) {
       if (value==1 || value.length>5){
          $scope.Risk.risk_data.partial[partial]="Alto"
          return

       }

     });


   }

   $scope.back=function(passo){
     if (passo>0){
         localstorage('risk_profile0'+ passo +'.html',JSON.stringify({action:'',location:$scope.page.location, prev_page:curr_page}))
         redirect('risk_profile0'+ passo +'.html')
         return;
     }
     if (passo==-1){
         redirect($scope.page.prev_page)
         return;
     }
     redirect($scope.page.location)
   }


})
