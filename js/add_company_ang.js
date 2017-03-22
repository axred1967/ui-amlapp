var app2 = angular.module('myApp', []);
app2.filter('uppercase', function() {
    return function(input, $scope) {
        if ( input !==undefined && input.length>0)
        return input.toUpperCase();
        else
        return input

    }
});
app2.filter('capitalize', function() {
    return function(input, $scope) {
        if ( input !==undefined && input.length>0)
        return input.substring(0,1).toUpperCase()+input.substring(1);
        else
        return input

    }
});
app2.controller('personCtrl', function ($scope,$http) {
    $scope.datalang = DATALANG;
    if (localStorage.getItem('stack')!=null) {
      $scope.stack=JSON.parse(localStorage.getItem('stack'))
      $scope.lastkey= Object.keys($scope.stack).pop() ;
    }
    switch ($scope.stack[$scope.lastkey].action){
        case 'add_company_for_contract':
            $scope.viewName="Inserisci Società"
            break;
        default:
            $scope.viewName="Inserisci Società"
    }
    $scope.add_company= function (){
    var langfileloginchk = localStorage.getItem("language");
    if(langfileloginchk == 'en' )
    {
        var company_name_msg ="Please enter  Company Name";
       var company_addressmsg = "Please enter  Company Address";
       var comany_fiscal_idmsg ="Please enter  Fiscal Id";

    }
    else
    {
      var company_name_msg ="Si prega di inserire Nome Società";
       var company_addressmsg = "Si prega di inserire  Indirizzo Azienda ";
       var comany_fiscal_idmsg ="Si prega di inserire Partita iva o COE";
    }


    var company_name = $.trim($('#company_name').val());
    var company_address = $.trim($('#company_address').val());
    var comany_fiscal_id = $.trim($('#comany_fiscal_id').val());

     if(company_name=="") swal("",company_name_msg)
     else if(company_address=="") swal("",company_addressmsg)
     else if(comany_fiscal_id=="") swal("",comany_fiscal_idmsg)


      else
      {

          var id=localStorage.getItem("userId");
          var email=localStorage.getItem("userEmail");
          var usertype = localStorage.getItem('userType');
          $('#loader_img').show();
          data={ "action":scope.action, id:id,email:email,usertype:usertype,lang:langfileloginchk, dbData: $scope.Company}
          $http.post( SERVICEURL2,  data )
              .success(function(data) {
                        $('#loader_img').hide();
                        if(data.RESPONSECODE=='1') 			{
                           $scope.Company=[]
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

  $scope.back=function(){
    switch ($scope.stack[$scope.lastkey].action){
       case'add_company_for_contract':
            if ($scope.lastid!==undefined && $scope.lastid>0 ){
            $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
            $scope.Contract.fullname=$scope.Company.name
            $scope.Contract.company_id= $scope.lastid
            localstorage('Contract', JSON.stringify($scope.Contract));
            }
            break;
    }
    back=$scope.lastkey
    delete $scope.stack[back]
    localstorage('stack',JSON.stringify($scope.stack))
    redirect(back)
  }
})
