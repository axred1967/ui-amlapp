app2.controller('my_agent', function ($scope,$http,$translate,Customers_inf) {
  $scope.loader=true;
  $scope.main.Back=false
  $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_customer"
  $scope.main.action="add_customer"
  $scope.main.viewName="i miei Agenti"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.page={}

   curr_page=base_name()
   page=localStorage.getItem(curr_page)
   if ( page!= null && page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }

  $scope.Customers_inf=new Customers_inf

  $scope.imageurl=function(Customer){
    Customer.IMAGEURI=BASEURL+"uploads/user/small/"
    if (Customer.image===undefined || Customer.image.length==0)
      Customer.imageurl= '../img/customer-listing1.png'
    else
      Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   Customer.imageurl

  }


  $scope.tocustomer = function(d){
    localstorage('add_customer.html',JSON.stringify({action:'update_customer',location:curr_page,agent:true}))
    localstorage("CustomerProfileId",d.user_id);
    localstorage("Customertype",1);
    $state.go('add_customer')
  };

  $scope.add_customer = function(){
    localstorage('add_customer.html',JSON.stringify({action:'add_customer',location:curr_page ,agent:true}))
    $state.go('add_customer')
  };
  $scope.toDocs = function(d){
    localstorage('my_document.html',JSON.stringify({action:'list_from_my_customer',location:curr_page}))
    localstorage("customerId",d.user_id);
    localstorage("customer_name",d.fullname);
    $state.go('my_document')
  };
  $scope.deleteCustomer=function(Customer,index )
  {
    navigator.notification.confirm(
        'Vuoi cancellare il Contratto!', // message
        function(button) {
         if ( button == 1 ) {
             $scope.deleteCustomer(Customer,index);
         }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
        );

  }
  $scope.deleteCustomer=function(Customer,index){
    $http.post(SERVICEURL2,{action:'delete',table:'users','primary':'id',id:Customer.user_id, agent:true })
    $scope.Customer.splice(index,1);
  }
  console.log($scope.Contracts);
});
function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
      $scope.deleteDoc(doc)
}
