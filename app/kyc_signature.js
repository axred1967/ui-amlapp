app2.controller('kyc_signature', function ($scope,$http,$state,$translate,$timeout,$stateParams,$interval) {
  //gestisco lo state parameter
  $scope.curr_page=$state.current.name
  $scope.pages=$stateParams.pages
  if ($scope.pages===null || $scope.pages===undefined){
    $scope.pages=JSON.parse(localStorage.getItem('pages'));
  }
  $scope.page=$scope.pages[$state.current.name]
  $scope.back=function(passo){
    if (passo==-1){
      $state.go($scope.page.prev_page)
      return;
    }
    if (passo==1){
      if ($scope.print){

      url=PDFURL +'kyc.php?id='+$scope.Contract.contract_id+"&download=Y"+$scope.agent.pInfoUrl
        var anchor = angular.element('<a/>');
      	angular.element(document.body).append(anchor);
      	var ev = document.createEvent("MouseEvents");
      	ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      	anchor.attr({
      		href: url,
      		target: '_blank',
      		download: 'kyc'+$scope.Contract.contract_id+ '-'+$scope.agent.id+'.pdf'
      	})[0].dispatchEvent(ev);
        anchor.remove()
      }
        $scope.pages['risk_profile01_sm']={action:'', location:$scope.page.location,prev_page:$state.current.name,temp:null,Contract:$scope.Contract}
  			localstorage('pages',JSON.stringify($scope.pages))
        $state.go('risk_profile01_sm',{pages:$scope.pages})


    $state.go()
  }
  if (passo==0){
    $state.go($scope.page.location)
  }
}

  $scope.main.Back=true
  $scope.main.Add=false
  //		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $scope.main.viewName="Adeguata Verifica"
  $scope.main.loader=true
  switch ($scope.page.action){
    default:
    $scope.Contract=$scope.pages[$scope.page.location].Contract
    appData=$scope.Contract
    data={"action":"kycAx",appData:appData,pInfo:$scope.agent.pInfo}
    $scope.main.loader=true
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {

      if(responceData.data.RESPONSECODE=='1') 			{
        //        $scope.loader=false
        data=responceData.data.RESPONSE;
        $scope.Kyc=data;
        $scope.countryList=responceData.countrylist

        $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
        //$scope.Kyc.contract_data=IsJsonString($scope.Kyc.contract)
        //$scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
        //$scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
        //convertDateStringsToDates($scope.Kyc)
        //convertDateStringsToDates($scope.Kyc.contractor_data)
        //convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
        //convertDateStringsToDates($scope.Kyc.company_data)
        //convertDateStringsToDates($scope.Kyc.owner_data)
        if ( $scope.Kyc.kyc_status==0)
          $scope.print=true;
        if ($scope.Kyc.contractor_data.sign===undefined)
        $scope.Kyc.contractor_data.sign=""
        else {
          url=SERVICEDIRURL +"file_down.php?tipo=firma&file=" +$scope.Kyc.contractor_data.sign +"&entity_key="+$scope.pages.currentObId+"&entity="+$scope.pages.currentOb+ $scope.agent.pInfoUrl
          $scope.signaturePad.fromDataURL(url)

        }
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

    $scope.action="saveKyc"


  }

  $scope.signature_ready=function(){
    clearButton = document.querySelector("#clearCanvas")

    var wrapper = document.getElementById("signature-pad"),
    savePNGButton = wrapper.querySelector("[data-action=save-png]"),
    canvas = wrapper.querySelector("canvas"),
    signaturePad;
    $scope.signaturePad = new SignaturePad(canvas);

    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
        var ratio =  Math.max(window.devicePixelRatio || 1, 1);

         // This part causes the canvas to be cleared
         $cbody=$('.signature-pad--body')
         canvas.height=$cbody.height();
         canvas.width=$cbody.width();

         // This library does not listen for canvas changes, so after the canvas is automatically
         // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
         // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
         // that the state of this library is consistent with visual state of the canvas, you
         // have to clear it manually.
         $scope.signaturePad.clear();

  }

    window.onresize = resizeCanvas;
    resizeCanvas();


    clearButton.addEventListener("click", function (event) {
      $scope.signaturePad.clear();
    });
  };
  $scope.signature_ready();



  $scope.save_kyc= function (passo){
    if ($scope.form.$invalid) {
      angular.forEach($scope.form.$error, function(field) {
        angular.forEach(field, function(errorField) {
          errorField.$setTouched();
        })
      });
      swal("riempire form corretamente");
      console.log("Form is invalid.");
      return
    } else {
      //$scope.formStatus = "Form is valid.";
      console.log("Form is valid.");
      console.log($scope.data);
    }
    var Canvas2 = $("#canvas2")[0];

      var f={}
      f.name=$scope.pages.currentObId +"_firma"+ Math.random().toString(36).slice(-16)+'.png'
      filename=f.name
      $scope.Kyc.contractor_data.sign=f.name
      f.data=Canvas2.toDataURL()
      data={action:"upload_document_ax",firma:true,entity_key:$scope.pages.currentObId,entity:$scope.pages.currentOb, f:f,filename:filename,pInfo:$scope.agent.pInfo}
      $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
      .then(function(data){

        if (data.data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          $state.go('login');;;
        }
        console.log('success');
      })
      , (function(){
        console.log('error');
      });



    var langfileloginchk = localStorage.getItem("language");
    dbData={}
    dbData.contractor_data=JSON.stringify($scope.Kyc.contractor_data)
    dbData.kyc_status=1
    dbData.kyc_date=convertDatestoStrings(new Date())
    data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,final:true,agg:$scope.page.agg,pInfo:$scope.agent.pInfo}
    $scope.main.loader=true
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


  $scope.showCanvas=function(){
    $scope.oldSign="change"
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

  $scope.$on('backButton', function(e) {

    $scope.back()
  });

  $scope.$on('addButton', function(e) {
  })
  $scope.$on('$viewContentLoaded',
  function(event){
    $timeout(function() {
      setDefaults($scope);
      $('.mdl-layout__drawer-button').hide()
      $scope.main.loader=false
    }, 5);
  });

})
