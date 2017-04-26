var app2 = angular.module('myApp', ['pascalprecht.translate']);
app2.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')'

            });
        });
    };
});

app2.controller('personCtrl', function ($scope,$http,$translate,$rootScope) {
//alert(window.location.pathname.replace(/^\//, ''));

  curr_page= base_name()
  page=localStorage.getItem(curr_page)
  if (page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }

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
      data= {"action":"ContractList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last}
      $scope.loader=true

      $http.post(SERVICEURL2,  data )
          .success(function(responceData)  {
                      if(responceData.RESPONSECODE=='1') 			{
                      data=responceData.RESPONSE;
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
                      $scope.loaded=data.length
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

   $scope.imageurl=function(Contract){
     if (Contract.act_for_other==1 && Contract.company_image!==undefined && Contract.company_image !=null && Contract.company_image.length>0){
       Contract.IMAGEURI=BASEURL+"uploads/company/small/"
       Contract.imageurl= Contract.IMAGEURI +Contract.company_image
       return   Contract.imageurl

     }
     if (Contract.act_for_other==2 && Contract.owner_image!==undefined && Contract.owner_image  !=null && Contract.owner_image.length>0){
       Contract.IMAGEURI=BASEURL+"uploads/company/small/"
       Contract.imageurl= Contract.IMAGEURI +Contract.owner_image
       return   Contract.imageurl

     }
     Contract.IMAGEURI=BASEURL+"uploads/user/small/"
     if (Contract.image===undefined || Contract.image.length==0)
       Contract.imageurl= '../img/customer-listing1.png'
     else
       Contract.imageurl= Contract.IMAGEURI +Contract.image
     return   Contract.imageurl

   }
   $scope.toDocs = function(Contract){
  	 localstorage('my_document.html',JSON.stringify({action:'list_from_view_contract',location:curr_page}))
  	 localstorage('Contract', JSON.stringify(Contract));
  	 redirect('my_document.html')
  };


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
