app2.filter('filterMultiple',['$filter',function ($filter) {
return function (items, keyObj) {
    var filterObj = {
        data:items,
        filteredData:[],
        applyFilter : function(obj,key){
            var fData = [];
            if (this.filteredData.length == 0)
                this.filteredData = this.data;
            if (obj){
                var fObj = {};
                if (!angular.isArray(obj)){
                    fObj[key] = obj;
                    fData = fData.concat($filter('filter')(this.filteredData,fObj));
                } else if (angular.isArray(obj)){
                    if (obj.length > 0){
                        for (var i=0;i<obj.length;i++){
                            if (angular.isDefined(obj[i])){
                                fObj[key] = obj[i];
                                fData = fData.concat($filter('filter')(this.filteredData,fObj));
                            }
                        }

                    }
                }
                if (fData.length > 0){
                    this.filteredData = fData;
                }
            }
        }
    };
    if (keyObj){
        angular.forEach(keyObj,function(obj,key){
            filterObj.applyFilter(obj,key);
        });
    }
    return filterObj.filteredData;
}
}]);

app2.factory('ObAmlApp', function($http,$state) {
  var ObAmlApp = function() {
    this.Ob = [];
    this.settings={};
    this.settings.id="";
    this.settings.table="";
    this.busy = false;
    this.after = '';
    this.loaded=0;
    this.pInfo={}

  };
  ObAmlApp.prototype.set_settings = function(settings) {
    this.settings=settings;
  }

  ObAmlApp.prototype.nextPage = function() {
    if (this.busy || this.loaded==-1) return;
    this.busy = true;

    var id=localStorage.getItem("userId");
    var email=localStorage.getItem("userEmail");
    var usertype = localStorage.getItem('userType');

    var priviledge = localStorage.getItem("priviligetype");
    this.settings.last=99999999999
    if ( this.Ob!==undefined && this.Ob.length>0){
      lastkey= Object.keys(this.Ob).pop() ;
      this.settings.last=this.Ob[lastkey][this.settings.id];
    }
    data= {"action":"ListObjs",settings:this.settings,pInfo:this.pInfo}
    $http.post(SERVICEURL2,  data )
    .then(function(responceData)  {
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        // gestisco le preferenze
        angular.forEach(data,function(value,key) {
          settings=IsJsonString(value.settings)
          if (settings!==false && isObject(settings) ){
            data[key].settings=settings
          }
          else{
            data[key].settings={}
          }
        })

        if (data.length==0){
          this.loaded=-1
        }
        if (this.settings.last==99999999999)
        this.Ob=data;
        else
        this.Ob=this.Ob.concat(data);
        //$scope.Customers=data;
        this.loaded=data.length
        this.busy = false;
      }
      else   {
        if (responceData.data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          $state.go('login');;;
        }
        this.busy = false;
        this.loaded=-1
        console.log('no customer')
      }}.bind(this))
    , (function() {
      console.log("error");
    });


  };

  return ObAmlApp;
});

app2.controller('email_templates', function ($scope,$http,$translate,$rootScope,$state,ObAmlApp,$timeout) {
  //alert(window.location.pathname.replace(/^\//, ''));
  $scope.main.login=false
  $scope.main.Back=false
  if ($scope.agent.user_type == 3)
    $scope.main.Add=false
  else
    $scope.main.Add=true

  $scope.main.Search=true
  $scope.main.AddPage="add_email"
  $scope.main.viewName="Template Email"
  $scope.main.Sidebar=true
  $('.mdl-layout__drawer-button').show()
  $scope.main.loader=true
  $scope.page={}

   $scope.curr_page='email_templates'
   page=localStorage.getItem($scope.curr_page)
   if ( page!= null && page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }
   $scope.main.location=$scope.page.location


  $scope.ObAmlApp=new ObAmlApp
  $scope.ObAmlApp.pInfo=$scope.agent.pInfo
  $scope.ObAmlApp.set_settings({table:'emails',id:'emails_id'})
//  $scope.main.loader=Contracts_inf.busy
//  $scope.addMoreItems =function(){


//  }
//  $scope.addMoreItems()

  $scope.imageurl=function(image){
    if (image===undefined || image==null || image.length==0)
      imageurl= '../img/customer-listing1.png'
    else
      imageurl= BASEURL+ "file_down.php?action=file&file=" + Ob.image +"&profile=1&agent_id="+  $scope.agent.pInfoUrl
//    Ob.imageurl= Ob.IMAGEURI +Ob.image
    return   imageurl
  }
  $scope.add_email_template = function(){
    localstorage('add_email_template',JSON.stringify({action:'add_ob',location:$scope.curr_page}))
    $state.go('add_email_template')
  };
  $scope.toOb = function(Ob,index){
    localstorage('add_email_template',JSON.stringify({action:'edit',location:$scope.curr_page}))
    localstorage('Ob',JSON.stringify(Ob))
    $state.go('add_email_template')
  };

  $scope.delete=function(Ob,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare Oggetto?");
      if (r == true) {
        $scope.delete2(Ob,index);
      }
    }
    else{
      navigator.notification.confirm(
        'Vuoi Cancellare Oggetto?', // message
        function(button) {
          if ( button == 1 ) {
            $scope.delete2(Ob,index);
          }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
    );
    }

  }
  $scope.deleteOb=function(ob,index){
    data={action:'delete',table:$scope.ObAmlApp.settings.table,'primary':'id',id:ob[$scope.ObAmlapp.settings.id] ,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post(SERVICEURL2,data)
    $scope.ObAmlApp.Ob.splice(index,1);

  }
  $scope.back = function(d){
    $state.go($scope.page.location)
  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_email_template()
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
