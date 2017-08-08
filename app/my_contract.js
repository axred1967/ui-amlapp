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
    this.loaded=0;
    this.pInfo={}

  };

  Contracts_inf.prototype.nextPage = function() {
    if (this.busy || this.loaded==-1) return;
    this.busy = true;

    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var usertype = localStorage.getItem('userType');

    var priviledge = localStorage.getItem("priviligetype");
    last=99999999999
    if ( this.Contracts!==undefined && this.Contracts.length>0){
      lastkey= Object.keys(this.Contracts).pop() ;
      last=this.Contracts[lastkey].contract_id;

    }
    data= {"action":"ContractList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last,pInfo:this.pInfo}
    $http.post(SERVICEURL2,  data )
    .then(function(responceData)  {
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        //$http.post( LOG,  {r:"dopo caricamento",data:data})
        if (usertype<3)
        angular.forEach(data,function(value,key) {
          if (data[key].act_for_other==1)
            data[key].fullname=data[key].name
          if (data[key].act_for_other==2)
              data[key].fullname=data[key].other_name
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
          localstorage('msg','Sessione Scaduta ');
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

app2.controller('my_contract', function ($scope,$http,$translate,$rootScope,$state,Contracts_inf,$timeout) {
  //alert(window.location.pathname.replace(/^\//, ''));
  $scope.main.login=false
  $scope.main.Back=false
  if ($scope.agent.user_type == 3)
    $scope.main.Add=false
  else
    $scope.main.Add=true
  $scope.deleted=0
  $scope.main.Search=true
  $scope.main.AddPage="add_contract"
  $scope.main.action="add_contract"
  $scope.main.viewName="I miei Contratti"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.main.loader=true
  $scope.page={}

   $scope.curr_page='home'
   page=localStorage.getItem($scope.curr_page)
   if ( page!= null && page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }
   $scope.main.location=$scope.page.location


  $scope.Contracts_inf=new Contracts_inf
  $scope.Contracts_inf.pInfo=$scope.agent.pInfo
//  $scope.main.loader=Contracts_inf.busy
//  $scope.addMoreItems =function(){


//  }
//  $scope.addMoreItems()

  $scope.imageurl=function(Contract){
    if (Contract.act_for_other==1 && Contract.company_image!==undefined && Contract.company_image !=null && Contract.company_image.length>0){
      //Contract.imageurl= Contract.IMAGEURI +Contract.company_image
      Contract.imageurl= BASEURL + "file_down.php?action=file&file=" + Contract.company_image +"&profile=1&entity=company&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie

      return   Contract.imageurl

    }
    if (Contract.act_for_other==2 && Contract.owner_image!==undefined && Contract.owner_image  !=null && Contract.owner_image.length>0){
//      Contract.imageurl= Contract.IMAGEURI +Contract.owner_image
      Contract.imageurl= BASEURL + "file_down.php?action=file&file=" + Contract.owner_image +"&profile=1&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie
      return   Contract.imageurl

    }
    Contract.IMAGEURI=BASEURL+"uploads/user/small/"
    if (Contract.image===undefined || Contract.image==null || Contract.image.length==0)
    Contract.imageurl= '../img/customer-listing1.png'
    else
    Contract.imageurl= BASEURL+ "file_down.php?action=file&file=" + Contract.image +"&profile=1&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie
//    Contract.imageurl= Contract.IMAGEURI +Contract.image
    return   Contract.imageurl

  }
  $scope.toDocs = function(Contract){
    localstorage('my_document',JSON.stringify({action:'list_from_view_contract',location:$scope.curr_page}))
    localstorage('Contract', JSON.stringify(Contract));
    $state.go('my_document')
  };

  $scope.print_kyc=function(Contract){
  	url=BASEURL + 'pdfgeneration/kyc.php?id='+Contract.contract_id+"&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie+"&download=Y"
  	if ($scope.main.web){
      var anchor = angular.element('<a/>');
    	angular.element(document.body).append(anchor);
    	var ev = document.createEvent("MouseEvents");
    	ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    	anchor.attr({
    		href: url,
    		target: '_blank',
    		download: 'kyc'+$scope.Contract.contract_id+ '-'+$scope.agent.id+'.pdf'
    	})[0].dispatchEvent(ev);

  	}
  	else {
  		var fileTransfer = new FileTransfer();
  	    var uri = encodeURI(url);

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
  	url=BASEURL + 'pdfgeneration/risk.php?id='+Contract.contract_id+"&agent_id="+ $scope.agent.id+"&cookie="+$scope.agent.cookie+"&download=Y"
  	if ($scope.main.web){
      var anchor = angular.element('<a/>');
    	angular.element(document.body).append(anchor);
    	var ev = document.createEvent("MouseEvents");
    	ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    	anchor.attr({
    		href: url,
    		target: '_blank',
    		download: 'Risk'+$scope.Contract.contract_id+ '-'+$scope.agent.id+'.pdf'
    	})[0].dispatchEvent(ev);

  	}
  	else {
  		var fileTransfer = new FileTransfer();
  	    var uri = encodeURI(url);

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

  $scope.tocontract = function(d){
    if ($scope.agent.user_type==3)
      return
    localstorage('view_contract',JSON.stringify({action:'view',location:$scope.curr_page}))
    localstorage("contract_id",d.contract_id);
    localstorage("customer_id",d.contractor_id);
    localstorage("Customertype",1);
    localstorage('Contract', JSON.stringify(d));
    $state.go('view_contract')
  };
  $scope.add_contract = function(){
    localstorage('add_contract',JSON.stringify({action:'add_contract',location:$scope.curr_page}))
    $state.go('add_contract')
  };
  $scope.deleteContract=function(Contract,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare il Contratto?");
      if (r == true) {
        $scope.deleteContract2(Company,index);
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

  }
  $scope.deleteContract2=function(contract,index){
    data={action:'delete',table:'contract','primary':'id',id:contract.contract_id ,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post(SERVICEURL2,data)
    $state.reload()
  }
  $scope.back = function(d){
    $state.go($scope.page.locatio)
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_contract()
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

});
