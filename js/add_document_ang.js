var app2 = angular.module('myApp', ['pascalprecht.translate','ng-currency','fieldMatch']);
//Field Match directive
app2.config(['$locationProvider', function($locationProvider) {
   $locationProvider.html5Mode(true);
}]);
angular.module('fieldMatch', [])
   .directive('fieldMatch', ["$parse", function($parse) {
       return {
           require: 'ngModel',
           link: function(scope, elem, attrs, ctrl) {
               var me = $parse(attrs.ngModel);
               var matchTo = $parse(attrs.fieldMatch);
               scope.$watchGroup([me, matchTo], function(newValues, oldValues) {
                   ctrl.$setValidity('fieldmatch', me(scope) === matchTo(scope));
               }, true);
           }
       }
   }]);
//Run material design lite
app2.directive("ngModel",["$timeout", function($timeout){
            return {
                restrict: 'A',
                priority: -1, // lower priority than built-in ng-model so it runs first
                link: function(scope, element, attr) {
                    scope.$watch(attr.ngModel,function(value){
                        $timeout(function () {
                            if (value){
                                element.trigger("change");
                            } else if(element.attr('placeholder') === undefined) {
                                if(!element.is(":focus"))
                                    element.trigger("blur");
                            }
                        });
                    });
                }
            };
        }]);

app2.run(function($rootScope, $timeout) {
   $rootScope.$on('$viewContentLoaded', function(event) {
       $timeout(function() {
           componentHandler.upgradeAllRegistered();
       }, 0);
   });
   $rootScope.render = {
       header: true,
       aside: true
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
app2.controller('personCtrl', function ($scope,$http,$translate,$location) {
    $scope.action="";
    $scope.Doc={}
    $scope.word={};
    $scope.stack={}
    if (localStorage.getItem('stack')!=null ) {
      $scope.stack=JSON.parse(localStorage.getItem('stack'))
      $scope.lastkey= Object.keys($scope.stack).pop() ;
      if($scope.stack[$scope.lastkey]!==undefined && $scope.stack[$scope.lastkey].action!==undefined){
        $scope.action=$scope.stack[$scope.lastkey].action;
      }else
      {
        $scope.action=$location.search().action
        $scope.Doc=$location.search()
      }
    }

    //localstorage("back","view_contract.html");
    switch ($scope.action){
        case 'edit' :
             Doc=JSON.parse(localStorage.getItem('Doc'))
             convertDateStringsToDates(Doc)
             $scope.Doc=Doc
             $scope.action='edit'
             $scope.viewName="Modifica Documento"
             dbData=$scope.Doc
             data={ "action":"documentList", dbData:dbData}
             $http.post( SERVICEURL2,  data )
                 .success(function(data) {
                           if(data.RESPONSECODE=='1') 			{
                             //$word=$($search.currentTarget).attr('id');
                             $scope.word[$search]=data.RESPONSE;
                           }
                  })
                 .error(function() {
                          console.log("error");
                  });


             break;
        default :
             $scope.Doc.image_name=""
             $scope.Doc.doc_date=new Date()
             $scope.viewName="Nuovo Documento"
              break;
    }

    $('input.mdl-textfield__input').each(
          function(index){
              $(this).parent('div.mdl-textfield').addClass('is-dirty');
              $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
      );





    $scope.showAC=function($search,$table){
      var id=localStorage.getItem("userId");
      var usertype = localStorage.getItem('userType');
      res = $search.split(".")
      $search=res[1]
      $word=$scope[res[0]][res[1]]
      $table=res[0].toLowerCase()

      if (( $word  !== "undefined" && $word.length>3 &&  $word!=$scope.oldWord)){

        data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table}
        $http.post( SERVICEURL2,  data )
            .success(function(data) {
                      if(data.RESPONSECODE=='1') 			{
                        //$word=$($search.currentTarget).attr('id');
                        $scope.word[$search]=data.RESPONSE;
                      }
             })
            .error(function() {
                     console.log("error");
             });
        }
        $scope.oldWord= $($search.currentTarget).val()
    }
    $scope.deleteDoc=function()
    {
      $scope.Doc.image_name=""
    }

    $scope.uploadfromgallery=function()
    {
       // alert('cxccx');
       navigator.camera.getPicture($scope.uploadPhoto,
            function(message) {
                alert('get picture failed');
            },
            {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            }
        );
    }
    $scope.add_photo=function()
    {
       // alert('cxccx');
       navigator.camera.getPicture($scope.uploadPhoto,
            function(message) {
                alert('get picture failed');
            },
            {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.CAMERA
            }
        );
    }

    $scope.uploadPhoto=function(imageURI){
      $("#agent_image").hide();
      $('#profileimgloader').show();

       var options = new FileUploadOptions();
       options.fileKey="file";
       options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
       options.mimeType="text/plain";
       options.chunkedMode = false;
       var params = new Object();

       options.params = params;
       var ft = new FileTransfer();
       ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per), $scope.winFT, $scope.failFT, options,true);



    }
    $scope.winFT=function (r)
    {
        $('#doc_image').val(review_info.response);
       // var review_selected_image  =  review_info.review_id;
        //$('#review_id_checkin').val(review_selected_image);
        data={ "action":"get_document_image_name_multi", id:$scope.Doc.per_id,for:$scope.Doc.per}
        $http.post( SERVICEURL2,  data )
            .success(function(data) {
                      if(data.RESPONSECODE=='1') 			{
                        //$word=$($search.currentTarget).attr('id');
                        $scope.word[$search]=data.RESPONSE;
                      }
             })
            .error(function() {
                     console.log("error");
             });
    }
    $scope.failFT =function (error)
    {
        $("#agent_image").show();
        $('#profileimgloader').hide();

    }

    $scope.add_document=function(){
      if ($scope.form.$invalid) {
          angular.forEach($scope.form.$error, function(field) {
              angular.forEach(field, function(errorField) {
                  errorField.$setTouched();
              })
          });
          $scope.formStatus = "Dati non Validi.";
          console.log("Form is invalid.");
					return
      } else {
          //$scope.formStatus = "Form is valid.";
          console.log("Form is valid.");
          console.log($scope.data);
      }

      var  appData ={
        id :localStorage.getItem("userId"),
        usertype: localStorage.getItem('userType')
      }
      dbData=$scope.DOC

      var langfileloginchk = localStorage.getItem("language");
      data= {"action":"savedocument",dbData:dbData}
      $http.post(SERVICEURL2,data)
        .success(function(data){
          $('#loader_img').hide();
          if(data.RESPONSECODE=='1')
          {
            $scope.Doc=data
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
    $scope.addWord=function($search,$word){
      res = $search.split(".")
      $scope[res[0]][res[1]]=$word
      $scope.word[res[1]]=[]
    }
    $scope.back=function(){
      back=$scope.lastkey
      delete $scope.stack[back]
     localstorage('stack',JSON.stringify($scope.stack))
      redirect(back)
    }

})
