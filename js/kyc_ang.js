var app2 = angular.module('myApp', []);
app2.filter('capitalize', function() {
    return function(input, $scope) {
        if ( input !==undefined && input.length>0)
        return input.substring(0,1).toUpperCase()+input.substring(1);
        else
        return input

    }
});
app2.controller('personCtrl', function ($scope,$http, $filter) {

    $scope.datalang = DATALANG;
    if (localStorage.getItem('stack')!=null) {
      $scope.stack=JSON.parse(localStorage.getItem('stack'))
      $scope.lastkey= Object.keys($scope.stack).pop() ;
    }
    switch ($scope.stack[$scope.lastkey].action){
      default:
          var id=localStorage.getItem("CustomerProfileId");
        	var email=localStorage.getItem("userEmail");
          $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
          data= {"action":"viewkyc",contract_id:$scope.Contract.contract_id}
          $http.post( SERVICEURL2,  data )
              .success(function(responceData) {
                        $('#loader_img').hide();
                        if(responceData.RESPONSECODE=='1') 			{
                          data=responceData.RESPONSE;
                           $scope.Kyc=data;
                           $scope.Kyc.customer_name=$scope.Contract.name1
                           $scope.Kyc.customer_surname=$scope.Contract.surname
                           $scope.Kyc.customer_email=$scope.Contract.email
                           $scope.Kyc.customer_mobile=$scope.Contract.mobile                         }
                         else
                         {
                           console.log('error');
                         }
               })
              .error(function() {
                       console.log("error");
               });

            $scope.action="saveKyc"
            $scope.viewName="Informazioni personali"


    }
    $scope.save_kyc= function (passo){
      var langfileloginchk = localStorage.getItem("language");


      if(langfileloginchk == 'en' )
      {
          var namemsg ="Please enter Name";
          var surnamemsg ="Please enter Surname";

         var  profmsg ="Please enter Profession";
         var mobilemsg ="Please enter Mobile Number";

      }
      else
      {
          var namemsg ="Si prega di inserire nome";
          var surnamemsg ="Si prega di inserire cognome";
          var  profmsg ="Si prega inserire Professione";
         var emailmsg ="Inserisci e-mail";
         var mobilemsg ="Si prega di inserire numero di cellulare";
         var mobilevalidmsg ="Si prega di inserire il numero di cellulare valido";
         var valid_emailmsg = "Si prega di fornire un ID e-mail valido";

      }

      dbData=$scope.Kyc
      if(dbData.customer_name=="") swal("",namemsg);
      if(dbData.customer_surname=="") swal("",surnamemsg);

      else if(dbData.customer_email=="") swal("",emailmsg);

      //else if(dbData.customer_mobile_number =="") swal("",mobilemsg);
      //else if(isNaN(dbData.customer_mobile_number))swal("",mobilevalidmsg);
      //else if(customer_address_resi=='') swal("",validmessageaddrees);
      else if(!isValidEmailAddress(dbData.customer_email) )swal("",valid_emailmsg);
      else
      {

          $('#loader_img').show();
          data={ "action":$scope.action, contract_id:$scope.Contract.contract_id, dbData: $scope.Kyc}
          $http.post( SERVICEURL2,  data )
              .success(function(data) {
                        $('#loader_img').hide();
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
  }


  $scope.back=function(passo){
    back=$scope.lastkey
    action=$scope.stack[back].action
    delete $scope.stack[back]
    switch (passo){
      case 1:
          break;
      case 2:
          $scope.stack['view_contract.html']={}
          $scope.stack['view_contract.html'].action="edit_kyc"
          localstorage('stack',JSON.stringify($scope.stack))
          redirect('kycstep02.html')
          return
          break;

      default:

    }

    localstorage('stack',JSON.stringify($scope.stack))
    redirect(back)
  }
})
