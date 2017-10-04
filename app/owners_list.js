app2.controller('owners_list', function ($scope,$http,$translate,$state,Customers_inf,$timeout,$interval,$stateParams) {
  /* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]

  $scope.main.Back=true
  $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_owner"
  $scope.main.AddLabel="aggiungi Titolare Effettivo"
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.deleted=0
  $scope.main.loader=true

  switch ($scope.page.action){
    case "owner_from_contract":

    $scope.Contract=$scope.page.Contract
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
		$scope.Company=$scope.page.Company
    $scope.company_id=$scope.Company.company_id
    $scope.Company_name=$scope.Company.name
    break;
    default:
		$scope.Company=$scope.page.Company
		$scope.company_id=$scope.Company.company_id
    $scope.Company_name=$scope.Company.name

  }
  $scope.main.viewName=$scope.Company_name

  $scope.Company={};
  $scope.Owner={};

  $scope.Owners_inf=new Customers_inf;
  $scope.Owners_inf.pInfo=$scope.agent.pInfo
  $scope.Owners_inf.CompanyId=$scope.company_id

  if ($scope.Contract!==undefined && isObject($scope.Contract))
  $scope.Owners_inf.Contract=$scope.Contract
  //$scope.Company.name=localStorage.getItem("Company_name");


  $scope.add_owner=function(Owner){
		//guardo se arrivo dal contratto o dalla società owner_from_contract viene chiamato dal contratto
    if ($scope.page.action=='owner_from_contract'){
      $scope.pages['add_owners']={action:'add_owner_from_contract', location:$state.current.name,company_id:$scope.company_id,owners:true,temp:null,Contract:$scope.Contract}

    }else {
      $scope.pages['add_owners']={action:'', location:$state.current.name,owners:true,temp:null,company_id:$scope.company_id}
    }
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_owners',{pages:$scope.pages})
  }
  $scope.edit_owner=function(Owner,indice){
    Owner.indice=indice
    if ($scope.page.action=='owner_from_contract'){
      $scope.pages['add_owners']={action:'edit_owners', location:$state.current.name,temp:null,Contract:$scope.Contract,owners:true,Owner:Owner}

    }else {
      $scope.pages['add_owners']={action:'edit_owners', location:$state.current.name,temp:null,owners:true,Owner:Owner}
    }
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_owners',{pages:$scope.pages})

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
    Customer.IMAGEURI=UPLOADSURL +"user/small/"
    if (Customer.image===undefined ||  Customer.image== null || Customer.image.length==0)
    Customer.imageurl= BASEURL + 'img/customer-listing1.png'
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

  $scope.loader=false
});
