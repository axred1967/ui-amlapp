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
    $scope.add_customer= function (){
      var langfileloginchk = localStorage.getItem("language");


      if(langfileloginchk == 'en' )
      {
          var namemsg ="Please enter Name";
          var surnamemsg ="Please enter Surname";

         var emailmsg ="Please enter Email";
         var mobilemsg ="Please enter Mobile Number";
         var mobilevalidmsg ="Please enter valid mobile number";
         var valid_emailmsg = "Please provide a valid Email ID";
         var chkmobileaccpt ="Only 10 digit Mobile Number accepted";
         var validmessageaddrees = "Please enter Address of residence";

      }
      else
      {
          var namemsg ="Si prega di inserire nome";
          var surnamemsg ="Si prega di inserire cognome";

         var emailmsg ="Inserisci e-mail";
         var mobilemsg ="Si prega di inserire numero di cellulare";
         var mobilevalidmsg ="Si prega di inserire il numero di cellulare valido";
         var valid_emailmsg = "Si prega di fornire un ID e-mail valido";
         var chkmobileaccpt ="Solo 10 cifre numero di cellulare accettato";
         var validmessageaddrees = "Si prega di inserire indirizzo di residenza";

      }

      var id=localStorage.getItem("userId");
      var email=localStorage.getItem("userEmail");
      var customer_name = $.trim($('#customer_name').val());
      var customer_email = $.trim($('#customer_email').val());
      var customer_mobile_number = $.trim($('#customer_mobile_number').val());
      var customer_address_resi = $.trim($('#customer_address_resi').val());
     // var actedcompnay = $('#actofcompany').val();
      if($('#actofcompany').is(":checked"))
      {
          var actedcompnay = 1;
      }
      else
      {
         var actedcompnay = 0;
      }
      //alert(actedcompnay); exit;
      var usertype = localStorage.getItem('userType');

      if(customer_name=="") swal("",namemsg);
      if(customer_surname=="") swal("",surnamemsg);

      else if(customer_email=="") swal("",emailmsg);

      else if(customer_mobile_number =="") swal("",mobilemsg);
      else if(isNaN(customer_mobile_number))swal("",mobilevalidmsg);
      //else if(customer_address_resi=='') swal("",validmessageaddrees);
      else if(!isValidEmailAddress(customer_email) )swal("",valid_emailmsg);

      else
      {

          //$('#save_button_cust').hide();
          //$('#cancel_button_cust').hide();
          $('#loader_img').show();
          data={ "action":"addcustomer", id:id,email:email,usertype:usertype,lang:langfileloginchk, dbData: $scope.Customer}
          $http.post( SERVICEURL2,  data )
              .success(function(data) {
                        $('#loader_img').hide();
                        if(data.RESPONSECODE=='1') 			{
                           $scope.Customer=[]
                           swal("",data.RESPONSE);

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
})
