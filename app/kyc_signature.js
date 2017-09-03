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
    $state.go($scope.page.location)
  }

  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Sottoscrizione e Conclusione"
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
        if ($scope.Kyc.date_of_identification===undefined || $scope.Kyc.date_of_identification)
        $scope.Kyc.date_of_identification=new Date()
        $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
        $scope.Kyc.contractor_data.Docs=IsJsonString($scope.Kyc.contractor_data.Docs)
        $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
        $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
        //convertDateStringsToDates($scope.Kyc)
        //convertDateStringsToDates($scope.Kyc.contractor_data)
        //convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
        //convertDateStringsToDates($scope.Kyc.company_data)
        //convertDateStringsToDates($scope.Kyc.owner_data)
        $scope.oldSign  = $scope.Kyc.contractor_data.sign

        if ($scope.Kyc.contractor_data.sign===undefined)
          $scope.Kyc.contractor_data.sign=""
        else {
          var Canvas2 = $("#canvas2")[0];
                  var Context2 = Canvas2.getContext("2d");
                  var image = new Image();
                  image.src = $scope.Kyc.contractor_data.sign;
                  Context2.drawImage(image, 0, 0);

        }
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

    $scope.action="saveKyc"


  }
  $scope.signature_ready=function(){
    clearButton = document.querySelector("#clearCanvas")

    var wrapper = document.getElementById("signature-pad"),
    savePNGButton = wrapper.querySelector("[data-action=save-png]"),
    canvas = wrapper.querySelector("canvas"),
    signaturePad;

    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
      var Canvas2 = $("#canvas2")[0];
      $('#sig').val(Canvas2.toDataURL())
      var ratio =  Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      ratiox=canvas.offsetWidth/canvas.width
      canvas.height = canvas.offsetHeight * ratio;
      ratioy=canvas.offsetHeight/canvas.height
      var image = new Image();
      image.src = $('#sig').val();
      canvas.getContext("2d").scale(ratio, ratio);
      //canvas.getContext("2d").translate(canvas.width/2,canvas.height/2);
      canvas.getContext("2d").drawImage(image,0,0);
      //canvas.getContext("2d").translate(-canvas.width/2,-canvas.height/2)
    }

    window.onresize = resizeCanvas;
    resizeCanvas();

    signaturePad = new SignaturePad(canvas);

    clearButton.addEventListener("click", function (event) {
      signaturePad.clear();
    });
  };
  $scope.signature_ready();

  $scope.saveimg=function(){
      $('#sign').show();
      vals=$('#sig').val();
      if(vals != '')
      {
        $('#sign').attr('src',vals);
      }


  }

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
    var blank = $("#blank")[0];
    if (Canvas2.toDataURL()==blank.toDataURL())
        $scope.Kyc.contractor_data.sign=""
    else if ($scope.oldSign!= null && $scope.oldSign.length<10)
        $scope.Kyc.contractor_data.sign=Canvas2.toDataURL()

    var langfileloginchk = localStorage.getItem("language");
    dbData=angular.extend({},$scope.Kyc)
    dbData.contractor_data=JSON.stringify(dbData.contractor_data)
    dbData.company_data=JSON.stringify(dbData.company_data)
    dbData.owner_data=JSON.stringify(dbData.owner_data)

   data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,final:true,pInfo:$scope.agent.pInfo}
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
    $('#canvas2').attr('height','300px')
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
                $('input.mdl-textfield__input').each(
                  function(index){
                    $(this).parent('div.mdl-textfield').addClass('is-dirty');
                    $(this).parent('div.mdl-textfield').removeClass('is-invalid');
                  })
                $scope.main.loader=false
             }, 5);
   });

})
