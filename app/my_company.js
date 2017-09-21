app2.factory('Companies_inf', function($http) {
  var Companies_inf = function() {
    this.Companies = [];
    this.busy = false;
    this.after = '';
    this.loaded=0;
    this.pInfo={}

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

    data={"action":"CompanyList",id:id,email:email,usertype:usertype,priviledge:priviledge,last:last,pInfo:this.pInfo}
    $http.post(SERVICEURL2,  data )
    .then(function(responceData)  {
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        this.loaded=data.length
        if (last==99999999999)
        this.Companies=data;
        else
        this.Companies=this.Companies.concat(data);
        //$scope.Customers=data;
        this.busy=false;

      }
      else   {
        if (responceData.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        console.log('no customer')
      }
    }.bind(this))
    , (function() {
      console.log("error");
    });


  }
  return Companies_inf;

});
app2.controller('my_company', function ($scope,$http,$translate,$rootScope,$state, Companies_inf,$timeout,$interval,$stateParams) {
  /* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=JSON.parse(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]

  $scope.main.loader=true;

  $scope.main.Back=false
  $scope.main.Add=true
  $scope.main.Search=true
  $scope.main.AddPage="add_company"
  $scope.main.action="add_company"
  $scope.main.viewName="Le mie Società"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.deleted=0


  $scope.Companies_inf=new Companies_inf
  $scope.Companies_inf.pInfo=$scope.agent.pInfo


  $scope.imageurl=function(image){
    if (image===undefined || image.length==0)
      imageurl= '../img/customer-listing1.png'
    else
        imageurl= SERVICEDIRURL +"file_down.php?file=" + image +"&profile=1&entity=company"+$scope.agent.pInfoUrl
    return   imageurl


  }

  $scope.tocompany = function(d){
    $scope.pages['add_company']={action:'edit_company', company_id:d.company_id,location:$state.current.name,temp:null}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_company',{pages:$scope.pages})
  };
  $scope.add_company = function(){
    $scope.pages['add_company']={action:'add_company', location:$state.current.name,temp:null}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_company',{pages:$scope.pages})
  };
  $scope.toowners = function(d){
    $scope.pages['owners_list']={action:'owner_list', location:$state.current.name,temp:null,Company:d}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('owners_list',{pages:$scope.pages})

  };
  $scope.toDocs = function(d){
    $scope.pages['my_document']={action:'list_from_my_company', location:$state.current.name,temp:null,Company:d}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('my_document',{pages:$scope.pages})

  };
  $scope.deleteCompany=function(Company,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare la Società" +Company.name +"?");
      if (r == true) {
        $scope.deleteCompany2(Company,index);
      }
    }
    else{
      navigator.notification.confirm(
          "Vuoi cancellare La Società"+Company.name +"?", // message
          function(button) {
           if ( button == 1 ) {
               $scope.deleteCompany2(Company,index);
           }
          },            // callback to invoke with index of button pressed
          'Sei sicuro?',           // title
          ['Si','No']     // buttonLabels
          );

    }

  }
  $scope.deleteCompany2=function(Company,index){
    data={action:'delete',table:'company','primary':'company_id',id:Company.company_id ,pInfo:$scope.agent.pInfo}
    $http.post(SERVICEURL2,data)
    $state.reload()
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
