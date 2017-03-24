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
app2.filter('uppercase', function() {
    return function(input, $scope) {
        if ( input !==undefined && input.length>0)
        return input.toUpperCase();
        else
        return input

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
    $scope.word={};
    if (localStorage.getItem('stack')!=null) {
      $scope.stack=JSON.parse(localStorage.getItem('stack'))
      $scope.lastkey= Object.keys($scope.stack).pop() ;
    }
    switch ($scope.stack[$scope.lastkey].action){
        case 'add_company_for_contract':
            $scope.viewName="Inserisci Società"
            $scope.action="add_company"
            break;
        case 'edit_company':
          var CompanyID=localStorage.getItem("CompanyID");
        	var email=localStorage.getItem("userEmail");
          data= {"action":"show_edit_company",company_id:CompanyID}

            $http.post( SERVICEURL2,  data)
                .success(function(responceData)
                         {
                          $('#loader_img').hide();
                          if(responceData.RESPONSECODE=='1') 			{
                            data=responceData.RESPONSE;
                            $scope.Company=data;
                           }
                           else
                           {
                              console.log('no customer')
                           }

            })
            $scope.viewName="Modifica Società"
            $scope.action="edit_company"
            break;
        default:
            $scope.action="add_company"
            $scope.viewName="Inserisci Società"
    }
// autocomplete parole
    $scope.showAC=function($search,$table){
    var id=localStorage.getItem("userId");
    var usertype = localStorage.getItem('userType');

    if ((typeof $($search.currentTarget).val()  !== "undefined" && $($search.currentTarget).val().length>3 &&  $($search.currentTarget).val()!=$scope.oldWord)){
      $word=$($search.currentTarget).attr('id');
      data={ "action":"ACWord", id:id,usertype:usertype, name:$scope.searchContractor, search:$($search.currentTarget).val() ,word:$word ,table:$table}
      $http.post( SERVICEURL2,  data )
          .success(function(data) {
                    if(data.RESPONSECODE=='1') 			{
                      $word=$($search.currentTarget).attr('id');
                      $scope.word[$word]=data.RESPONSE;
                    }
           })
          .error(function() {
                   console.log("error");
           });
      }
      $scope.oldWord= $($search.currentTarget).val()
    }
    $scope.addWord=function($e,word){
      $('#'+$e).val(word);

      $scope.word[$e]=[]
    }
    $scope.add_company= function (){
      var langfileloginchk = localStorage.getItem("language");
      if ($scope.form.$invalid) {
          angular.forEach($scope.form.$error, function(field) {
              angular.forEach(field, function(errorField) {
                  errorField.$setTouched();
              })
          });
          $scope.formStatus = "Dati non Validi.";
          console.log("Form is invalid.");
					return
      } else {
          //$scope.formStatus = "Form is valid.";
          console.log("Form is valid.");
          console.log($scope.data);
      }

      var id=localStorage.getItem("userId");
      var email=localStorage.getItem("userEmail");
      var usertype = localStorage.getItem('userType');
      $('#loader_img').show();
      data={ "action":$scope.action, id:id,email:email,usertype:usertype,lang:langfileloginchk, dbData: $scope.Company}
      $http.post( SERVICEURL2,  data )
          .success(function(data) {
                    $('#loader_img').hide();
                    if(data.RESPONSECODE=='1') 			{
                       swal("",data.RESPONSE);
                       $scope.lastid=data.lastid
                       $scope.back()
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
  $scope.back=function(){
    switch ($scope.stack[$scope.lastkey].action){
       case'add_company_for_contract':
            if ($scope.lastid!==undefined && $scope.lastid>0 ){
            $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
            $scope.Contract.name=$scope.Company.name
            $scope.Contract.company_id= $scope.lastid
            localstorage('Contract', JSON.stringify($scope.Contract));
            }
            break;
    }
    back=$scope.lastkey
    delete $scope.stack[back]
    localstorage('stack',JSON.stringify($scope.stack))
    redirect(back)
  }
})
