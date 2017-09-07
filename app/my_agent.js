app2.controller('my_agent', function ($scope,$http,$translate,$state,Customers_inf,$timeout,$stateParams,$interval) {
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
  $scope.deleted=0
   $scope.curr_page="my_agent"
   page=localStorage.getItem($scope.curr_page)
   if ( page!= null && page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }
   $scope.main.location=$scope.page.location

  $scope.Customers_inf=new Customers_inf
  $scope.Customers_inf.pInfo=$scope.agent.pInfo

  $scope.imageurl=function(Customer){

    Customer.IMAGEURI=BASEURL+"uploads/user/small/"
    if (Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
      Customer.imageurl= '../img/customer-listing1.png'
    else
   Customer.imageurl= BASEURL+ "file_down.php?action=file&file=" + Customer.image +"&profile=1"+ $scope.agent.pInfoUrl
//
    //  Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   Customer.imageurl

  }


  $scope.decode_priv = function(d){
    switch (d){
      case '0':
        return "Nessun Cliente"
      break;
      case '2':
        return "I suoi Clienti"
      break;
      case '1':
        return "Tutti i clienti dell'agenzia"
      break;

    }
  }
  $scope.tocustomer = function(d){
    pages={'add_customer':{action:'update_customer',user_id:d.user_id,location:$scope.curr_page ,agent:true}}
    localstorage('pages',JSON.stringify(pages))
    $state.go('add_customer',{pages:pages})
  };

  $scope.add_customer = function(){
    pages={'add_customer':{action:'add_customer',location:$scope.curr_page ,agent:true}}
    $state.go('add_customer',{pages:pages})
  };

  $scope.deleteCustomer=function(Customer,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare l'Agente?");
      if (r == true) {
        $scope.deleteCustomer2(Customer,index);
      }
    }
    else{
      navigator.notification.confirm(
          'Vuoi cancellare l\'agente?', // message
          function(button) {
           if ( button == 1 ) {
               $scope.deleteCustomer2(Customer,index);
           }
          },            // callback to invoke with index of button pressed
          'Sei sicuro?',           // title
          ['Si','No']     // buttonLabels
          );
      }

  }
  $scope.deleteCustomer2=function(Customer,index){
    data={action:'delete',table:'users','primary':'user_id',id:Customer.user_id, agent:true ,pInfo:$scope.agent.pInfo}
    $http.post(SERVICEURL2,data)
    $state.reload();
  }
  $scope.back=function(){
    $state.go($scope.page.location)
  }

  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_customer()
  })
  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               $('input.mdl-textfield__input').each(
                 function(index){
                   $(this).parent('div.mdl-textfield').addClass('is-dirty');
                   $(this).parent('div.mdl-textfield').removeClass('is-invalid');
                 })
               $scope.main.loader=false
            }, 5);
  });

});
function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
      $scope.deleteDoc(doc)
}
