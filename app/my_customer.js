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



    last=99999999999
    if ( this.Customers!==undefined && this.Customers.length>0){
      lastkey= Object.keys(this.Customers).pop() ;
      last=this.Customers[lastkey].user_id;
      if (agent=='Owners')
        last=this.Customers[lastkey].id;
    }
    data={"action":"CustomerList",last:last,pInfo:this.pInfo}
    if (agent)
    data={"action":"AgentList",last:last,pInfo:this.pInfo}
    if (agent=='Owners'){
      if (isObject(this.Contract))
        appData=this.Contract
      else
        appData=[]
      data={"action":"OwnersList",company_id:this.CompanyId,last:last,appData:appData,pInfo:this.pInfo}
    }

    $http.post(SERVICEURL2,  data )
    .then(function(responceData)  {
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

app2.controller('my_customer', function ($scope,$http,$translate,$rootScope, $state, Customers_inf,$timeout, $interval, $translate,$filter, $stateParams) {
  /* gestiote parametri di stato */
  $scope.main.state=$state.current.name
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]


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
  $scope.main.Search=true
  $scope.main.AddPage="add_customer"
  $scope.main.action="add_customer"

  $scope.main.Sidebar=true
  $scope.main.viewName="Le mie Persone"
  $('.mdl-layout__drawer-button').show()
  $scope.main.loader=true

  $scope.Customers_inf=new Customers_inf  //    $scope.datalang = DATALANG;
  $scope.Customers_inf.pInfo=$scope.agent.pInfo

  $scope.imageurl=function(Customer){

    if (Customer===undefined || Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
      imageurl= BASEURL + 'img/customer-listing1.png'
    else
    imageurl= SERVICEDIRURL +"file_down.php?tipo=profilo&file=" + Customer.image +"&profile=1"+ $scope.agent.pInfoUrl
//
    //  Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   imageurl

  }


  $scope.tocustomer = function(d){
    $scope.pages['add_customer']={action:'update_customer', user_id:d.user_id,location:$state.current.name,temp:null,Customer:d,currentObId:d.user_id,currentOb:'users'}
    localstorage('pages',JSON.stringify($scope.pages))

    $state.go('add_customer',{pages:$scope.pages})
  };

  $scope.add_customer = function(){
    $scope.pages['add_customer']={action:'add_customer', location:$state.current.name,temp:null,currentObId:null,currentOb:'users'}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_customer',{pages:$scope.pages})
  };
  $scope.toDocs = function(d){
    $scope.pages['my_document']={action:'list_from_my_customer', location:$state.current.name,Customer:d,currentObId:d.user_id,currentOb:'users'}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('my_document',{pages:$scope.pages})
  };
  $scope.deleteCustomer=function(Ob,index )
  {
    swal({
      title: $filter('translate')("Sei Sicuro?"),
      text: $filter('translate')("la Cancellazione del Cliente sarà non reversibile!"),
      icon: "warning",
      buttons: {
      'procedi':{text:$filter('translate')('Procedi'),value:true},
      'annulla':{text:$filter('translate')('Annulla'),value:false},

      },

    })
    .then((Value) => {
      if (Value) {
        data={action:'delete',table:'users','primary':'user_id',id:Ob.user_id ,pInfo:$scope.agent.pInfo}
        $http.post(SERVICEURL2,data)
        .then(function(data){
        if(data.data.RESPONSECODE=='1')
        {
          $state.reload()
          swal($filter('translate')('Cancellazione effettuata'), {
            icon: "success",
          });
        }
        else      {
          if (data.data.RESPONSECODE=='-1'){
             localstorage('msg','Sessione Scaduta ');
             $state.go('login');;;
             swal("",data.data.RESPONSE);
          }
        }
      })
      , (function(){
        console.log('error');
      })

      } else {
        swal($filter('translate')('Cancellazione Annulata'));
      }
    });
  }
  $scope.$on('showSubHeader', function(e) {
    $scope.main.showSubHeader=true
  })
  $scope.$on('backButton', function(e) {
  });

  $scope.$on('addButton', function(e) {
    $scope.add_customer()
  })
  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               setDefaults($scope)
               $scope.main.loader=false
            }, 200);
  });

});
function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
      $scope.deleteDoc(doc)
}
