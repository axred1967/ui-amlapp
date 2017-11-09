app2.factory('Companies_inf', function($http) {
  var Companies_inf = function() {
    this.Companies = [];
    this.busy = false;
    this.after = '';
    this.loaded=0;
    this.pInfo={}
    this.search=''
    this.searchThings=''

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

    data={"action":"CompanyList",search:this.search,searchThings:this.searchThings,last:last,pInfo:this.pInfo}
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
app2.controller('my_company', function ($scope,$http,$translate,$rootScope,$state, Companies_inf,$timeout,$interval,$stateParams,$filter) {
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
  $scope.main.state=$state.current.name;
  $scope.main[$scope.main.state] ={}
  if ($scope.main.searchText !== undefined && $scope.main.searchText.length>0){
    $scope.main.hideName=true
      $scope.main.showSubHeader=true
  }

  $scope.main[$scope.main.state].subHeader="Cerca"


  $scope.Companies_inf=new Companies_inf
  $scope.Companies_inf.pInfo=$scope.agent.pInfo


  $scope.imageurl=function(image){
    if (image===undefined || image.length==0)
      imageurl= BASEURL + 'img/customer-listing1.png'
    else
        imageurl= SERVICEDIRURL +"file_down.php?file=" + image +"&tipo=profilo&entity=company"+$scope.agent.pInfoUrl
    return   imageurl


  }

  $scope.tocompany = function(d){
    $scope.pages['add_company']={action:'edit_company', company_id:d.company_id,location:$state.current.name,temp:null,currentObId:d.company_id,currentOb:'company'}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_company',{pages:$scope.pages})
  };
  $scope.add_company = function(){
    $scope.pages['add_company']={action:'add_company', location:$state.current.name,temp:null,currentObId:null,currentOb:'company'}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('add_company',{pages:$scope.pages})
  };
  $scope.toowners = function(d){
    $scope.pages['owners_list']={action:'owner_list', location:$state.current.name,temp:null,Company:d,currentObId:d.company_id,currentOb:'company'}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('owners_list',{pages:$scope.pages})

  };
  $scope.toRole = function(d){
    $scope.pages['role_list']={action:'role_list', location:$state.current.name,temp:null,Company:d,currentObId:d.company_id,currentOb:'company'}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('role_list',{pages:$scope.pages})

  };

  $scope.toDocs = function(d){
    $scope.pages['my_document']={action:'list_from_my_company', location:$state.current.name,temp:null,Company:d,currentObId:d.company_id,currentOb:'company'}
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go('my_document',{pages:$scope.pages})

  };
  $scope.deleteCompany=function(Ob,index )
  {
    swal({
      title: $filter('translate')("Sei Sicuro?"),
      text: $filter('translate')("la Cancellazione della Persona Giuridica sarà non reversibile!"),
      icon: "warning",
      buttons: {
      'procedi':{text:$filter('translate')('Procedi'),value:true},
      'annulla':{text:$filter('translate')('Annulla'),value:false},

      },

    })
    .then((Value) => {
      if (Value) {
        data={action:'delete',table:'company','primary':'company_id',id:Ob.company_id ,pInfo:$scope.agent.pInfo}
        $http.post(SERVICEURL2,data)
        .then(function(data){
        if(data.data.RESPONSECODE=='1')
        {
          $state.reload()
          swal($filter('translate')('Cancellazione effettuata'), {
            icon: "success",
          });
        }
        else      {
          if (data.data.RESPONSECODE=='-1'){
             localstorage('msg','Sessione Scaduta ');
             $state.go('login');;;
             swal("",data.data.RESPONSE);
          }
        }
      })
      , (function(){
        console.log('error');
      })

      } else {
        swal($filter('translate')('Cancellazione Annulata'));
      }
    });
  }

  $scope.$on('backButton', function(e) {
  });

  $scope.$on('addButton', function(e) {
    $scope.add_company()
  })
  $scope.$on('showSubHeader', function(e) {
    $scope.main[$scope.main.state].showSubHeader=true
  })

  $scope.$on('searchButton', function(e,args) {
    $timeout(function() {
      if (args.click || ($scope.main.searchText.length>2 && $scope.Companies_inf.search!=$scope.main.searchText) || ($scope.main.searchText.length==0 && $scope.Companies_inf.search!=$scope.main.searchText) ){
        $scope.Companies_inf.search=$scope.main.searchText
        $scope.Companies_inf.searchThings=$scope.main.searchThings
        $scope.Companies_inf.last=99999999999
        $scope.Companies_inf.Companies=[]
        $scope.Companies_inf.loaded=0
        $scope.Companies_inf.busy=false

        $scope.Companies_inf.nextPage()

      }
   }, 2000);
  })

  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               setDefaults($scope)
               $scope.main.loader=false
            }, 5);
  });


});
