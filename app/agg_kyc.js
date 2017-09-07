app2.controller('agg_kyc', function ($scope,$http,$translate,$rootScope,$state,ObAmlApp,$timeout,$stateParams,$filter) {
  //alert(window.location.pathname.replace(/^\//, ''));

  $scope.curr_page=$state.current.name
  $scope.pages=$stateParams.pages
  if ($scope.pages===null || $scope.pages===undefined){
    $scope.pages=JSON.parse(localStorage.getItem('pages'));
  }
  $scope.page=$scope.pages[$state.current.name]

  $scope.main.login=false
  $scope.main.Back=false
  $scope.deleted=0
  $scope.main.Search=true
  $scope.main.AddPage="add_ob"
  $scope.main.AddLabel="aggiuggi aggiornamento adeguata verifica"
  $scope.main.viewName="Aggiornamenti AV"
  $scope.main.Sidebar=true
  $scope.main.loader=true
  $scope.Contract=$scope.page.Contract
  $scope.co=$filter('translate')('Contract');
  $scope.ObAmlApp=new ObAmlApp
  $scope.ObAmlApp.pInfo=$scope.agent.pInfo
  $scope.ObAmlApp.set_settings(
  {table:'kyc_log',id:'id',
  join:{
    'j1':{'table':'kyc',
          'condition':'uno.kyc_id=j1.id '
        }
  },
  where:{contract_id:{col:'j1.contract_id',valore:$scope.Contract.contract_id}}
  })
//  $scope.main.loader=Contracts_inf.busy
//  $scope.addMoreItems =function(){


//  }
//  $scope.addMoreItems()

  $scope.imageurl=function(image){
    if (image===undefined || image==null || image.length==0)
      imageurl= '../img/customer-listing1.png'
    else
      imageurl= BASEURL+ "file_down.php?action=file&file=" + Ob.image +"&profile=1"+ $scope.agent.pInfoUrl
  //    Ob.imageurl= Ob.IMAGEURI +Ob.image
    return   imageurl
  }
  $scope.add_ob = function(){

    swal({
      title: $filter('translate')("Sei Sicuro?"),
      text: $filter('translate')("L'inserimento di un aggiornamento creerà una copia dello stato attuale di adeguata verifica!"),
      icon: "warning",
      buttons: {
      'procedi':{text:$filter('translate')('Procedi'),value:true},
      'annulla':{text:$filter('translate')('Annulla'),value:false},

      },

    })
    .then((Value) => {
      if (Value) {
        swal("Storicizzazione Eseguita!", {
          icon: "success",
        });
      } else {
        swal("Operazione Annullata!");
      }
    });
  };
  $scope.toOb = function(Ob,index){
    localstorage('add_agency',JSON.stringify({action:'edit',location:$scope.curr_page}))
    localstorage('Ob',JSON.stringify(Ob))
    $state.go('add_agency',null,{ reload: true })
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
               $('input.mdl-textfield__input').each(
                 function(index){
                   $(this).parent('div.mdl-textfield').addClass('is-dirty');
                   $(this).parent('div.mdl-textfield').removeClass('is-invalid');
                 })
                 $('.mdl-layout__drawer-button').show()
               $scope.main.loader=false
            }, 5);
  });

});
