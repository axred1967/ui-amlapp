app2.controller('login', function ($scope,$http,$translate,$rootScope,$timeout,$state,$timeout,$window,$stateParams,tmhDynamicLocale,$translate) {
  $scope.main.Back=false
  $scope.main.Add=false
  $scope.main.Search=false
  $scope.main.viewName="\n"
  $scope.main.Sidebar=false
  $scope.main.login=true
//  $scope.main.loader=true

  var msg=localStorage.getItem('msg');
  if (msg!==undefined && msg!==null && msg.length>0){
    swal('',msg)
    localstorage('msg','');
  }
  $scope.curr_page="login"
  page=localStorage.getItem($scope.curr_page)
  if ( page!= null && page.length >0 ){
    $scope.page=JSON.parse(page)
    $scope.action=$scope.page.action

  }



  $scope.inputType = 'password';
   // Hide & show password function
   $scope.hideShowPassword = function(){
     if ($scope.inputType == 'password')
       $scope.inputType = 'text';
     else
       $scope.inputType = 'password';
   };
   $scope.signUp=function()   {
     localstorage('add_agency',JSON.stringify({action:'signUp',location:$scope.curr_page}))
     $state.go('add_agency')

   }



  $scope.loginf=function()   {

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

    /*get all the fields*/
    var username=$.trim($("#username").val());
    var password = $.trim($("#password").val());
    var langfileloginchk = localStorage.getItem("language");

    if(langfileloginchk == 'en' )  {
      var usernamemsg = "Please enter Email Id";
      var passwordmsg ="Please Enter Password";

      var chkemailpassw ="Email Id / Password mismatch";
      var waitbutton ="Wait..";
      var loginbutdbutton = "Login";
      var valid_emailmsg = "Please provide a valid Email ID";
    }
    else   {
      var usernamemsg = "Inserisci e-mail ";
      var passwordmsg ="Per favore, inserisci la password";

      var chkemailpassw ="Email ID / Password non corrispondente";
      var waitbutton ="Aspetta..";
      var valid_emailmsg = "Si prega di fornire un ID e-mail valido";
      var loginbutdbutton = "Accesso";
    }

    if(username=="") swal("",usernamemsg, "error");

    else if(password=="") swal("",passwordmsg, "error");
    else if(!isValidEmailAddress(username) )swal("",valid_emailmsg);
    else   {
      $("#submitbtn").html(waitbutton);
      data={"action":"login","username":username,"password":password}
      $http.post( SERVICEURL2,  data )
      .then(function(responceData) {
        data=responceData;
        if(data.data.RESPONSECODE==1 || data.data.RESPONSECODE==3)
        {
          localstorage("userId",data.data.userId);
          localstorage("agentId",data.data.agentId);
          localstorage("agencyId",data.data.agencyId);
          localstorage("userType",data.data.usertype);
          localstorage("priviledge",data.data.priviledge);
          localstorage("userEmail",data.data.email);
          localstorage("agentId",data.data.agentId);
          localstorage("cookie",data.data.cookie);
          localstorage("image",data.data.image_name);
          //alert(data.agencyId);
          localstorage("Name",data.data.name);
          localstorage("paese",data.data.paese);
          localstorage("tipo_cliente",data.data.tipo_cliente);


          localstorage("userSettings",JSON.stringify(data.data.settings));

          $scope.agent.name=data.data.name;
          $scope.agent.email=data.data.email;
          $scope.agent.id=data.data.agentId;
          $scope.agent.user_id=data.data.userId
          $scope.agent.agency_id=data.data.agencyId;
          $scope.agent.user_type=data.data.usertype;
          $scope.agent.priviledge=data.data.priviledge;
          $scope.agent.cookie=data.data.cookie;
          $scope.agent.image=data.data.image_name
          $scope.agent.pInfo={user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}
          $scope.agent.pInfoUrl="&" +jQuery.param({pInfo:$scope.agent.pInfo})
          settings=IsJsonString(data.data.settings)
          if (settings!==false && isObject(settings) ){
            $scope.agent.settings=settings


          }

          if ($scope.agent.image===undefined ||  $scope.agent.image== null || $scope.agent.image.length==0)
            $scope.agent.imageurl= ''
          else
            $scope.agent.imageurl= SERVICEDIRURL +"file_down.php?action=file&file=" + $scope.agent.image +"&profile=1"+$scope.agent.pInfoUrl

          $scope.agent.paese=data.data.paese
          $scope.agent.tipo_cliente= data.data.tipo_cliente

          if (data.data.RESPONSECODE==3 ){
            if ( $stateParams.action=='signup'){

            $scope.Ob={}
            settings={table:'agency',id:'agency_id',
            fields:{'address':'uno.address',
            'country':'uno.country',
            'town':'uno.town',
            'tipo_cliente_app':'uno.tipo_cliente_app',
            'name':'j1.name',
            'email':'j1.email',
            'settings':'j1.settings',
            'user_id':'uno.user_id',
            'agency_id':'uno.agency_id'
            },
              join:{
                'j1':{'table':'users',
                      'condition':'uno.user_id=j1.user_id '
                    }
              },
              where:{
                'uno.agency_id':$stateParams.agency_id
              }
            }
            data= {"action":"getObj",settings:this.settings,pInfo:{action:$stateParams.action,user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
            $http.post(SERVICEURL2,  data )
            .then(function(responceData)  {
              data=responceData.data.RESPONSE;
              if(responceData.data.RESPONSECODE=='1') 			{
                $scope.Ob=data
                settings=IsJsonString($scope.Ob.settings)
                if (settings.codeCli==$stateParams.codeCli){
                  localstorage('add_agency',JSON.stringify({action:'completeSignUp',location:'home'}))
                  localstorage('Ob',JSON.stringify($scope.Ob))
                  swal("",'Completa la Registrazione',"warning");
                  $state.go("add_agency");

                }else{
                    swal('','Paramateri di verifica mail non corretti','error');
                }


                }
              else   {
                if (responceData.data.RESPONSECODE=='-1'){
                  localstorage('msg','Sessione Scaduta ');
                  $state.go('login');;;
                }
                }
            }), (function() {
              console.log("error");
            });






          }

            swal("",data.data.RESPONSE,"error");
            $("#submitbtn").html(loginbutdbutton);
          //$state.go('login');;;
            return;
          }

          if(data.data.usertype == 2)
          {
            localstorage("priviligetype",data.privilige);
            if(data.privilige == '0' )
            {

              $state.go("my_profile_agent_noprve.html");
            }
            else
            {
              $state.go("home");
            }
          }
          else
          {
            $state.go("home");
          }

        }
        else
        {
          swal("",data.data.RESPONSE,"error");
          $("#submitbtn").html(''+loginbutdbutton +' <span class="mdl-button__ripple-container"><span style="width: 270.147px; height: 270.147px; transform: translate(-50%, -50%) translate(29px, 22px);" class="mdl-ripple is-animating"></span></span>');
        }
      })
    }
    return false;
  }

  $scope.$on('$viewContentLoaded',
  function(event){
    $timeout(function() {
        setDefaults($scope)
        $scope.main.loader=false
        $('.mdl-layout__drawer-button').hide()


      }, 100);
    });
  })
