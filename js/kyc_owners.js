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
  var id=localStorage.getItem("CustomerProfileId");
  var email=localStorage.getItem("userEmail");
  $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
  $scope.action="saveKyc"
  $scope.viewName=$scope.Contract.owner

  $scope.page={}
  curr_page=base_name()
  page=localStorage.getItem(curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  if ($scope.page.edit) {
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    convertDateStringsToDates($scope.Kyc)
    convertDateStringsToDates($scope.Kyc.contractor_data)
    convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
    convertDateStringsToDates($scope.Kyc.company_data)
    convertDateStringsToDates($scope.Kyc.owner_data)
    $scope.owner=JSON.parse(localStorage.getItem('Owner'))
    $scope.Kyc.owner_data[$scope.owner.indice]=$scope.owner
  }
  else if ($scope.page.add){
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    convertDateStringsToDates($scope.Kyc)
    convertDateStringsToDates($scope.Kyc.contractor_data)
    convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
    convertDateStringsToDates($scope.Kyc.company_data)
    convertDateStringsToDates($scope.Kyc.owner_data)
    $scope.owner=JSON.parse(localStorage.getItem('Owner'))
    convertDateStringsToDates($scope.owner)
    if ($scope.Kyc.owner_data.length!==undefined|| $scope.Kyc.owner_data.length>0 ){
      $scope.Kyc.owner_data[$scope.Kyc.owner_data.length]=$scope.owner
    }
   else {
     $scope.Kyc.owner_data={}
     $scope.Kyc.owner_data[$scope.Kyc.owner_data.length]=$scope.owner
   }

  }
  else {
  switch ($scope.action){
    default:
    appData=$scope.Contract
    data= {"action":"kycAx",appData:appData,country:true}
    $http.post( SERVICEURL2,  data )
    .success(function(responceData) {
      $scope.loader=true;
      if(responceData.RESPONSECODE=='1') 			{
        data=responceData.RESPONSE;
        $scope.Kyc=data;
        $scope.countryList=responceData.countrylist
        localstorage('countryList',JSON.stringify($scope.countryList))
        if ($scope.Kyc.date_of_identification===undefined || $scope.Kyc.date_of_identification)
        $scope.Kyc.date_of_identification=new Date()
        $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
        $scope.Kyc.contractor_data.Docs=IsJsonString($scope.Kyc.contractor_data.Docs)
        $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
        $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
        convertDateStringsToDates($scope.Kyc)
        convertDateStringsToDates($scope.Kyc.contractor_data)
        convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
        convertDateStringsToDates($scope.Kyc.company_data)
        convertDateStringsToDates($scope.Kyc.owner_data)
        $scope.loader=false


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
    }


  }
  $scope.deleteOwn= function (Own,index){
    owner_id=Own.user_id
    $scope.loader=true;

    data={ "action":"deleteOwner", appData:$scope.Kyc.contractor_data,user_id:owner_id}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      if(data.RESPONSECODE=='1') 			{
        swal("",data.RESPONSE);
        $scope.Kyc.owner_data.splice(index,index);
        $scope.loader=false;

      }
      else
      {
        console.log('error');
        swal("",data.RESPONSE);
        $scope.Kyc.owner_data.splice(index,index);
      }
    })
    .error(function() {
      console.log("error");
    });


  }

  $scope.save_kyc= function (passo){
    var langfileloginchk = localStorage.getItem("language");
    dbData=$scope.Kyc
    dbData.contractor_data=JSON.stringify(dbData.contractor_data)
    dbData.company_data=JSON.stringify(dbData.company_data)
    dbData.owner_data=JSON.stringify(dbData.owner_data)

    $scope.loader=true;

    data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      if(data.RESPONSECODE=='1') 			{
        swal("",data.RESPONSE);
        $scope.lastid=data.lastid

        $scope.back(passo)

      }
      else
      {
        console.log('error');
        swal("",data.RESPONSE);
      }
    })
    .error(function() {
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



  $scope.add_owner=function(Owner){
    localstorage('add_owners.html',JSON.stringify({action:'add_customer_for_kyc_owner',location:'kyc_owners.html',other_data:true,owners:true}))
    localstorage('Contract',JSON.stringify($scope.Kyc.contractor_data))
    redirect('add_owners.html')

  }
  $scope.edit_owner=function(Owner,indice){
    localstorage('Kyc',JSON.stringify($scope.Kyc))
    localstorage('add_customer.html',JSON.stringify({action:'edit_customer_for_kyc_owner',location:'kyc_owners.html',other_data:true,owners:true}))
    Owner.indice=indice
    localstorage('Owner',JSON.stringify(Owner))
    redirect('add_customer.html')

  }

  $scope.back=function(passo){
    if (passo>0){
        localstorage('kyc_signature.html',JSON.stringify({action:'',location:$scope.page.location, prev_page:curr_page}))
        redirect('kyc_signature.html')
        return;
    }
    if (passo==-1){
        redirect($scope.page.prev_page)
        return;
    }
    redirect($scope.page.location)
  }

});
