app2.controller('owners_list', function ($scope,$http,$translate,$state,Customers_inf,$timeout) {
  $scope.loader=true;
  $scope.main.Back=true
  $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_owner"
  $scope.main.action="add_owner"
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.deleted=0
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
  if ($scope.Contract!==undefined && isObject($scope.Contract))
  $scope.Owners_inf.Contract=$scope.Contract
  //$scope.Company.name=localStorage.getItem("Company_name");


  $scope.add_owner=function(Owner){
    if ($scope.page.action=='owner_from_contract'){
      localstorage('Contract',JSON.stringify($scope.Contract))
      localstorage('add_owners',JSON.stringify({action:'add_owner_from_contract',location:'owners_list'}))

    }else {
      localstorage('add_owners',JSON.stringify({action:'',location:'owners_list'}))

    }

    $state.go('add_owners')

  }
  $scope.edit_owner=function(Owner,indice){
    if ($scope.page.action=='owner_from_contract'){
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
  $scope.deleteOwn=function(ob,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare il Titolare Effettivo" + ob.fullname +"?");
      if (r == true) {
        $scope.deleteOwn2(ob,index);
      }
    }
    else{
      navigator.notification.confirm(
        "Vuoi Cancellare il Titolare Effettivo" + ob.fullname +"?", // message
        function(button) {
          if ( button == 1 ) {
            $scope.deleteOwn2(ob,index);
          }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
    );
    }

  }
  $scope.deleteOwn2=function(ob,index){
    data={action:'delete',table:'company_owners','primary':'id',id:ob.id ,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post(SERVICEURL2,data)
    $state.reload()
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
    switch ($scope.page.action){
      case'add_company_for_contract':
      if ($scope.lastid!==undefined && $scope.lastid>0 ){
        $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
        $scope.Contract.name=$scope.Company.name
        $scope.Contract.company_id= $scope.lastid
        localstorage('Contract', JSON.stringify($scope.Contract));
      }
      break;
    }
    $state.go($scope.page.location)
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_owner()
  })

  $scope.loader=false
});
