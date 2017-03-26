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
     if (localStorage.getItem('stack')!=null) {
       $scope.stack=JSON.parse(localStorage.getItem('stack'))
       $scope.lastkey= Object.keys($scope.stack).pop() ;
     }
     $scope.Contrac={}
     $scope.word={};
     //localstorage("back","view_contract.html");
     switch ($scope.stack[$scope.lastkey].action){
         case 'edit' :
              Contract=JSON.parse(localStorage.getItem('Contract'))
              convertDateStringsToDates(Contract)
              $scope.Contract=Contract
                  switch($scope.Contract.act_for_other){
                      case "1":
                        $scope.Contract.company_id= $scope.Contract.other_id
                      break;
                      case "2":
                      $scope.Contract.user_id= $scope.Contract.other_id
                      break;
                  }


              $scope.action='edit'
              $scope.viewName="Modifica Contratto"
              break;
         default :
              $scope.viewName="Nuovo Contratto"
               break;
     }
     $('input.mdl-textfield__input').each(
           function(index){
               $(this).parent('div.mdl-textfield').addClass('is-dirty');
               $(this).parent('div.mdl-textfield').removeClass('is-invalid');
           }
       );




     $scope.showContractorList=function(){
     if ((typeof $scope.Contract.fullname !== "undefined" && $scope.Contract.fullname.length>4 && $scope.oldContrator!=$scope.Contract.fullname)){
       data={ "action":"ACCustomerList", name:$scope.Contract.fullname}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.list=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldContrator=$scope.searchContractor
     }
     $scope.showCompanyList=function(){
     if ((typeof $scope.Contract.name !== "undefined" && $scope.Contract.name.length>4 && $scope.oldCompany!=$scope.Contract.name)){
       data={ "action":"ACCompanyList", name:$scope.Contract.name}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.listCompany=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldCompany=$scope.searchCompany;
     }
     $scope.showOtherList=function(){
     if ((typeof $scope.Contract.other_name !== "undefined" && $scope.Contract.other_name.length>4 && $scope.Contract.other_name!=$scope.oldOther)){
       data={ "action":"ACCustomerList", name:$scope.Contract.other_name}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.listOther=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldOther=$scope.searchOther
     }
     $scope.showAC=function($search,$table){
     var id=localStorage.getItem("userId");
     var usertype = localStorage.getItem('userType');
     res = $search.split(".")
     $search=res[1]
     $word=$scope[res[0]][res[1]]
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
     $scope.addContractorItem=function(id, name){
           $scope.list=[];
           $scope.Contract.fullname=name;
           $scope.Contract.contractor_id=id;
     };
     $scope.addCompanyItem=function(company){
           $scope.listCompany=[];
           $scope.Contract.name=company.name;
           $scope.Contract.company_id=company.company_id;
     };
     $scope.addOtherItem=function(other){
           $scope.listOther=[];
           $scope.Contract.other_name=other.fullname;
           $scope.Contract.user_id=other.user_id;
     };
     $scope.addWord=function($search,$word){
       res = $search.split(".")
       $scope[res[0]][res[1]]=$word
       $scope.word[res[1]]=[]
     }
     $scope.add_contract=function(){
//       add_contract($scope.action);
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

      var  appData ={
        id :localStorage.getItem("userId"),
        usertype: localStorage.getItem('userType')
      }
      dbData=$scope.Contract

      switch(dbData.act_for_other){
          case "1":
            dbData.other_id= $scope.Contract.company_id
            dbData.role_for_other= $.trim($('#Contract_role_for_other').val())
          break;
          case "2":
          dbData.other_id= $scope.Contract.user_id
          dbData.role_for_other=$.trim( $('#Contract_role_for_other').val())
          break;
      }


          $('#loader_img').show();
          data= {"action":"addcontract",appData,dbData,edit:$scope.action}
          $http.post(SERVICEURL2,data)
              .success(function(data){
                      $('#loader_img').hide();
                      if(data.RESPONSECODE=='1')
                      {
                        $scope.contract=[]
                        swal("",data.RESPONSE);
                        $scope.back()

                      }
                      else      {
                          swal("",data.RESPONSE);
                      }
              })
              .error(function(){
                  console.log('error');
              })
     }
     $scope.add_customer=function(){
       $scope.stack['add_contract.html']={}
       $scope.stack['add_contract.html'].action="add_customer_for_contract"
       localstorage('stack',JSON.stringify($scope.stack))
       redirect('add_customer.html')

     }
     $scope.add_company=function(){
       $scope.stack['add_contract.html']={}
       $scope.stack['add_contract.html'].action="add_company_for_contract"
       localstorage('stack',JSON.stringify($scope.stack))
       redirect('add_company.html')

     }
     $scope.add_other=function(){
       $scope.stack['add_contract.html']={}
       $scope.stack['add_contract.html'].action="add_other_for_contract"
       localstorage('stack',JSON.stringify($scope.stack))
       redirect('add_customer.html')

     }
     $scope.back=function(){
       back=$scope.lastkey
       delete $scope.stack[back]
      localstorage('stack',JSON.stringify($scope.stack))
       redirect(back)
     }

})
