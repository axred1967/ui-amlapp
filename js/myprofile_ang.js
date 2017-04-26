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
  var id=localStorage.getItem("userId");
  var agency_id=localStorage.getItem("agencyId");
  var email=localStorage.getItem("userEmail");
  data= {"action":"view_Customer_Profile_info",customer_id:id,email:email,agency_id:agency_id}

  $http.post( SERVICEURL2,  data )
      .success(function(responceData) {
                $('#loader_img').hide();
                if(responceData.RESPONSECODE=='1') 			{
                  data=responceData.RESPONSE;
                  $scope.Customer =  data;
                  $scope.Customer.doc_name="Immagine Profilo"
                  $scope.Customer.IMAGEURI=BASEURL+"uploads/user/small/"
                    $('input.mdl-textfield__input').each(
                          function(index){
                              $(this).parent('div.mdl-textfield').addClass('is-dirty');
                              $(this).parent('div.mdl-textfield').removeClass('is-invalid');
                          }
                      );

                  }
                 else
                 {
                   console.log('error');
                 }
       })
      .error(function() {
               console.log("error");
       });

       $scope.deleteDoc=function()
       {
         $scope.Doc.doc_image=""
       }

       $scope.uploadfromgallery=function()
       {
         $("#loader_img").show()
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
         $("#loader_img").show()
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
          userid=localStorage.getItem("userId")
          var options = new FileUploadOptions();
          options.fileKey="file";
          options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
          options.mimeType="text/plain";
          options.chunkedMode = false;
          var params = new Object();

          options.params = params;
          var ft = new FileTransfer();
          $http.post( LOG,  {data:BASEURL+"service.php?action=upload_user_image&userid="+userid})
          ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_user_image&userid="+userid), $scope.winFT, $scope.failFT, options);

//          ft.upload(imageURI, encodeURI(BASEURL+"service.php?action=upload_document_image_multi&userid="+$scope.Doc.per_id+"&for="+$scope.Doc.per), $scope.winFT, $scope.failFT, options,true);



       }
       $scope.winFT=function (r)
       {
         var review_info   =JSON.parse(r.response);
         $scope.Customer.image=review_info.response
         $scope.$apply()

       }
       $scope.failFT =function (error)
       {
         $("#loader_img").hide()

       }
       $scope.save_profile= function (){
         if ($scope.form.$invalid) {
             angular.forEach($scope.form.$error, function(field) {
                 angular.forEach(field, function(errorField) {
                     errorField.$setTouched();
                 })
             });
             $scope.formStatus = "Dati non Validi.";
   					swal('','Dati non validi')
             console.log("Form is invalid.");
   					return
         } else {
             //$scope.formStatus = "Form is valid.";
             console.log("Form is valid.");
             console.log($scope.data);
         }
         lang=localStorage.getItem('language');
       	var usertype = localStorage.getItem('userType');
           $('#loader_img').show();
           data={ "action":'saveProfileAx',id:id, lang:lang, dbData: $scope.Customer}
           $http.post( SERVICEURL2,  data )
               .success(function(data) {
                         $('#loader_img').hide();
                         if(data.RESPONSECODE=='1') 			{
                            swal("",data.RESPONSE);
                            $scope.lastid=data.lastid
                            redirect('index.html')
                          }
                          else
                          {
                            console.log('error');
                            swal("",data.RESPONSE);
                          }
                })
               .error(function() {
                        console.log("error");
                });
   }
});
