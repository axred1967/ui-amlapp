var app2 = angular.module('myApp', []);

app2.controller('personCtrl', function ($scope,$http) {
    $scope.datalang = DATALANG;
    if (localStorage.getItem('stack')!=null) {
      $scope.stack=JSON.parse(localStorage.getItem('stack'))
      $scope.lastkey= Object.keys($scope.stack).pop() ;
    }


    var id=localStorage.getItem("userId");
  	var email=localStorage.getItem("userEmail");
    var contract_id = localStorage.getItem("contract_id");
    data= {"action":"view_Contract_info",id:id,email:email,contract_id:contract_id}

    $http.post( SERVICEURL2,  data )
        .success(function(responceData) {
                  $('#loader_img').hide();
                  if(responceData.RESPONSECODE=='1') 			{
                    data=responceData.RESPONSE;
                    data.owner=data.fullname;
                   if (data.name !== null && data.name.length>0)
                      data.owner=data.name
                   if (data.other_name !== null && data.other_name.length>0)
                      data.owner=data.other_name
                     $scope.Contract=data;
                   }
                   else
                   {
                     console.log('error');
                   }
         })
        .error(function() {
                 console.log("error");
         });
   $scope.risk_analisys = function(id){
      edit_risk_account(id)
  };
  $scope.edit_contract = function(){
    $scope.stack['view_contract.html']={}
    $scope.stack['view_contract.html'].action="edit"
    localstorage('stack',JSON.stringify($scope.stack))
    localstorage('Contract', JSON.stringify($scope.Contract));
    redirect('add_contract.html')
 };
  $scope.edit_profile = function(id){
     edit_info(id)
 };
 $scope.back = function(d){
   back=$scope.lastkey
   delete $scope.stack[back]
   localstorage('stack',JSON.stringify($scope.stack))
   redirect(back)
 }
})
