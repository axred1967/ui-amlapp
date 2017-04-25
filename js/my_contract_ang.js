var app2 = angular.module('myApp', ['pascalprecht.translate']);


app2.controller('personCtrl', function ($scope,$http,$translate) {
//alert(window.location.pathname.replace(/^\//, ''));

  curr_page= base_name()
  page=localStorage.getItem(curr_page)
  if (page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }

    $scope.loaded=-1;
    $scope.addMoreItems =function(){
      var id=localStorage.getItem("userId");
      var email=localStorage.getItem("userEmail");
      var usertype = localStorage.getItem('userType');
       var priviledge = localStorage.getItem("priviligetype");
      last=99999999999
      if ( $scope.Contracts!==undefined && $scope.Contracts.length>0){
        lastkey= Object.keys($scope.Contracts).pop() ;
         last=$scope.Contracts[lastkey].contract_id;

      }
      $scope.loader=true
      data= {"action":"ContractList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last}
      $http.post(SERVICEURL2,  data )
          .success(function(responceData)  {
                      if(responceData.RESPONSECODE=='1') 			{
                      data=responceData.RESPONSE;
                      $scope.loaded=data.length
                      $http.post( LOG,  {r:"dopo caricamento",data:data})
                      angular.forEach(data,function(value,key) {
                        if (data[key].name !== null && data[key].name.length>0)
                            data[key].fullname=data[key].name
                        if (data[key].other_name !== null && data[key].other_name.length>0)
                          data[key].fullname=data[key].other_name
                      })
                      if (last==99999999999)
                        $scope.Contracts=data;
                      else
                        $scope.Contracts=$scope.Contracts.concat(data);
                      //$scope.Customers=data;
                      $scope.loader=false
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
     localstorage('view_contract.html',JSON.stringify({action:'view',location:curr_page}))
     localstorage("contract_id",d.contract_id);
     localstorage("customer_id",d.contractor_id);
     localstorage("Customertype",1);
     localstorage('Contract', JSON.stringify(d));
     redirect('view_contract.html')
    };
    $scope.add_contract = function(){
      localstorage('add_contract.html',JSON.stringify({action:'add_contract',location:curr_page}))
      redirect('add_contract.html')
     };
     $scope.deleteContract=function(Contract,index )
     {
       navigator.notification.confirm(
           'Vuoi cancellare il Contratto!', // message
           function(button) {
            if ( button == 1 ) {
                $scope.deleteContract2(Contract,index);
            }
           },            // callback to invoke with index of button pressed
           'Sei sicuro?',           // title
           ['Si','No']     // buttonLabels
           );

     }
     $scope.deleteContract2=function(contract,index){
       $http.post(SERVICEURL2,{action:'delete',table:'contract','primary':'id',id:contract.contract_id })
       $scope.Contracts.splice(index,1);
     }

    $scope.back = function(d){
       redirect($scope.page.location)
     }


});
