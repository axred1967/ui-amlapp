var back=localStorage.getItem("back");
if (back!==undefined && back.length>0){
//  localstorage("back","");
}
else {
back="my_company.html";
}

var app2 = angular.module('myApp', []);

app2.controller('personCtrl', function ($scope,$http) {
    $scope.datalang = DATALANG;
    if (localStorage.getItem('stack')!=null) {
      $scope.stack=JSON.parse(localStorage.getItem('stack'))
      $scope.lastkey= Object.keys($scope.stack).pop() ;
    }
    $scope.Company=[];
    $scope.Owner=[];
    $scope.Company.name=localStorage.getItem("Company_name");
    var id=localStorage.getItem("userId");
    var CompanyID=localStorage.getItem("CompanyID");
  	var email=localStorage.getItem("userEmail");
    $('#loader_img').hide();
    var usertype = localStorage.getItem('userType');
     var image = localStorage.getItem("Profileimageagencyuser");
     var priviledge = localStorage.getItem("priviligetype");
     if(priviledge == 0 && usertype  == '2'  )
     {
         redirect("my_profile_agent_noprve.html");
     }
    if(image != null)
    {
            $('#Profileimageagencyuser').attr("src",BASEURL+"uploads/user/small/"+image);

    }
    $('#Profileimageagencyusername').html(name);
    $('#Profileimageagencyuseremail').html(email);
    data= {"action":"OwnersList",company_id:CompanyID, id:id,email:email,usertype:usertype,priviledge:priviledge}
    $http.post(
      SERVICEURL2,  data
      )
        .success(function(responceData)
                 {
                  $('#loader_img').hide();
                  if(responceData.RESPONSECODE=='1') 			{
                    data=responceData.RESPONSE;
                    $scope.Owners=data;
                   }
                   else
                   {
                      //swal("", 'no customer')
                      $scope.Owners=[];

                   }

         })
        .error(function() {
                swal("", 'Errore')
                 console.log("error");
         });
         $scope.tocustomer = function(d){
            tocustomer(d)
          };
          $scope.add_owner=function(Owner){
            $scope.stack['owners_list.html']={}
            $scope.stack['owners_list.html'].action="add_owners"
            localstorage('stack',JSON.stringify($scope.stack))
            redirect('add_owners.html')

          }
          $scope.edit_owner=function(Owner){
            $scope.stack['owners_list.html']={}
            $scope.stack['owners_list.html'].action="edit_owners"
            localstorage('stack',JSON.stringify($scope.stack))

            localstorage('Owner',JSON.stringify(Owner))
            redirect('add_owners.html')

          }

          $scope.back=function(){
            switch ($scope.stack[$scope.lastkey].action){
               case'add_company_for_contract':
                    if ($scope.lastid!==undefined && $scope.lastid>0 ){
                    $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
                    $scope.Contract.name=$scope.Company.name
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

      console.log($scope.Contracts);
});
