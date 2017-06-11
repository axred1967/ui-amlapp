app2.factory('Companies_inf', function($http) {
  var Companies_inf = function() {
    this.Companies = [];
    this.busy = false;
    this.after = '';
    this.loaded=0;

  };

  Companies_inf.prototype.nextPage = function() {
    if (this.busy || this.loaded==-1) return;
    this.busy = true;

    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var usertype = localStorage.getItem('userType');
    var image = localStorage.getItem("Profileimageagencyuser");
    var priviledge = localStorage.getItem("priviligetype");
    last=99999999999
    if ( this.Companies!==undefined   && this.Companies.length>0){
      lastkey= Object.keys(this.Companies).pop() ;
      last=this.Companies[lastkey].company_id;
    }

    data={"action":"CompanyList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post(SERVICEURL2,  data )
    .success(function(responceData)  {
      if(responceData.RESPONSECODE=='1') 			{
        data=responceData.RESPONSE;
        this.loaded=data.length
        if (last==99999999999)
        this.Companies=data;
        else
        this.Companies=this.Companies.concat(data);
        //$scope.Customers=data;
        this.busy=false;

      }
      else   {
        if (responceData.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        console.log('no customer')
      }
    }.bind(this))
    .error(function() {
      console.log("error");
    });


  }
  return Companies_inf;

});
app2.controller('my_company', function ($scope,$http,$translate,$rootScope,$state, Companies_inf,$timeout) {
  //$scope.datalang = DATALANG;
  $scope.main.Back=false
  $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_company"
  $scope.main.action="add_company"
  $scope.main.viewName="Le mie Società"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.main.loader=true;
  $scope.page={}

   $scope.curr_page='my_company'
   page=localStorage.getItem($scope.curr_page)
   if ( page!= null && page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }
   $scope.main.location=$scope.page.location

  $scope.Companies_inf=new Companies_inf


  $scope.imageurl=function(image){
    if (image===undefined || image.length==0)
      imageurl= '../img/customer-listing1.png'
    else
        imageurl= BASEURL+ "file_down.php?file=" + image +"&profile=1&entity=company"
    return   imageurl


  }

  $scope.tocompany = function(d){
    localstorage("CompanyID",d.company_id);
    localstorage('add_company',JSON.stringify({action:'edit_company',location:$scope.curr_page}))
    $state.go('add_company')
  };
  $scope.add_company = function(){
    localstorage('add_company',JSON.stringify({action:'add_company',location:$scope.curr_page}))
    $state.go('add_company')
  };
  $scope.toowners = function(d){
    localstorage('owners_list',JSON.stringify({action:'owners_list',location:$scope.curr_page}))
    localstorage("Company_name",d.name);
    localstorage("CompanyID",d.company_id);
    $state.go('owners_list')
  };
  $scope.toDocs = function(d){
    localstorage('my_document',JSON.stringify({action:'list_from_my_company',location:$scope.curr_page}))
    localstorage("Company",JSON.stringify(d));
    $state.go('my_document')
  };
  $scope.deleteCompany=function(Company,index )
  {
    navigator.notification.confirm(
        'Vuoi cancellare La Società!', // message
        function(button) {
         if ( button == 1 ) {
             $scope.deleteCompany2(Company,index);
         }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
        );

  }
  $scope.deleteCompany2=function(Company,index){
    data={action:'delete',table:'comapny','primary':'id',id:Company.company_id ,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post(SERVICEURL2,data)
    $scope.Companies_inf.Companies.splice(index,1);
  }
  $scope.$on('backButton', function(e) {
  });

  $scope.$on('addButton', function(e) {
    $scope.add_company()
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
