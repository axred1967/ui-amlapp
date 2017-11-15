app2.filter('filterMultiple',['$filter',function ($filter) {
return function (items, keyObj) {
    var filterObj = {
        data:items,
        filteredData:[],
        applyFilter : function(obj,key){
            var fData = [];
            if (this.filteredData.length == 0)
                this.filteredData = this.data;
            if (obj){
                var fObj = {};
                if (!angular.isArray(obj)){
                    fObj[key] = obj;
                    fData = fData.concat($filter('filter')(this.filteredData,fObj));
                } else if (angular.isArray(obj)){
                    if (obj.length > 0){
                        for (var i=0;i<obj.length;i++){
                            if (angular.isDefined(obj[i])){
                                fObj[key] = obj[i];
                                fData = fData.concat($filter('filter')(this.filteredData,fObj));
                            }
                        }

                    }
                }
                if (fData.length > 0){
                    this.filteredData = fData;
                }
            }
        }
    };
    if (keyObj){
        angular.forEach(keyObj,function(obj,key){
            filterObj.applyFilter(obj,key);
        });
    }
    return filterObj.filteredData;
}
}]);

app2.factory('Contracts_inf', function($http,$state) {
  var Contracts_inf = function() {
    this.Contracts = [];
    this.busy = false;
    this.after = '';
    this.loaded=-2;
    this.pInfo={}
    this.search=''
    this.searchThings=''

  };

  Contracts_inf.prototype.nextPage = function() {
    if (this.busy || this.loaded==-1) return;
    this.busy = true;

    last=99999999999
    if ( this.Contracts!==undefined && this.Contracts.length>0){
      lastkey= Object.keys(this.Contracts).pop() ;
      last=this.Contracts[lastkey].contract_id;

    }
    data= {"action":"ContractList",last:last,search:this.search,searchThings:this.searchThings,pInfo:this.pInfo}
    $http.post(SERVICEURL2,  data )
    .then(function(responceData)  {
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        //$http.post( LOG,  {r:"dopo caricamento",data:data})
        if (this.pInfo.user_type<3)
        angular.forEach(data,function(value,key) {
          if (data[key].firmatario===undefined || data[key].firmatario===null || data[key].firmatario.trim().length==0){
  					data[key].firmatario=data[key].fullname
  				}
          data[key].fullname=data[key].firmatario
          data[key].Owner=data[key].firmatario
          data[key].contractor_name=data[key].firmatario
  				if (data[key].act_for_other==1){
  					if (data[key].owner===undefined || data[key].owner==null || data[key].owner.trim().length==0){
  						data[key].owner=data[key].name
  					}
            data[key].fullname=data[key].owner
            data[key].Owner=data[key].owner
  				}
  				if (data[key].act_for_other==2){
  					if (data[key].owner===undefined || data[key].owner==null || data[key].owner.trim().length==0){
  						data[key].owner=data[key].other_name
  					}
            data[key].fullname=data[key].owner
            data[key].Owner=data[key].owner
  				}
        })

        if (data.length==0){
          this.loaded=-1
        }
        if (last==99999999999)
        this.Contracts=data;
        else
        this.Contracts=this.Contracts.concat(data);
        //$scope.Customers=data;
        this.loaded=data.length

        this.busy = false;
      }
      else   {
        if (responceData.data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ' +responceData.data.RESPONSE);
          $state.go('login');;;
        }
        this.busy = false;
        this.loaded=-1
        console.log('no customer')
      }}.bind(this)),
    (function() {
      console.log("error");
    });


  };

  return Contracts_inf;
});

app2.controller('my_contract', function ($scope,$http,$translate,$rootScope,$state,Contracts_inf,$timeout,tmhDynamicLocale,$translate,$filter) {
  // fisso valori iniziali
  if ($scope.agent.name===undefined){
    $scope.agent.name=localStorage.getItem('Name');
    $scope.agent.email=localStorage.getItem('userEmail');
    $scope.agent.id=localStorage.getItem('agentId');
    $scope.agent.user_id=localStorage.getItem('userId');
    $scope.agent.agency_id=localStorage.getItem('agencyId');
    $scope.agent.user_type=localStorage.getItem('userType');
    $scope.agent.priviledge=localStorage.getItem('priviledge');

    $scope.agent.cookie=localStorage.getItem('cookie');
    $scope.agent.image=localStorage.getItem('image');

    $scope.agent.image=localStorage.getItem('Profileimageagencyuser');
    $scope.agent.settings=IsJsonString(localStorage.getItem('userSettings'));

    $scope.agent.pInfo={user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}
    $scope.agent.pInfoUrl="&" +jQuery.param({pInfo:$scope.agent.pInfo})

    if ($scope.agent.image===undefined ||  $scope.agent.image== null || $scope.agent.image.length==0)
      $scope.agent.imageurl= ''
    else
      $scope.agent.imageurl= SERVICEDIRURL +"tipo=profilo&file_down.php?file=" + $scope.agent.image +"&action=file&profile=1"
    $scope.agent.paese= localStorage.getItem("paese");
    $scope.agent.tipo_cliente= localStorage.getItem("tipo_cliente");
  }
  // fisso preferenze nomi
      paese = $scope.agent.paese;
      tipo_cliente = $scope.agent.tipo_cliente;
      switch (paese){
        case 'italia':
        tmhDynamicLocale.set('it');
        switch (tipo_cliente){
          case 'agenzia assicurazioni':
          $translate.use('it-ITass'); // translati   ons-en-US.json
          break;
          case 'studio commercialisti':
          $translate.use('it-IT-comm'); // translati   ons-en-US.json
          break;
          case 'studio legale':
          $translate.use('it-IT-avv'); // translati   ons-en-US.json
          break;
          case 'studio notarile':
          $translate.use('it-IT-notai'); // translati   ons-en-US.json
          break;
          default:
          $translate.use('it-IT'); // translati   ons-en-US.json

        }
        break;
        case 'san marino':
        tmhDynamicLocale.set('it');
        switch (tipo_cliente){
          case 'agenzia assicurazioni':
          $translate.use('sm-SMass'); // translati   ons-en-US.json
          break;
          case 'studio commercialisti':
          $translate.use('sm-SM-comm'); // translati   ons-en-US.json
          break;
          case 'studio legale':
          $translate.use('sm-SM-avv'); // translati   ons-en-US.json
          break;
          case 'studio notarile':
          $translate.use('sm-SM-notai'); // translati   ons-en-US.json
          break;
          default:
          $translate.use('it-IT'); // translati   ons-en-US.json

        }
        break;
        case'stati uniti' :
        break;
        default:
        $translate.use('it-IT'); // translati   ons-en-US.json
        tmhDynamicLocale.set('it');

      }

      if ($scope.agent.user_type==3)
      $scope.main.Cm=$filter('translate')("dati personali")
        else
      $scope.main.Cm=$filter('translate')("Le mie Persone")
  //alert(window.location.pathname.replace(/^\//, ''));
  $scope.pages={}
  $scope.pages[$state.current.name]={}
  $scope.main.state=$state.current.name;
  $scope.main.login=false
  $scope.main.Back=false
  if ($scope.agent.user_type == 3)
    $scope.main.Add=false
  else
    $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_contract"
  $scope.main.AddLabel="Nuova AV"
  $scope.main.action="add_contract"
  $scope.main.viewName="I miei Contratti"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.main.loader=true
  if ($scope.main.searchText !== undefined && $scope.main.searchText.length>0){
    $scope.main.hideName=true
      $scope.main.showSubHeader=true
  }
  $scope.main[$scope.main.state].subHeader="Cerca"




  $scope.Contracts_inf=new Contracts_inf
  $scope.Contracts_inf.pInfo=$scope.agent.pInfo
  $scope.Contracts_inf.search=$scope.searchText
  $scope.Contracts_inf.searchThings=$scope.main.searchThings
//  $scope.main.loader=Contracts_inf.busy
//  $scope.addMoreItems =function(){


//  }
//  $scope.addMoreItems()

  $scope.imageurl=function(Contract){
    if (Contract.act_for_other==1 && Contract.company_image!==undefined && Contract.company_image !=null && Contract.company_image.length>0){
      //Contract.imageurl= Contract.IMAGEURI +Contract.company_image
      Contract.imageurl= SERVICEDIRURL +"file_down.php?tipo=profilo&file=" + Contract.company_image +"&entity=company"+$scope.agent.pInfoUrl

      return   Contract.imageurl

    }
    if (Contract.act_for_other==2 && Contract.Owner_image!==undefined && Contract.Owner_image  !=null && Contract.Owner_image.length>0){
//      Contract.imageurl= Contract.IMAGEURI +Contract.Owner_image
      Contract.imageurl= SERVICEDIRURL +"file_down.php?tipo=profilofile=" + Contract.Owner_image +$scope.agent.pInfoUrl
      return   Contract.imageurl

    }
    Contract.IMAGEURI=UPLOADSURL +"user/small/"
    if (Contract.image===undefined || Contract.image==null || Contract.image.length==0)
    Contract.imageurl= BASEURL + 'img/customer-listing1.png'
    else
    Contract.imageurl= SERVICEDIRURL +"file_down.php?tipo=profilo&file=" + Contract.image +$scope.agent.pInfoUrl
//    Contract.imageurl= Contract.IMAGEURI +Contract.image
    return   Contract.imageurl

  }


  $scope.print_kyc=function(Contract){
  	url=PDFURL +'kyc.php?id='+Contract.contract_id+"&download=Y"+$scope.agent.pInfoUrl
  	if ($scope.main.web){
      var anchor = angular.element('<a/>');
    	angular.element(document.body).append(anchor);
    	var ev = document.createEvent("MouseEvents");
    	ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    	anchor.attr({
    		href: url,
    		target: '_blank',
    		download: 'kyc'+Contract.contract_id+ '-'+$scope.agent.id+'.pdf'
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
  $scope.print_risk=function(Contract,index){
  	url=PDFURL +'risk.php?id='+Contract.contract_id+"&download=Y"+$scope.agent.pInfoUrl
  	if ($scope.main.web){
      var anchor = angular.element('<a/>');
    	angular.element(document.body).append(anchor);
    	var ev = document.createEvent("MouseEvents");
    	ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    	anchor.attr({
    		href: url,
    		target: '_blank',
    		download: 'Risk'+Contract.contract_id+ '-'+$scope.agent.id+'.pdf'
    	})[0].dispatchEvent(ev);
      anchor.remove()

  	}
  	else {
  		var fileTransfer = new FileTransfer();
//  	    var uri = encodeURI(url);
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
  $scope.toDocs = function(Contract){
    $scope.pages.currentObId=Contract.contract_id
    $scope.pages.currentOb="contract"
    $scope.pages['kyc_document']={action:'', location:$state.current.name,Contract:Contract,view:true}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('kyc_document',{pages:$scope.pages})


  };
  $scope.tocontract = function(Contract){
    if ($scope.agent.user_type==3)
      return
    /*
    localstorage('view_contract',JSON.stringify({action:'view',location:$scope.curr_page}))
    localstorage("contract_id",d.contract_id);
    localstorage("customer_id",d.contractor_id);
    localstorage("Customertype",1);
    localstorage('Contract', JSON.stringify(d));
    */
    $scope.pages.currentObId=Contract.contract_id
    $scope.pages.currentOb="contract"

    $scope.pages['view_contract']={action:'view', location:$state.current.name,Contract:Contract}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('view_contract',{pages:$scope.pages})
  };
  $scope.add_contract = function(){
    $scope.pages.currentOb="contract"
    $scope.pages['kyc_contractor.01']={action:'add_contract', location:$state.current.name}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('kyc_contractor.01',{pages:$scope.pages})

/*
    pages={'add_contract':{action:'add_contract', location:$state.current.name},currentOb:'contract'}
    localstorage('pages',JSON.stringify(pages))
    $state.go('add_contract',{pages:pages})
*/

  };
  $scope.share = function(d){
    if ($scope.main.web){
      r=confirm("Acconsenti di Condividere i tuoi dati personali e dei soggetti a te delegati al Contraente ai fini AML?");
      if (r == true) {
        $scope.share2(d);
      }
    }
    else{
      navigator.notification.confirm(
        'Acconsenti di Condividere i tuoi dati personali e dei soggetti a te delegati al Contraente ai fini AML?', // message
        function(button) {
          if ( button == 1 ) {
            $scope.share2(d);
          }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
    );
    }

  }
  $scope.share2 = function(d){
    data={"action":"addShare",appData:d,pInfo:$scope.agent.pInfo}
    $http.post(SERVICEURL2,data)
    .then(function(data){
      if(data.data.RESPONSECODE=='1')
      {
        $state.reload()
      }
      else      {
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        swal("",data.data.RESPONSE);
      }
    })
    , (function(){
      console.log('error');
    })
  }
  $scope.removeShare = function(d){
    if ($scope.main.web){
      r=confirm("Vuoi che l'aggiornamento dei tuoi dati non sarà più visibile al Contraente?");
      if (r == true) {
        $scope.removeShare2(d);
      }
    }
    else{
      navigator.notification.confirm(
        'Vuoi che l\'aggiornamento dei tuoi dati non sarà più visibile al Contraente?', // message
        function(button) {
          if ( button == 1 ) {
            $scope.removeShare2(d);
          }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
    );
    }

  }
  $scope.removeShare2 = function(d){
    data={"action":"removeShare",appData:d,pInfo:$scope.agent.pInfo}
    $http.post(SERVICEURL2,data)
    .then(function(data){
      if(data.data.RESPONSECODE=='1')
      {
        $state.reload()
      }
      else      {
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        swal("",data.data.RESPONSE);
      }
    })
    , (function(){
      console.log('error');
    })
  }


  $scope.deleteContract=function(Contract,index )
  {
    swal({
      title: $filter('translate')("Sei Sicuro?"),
      text: $filter('translate')("la Cancelazione del Contratto sarà non reversibile e si perderà continuità CPU!"),
      icon: "warning",
      buttons: {
      'procedi':{text:$filter('translate')('Procedi'),value:true},
      'annulla':{text:$filter('translate')('Annulla'),value:false},

      },

    })
    .then((Value) => {
      if (Value) {
        data={action:'delete',table:'contract','primary':'id',id:Contract.contract_id ,pInfo:$scope.agent.pInfo}
        $http.post(SERVICEURL2,data)
        $state.reload()
        swal($filter('translate')('Cancellazione effettuata'), {
          icon: "success",
        });
      } else {
        swal($filter('translate')('Cancellazione Annulata'));
      }
    });/*
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare il Contratto?");
      if (r == true) {
        $scope.deleteContract2(Contract,index);
      }
    }
    else{
      navigator.notification.confirm(
        'Vuoi cancellare il Contratto?', // message
        function(button) {
          if ( button == 1 ) {
            $scope.deleteContract2(Contract,index);
          }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
    );
    }
*/
  }
  $scope.deleteContract2=function(contract,index){
    data={action:'delete',table:'contract','primary':'id',id:contract.contract_id ,pInfo:$scope.agent.pInfo}
    $http.post(SERVICEURL2,data)
               .then(function(data){
          if(data.data.RESPONSECODE=='1')
          {
            $state.reload()
          }
          else      {
            if (data.data.RESPONSECODE=='-1'){
               localstorage('msg','Sessione Scaduta ');
               $state.go('login');;;
            }
            swal("",data.data.RESPONSE);
          }
        })
        , (function(){
          console.log('error');
        })
  }
  $scope.copyContract=function(Contract,index ){
    swal({
      title: $filter('translate')("Sei Sicuro?"),
      text: $filter('translate')("I dati del Contratto e della AV  verranno duplicati con un nuovo CPU!"),
      icon: "warning",
      buttons: {
      'procedi':{text:$filter('translate')('Procedi'),value:true},
      'annulla':{text:$filter('translate')('Annulla'),value:false},

      },

    })
    .then((Value) => {
      if (Value) {
        data={action:'copyContract',id:Contract.contract_id ,pInfo:$scope.agent.pInfo}
        $http.post(SERVICEURL2,data)
                   .then(function(data){
              if(data.data.RESPONSECODE=='1')
              {
                swal($filter('translate')('Duplicazione effettuata'), {
                  icon: "success",
                });
                $state.reload()
              }
              else      {
                if (data.data.RESPONSECODE=='-1'){
                   localstorage('msg','Sessione Scaduta ');
                   $state.go('login');;;
                }
                swal("",data.data.RESPONSE);
              }
            })
            , (function(){
              console.log('error');
            })


      } else {
        swal($filter('translate')('Duplicazione Annulata'));
      }
    });

  }
  $scope.agentList=getAgentList($scope.agentListI,$scope.agent)

  $scope.back = function(d){
    $state.go($scope.page.location)
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_contract()
  })
  $scope.$on('showSubHeader', function(e) {

    $scope.main[$scope.main.state].showSubHeader=true
  })
  $scope.$on('searchButton', function(e,args) {
    $timeout(function() {
      if (args.click || ($scope.main.searchText.length>2 && $scope.Contracts_inf.search!=$scope.main.searchText) ||  ($scope.main.searchText.length==0 && $scope.Contracts_inf.search!=$scope.main.searchText)){
        $scope.Contracts_inf.search=$scope.main.searchText
        $scope.Contracts_inf.searchThings=$scope.main.searchThings
        $scope.Contracts_inf.last=99999999999
        $scope.Contracts_inf.Contracts=[]
        $scope.Contracts_inf.loaded=0
        $scope.Contracts_inf.busy=false
        $scope.Contracts_inf.nextPage()

      }
   }, 2000);


  })
  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               setDefaults($scope)
               $scope.main.loader=false
            }, 5);
  });

});
