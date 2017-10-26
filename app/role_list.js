app2.controller('role_list', function ($scope,$http,$translate,$state,Customers_inf,$timeout,$interval,$stateParams,ObAmlApp) {
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
	$scope.tipo_ruolo="Elenco Cariche Sociali "
  $scope.main.Sidebar=false
  $scope.deleted=0
  $scope.main.loader=true

  switch ($scope.page.action){

    default:
		$scope.Company=$scope.page.Company
		$scope.company_id=$scope.Company.company_id
    $scope.Company_name=$scope.Company.name

  }
  $scope.main.viewName=$scope.Company_name

  $scope.Company={};
	$scope.Owners_inf=new ObAmlApp
	$scope.Owners_inf.pInfo=$scope.agent.pInfo
	$scope.Owners_inf.set_settings({table:'company_owners',id:'id',
  fields:{
		'uno.*':'','j1.*':'','concat(name," ",surname)':'fullname'
	},
	where:{'uno.company_id':{'valore':$scope.page.currentObId},'uno.tipo':'ROLE'},
  join:{
    'j1':{'table':'users',
          'condition':'uno.user_id=j1.user_id '
        }
  }
	})




  $scope.add_owner=function(Owner){
		//guardo se arrivo dal contratto o dalla società owner_from_contract viene chiamato dal contratto
    $scope.pages['add_owners']={action:'add_role', location:$state.current.name,owners:true,role:true,type:'role',temp:null,company_id:$scope.company_id}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_owners',{pages:$scope.pages})
  }
  $scope.edit_owner=function(Owner,indice){
    Owner.indice=indice
    $scope.pages['add_owners']={action:'edit_role', location:$state.current.name,temp:null,owners:true,type:'role',role:true,Owner:Owner}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_owners',{pages:$scope.pages})

  }
	$scope.deleteOwn=function(ob,index )
  {
    swal({
      title: $filter('translate')("Sei Sicuro?"),
      text: $filter('translate')("la Cancelazione della carica sociale sarà non reversibile!"),
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
							 $('.mdl-layout__drawer-button').hide()
            }, 500);
  });

  $scope.loader=false
});
