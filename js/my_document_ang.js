var app2 = angular.module('myApp', ['pascalprecht.translate','ng-currency','fieldMatch']);
//Field Match directive
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
app2.controller('personCtrl', function ($scope,$http,$translate) {
    $('#loader_img').hide()
    $scope.page={}
    $scope.action="";
    $scope.Docs={}
    $scope.Doc={}
    $scope.word={};
    page=localStorage.getItem('my_document.html')
   if (page.length >0 ){
     $scope.page=JSON.parse(page)
     $scope.action=$scope.page.action

   }

   console.log('action'+$scope.action);
    $scope.addMoreItems =function(){
      last=99999999999
      if ( $scope.Contracts!==undefined && $scope.Contracts.length>0){
        lastkey= Object.keys($scope.Contracts).pop() ;
         last=$scope.Contracts[lastkey].id;
      }
      dbData=$scope.Doc
      data={ "action":"documentList", dbData:dbData}
      $('#loader_img').show();
      $http.post(SERVICEURL2,  data )
          .success(function(responceData)  {
                    $('#loader_img').hide();
                    if(responceData.RESPONSECODE=='1') 			{
                      data=responceData.RESPONSE;
                      angular.forEach(data,function(value,key) {
                        data[key].IMAGEURI=BASEURL+'uploads/document/'+data[key].per+'_'+data[key].per_id +'/resize/'

                      })
                      $scope.loaded=data.length
                      if (last==99999999999)
                        $scope.Docs=data;
                      else
                        $scope.Docs=$scope.Docs.concat(data);
                      //$scope.Customers=data;
                     }
                     else   {
                        console.log('no docs')
                     }
           })
          .error(function() {
                   console.log("error");
           });


    }

    $scope.addMoreItems()
    switch ($scope.action){
        case 'list_from_view_contract' :
             $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
             convertDateStringsToDates($scope.Contract)
             $scope.Doc.per_id=$scope.Contract.contract_id
             $scope.Doc.per='contract'
             $scope.viewName="Documenti Contratto"
             dbData=$scope.Doc
             data={ "action":"documentList", dbData:dbData}
             $scope.addMoreItems()


             break;
        default :
             $scope.viewName="Documenti Contratto"
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

    $scope.uploadfromgallery=function(Doc)
    {
      localstorage('Doc', JSON.stringify($scope.Doc));
       // alert('cxccx');
       navigator.camera.getPicture($scope.uploadPhoto(Doc),
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
    $scope.add_photo=function(Doc)
    {
      localstorage('Doc', JSON.stringify($scope.Doc));
       // alert('cxccx');
       navigator.camera.getPicture($scope.uploadPhoto(Doc),
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
      $scope.Doc=JSON.parse(localstorage.getItem('Doc'))

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
      $scope.Doc=JSON.parse(localstorage.getItem('Doc'))
      var foundItem = $filter('filter')($scope.Docs, { id: $scope.Doc.id  }, true)[0];
      var review_info   =JSON.parse(r.response);
      var id = review_info.id;
        $('#doc_image').val(review_info.response);
       // var review_selected_image  =  review_info.review_id;
        //$('#review_id_checkin').val(review_selected_image);
        data={ "action":"get_document_image_name_multi", id:id}
        $http.post( SERVICEURL2,  data )
            .success(function(data) {
                      if(data.RESPONSECODE=='1') 			{
                        //$word=$($search.currentTarget).attr('id');
                        $scope.Docs[foudItem].doc_image=data.RESPONSE.imagename;
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
      localstorage('add_document.html',JSON.stringify({action:"add_document_for_contract",location:"my_document.html"}))

      Doc={agency_id=localStorage.getItem('agencyId'),per_id:$scope.Contract.contract_id,per:'contract'}
      localstorage('Doc',JSON.stringify(Doc))
      redirect('add_document.html')    }
      $scope.edit_doc=function(Doc){
        localstorage('add_document.html',JSON.stringify({action:"edit_document_for_contract",location:"my_document.html"}))
        localstorage('Doc',JSON.stringify(Doc))
        redirect('add_document.html')    }

    $scope.addWord=function($search,$word){
      res = $search.split(".")
      $scope[res[0]][res[1]]=$word
      $scope.word[res[1]]=[]
    }
    $scope.back=function(){
      redirect($scope.page.location)
    }

})
