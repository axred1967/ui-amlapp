app2.controller('add_agency', function ($scope,$http,$state,$translate,$timeout,textAngularManager,$window) {
  $scope.main.login=false
  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Iscrivito ad AmlAPP"
  $scope.Ob={}
  $scope.page={}
  $scope.settings={}
  $scope.curr_page='add_agency'

 //chaptcha
  $scope.key="6LdHxysUAAAAAJI6B3TtZodNDewSh-CVY_lCxYbz";

  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }
  $scope.main.location=$scope.page.location
  $scope.settings.table="agency"
  $scope.settings.id="agency_id"

  switch ($scope.page.action){
    case 'add_ob':
    $scope.main.viewName="Iscriviti ad AmlAPP"
    $scope.Ob.user_type=1
    $scope.Ob.password=Math.random().toString(36).slice(-8)
    $scope.settings.action="add"
    break;
    case 'signUp':
    $scope.main.viewName="Iscriviti "
    $scope.Ob.user_type=1
    $scope.Ob.status=99
    $scope.Ob.password=Math.random().toString(36).slice(-8)
    $scope.Ob.settings={}
    $scope.Ob.settings.codeCli=Math.random().toString(36).slice(-8)
    $scope.settings.action="add"

    break;
    case 'completeSignUp':
    $scope.main.viewName="Completa Iscrizione"
    $scope.settings.action="edit"
    $scope.main.Back=false
    $scope.Ob=JSON.parse(localStorage.getItem('Ob'))
    $scope.Ob.settings=IsJsonString($scope.Ob.settings)
    $scope.Ob.status=1
    break;

    default:
    $scope.main.viewName="Modifica Cliente AmlAPP"
    $scope.settings.action="edit"
    $scope.Ob=JSON.parse(localStorage.getItem('Ob'))
    $scope.Ob.settings=IsJsonString($scope.Ob.settings)

  }


  $scope.renderChaptch = function(){
    if ($scope.widgetId1===undefined && $scope.action=='signUp'){
      return grecaptcha.render('rechaptcha', {
      'sitekey' : '6LdHxysUAAAAAJI6B3TtZodNDewSh-CVY_lCxYbz',
      'theme' : 'light'
      })
    }
    else return $scope.widgetId1
  };
  $scope.widgetId1 =$scope.renderChaptch()

  $scope.saveOb= function (passo){
    if ($scope.action=="signUp" && grecaptcha!== undefined && grecaptcha.getResponse($scope.widgetId1)==''){
      swal("", "verifica che sei una persona non un robot");
      return;
    }
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
    $scope.settings.other_table=[]
    $scope.settings.other_table[0]={}
    $scope.settings.other_table[0].table="users"
    $scope.settings.other_table[0].id="user_id"

    $scope.main.loader=true
    other_actions=[]
    dest_email=$scope.Ob.email
    if ($scope.action=='signUp'){
      other_actions[0]={ action:'mail_template',
        email:dest_email,
        template:'agency_added',
        vars:{
          client_name:$scope.Ob.name,
          email:$scope.Ob.email,
          password:$scope.Ob.password,
          codeCli:$scope.Ob.settings.codeCli
      }}
      other_actions[1]={ action:'mail_template', email:"axred1967@gmail.com,info@euriskoformazione.it",
        template:'nuovo_cliente',
        vars:{
          client_name:$scope.Ob.name,
          email:$scope.Ob.email,
          password:$scope.Ob.password
        }
        }
    }
    $scope.Ob.settings=JSON.stringify($scope.Ob.settings);
    data={ "action":"saveOb", settings:$scope.settings,dbData:$scope.Ob,other_actions:other_actions,pInfo:{action:$scope.page.action,user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
        if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.lastid;


        $scope.main.loader=false

        $scope.back()
      }
      else
      {
        if (data.data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          $scope.main.loader=false
          $state.go('login');;;
        }
        console.log('error');
        swal("",data.data.RESPONSE);
        $scope.main.loader=false
      }
    })
    , (function() {
      $scope.main.loader=false
      console.log("error");
    });


  }
  $scope.showAC=function($search,$word, settings){
    var id=localStorage.getItem("userId");
    var usertype = localStorage.getItem('userType');
    res = $search.split(".")
    $search=res[1]
    if ($word===undefined){
      $word=$scope[res[0]][res[1]]
    }
    else {
      $word=$('#'+$word).val()
    }
    $table=res[0].toLowerCase()

    if (( $word  !== "undefined" && $word.length>0 &&  $word!=$scope.oldWord) || settings.zero){

     data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,zero:settings.zero,order:settings.order,countries:settings.countries,search:$word ,table:$table,pInfo:{action:$scope.page.action,user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
      $http.post( SERVICEURL2,  data )
      .then(function(data) {
        if(data.data.RESPONSECODE=='1') 			{
          //$word=$($search.currentTarget).attr('id');
          $scope.word[$search]=data.data.RESPONSE;

        }
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
      })
      , (function() {
        console.log("error");
      });
    }
    $scope.oldWord= $($search.currentTarget).val()
  }
  $scope.resetAC=function(){
    $scope.word={}
    $scope.list={}
    $scope.listOther={}
    $scope.listCompany={}


  }
  $scope.addWord=function($search,$word,par){
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
    if (par.id!==undefined){
      $('#'+par.id).parent('div.mdl-textfield').addClass('is-dirty');
      $('#'+par.id).parent('div.mdl-textfield').removeClass('is-invalid');

    }

    if (par.countries && $scope.word['countries']!==undefined){
      $scope.word['countries']=[]
    }
  }



   $scope.back=function(passo){
     precPage=JSON.parse(localStorage.getItem($scope.page.location))
     if (!isObject(precPage))
       precPage={}
     switch ($scope.page.action){
       case 'signUp':
          localstorage('msg','Ben trovato '+ $scope.Ob.name +'.\n Controlla la tua email per completare registrazione! ');
          break;
        case 'completeSignUp':
           swal('','Registrazione Completata\n ora puoi provare la nostra APP per un mese gratuitamente','');
           break;
      }
      $state.go($scope.page.location)

   }
   $scope.$on('backButton', function(e) {
       $scope.back()
   });

   $scope.$on('addButton', function(e) {
   })
   $scope.$on('$viewContentLoaded',
            function(event){
              $('.mdl-tooltip.is-active').removeClass('is-active');
              $timeout(function() {
                $('input.mdl-textfield__input').each(
                  function(index){
                    $(this).parent('div.mdl-textfield').addClass('is-dirty');
                    $(this).parent('div.mdl-textfield').removeClass('is-invalid');
                  })
                $scope.main.loader=false
             }, 100);
   });

   $scope.main.loader=false

})
