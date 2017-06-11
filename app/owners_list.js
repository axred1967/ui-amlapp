app2.controller('owners_list', function ($scope,$http,$translate,$state,Customers_inf,$timeout) {
  $scope.loader=true;
  $scope.main.Back=true
  $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_owner"
  $scope.main.action="add_owner"
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()

  $scope.page={}

  $scope.curr_page="owners_list"
  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action
  }
  $scope.main.location=$scope.page.location

  switch ($scope.action){
    case "owner_from_contract":
    $scope.Contract=IsJsonString(localStorage.getItem('Contract'))
    if ($scope.Contract.act_for_other==2){
      $scope.company_id=$scope.Contract.company_id;
      $scope.Company_name="CPU:" + $scope.Contract.CPU + " Deleganti"
    }
    else{
      $scope.company_id=$scope.Contract.company_id;
      $scope.Company_name=$scope.Contract.name

    }
    break;
    case "ownwe_from_compnay":
    $scope.company_id=localStorage.getItem("CompanyID")
    $scope.Company_name=localStorage.getItem("Company_name")
    break;
    default:
    $scope.company_id=localStorage.getItem("CompanyID")
    $scope.Company_name=localStorage.getItem("Company_name")

  }
  $scope.main.viewName=$scope.company_name

  $scope.Company={};
  $scope.Owner={};

  $scope.Owners_inf=new Customers_inf;
  $scope.Owners_inf.CompanyId=$scope.company_id
  if (isObject($scope.Contract))
  $scope.Owner_inf.Contract=$scope.Contract
  //$scope.Company.name=localStorage.getItem("Company_name");


  $scope.add_owner=function(Owner){
    if ($scope.main.action=='owner_from_contract'){
      localstorage('Contract',JSON.stringify($scope.Contract))
      localstorage('add_owners',JSON.stringify({action:'add_owner_from_contract',location:'owners_list'}))

    }else {
      localstorage('add_owners',JSON.stringify({action:'',location:'owners_list'}))

    }

    $state.go('add_owners')

  }
  $scope.edit_owner=function(Owner,indice){
    if ($scope.main.action=='owner_from_contract'){
      localstorage('Contract',JSON.stringify($scope.Contract))
      localstorage('add_customer',JSON.stringify({action:'edit_customer_for_kyc_owner',location:$scope.curr_page,owners:true}))
      localstorage('Owner',JSON.stringify(Owner))

    }else {
      localstorage('add_customer',JSON.stringify({action:'edit_customer_for_kyc_owner',location:$scope.curr_page}))
      localstorage('Owner',JSON.stringify(Owner))
    }
    Owner.indice=indice
    localstorage('Owner',JSON.stringify(Owner))
    $state.go('add_customer')

  }
  $scope.deleteOwn= function (Own,index){
    owner_id=Own.user_id
    $('#loader_img').show();
   data={ "action":"deleteOwner", appData:$scope.Contract,user_id:owner_id,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1') 			{
        swal("",data.RESPONSE);
        $scope.Kyc.Contract.splice(index,index);

      }
      else
      {
        if (data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          $state.go('login');;;
        }
        console.log('error');
        swal("",data.RESPONSE);
      }
    })
    .error(function() {
      console.log("error");
    });


  }
  $scope.imageurl=function(Customer){
    Customer.IMAGEURI=BASEURL+"uploads/user/small/"
    if (Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
    Customer.imageurl= '../img/customer-listing1.png'
    else
    Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   Customer.imageurl

  }

  $scope.back=function(){
    switch ($scope.main.action){
      case'add_company_for_contract':
      if ($scope.lastid!==undefined && $scope.lastid>0 ){
        $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
        $scope.Contract.name=$scope.Company.name
        $scope.Contract.company_id= $scope.lastid
        localstorage('Contract', JSON.stringify($scope.Contract));
      }
      break;
    }
    redirect($scope.main.location)
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_owner()
  })

  $scope.loader=false
});
