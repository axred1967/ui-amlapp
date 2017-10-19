app2.controller('my_agencies', function ($scope,$http,$translate,$rootScope,$state,ObAmlApp,$timeout,$stateParams) {
  //alert(window.location.pathname.replace(/^\//, ''));
  $scope.curr_page=$state.current.name
  $scope.pages=$stateParams.pages
  if ($scope.pages===null || $scope.pages===undefined){
    $scope.pages=JSON.parse(localStorage.getItem('pages'));
  }
  $scope.page=$scope.pages[$state.current.name]

  $scope.main.login=false
  $scope.main.Back=false
  if ($scope.agent.user_type == 3)
    $scope.main.Add=false
  else
    $scope.main.Add=true
  $scope.deleted=0
  $scope.main.Search=true
  $scope.main.AddPage="add_email"
  $scope.main.viewName="Le mie Agenzie"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.main.loader=true


  $scope.ObAmlApp=new ObAmlApp
  $scope.ObAmlApp.pInfo=$scope.agent.pInfo
  $scope.ObAmlApp.set_settings({table:'agency',id:'agency_id',
  fields:{'uno.address':'address',
  'uno.country':'country',
  'uno.town':'town',
  'uno.tipo_cliente_app':'tipo_cliente_app',
  'j1.name':'name',
  'j1.email':'email',
  'j1.settings':'settings',
  'uno.user_id':'user_id',
  'uno.agency_id':'agency_id'
},
  join:{
    'j1':{'table':'users',
          'condition':'uno.user_id=j1.user_id '
        }
  }})
//  $scope.main.loader=Contracts_inf.busy
//  $scope.addMoreItems =function(){


//  }
//  $scope.addMoreItems()

  $scope.imageurl=function(image){
    if (image===undefined || image==null || image.length==0)
      imageurl= BASEURL + 'img/customer-listing1.png'
    else
      imageurl= SERVICEDIRURL +"file_down.php?action=file&file=" + Ob.image +"&profile=1"+ $scope.agent.pInfoUrl
  //    Ob.imageurl= Ob.IMAGEURI +Ob.image
    return   imageurl
  }
  $scope.add_ob = function(){
    $scope.pages.add_agency={action:'add_ob',location:$scope.curr_page}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_agency', {pages:$scope.pages})
  };
  $scope.toOb = function(Ob,index){
    $scope.pages.add_agency={action:'edit',location:$scope.curr_page,Ob:Ob}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_agency',{pages:$scope.pages})
  };

  $scope.deleteOb=function(Ob,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare Oggetto?");
      if (r == true) {
        $scope.delete2(Ob,index);
      }
    }
    else{
      navigator.notification.confirm(
        'Vuoi Cancellare Oggetto?', // message
        function(button) {
          if ( button == 1 ) {
            $scope.delete2(Ob,index);
          }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
    );
    }

  }
  $scope.delete2=function(ob,index){
    $scope.ObAmlApp.settings.other_table=[]
    $scope.ObAmlApp.settings.other_table[0]={}
    $scope.ObAmlApp.settings.other_table[0].table="users"
    $scope.ObAmlApp.settings.other_table[0].id="user_id"
    $scope.ObAmlApp.settings.other_table[0].value=ob.user_id;
    data={action:'delete',other_table:$scope.ObAmlApp.settings.other_table,table:$scope.ObAmlApp.settings.table,'primary':'agency_id',id:ob[$scope.ObAmlApp.settings.id] ,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post(SERVICEURL2,data)
    $scope.ObAmlApp.Ob.splice(index,1);
    $state.reload()

  }
  $scope.back = function(d){
    $state.go($scope.page.location)
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_ob()
  })
  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               setDefaults($scope)
               $scope.main.loader=false
            }, 5);
  });

});
