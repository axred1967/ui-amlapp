app2.controller('owners_list', function ($scope,$http,$translate,$state,Customers_inf,$timeout,$interval,ObAmlApp,$stateParams) {
  /* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]
	$scope.state=$state.current.name

  $scope.main.Back=true
  $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_owner"
  $scope.main.AddLabel="aggiungi Ruolo Sociale"
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.deleted=0
  $scope.main.loader=true
	$scope.tipo_ruolo="Elenco Titolari Effettivi"
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

	$scope.Owners_inf=new ObAmlApp
  $scope.Owners_inf.pInfo=$scope.agent.pInfo
  $scope.Owners_inf.set_settings({table:'company_owners',id:'id',
  fields:{
		'uno.*':'','j1.*':'','concat(name," ",surname)':'fullname'
	},
	where:{'uno.company_id':{'valore':$scope.page.currentObId},'uno.tipo':'TE'},
  join:{
    'j1':{'table':'users',
          'condition':'uno.user_id=j1.user_id '
        }
  }
	})
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
    swal({
      title: $filter('translate')("Sei Sicuro?"),
      text: $filter('translate')("la Cancelazione della Titolare Effettivo sarà non reversibile!"),
      icon: "warning",
      buttons: {
      'procedi':{text:$filter('translate')('Procedi'),value:true},
      'annulla':{text:$filter('translate')('Annulla'),value:false},

      },

    })
    .then((Value) => {
      if (Value) {
				data={action:'delete',table:'company_owners','primary':'id',id:ob.id ,pInfo:$scope.agent.pInfo}
        $http.post(SERVICEURL2,data)
        $state.reload()
        swal($filter('translate')('Cancellazione effettuata'), {
          icon: "success",
        });
      } else {
        swal($filter('translate')('Cancellazione Annulata'));
      }
    });
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
  					 	setDefaults($scope)
               $scope.main.loader=false
            }, 5);
  });

  $scope.loader=false
});
