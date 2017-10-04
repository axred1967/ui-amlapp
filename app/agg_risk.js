app2.controller('agg_risk', function ($scope,$http,$translate,$rootScope,$state,ObAmlApp,$timeout,$stateParams,$filter) {
  //alert(window.location.pathname.replace(/^\//, ''));

  $scope.curr_page=$state.current.name
  $scope.pages=$stateParams.pages
  if ($scope.pages===null || $scope.pages===undefined){
    $scope.pages=JSON.parse(localStorage.getItem('pages'));
  }
  $scope.page=$scope.pages[$state.current.name]

  $scope.main.login=false
  $scope.main.Back=true
  $scope.deleted=0
  $scope.main.Search=true
  $scope.main.AddPage="add_ob"
  $scope.main.AddLabel="aggiuggi aggiornamento del Rischio"
  $scope.main.viewName="Aggiornamenti Rischio"
  $scope.main.Sidebar=false
  $scope.main.loader=true
  $scope.Contract=$scope.page.Contract
  $scope.co=$filter('translate')('Contract');
  $scope.ObAmlApp=new ObAmlApp
  $scope.ObAmlApp.pInfo=$scope.agent.pInfo
  $scope.ObAmlApp.set_settings(
  {table:'risk_log',id:'id',
  fields:{'uno.*':''},
  join:{
    'j1':{'table':'risk',
          'condition':'uno.risk_id=j1.risk_id '
        }
  },
  where:{contract_id:{col:'j1.contract_id',valore:$scope.Contract.contract_id}}
  })
//  $scope.main.loader=Contracts_inf.busy
//  $scope.addMoreItems =function(){


//  }
//  $scope.addMoreItems()
$scope.print_risk=function(Contract){
  url=PDFURL +'risk.php?agg='+Contract.risk_id+"&download=Y"+$scope.agent.pInfoUrl
  if ($scope.main.web){
    var anchor = angular.element('<a/>');
    angular.element(document.body).append(anchor);
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    anchor.attr({
      href: url,
      target: '_blank',
      download: 'risk'+Contract.contract_id+ '-'+$scope.agent.id+'.pdf'
    })[0].dispatchEvent(ev);
    anchor.remove()

  }
  else {
    var fileTransfer = new FileTransfer();
      var uri = url;

      fileTransfer.download(
            uri,
            cordova.file.externalApplicationStorageDirectory+'download/MyPdf.pdf',
            function(entry) {
              cordova.plugins.SitewaertsDocumentViewer.viewDocument(
                  cordova.file.externalApplicationStorageDirectory+'download/MyPdf.pdf', 'application/pdf');

              console.log("download complete: " + entry.fullPath);
            },
            function(error) {
                  console.log("download error source " + error.source);
                  console.log("download error target " + error.target);
                  console.log("upload error code" + error.code);
            }
        );

  }

}

  $scope.imageurl=function(image){
    if (image===undefined || image==null || image.length==0)
      imageurl= BASEURL + 'img/customer-listing1.png'
    else
      imageurl= SERVICEDIRURL +"file_down.php?action=file&file=" + Ob.image +"&profile=1"+ $scope.agent.pInfoUrl
  //    Ob.imageurl= Ob.IMAGEURI +Ob.image
    return   imageurl
  }
  $scope.add_ob = function(){

    swal({
      title: $filter('translate')("Sei Sicuro?"),
      text: $filter('translate')("L'aggiornamento storicizza l'attuale Analisi del Rischio e da la possibilità di completare aggiornamento!"),
      icon: "warning",
      buttons: {
      'procedi':{text:$filter('translate')('Procedi'),value:true},
      'annulla':{text:$filter('translate')('Annulla'),value:false},

      },

    })
    .then((Value) => {
      if (Value) {
        data={action:'addAggRisk',contract_id:$scope.Contract.contract_id,pInfo:$scope.agent.pInfo}
        $http.post(SERVICEURL2,data)
        $state.reload()
        $scope.back()
        swal($filter('translate')("Storicizzazione Eseguita!"), {
          icon: "success",
        });
      } else {
        swal($filter('translate')("Operazione Annullata!"));
      }
    });
  };
  $scope.toOb = function(Ob,index){
    $scope.pages[$state.current.name].Contract=$scope.Contract
    if ($scope.agent.settings.risk_type==1){
      $scope.pages['risk_profile01_sm']={action:'', location:$state.current.name,temp:null,Contract:$scope.Contract,agg:Ob.id}
      localstorage('pages',JSON.stringify($scope.pages))
      $state.go('risk_profile01_sm',{pages:$scope.pages})
      return
    }
    if ($scope.agent.settings.risk_type==2){
      $scope.pages['risk_profile01_4d']={action:'', location:$state.current.name,temp:null,Contract:$scope.Contract,agg:Ob.id}
      localstorage('pages',JSON.stringify($scope.pages))
      $state.go('risk_profile01_4d',{pages:$scope.pages})
      return
    }
    else{
      $scope.pages['risk_profile01']={action:'', location:$state.current.name,temp:null,Contract:$scope.Contract,agg:Ob.id}
      localstorage('pages',JSON.stringify($scope.pages))
      $state.go('risk_profile01',{pages:$scope.pages})
    }
    };
  $scope.stato=function(Ob,index ){
    if (!isObject(Ob.risk_update)){
      risk_update=IsJsonString(Ob.risk_update)
    }
    if (risk_update.state=="aggiornamento"){
      return "Aggionamento"
    }
    else {
      return "Anali dei Rischio iniziale"
    }
  }
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
                 $('.mdl-layout__drawer-button').hide()
               $scope.main.loader=false
            }, 5);
  });

});
