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
   $scope.init=function(){
     $scope.page={}

     curr_page= basename()

     page=localStorage.getItem(curr_page)
    if (page.length >0 ){
      $scope.page=JSON.parse(page)
      $scope.action=$scope.page.action

    }

    console.log('action'+$scope.action);

      $scope.word={};
      //localstorage("back","view_contract.html");
      switch ($scope.action){
        case 'edit' :
            Contract=JSON.parse(localStorage.getItem('Contract'))
            convertDateStringsToDates(Contract)
            $scope.Contract=Contract
            switch($scope.Contract.act_for_other){
              case "1":
              $scope.Contract.company_id= $scope.Contract.other_id
              break;
              case "2":
              $scope.Contract.user_id= $scope.Contract.other_id
              break;
            }
            if (! ($scope.Contract.Docs instanceof Array) && $scope.Contract.Docs.length>0){
              $scope.Contract.Docs=JSON.parse($scope.Contract.Docs)
            }

            $scope.action='edit'
            $scope.viewName="Modifica Contratto"
            break;

        case 'add_contract' :
          $scope.action='add'
          $scope.viewName="Nuovo Contratto"
          break;
        default :
          $scope.viewName="Nuovo Contratto"
          $scope.action='add'
          break;
      }

      if ($scope.page.addDoc){
          Doc=JSON.parse(localStorage.getItem('Doc'))
          convertDateStringsToDates(Doc)
          Contract=JSON.parse(localStorage.getItem('Contract'))
          convertDateStringsToDates(Contract)
          $scope.Contract=Contract

          if ($scope.Contract.Docs.length!==undefined){
            $scope.Contract.Docs[Contract.Docs.length-1]=Doc
          }
         else {
           $scope.Contract.Docs=[]
           $scope.Contract.Docs[0]=Doc
         }
          $scope.Contract.DocsLoaded++
        }

      if ($scope.Contract.Docs===undefined ||  $scope.Contract.Docs.length===undefined ||  $scope.Contract.Docs.length==0){
        $scope.Contract.Docs=[]
        $scope.Contract.Docs[0]={}
        $scope.Contract.DocsLoaded=0;
        $scope.Contract.Docs[0].doc_name="Immagine Contratto"
        $scope.Contract.Docs[0].doc_type="Contratto di Servizio"
        $scope.Contract.contract_date=new Date()
        $scope.Contract.contract_eov=new Date()

      }
      $('input.mdl-textfield__input').each(
            function(index){
                $(this).parent('div.mdl-textfield').addClass('is-dirty');
                $(this).parent('div.mdl-textfield').removeClass('is-invalid');
            }
        );

   }




     $scope.showContractorList=function(){
     if ((typeof $scope.Contract.fullname !== "undefined" && $scope.Contract.fullname.length>4 && $scope.oldContrator!=$scope.Contract.fullname)){
       data={ "action":"ACCustomerList", name:$scope.Contract.fullname}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.list=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldContrator=$scope.searchContractor
     }
     $scope.showCompanyList=function(){
     if ((typeof $scope.Contract.name !== "undefined" && $scope.Contract.name.length>4 && $scope.oldCompany!=$scope.Contract.name)){
       data={ "action":"ACCompanyList", name:$scope.Contract.name}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.listCompany=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldCompany=$scope.searchCompany;
     }
     $scope.showOtherList=function(){
     if ((typeof $scope.Contract.other_name !== "undefined" && $scope.Contract.other_name.length>4 && $scope.Contract.other_name!=$scope.oldOther)){
       data={ "action":"ACCustomerList", name:$scope.Contract.other_name}
       $http.post( SERVICEURL2,  data )
           .success(function(data) {
                     if(data.RESPONSECODE=='1') 			{
                       $scope.listOther=data.RESPONSE;
                     }
            })
           .error(function() {
                    console.log("error");
            });
       }
       $scope.oldOther=$scope.searchOther
     }
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
     $scope.resetAC=function(){
       $scope.word={}
       $scope.list={}
       $scope.listOther={}
       $scope.listCompany={}


     }
     $scope.addContractorItem=function(id, name){
           $scope.list=[];
           $scope.Contract.fullname=name;
           $scope.Contract.contractor_id=id;
     };
     $scope.addCompanyItem=function(company){
           $scope.listCompany=[];
           $scope.Contract.name=company.name;
           $scope.Contract.company_id=company.company_id;
     };
     $scope.addOtherItem=function(other){
           $scope.listOther=[];
           $scope.Contract.other_name=other.fullname;
           $scope.Contract.user_id=other.user_id;
     };
     $scope.addWord=function($search,$word){
       res = $search.split(".")
       $scope[res[0]][res[1]]=$word
       $scope.word[res[1]]=[]
     }
     $scope.add_contract=function(){
//       add_contract($scope.action);
      var langfileloginchk = localStorage.getItem("language");
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

      var  appData ={
        id :localStorage.getItem("userId"),
        usertype: localStorage.getItem('userType')
      }
      // aggiorno il campo blog per contenere Json
      if ($scope.Contract.Docs.length>0 )
        $scope.Contract.Docs=JSON.stringify($scope.Contract.Docs)

      dbData=$scope.Contract
      // metto i documenti in json
      //dbData.Docs=JSON.parse($scope.Contract.Docs)
      switch(dbData.act_for_other){
          case "1":
            dbData.other_id= $scope.Contract.company_id
            dbData.role_for_other= $.trim($('#Contract_role_for_other').val())
          break;
          case "2":
          dbData.other_id= $scope.Contract.user_id
          dbData.role_for_other=$.trim( $('#Contract_role_for_other').val())
          break;
      }


          $('#loader_img').show();
          data= {"action":"addcontract",appData:appData,dbData:dbData,edit:$scope.action}
          $http.post(SERVICEURL2,data)
              .success(function(data){
                      $('#loader_img').hide();
                      if(data.RESPONSECODE=='1')
                      {
                        $scope.contract=[]
                        swal("",data.RESPONSE);
                        $lastid=data.lastid

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
     $scope.add_customer=function(){
       localstorage('add_customer.html',JSON.stringify({action:"add_customer_for_contract",location:curr_page}))
       redirect('add_customer.html')

     }
     $scope.add_company=function(){
       localstorage('add_company.html',JSON.stringify({action:"add_company_for_contract",location:curr_page}))
       redirect('add_company.html')

     }
     $scope.add_other=function(){
       localstorage('add_customer.html',JSON.stringify({action:"add_other_for_contract",location:curr_page}))
       redirect('add_customer.html')

     }
     $scope.back=function(){
       redirect($scope.page.location)
     }

    $scope.deleteDoc=function(Doc )
    {
      navigator.notification.confirm(
          'Vuoi cancellare il Documento!', // message
          function(button) {
           if ( button == 1 ) {
               $scope.deleteDoc2(Doc);
           }
          },            // callback to invoke with index of button pressed
          'Sei sicuro?',           // title
          ['Si','No']     // buttonLabels
          );

    }
    $scope.deleteDoc2=function(Doc){
      $http.post(SERVICEURL2,{action:'delete',table:'documents','primary':'id',id:Doc.id })
      Doc.deleted=true;
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


    $scope.add_document=function(Doc){
      localstorage('add_document.html',JSON.stringify({action:"add_document_for_contract",location:curr_page}))
      Doc.doc_name="Immagine Contratto"
      Doc.doc_type="Contratto di Servizio"
      Doc.agency_id=localStorage.getItem('agencyId')
      Doc.per='contract'
      Doc.showOnlyImage=true
      Doc.indice=$scope.Contract.Docs.length

      localstorage('Doc',JSON.stringify(Doc))
      localstorage('Contract',JSON.stringify($scope.Contract))
      redirect('add_document.html')
     }

      $scope.edit_doc=function(Doc){
        localstorage('add_document.html',JSON.stringify({action:"edit_document_for_contract",location:curr_page}))
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

function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
      $scope.deleteDoc(doc)
}
