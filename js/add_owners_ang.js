

 var app2 = angular.module('myApp', ['ng-currency']);
 app2.filter('capitalize', function() {
     return function(input, $scope) {
         if ( input !==undefined && input.length>0)
         return input.substring(0,1).toUpperCase()+input.substring(1);
         else
         return input

     }
 });

 app2.controller('personCtrl', function ($scope,$http) {
     $scope.datalang = DATALANG;
     if (localStorage.getItem('stack')!=null) {
       $scope.stack=JSON.parse(localStorage.getItem('stack'))
       $scope.lastkey= Object.keys($scope.stack).pop() ;
     }
     $scope.word={};
     $scope.Owner={}
     //localstorage("back","view_contract.html");
     switch ($scope.stack[$scope.lastkey].action){
         case 'edit_owners' :
              $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
              $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
              $scope.action='edit_owners'
              $scope.viewName="Modifica Contratto"
              break;
         default :
              if($scope.stack[$scope.lastkey].load)
                $scope.Owner=JSON.parse(localStorage.getItem('Owner'))

              $scope.viewName="Nuovo Contratto"
              $scope.action='add_owners'
              $scope.Owner.company_id=localStorage.getItem("CompanyID");
               break;
     }




     $scope.showContractorList=function(){
     if ((typeof $scope.Owner.fullname !== "undefined" && $scope.Owner.fullname.length>4 && $scope.oldContrator!=$scope.Owner.fullname)){
       data={ "action":"ACCustomerList", name:$scope.Owner.fullname}
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
     $scope.addContractorItem=function(id, name){
           $scope.list=[];
           $scope.Owner.fullname=name;
           $scope.Owner.user_id=id;
     };
     $scope.add_owner=function(){
//       add_contract($scope.action);
      var langfileloginchk = localStorage.getItem("language");
      if(langfileloginchk == 'en' )
      {
        var namemsg ="Please enter one existing owner name";

      }
      else
      {
        var namemsg ="Inserire un titolare effettivo esistente" ;
      }
      var  appData ={
        id :localStorage.getItem("userId"),
        usertype: localStorage.getItem('userType')
      }
      dbData=$scope.Owner
      dbData.agent_id=appData.id

      if(dbData.user_id=="") swal("",namemsg);

      else
      {
          $('#loader_img').show();
          data= {"action":$scope.action,appData:appData,dbData: dbData}
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
       $scope.word[$e]=[]
     }
     $scope.back=function(){
       back=$scope.lastkey
       delete $scope.stack[back]
       localstorage('stack',JSON.stringify($scope.stack))
       redirect(back)
     }
     $scope.add_customer=function(){
       $scope.stack['add_owners.html']={}
       $scope.stack['add_owners.html'].action="add_customer_for_owner"
       localstorage('Owner',JSON.stringify($scope.Owner))
       localstorage('stack',JSON.stringify($scope.stack))
       redirect('add_customer.html')
     }

})
