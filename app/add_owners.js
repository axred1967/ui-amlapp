app2.controller('add_owners', function ($scope,$http,$state,$translate) {
  $scope.loader=true

  $scope.main.Back=true
  $scope.main.Add=false
	//$scope.main.AddPage="add_document"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuovo TE"
  $scope.page={}
  page=localStorage.getItem('add_owners.html')
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.word={};
  $scope.Owner={}
  //localstorage("back","view_contract.html");
  switch ($scope.action){
    case 'edit_owners' :
    $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    $scope.action='edit_owners'
    $scope.main.viewName="Modifica TE"
    break;
    case 'edit_owner_from_contract' :
    $scope.Owner=JSON.parse(localStorage.getItem('Owner'))
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    $scope.action='edit_owners'
    $scope.main.viewName="Modifica TE"
    $scope.page.type="owners"
    break;
    case 'edit_customer_for_kyc_owner' :
    $scope.Owner={}
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    $scope.action='edit_owners'
    $scope.main.viewName="Modifica TE"
    $scope.page.type="owners"
    break;
    case 'add_customer_for_kyc_owner' :
    $scope.Owner={}
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    $scope.action='add_owners'
    $scope.main.viewName="Nuovo TE"
    break;
    case 'add_owner_from_contract' :
    $scope.Owner={}
    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
    $scope.action='add_owners'
    $scope.main.viewName="Nuovo TE"
    break;
    default :
    if($scope.page.load!==undefined && $scope.page.load)
    $scope.Owner=JSON.parse(localStorage.getItem('Owner'))

    $scope.main.viewName="Nuovo TE"
    $scope.action='add_owners'
    $scope.Owner.company_id=localStorage.getItem("CompanyID");
    break;
  }

  if($scope.page.load!==undefined && $scope.page.load)
    $scope.Owner=JSON.parse(localStorage.getItem('Owner'))


  $scope.showContractorList=function(){
    if ((typeof $scope.Owner.fullname !== "undefined" && $scope.Owner.fullname.length>4 && $scope.oldContrator!=$scope.Owner.fullname)){
      data={ "action":"ACCustomerList", name:$scope.Owner.fullname}
      $http.post( SERVICEURL2,  data )
      .success(function(data) {
        if(data.RESPONSECODE=='1') 			{
          $scope.list=data.RESPONSE;
        }
      })
      .error(function() {
        console.log("error");
      });
    }
    $scope.oldContrator=$scope.searchContractor
  }
  $scope.addContractorItem=function(id, name){
    $scope.list=[];
    $scope.Owner.fullname=name;
    $scope.Owner.user_id=id;
  };
  $scope.add_owner=function(){
    //       add_contract($scope.action);
    var langfileloginchk = localStorage.getItem("language");


      if ($scope.Owner.user_id===undefined || !($scope.Owner.user_id>0)){
        swal("","riempire form corretamente- selezionare TE");
        return
    }
    if ($scope.page.type=='owners' ){
      appData=$scope.Contract
    }
    else {
      var  appData ={
        id :localStorage.getItem("userId"),
        usertype: localStorage.getItem('userType')
      }
    }

    dbData=$scope.Owner
    dbData.agent_id=appData.id


    $scope.loader=true
    data= {"action":$scope.action,appData:appData,dbData: dbData}
    $http.post(SERVICEURL2,data)
    .success(function(data){
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1')
      {
        $scope.contract=[]
        swal("",data.RESPONSE);
        $scope.Owner=data.owner
        $scope.lastid=data.lastid
        $scope.back()

      }
      else      {
        swal("",data.RESPONSE);
      }
    })
    .error(function(){
      console.log('error');
    })
  }
  $scope.back=function(){
    switch($scope.page.action){
      case'edit_customer_for_kyc_owner':
				localstorage('Owner', JSON.stringify($scope.Owner));
				precPage=JSON.parse(localStorage.getItem($scope.page.location))
				precPage.edit=true
				localstorage($scope.page.location,JSON.stringify(precPage))
			break;
			case'add_customer_for_kyc_owner':
			if ($scope.lastid!==undefined && $scope.lastid>0 ){
				$scope.Owner.fullname=$scope.Owner.name +" "+$scope.Owner.surname
				$scope.Owner.id= $scope.lastid
        localstorage('Owner', JSON.stringify($scope.Owner));
				precPage=JSON.parse(localStorage.getItem($scope.page.location))
				precPage.add=true
				localstorage($scope.page.location,JSON.stringify(precPage))
			}
      break;

    }
    //       windows.histoery.back()
    history.back()
  }

  $scope.add_customer=function(){
    localstorage('add_customer.html',JSON.stringify({action:'add_customer_for_owner',location:'add_owners.html'}))
    localstorage('Kyc',JSON.stringify($scope.Kyc))
    state.go('add_customer')
  }

})
