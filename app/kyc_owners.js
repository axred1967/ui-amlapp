app2.controller('kyc_owners', function ($scope,$http,$state,$translate,$timeout) {
  $scope.main.Back=true
  $scope.main.Add=true
	$scope.main.AddPage="add_owners"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.loader=true
  $scope.deleted=0
  var id=localStorage.getItem("CustomerProfileId");
  var email=localStorage.getItem("userEmail");
  $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
  $scope.action="saveKyc"
  $scope.main.viewName=$scope.Contract.owner

  $scope.page={}
  $scope.curr_page='kyc_owners'
  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.main.location=$scope.page.location

  if ($scope.page.edit) {
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    convertDateStringsToDates($scope.Kyc)
    convertDateStringsToDates($scope.Kyc.contractor_data)
    convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
    convertDateStringsToDates($scope.Kyc.company_data)
    convertDateStringsToDates($scope.Kyc.owner_data)
    $scope.owner=JSON.parse(localStorage.getItem('Owner'))
    $scope.Kyc.owner_data[$scope.owner.indice]=$scope.owner
  }
  else if ($scope.page.add){
    $scope.Kyc=JSON.parse(localStorage.getItem('Kyc'))
    convertDateStringsToDates($scope.Kyc)
    convertDateStringsToDates($scope.Kyc.contractor_data)
    convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
    convertDateStringsToDates($scope.Kyc.company_data)
    convertDateStringsToDates($scope.Kyc.owner_data)
    $scope.owner=JSON.parse(localStorage.getItem('Owner'))
    convertDateStringsToDates($scope.owner)
    if ($scope.Kyc.owner_data.length!==undefined|| $scope.Kyc.owner_data.length>0 ){
      $scope.Kyc.owner_data[$scope.Kyc.owner_data.length]=$scope.owner
    }
   else {
     $scope.Kyc.owner_data={}
     $scope.Kyc.owner_data[$scope.Kyc.owner_data.length]=$scope.owner
   }

  }
  else {
  switch ($scope.action){
    default:
    appData=$scope.Contract
    data={"action":"kycAx",appData:appData,country:true,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      $scope.loader=true;
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        $scope.Kyc=data;
        $scope.countryList=responceData.countrylist
        localstorage('countryList',JSON.stringify($scope.countryList))
        if ($scope.Kyc.date_of_identification===undefined || $scope.Kyc.date_of_identification)
        $scope.Kyc.date_of_identification=new Date()
        $scope.Kyc.contract_data=IsJsonString($scope.Kyc.contract_data)
        $scope.Kyc.contract_data.Docs=IsJsonString($scope.Kyc.contract_data.Docs)
        $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
        $scope.Kyc.contractor_data.Docs=IsJsonString($scope.Kyc.contractor_data.Docs)
        $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
        $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
        convertDateStringsToDates($scope.Kyc)
        convertDateStringsToDates($scope.Kyc.contract_data)
        convertDateStringsToDates($scope.Kyc.contract_data.Docs)
        convertDateStringsToDates($scope.Kyc.contractor_data)
        convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
        convertDateStringsToDates($scope.Kyc.company_data)
        convertDateStringsToDates($scope.Kyc.owner_data)
        $scope.loader=false


        $('input.mdl-textfield__input').each(
          function(index){
            $(this).parent('div.mdl-textfield').addClass('is-dirty');
            $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
        );
      }
      else
      {
        if (responceData.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        console.log('error');
      }
    })
    , (function() {
      console.log("error");
    });
    }


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
    $scope.Kyc.owner_data.splice(index-$scope.deleted,1);
    $scope.deleted++
  }

  $scope.save_kyc= function (passo){
    var langfileloginchk = localStorage.getItem("language");
    dbData=$scope.Kyc
    dbData.contract_data=JSON.stringify(dbData.contract_data)
    dbData.contractor_data=JSON.stringify(dbData.contractor_data)
    dbData.company_data=JSON.stringify(dbData.company_data)
    dbData.owner_data=JSON.stringify(dbData.owner_data)

    $scope.main.loader=true;

   data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.lastid

        $scope.back(passo)

      }
      else
      {
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        console.log('error');
        swal("",data.data.RESPONSE);
      }
    })
    , (function() {
      console.log("error");
    });


  }


  $scope.showAC=function($search,$word){
    var id=localStorage.getItem("userId");
    var usertype = localStorage.getItem('userType');
    res = $search.split(".")
    $search=res[1]
    if ($word===undefined){
      $word=$scope[res[0]][res[1]]
    }
    else {
      $word=$('#'+$word).val()
    }
    $table=res[0].toLowerCase()

    if (( $word  !== "undefined" && $word.length>3 &&  $word!=$scope.oldWord)){

     data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
      $http.post( SERVICEURL2,  data )
      .then(function(data) {
        if(data.data.RESPONSECODE=='1') 			{
          //$word=$($search.currentTarget).attr('id');
          $scope.word[$search]=data.data.RESPONSE;
        }
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
      })
      , (function() {
        console.log("error");
      });
    }
    $scope.oldWord= $($search.currentTarget).val()
  }
  $scope.resetAC=function(){
    $scope.word={}
    $scope.list={}
    $scope.listOther={}
    $scope.listCompany={}


  }
  $scope.addWord=function($search,$word){
    res = $search.split(".")
    switch(res.length){
      case 2:
      $scope[res[0]][res[1]]=$word
      $scope.word[res[1]]=[]
      break;
      case 3:
      $scope[res[0]][res[1]][res[2]]=$word
      $scope.word[res[2]]=[]
      break;

    }
  }



  $scope.add_owner=function(Owner){
    localstorage('add_owners',JSON.stringify({action:'add_customer_for_kyc_owner',location:'kyc_owners',other_data:true,owners:true}))
    localstorage('Contract',JSON.stringify($scope.Kyc.contractor_data))
    $state.go('add_owners')

  }
  $scope.edit_owner=function(Owner,indice){
    localstorage('Kyc',JSON.stringify($scope.Kyc))
    localstorage('add_customer',JSON.stringify({action:'edit_customer_for_kyc_owner',location:'kyc_owners',other_data:true,owners:true}))
    Owner.indice=indice
    localstorage('Owner',JSON.stringify(Owner))
    $state.go('add_customer')

  }

  $scope.back=function(passo){
    if (passo>0){
        localstorage('kyc_signature',JSON.stringify({action:'',location:$scope.page.location, prev_page:$scope.curr_page}))
        $state.go('kyc_signature')
        return;
    }
    if (passo==-1){
        history.back()
        return;
    }
    $state.go('view_contract')
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    localstorage('Contract',JSON.stringify($scope.Kyc.contract_data))
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

});
