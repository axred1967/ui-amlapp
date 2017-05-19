app2.factory('Customers_inf', function($http) {
  var Customers_inf = function() {
    this.Customers = [];
    this.busy = false;
    this.after = '';
    this.loaded=0;
    this.CompanyId=-1
    this.Contract={}
  };

  Customers_inf.prototype.nextPage = function(agent) {
    if (this.busy || this.loaded==-1) return;
    this.busy = true;

    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var usertype = localStorage.getItem('userType');
    var priviledge = localStorage.getItem("priviligetype");
    var agencyId = localStorage.getItem('agencyId');

    last=99999999999
    if ( this.Customers!==undefined && this.Customers.length>0){
      lastkey= Object.keys(this.Customers).pop() ;
      last=this.Customers[lastkey].user_id;
      if (agent=='Owners')
        last=this.Customers[lastkey].id;
    }
    data= {"action":"CustomerList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last}
    if (agent)
    data= {"action":"AgentList",id:id,email:email,usertype:usertype,priviledge:priviledge,agency_id:agencyId,last:last}
    if (agent=='Owners'){
      if (isObject(this.Contract))
        appData=this.Contract
      else
        appData=[]
      data= {"action":"OwnersList",company_id:this.CompanyId,last:last,appData:appData}
    }

    $http.post(SERVICEURL2,  data )
    .success(function(responceData)  {
      if(responceData.RESPONSECODE=='1') 			{
        data=responceData.RESPONSE;
        this.loaded=data.length
        if (last==99999999999)
        this.Customers=data;
        else
        this.Customers=this.Customers.concat(data);
        //$scope.Customers=data;
        this.busy=false;
        if (data.length==0){
          this.loaded=-1
        }

      }
      else   {
        this.busy = false;
        this.loaded=-1
        console.log('no customer')
      }
    }.bind(this))
    .error(function() {
      this.busy = false;
      this.loaded=-1
      console.log("error");
    });


  }
  return Customers_inf;

});

app2.controller('my_customer', function ($scope,$http,$translate,$rootScope, $state, Customers_inf) {
  $scope.loader=true;
  $scope.main.Back=false
  $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_customer"
  $scope.main.action="add_customer"
  $scope.main.viewName="Le mie Persone"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.page={}

   $scope.curr_page="my_customer.html"
   page=localStorage.getItem($scope.curr_page)
   if ( page!= null && page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }


  $scope.Customers_inf=new Customers_inf  //    $scope.datalang = DATALANG;


  $scope.imageurl=function(Customer){
    Customer.IMAGEURI=BASEURL+"uploads/user/small/"
    if (Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
      Customer.imageurl= '../img/customer-listing1.png'
    else
      Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   Customer.imageurl

  }


  $scope.tocustomer = function(d){
    localstorage('add_customer.html',JSON.stringify({action:'edit_customer',location:$scope.curr_page}))
    localstorage("CustomerProfileId",d.user_id);
    localstorage("Customertype",1);
    $state.go('add_customer')
  };

  $scope.add_customer = function(){
    localstorage('add_customer.html',JSON.stringify({action:'add_customer',location:'my_customer.html'}))
    $state.go('add_customer')
  };
  $scope.toDocs = function(d){
    localstorage('my_document.html',JSON.stringify({action:'list_from_my_customer',location:$scope.curr_page}))
    localstorage('Customer',JSON.stringify(d))
    $state.go('my_document')
  };
  $scope.deleteCustomer=function(Customer,index )
  {
    navigator.notification.confirm(
        'Vuoi cancellare il Contratto!', // message
        function(button) {
         if ( button == 1 ) {
             $scope.deleteCustomer2(Customer,index);
         }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
        );

  }
  $scope.deleteCustomer2=function(Customer,index){
    $http.post(SERVICEURL2,{action:'delete',table:'users','primary':'id',id:Customer.user_id })
    $scope.Customer.splice(index,1);
  }
  $scope.loader=false
});
function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
      $scope.deleteDoc(doc)
}
