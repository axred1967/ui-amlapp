var app2 = angular.module('myApp', []);

app2.controller('personCtrl', function ($scope,$http) {
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
    $scope.addMoreItems =function(){
      last=99999999999
      if ( $scope.Contracts!==undefined && $scope.Contracts.length>0){
        lastkey= Object.keys($scope.Contracts).pop() ;
         last=$scope.Contracts[lastkey].id;
      }

      data= {"action":"ContractList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last}
      $http.post(SERVICEURL2,  data )
          .success(function(responceData)  {
                    $('#loader_img').hide();
                    if(responceData.RESPONSECODE=='1') 			{
                      data=responceData.RESPONSE;
                      $scope.loaded=data.length
                      angular.forEach(data,function(value,key) {
                        if (data[key].name !== null && data[key].name.length>0)
                            data[key].fullname=data[key].name
                        if (data[key].other_name !== null && data[key].other_name.length>0)
                          data[key].fullname=data[key].other_name
                      })
                      if (last==99999999999)
                        $scope.Contracts=data;
                      else
                        $scope.Companies=$scope.Contracts.concat(data);
                         $scope.Contracts=data;
                      //$scope.Customers=data;
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
   $scope.tocontract = function(d){
     $scope.stack={}
     $scope.stack['my_contract.html']={}
     $scope.stack['my_contract.html'].action="view"
     localstorage('stack',JSON.stringify($scope.stack))
     localstorage("contract_id",d.contract_id);
     localstorage("customer_id",d.contractor_id);
     localstorage("Customertype",1);
     localstorage('Contract', JSON.stringify(d));
     redirect('view_contract.html')
    };
    $scope.add_contract = function(){
      $scope.stack={}
      $scope.stack['my_contract.html']={}
      $scope.stack['my_contract.html'].action="add_contract"
      localstorage('stack',JSON.stringify($scope.stack))
      redirect('add_contract.html')
     };
    $scope.back = function(d){
      back=$scope.lastkey
      delete $scope.stack[$scope.lastkey]
      localstorage('stack',JSON.stringify($scope.stack))
      redirect(back)
    }
console.log($scope.Contracts);


});
