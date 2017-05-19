app2.controller('kyc_signature', function ($scope,$http,$state,$translate) {
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Sottoscrizione kyc_company"
  $scope.main.loader=true
  $scope.page={}
  $scope.Contract=JSON.parse(localStorage.getItem('Contract'))

  $scope.curr_page='kyc_signature.html'
  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }



  switch ($scope.action){
    default:
    var id=localStorage.getItem("CustomerProfileId");
    var email=localStorage.getItem("userEmail");
    appData=$scope.Contract
    data= {"action":"kycAx",appData:appData}
//    $scope.loader=true
    $http.post( SERVICEURL2,  data )
    .success(function(responceData) {

      if(responceData.RESPONSECODE=='1') 			{
//        $scope.loader=false
        data=responceData.RESPONSE;
        $scope.Kyc=data;
        $scope.countryList=responceData.countrylist
        if ($scope.Kyc.date_of_identification===undefined || $scope.Kyc.date_of_identification)
        $scope.Kyc.date_of_identification=new Date()
        $scope.Kyc.contractor_data=IsJsonString($scope.Kyc.contractor_data)
        $scope.Kyc.contractor_data.Docs=IsJsonString($scope.Kyc.contractor_data.Docs)
        $scope.Kyc.owner_data=IsJsonString($scope.Kyc.owner_data)
        $scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
        convertDateStringsToDates($scope.Kyc)
        convertDateStringsToDates($scope.Kyc.contractor_data)
        convertDateStringsToDates($scope.Kyc.contractor_data.Docs)
        convertDateStringsToDates($scope.Kyc.company_data)
        convertDateStringsToDates($scope.Kyc.owner_data)
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
        console.log('error');
      }
    })
    .error(function() {
      console.log("error");
    });

    $scope.action="saveKyc"


  }
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
    dbData=$scope.Kyc
    dbData.contractor_data=JSON.stringify(dbData.contractor_data)
    dbData.company_data=JSON.stringify(dbData.company_data)
    dbData.owner_data=JSON.stringify(dbData.owner_data)

    data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,final:true}
    $scope.loader=true
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      if(data.RESPONSECODE=='1') 			{
        swal("",data.RESPONSE);
        $scope.lastid=data.lastid

        $scope.back(passo)

      }
      else
      {
        console.log('error');
        swal("",data.RESPONSE);
      }
    })
    .error(function() {
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

   $scope.back=function(passo){
     if (passo==-1){
         history.back()
         return;
     }
     //$scope.loader=false
     $state.go('view_contract')
   }

})
