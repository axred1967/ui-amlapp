

 $(".mdl-textfield__input").focus(function(){
   $('label[for="'+$(this).attr("id") +'"]').show()
 });
 $(".mdl-textfield__input").blur(function(){
   $('label[for="'+$(this).attr("id") +'"]').hide()
 });
 var app2 = angular.module('myApp', ['ngInputCurrency']);
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
     $scope.word={};
     //localstorage("back","view_contract.html");
     switch ($scope.stack[$scope.lastkey].action){
         case 'edit' :
              $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
              $scope.action='edit'
              $scope.viewName="Modifica Contratto"
              break;
         default :
              $scope.viewName="Nuovo Contratto"
               break;
     }




     $scope.showContractorList=function(){
     if ((typeof $scope.Contract.fullname !== "undefined" && $scope.Contract.fullname.length>4 && $scope.oldContrator!=$scope.Contract.fullname)){
       data={ "action":"ACCustomerList", name:$scope.Contract.fullname}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.list=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldContrator=$scope.searchContractor
     }
     $scope.showCompanyList=function(){
     if ((typeof $scope.Contract.name !== "undefined" && $scope.Contract.name.length>4 && $scope.oldCompany!=$scope.Contract.name)){
       data={ "action":"ACCompanyList", name:$scope.Contract.name}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.listCompany=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldCompany=$scope.searchCompany;
     }
     $scope.showOtherList=function(){
     if ((typeof $scope.Contract.other_name !== "undefined" && $scope.Contract.other_name.length>4 && $scope.Contract.other_name!=$scope.oldOther)){
       data={ "action":"ACCustomerList", name:$scope.Contract.other_name}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.listOther=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldOther=$scope.searchOther
     }
     $scope.showAC=function($search,$table){
     var id=localStorage.getItem("userId");
     var usertype = localStorage.getItem('userType');

     if ((typeof $($search.currentTarget).val()  !== "undefined" && $($search.currentTarget).val().length>3 &&  $($search.currentTarget).val()!=$scope.oldWord)){
       $word=$($search.currentTarget).attr('id');
       data={ "action":"ACWord", id:id,usertype:usertype, name:$scope.searchContractor, search:$($search.currentTarget).val() ,word:$word ,table:$table}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $word=$($search.currentTarget).attr('id');
                       $scope.word[$word]=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldWord= $($search.currentTarget).val()
     }
     $scope.addContractorItem=function(id, name){
           $scope.list=[];
           $scope.Contract.fullname=name;
           $scope.Contract.contractor_id=id;
     };
     $scope.addCompanyItem=function(company){
           $scope.listCompany=[];
           $scope.Contract.name=company.name;
           $scope.Contract.company_id=company.company_id;
     };
     $scope.addOtherItem=function(other){
           $scope.listOther=[];
           $scope.Contract.other_name=other.fullname;
           $scope.Contract.user_id=other.user_id;
     };
     $scope.addWord=function($e,word){
       $('#'+$e).val(word);

       $scope.word[$e]=[]
     }
     $scope.add_contract=function(){
//       add_contract($scope.action);
      var langfileloginchk = localStorage.getItem("language");
      if(langfileloginchk == 'en' )
      {
        var scopemsg ="Please enter Scope of Contract";
         var naturemsg ="Please enter Nature of Contract";
         var customermsg ="Please enter customer";
         var datamsg = "Please enter date of contract"
         var eovmsg = "Please enter end of validity of contract"
         var other_idmsg = "Inserire soggetto delegante"
         var role_for_othermsg = "Inserire ruolo soggeto delegato"

      }
      else
      {
        var scopemsg ="Inserire scopo del contratto";
       var naturemsg ="Inserire Natura del contratto";
       var customermsg ="Inserire Firmatario del contratto";
       var datamsg = "Inserire data contratto"
       var eovmsg = "Inserire scadenza contratto"
       var other_idmsg = "Inserire soggetto delegante"
       var role_for_othermsg = "Inserire ruolo soggeto delegato"
      }
      var  appData ={
        id :localStorage.getItem("userId"),
        usertype: localStorage.getItem('userType')
      }
      dbData=$scope.Contract

      switch(dbData.act_for_other){
          case "1":
            dbData.other_id= $.trim($('#Company').val());
            dbData.role_for_other= $.trim($('#role_for_other').val())
            if(dbData.other_id=="") swal("",other_idmsg);
            if(dbData.role_for_other=="") swal("",role_for_othermsg);
          break;
          case "2":
          dbData.other_id= $.trim($('#other_id').val());
          dbData.role_for_other=$.trim( $('#role_for_other').val())
          if(dbData.other_id=="") swal("",other_idmsg);
          if(dbData.role_for_other=="") swal("",role_for_othermsg);
          break;
          default:
          dbData.other_id= -1;
          dbData.role_for_other=-1;
      }

      if(dbData.scope_contract=="") swal("",scopemsg);
      else if(dbData.nature_contract=="") swal("",naturemsg);
      else if(dbData.contract_date =="") swal("",datamsg);
      else if(dbData.contract_eov=='') swal("",eov);

      else
      {
          $('#loader_img').show();
          data= {"action":"addcontract",appData,dbData,edit:$scope.action}
          $http.post(SERVICEURL2,data)
              .success(function(data){
                      $('#loader_img').hide();
                      if(data.RESPONSECODE=='1')
                      {
                        $scope.contract=[]
                        swal("",data.RESPONSE);
                        $scope.back()

                      }
                      else      {
                          swal("",data.RESPONSE);
                      }
              })
              .error(function(){
                  console.log('error');
              })
      }
       $scope.word[$e]=[]
     }
     $scope.add_customer=function(){
       $scope.stack['add_contract.html']={}
       $scope.stack['add_contract.html'].action="add_customer_for_contract"
       localstorage('stack',JSON.stringify($scope.stack))
       redirect('add_customer.html')

     }
     $scope.add_company=function(){
       $scope.stack['add_contract.html']={}
       $scope.stack['add_contract.html'].action="add_company_for_contract"
       localstorage('stack',JSON.stringify($scope.stack))
       redirect('add_company.html')

     }
     $scope.add_other=function(){
       $scope.stack['add_contract.html']={}
       $scope.stack['add_contract.html'].action="add_other_for_contract"
       localstorage('stack',JSON.stringify($scope.stack))
       redirect('add_customer.html')

     }
     $scope.back=function(){
       back=$scope.lastkey
       delete $scope.stack[back]
       localstorage('stack',JSON.stringify($scope.stack))
       redirect(back)
     }

})
//gestione label

$(".mdl-textfield__input").focus(function(){
  $('label[for="'+$(this).attr("id") +'"]').show()
});
$(".mdl-textfield__input").blur(function(){
  $('label[for="'+$(this).attr("id") +'"]').hide()
});
