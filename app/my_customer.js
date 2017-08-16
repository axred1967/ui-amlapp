app2.factory('Customers_inf', function($http,$state) {
  var Customers_inf = function() {
    this.Customers = [];
    this.busy = false;
    this.after = '';
    this.loaded=0;
    this.CompanyId=-1
    this.Contract={}
    this.pInfo={}
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
    data={"action":"CustomerList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last,pInfo:this.pInfo}
    if (agent)
    data={"action":"AgentList",id:id,email:email,usertype:usertype,priviledge:priviledge,agency_id:agencyId,last:last,pInfo:this.pInfo}
    if (agent=='Owners'){
      if (isObject(this.Contract))
        appData=this.Contract
      else
        appData=[]
      data={"action":"OwnersList",company_id:this.CompanyId,last:last,appData:appData,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    }
    $('#ui-content').hide()
    $('#ui-loader').show()

    $http.post(SERVICEURL2,  data )
    .then(function(responceData)  {
      $('#ui-content').show()
      $('#ui-loader').hide()
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
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
        if (responceData.data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          $state.go('login');;;
        }
        this.busy = false;
        this.loaded=-1
        console.log('no customer')
      }
    }.bind(this))
    , (function() {
      this.busy = false;
      this.loaded=-1
      console.log("error");
    });


  }
  return Customers_inf;

});

app2.controller('my_customer', function ($scope,$http,$translate,$rootScope, $state, Customers_inf,$timeout) {
  if ($scope.agent===undefined || !$scope.agent.id>0  ){
    localstorage('msg','Autenticati per favore ');
    $state.go('login');;;

  }
  $scope.loader=true;
  $scope.main.Back=false
  if ($scope.agent.user_type == 3)
    $scope.main.Add=false
  else
    $scope.main.Add=true
  $scope.deleted=0
  $scope.main.Search=true
  $scope.main.AddPage="add_customer"
  $scope.main.action="add_customer"
  $scope.main.viewName="Le mie Persone"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.main.loader=true
  $scope.page={}

   $scope.curr_page="my_customer"
   page=localStorage.getItem($scope.curr_page)
   if ( page!= null && page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }
   $scope.main.location=$scope.page.location



  $scope.Customers_inf=new Customers_inf  //    $scope.datalang = DATALANG;
  $scope.Customers_inf.pInfo=$scope.agent.pInfo

  $scope.imageurl=function(Customer){

    if (Customer===undefined || Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
      imageurl= '../img/customer-listing1.png'
    else
    imageurl= BASEURL+ "file_down.php?action=file&file=" + Customer.image +"&profile=1"+ $scope.agent.pInfoUrl
//
    //  Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   imageurl

  }


  $scope.tocustomer = function(d){
    localstorage('add_customer',JSON.stringify({action:'update_customer',location:$scope.curr_page}))
    localstorage("CustomerProfileId",d.user_id);
    localstorage("Customertype",1);
    $state.go('add_customer')
  };

  $scope.add_customer = function(){
    localstorage('add_customer',JSON.stringify({action:'add_customer',location:'my_customer'}))
    $state.go('add_customer')
  };
  $scope.toDocs = function(d){
    localstorage('my_document',JSON.stringify({action:'list_from_my_customer',location:$scope.curr_page}))
    localstorage('Customer',JSON.stringify(d))
    $state.go('my_document')
  };
  $scope.deleteCustomer=function(Customer,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare la Persona?");
      if (r == true) {
        $scope.deleteCustomer2(Customer,index);
      }
    }
    else{

        navigator.notification.confirm(
            'Vuoi cancellare la Persona?', // message
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
    data={action:'delete',table:'users','primary':'user_id',id:Customer.user_id ,pInfo:$scope.agent.pInfo}
    $http.post(SERVICEURL2,data)
    $state.reload()
  }
  $scope.$on('backButton', function(e) {
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
