app2.controller('add_contract', function ($scope,$http,$translate,$rootScope,$timeout,$state,$timeout) {
		$scope.main.Back=true
		$scope.main.Add=false
//		$scope.main.AddPage="add_contract"
		$scope.main.Search=false
		$scope.main.Sidebar=false
		$('.mdl-layout__drawer-button').hide()
	  $scope.main.viewName="Nuovo  Contratto"
    $scope.main.loader=true
		$scope.aggKyc=false;
		$scope.page={}

     $scope.curr_page='add_contract'
     page=localStorage.getItem($scope.curr_page)
     if ( page!= null && page.length >0 ){
       $scope.page=JSON.parse(page)
       $scope.action=$scope.page.action

     }
		 $scope.main.location=$scope.page.location

		 $scope.word={};

     //localstorage("back","view_contract");
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
       convertDateStringsToDates($scope.Contract.Docs)

       $scope.action='edit'
       $scope.main.viewName="Modifica Contratto"
       break;

       case 'add_contract' :
       $scope.action='add'
       $scope.main.viewName="Nuovo Contratto"
       $scope.Contract={}
       $scope.Contract.contract_date=new Date()
       $scope.Contract.contract_eov=new Date()
       $scope.Contract.contract_eov.setFullYear($scope.Contract.contract_eov.getFullYear() + 5)
       break;
       default :
       $scope.main.viewName="Nuovo Contratto"
       $scope.action='add'
       break;
     }
     if ($scope.main.reload){
       $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
       convertDateStringsToDates($scope.Contract)
			 $scope.main.reload=false
     }
     //gestisco aggiunta Doc
     if ($scope.page.editDoc) {
       $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
       convertDateStringsToDates($scope.Contract)
       Doc=JSON.parse(localStorage.getItem('Doc'))
       convertDateStringsToDates(Doc)
       $scope.Customer.Docs[Doc.indice]=Doc

     }
     else if ($scope.page.addDoc){
       $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
       convertDateStringsToDates($scope.Contract)
       Doc=JSON.parse(localStorage.getItem('Doc'))
       convertDateStringsToDates(Doc)
       if ($scope.Contract.Docs.length!==undefined|| $scope.Contract.Docs.length>0 ){
         $scope.Contract.Docs[$scope.Contract.Docs.length]=Doc
       }
       else {
         $scope.Contract.Docs={}
         $scope.Contract.Docs[0]=Doc
       }

     }

     //GESTISCO INSERIMENTO DI UN NUOVO o delegante
     if ($scope.page.add){
       $scope.Contract=JSON.parse(localStorage.getItem('Contract'))
       convertDateStringsToDates($scope.Contract)
     }
     if ($scope.Contract.Docs===undefined || !isObject($scope.Contract.Docs)){
         $scope.Contract.Docs=[{}]
         $scope.newDocs=true;

     }
		 $scope.countryList=JSON.parse(localStorage.getItem('countryList'))

		 $scope.toogle=function(o){
			 o = o.split(".")
			 switch (s.length){
				 case 1:
				 $val= $scope[o[0]]
				 if ($val==1){
					 $scope[o[0]]=0;
	 					return
				 }
				 if ($val==0){
					 $scope[o[0]]=1;
	 					return
				 }
				 break;
				 case 2:
				 $val= $scope[o[0]][o[1]]
				 if ($val==1){
					 $scope[o[0]][o[1]]=0;
						return
				 }
				 if ($val==0){
					 $scope[o[0]][o[1]]=1;
						return
				 }
				 break;
				 case 3:
				 $val= $scope[o[0]][o[1]][o[2]]
				 if ($val==1){
					 $scope[o[0]][o[1]][o[2]]=0
						return
				 }
				 if ($val==0){
					 $scope[o[0]][o[1]][o[2]]=1;
						return
				 }
				 break;
				 case 4:
				 $val= $scope[o[0]][o[1]][o[2]][o[3]]
				 if ($val==1){
					 $scope[o[0]][o[1]][o[2]][o[3]]=0
						return
				 }
				 if ($val==0){
					 $scope[o[0]][o[1]][o[2]][o[3]]=1;
						return
				 }
				 break;

			 }


		 }
		 $scope.$on('$viewContentLoaded',
	            function(event){
								$timeout(function() {
									$('input.mdl-textfield__input,input.mdl-radio__button,input.mdl-checkbox__input').each(
						 			 function(index){
						 				 ngm=$(this).attr('ng-model')
										 if (ngm===undefined){
											 ngm=$(this).attr('modelAx')
										 }
											 s = ngm.split(".")
											 switch (s.length){
												 case 1:
												 $val= $scope[s[0]]
												 break;
												 case 2:
												 $val= $scope[s[0]][s[1]]
												 break;
												 case 3:
												 $val= $scope[s[0]][s[1]][s[2]]
												 break;
												 case 4:
												 $val= $scope[s[0]][s[1]][s[2]][s[3]]
												 break;
 										 	}


							 				 if ( $(this).attr('type')=="radio" && $val==$(this).attr('value') && document.getElementById($(this).attr('id')).parentNode.MaterialRadio!==undefined)
							 					 document.getElementById($(this).attr('id')).parentNode.MaterialRadio.check()
							 						 //$(this).parentNode.MaterialRadio.check()
							 					 if ($(this).attr('type')=="checkbox" && $val==$(this).attr('value') && document.getElementById($(this).attr('id')).parentNode.MaterialCheckbox!==undefined)
							 					  document.getElementById($(this).attr('id')).parentNode.MaterialCheckbox.check()
							 //                $(this).parentNode.MaterialCheckbox.check()



						 				 $(this).parent('div.mdl-textfield').addClass('is-dirty');
						 				 $(this).parent('div.mdl-textfield').removeClass('is-invalid');
						 			 }
						 		 );
								 if (! $scope.Contract.activity_country>0){
	 								$scope.Contract.activity_country=194;
	 							}

								 $scope.main.loader=false

						    }, 5);
	            });
		 $scope.showContractorList=function(){
       if ((typeof $scope.Contract.fullname !== "undefined" && $scope.Contract.fullname.length>4 && $scope.oldContrator!=$scope.Contract.fullname)){
        data={ "action":"ACCustomerList", name:$scope.Contract.fullname,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
         $http.post( SERVICEURL2,  data )
         .success(function(data) {
           if(data.RESPONSECODE=='1') 			{
             $scope.list=data.RESPONSE;
           }
		if (responceData.RESPONSECODE=='-1'){
		   localstorage('msg','Sessione Scaduta ');
		   $state.go('login');;;
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
        data={ "action":"ACCompanyList", name:$scope.Contract.name,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
         $http.post( SERVICEURL2,  data )
         .success(function(data) {
           if(data.RESPONSECODE=='1') 			{
             $scope.listCompany=data.RESPONSE;
           }
		if (data.RESPONSECODE=='-1'){
		   localstorage('msg','Sessione Scaduta ');
		   $state.go('login');;;
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
        data={ "action":"ACCustomerList", name:$scope.Contract.other_name,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
         $http.post( SERVICEURL2,  data )
         .success(function(data) {
           if(data.RESPONSECODE=='1') 			{
             $scope.listOther=data.RESPONSE;
           }
		if (data.RESPONSECODE=='-1'){
		   localstorage('msg','Sessione Scaduta ');
		   $state.go('login');;;
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

        data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
         $http.post( SERVICEURL2,  data )
         .success(function(data) {
           if(data.RESPONSECODE=='1') 			{
             //$word=$($search.currentTarget).attr('id');
             $scope.word[$search]=data.RESPONSE;
           }
		if (data.RESPONSECODE=='-1'){
		   localstorage('msg','Sessione Scaduta ');
		   $state.go('login');;;
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


    $scope.main.loader=true
   data={"action":"addcontract",appData:appData,dbData:dbData,aggKyc:$scope.aggKyc,edit:$scope.action,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post(SERVICEURL2,data)
    .success(function(data){
      $('#loader_img').hide();
      if(data.RESPONSECODE=='1')
      {
        $scope.contract=[]
        //swal("",data.RESPONSE);
        $lastid=data.lastid

        $scope.back()

      }
      else      {
		if (data.RESPONSECODE=='-1'){
		   localstorage('msg','Sessione Scaduta ');
		   $state.go('login');;;
		}
			$scope.main.loader=false

        swal("",data.RESPONSE);
      }
    })
    .error(function(){
			$('#loader_img').show();
      console.log('error');
    })
  }
  $scope.add_customer=function(){
		localstorage('Contract',JSON.stringify($scope.Contract))
		localstorage('add_customer',JSON.stringify({action:"add_customer_for_contract",location:$scope.curr_page}))
    $state.go('add_customer')

  }
  $scope.add_company=function(){
    localstorage('add_company',JSON.stringify({action:"add_company_for_contract",location:$scope.curr_page}))
    localstorage('Contract',JSON.stringify($scope.Contract))
    $state.go('add_company')

  }
  $scope.add_other=function(){
    localstorage('add_customer',JSON.stringify({action:"add_other_for_contract",location:$scope.curr_page}))
    localstorage('Contract',JSON.stringify($scope.Contract))
    $state.go('add_customer')

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
	data={action:'delete',table:'documents','primary':'id',id:Doc.id ,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post(SERVICEURL2,data)
    Doc.deleted=true;
  }

  $scope.uploadfromgallery=function(Doc,index)
  {
    Doc.index=index
    localstorage('Doc', JSON.stringify(Doc));
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
  $scope.add_photo=function(Doc, index)
  {
    Doc.index=index
    localstorage('Doc', JSON.stringify(Doc));
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
    $("#loader_img").show()
    $scope.Doc=JSON.parse(localStorage.getItem('Doc'))

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
    Doc=JSON.parse(localStorage.getItem('Doc'))
    var review_info   =JSON.parse(r.response);
    var id = review_info.id;
    $('#doc_image').val(review_info.response);
    // var review_selected_image  =  review_info.review_id;
    //$('#review_id_checkin').val(review_selected_image);
   data={ "action":"get_document_image_name_multi", id:id,DocId: $scope.Doc.id,agent_id:localStorage.getItem("agentId"),cookie:localStorage.getItem("cookie")}
    $http.post( SERVICEURL2,  data )
    .success(function(data) {
      if(data.RESPONSECODE=='1') 			{
        //$word=$($search.currentTarget).attr('id');
        $scope.Contract.Docs[Doc.index].doc_image=data.RESPONSE;
        $("#loader_img").hide()
      }
			if (data.RESPONSECODE=='-1'){
				 localstorage('msg','Sessione Scaduta ');
				 $state.go('login');;;
			}
    })
    .error(function() {
      $("#loader_img").hide()
      console.log("error");
    });
  }
  $scope.failFT =function (error)
  {
    $("#loader_img").hide()

  }


  $scope.add_document=function(Doc){
    if (Doc===undefined){
      Doc={}
    }
    localstorage('add_document',JSON.stringify({action:"add_document_for_contract",location:$scope.curr_page}))
    Doc.doc_name="Immagine Contratto"
    Doc.doc_type="Contratto di Servizio"
    Doc.agency_id=localStorage.getItem('agencyId')
    Doc.per='contract'
    if ($scope.Contract.contract_id===undefined && $scope.Contract.contract_id>0)
    Doc.per_id=$scope.Contract.contract_id;
    Doc.id=null
    Doc.image_name=null
    Doc.showOnlyImage=true
    Doc.indice=$scope.Contract.Docs.length

    localstorage('Doc',JSON.stringify(Doc))
    localstorage('Contract',JSON.stringify($scope.Contract))
    $state.go('add_document')
  }

  $scope.edit_doc=function(Doc,indice){
    localstorage('add_document',JSON.stringify({action:"edit_document_for_contract",location:$scope.curr_page}))
    Doc.indice=indice
    localstorage('Doc',JSON.stringify(Doc))
    $state.go('add_document')    }

    $scope.addWord=function($search,$word){
      res = $search.split(".")
      $scope[res[0]][res[1]]=$word
      $scope.word[res[1]]=[]
    }

		$scope.back=function(){
	    $state.go($scope.page.location)
	  }
		$scope.$on('backButton', function(e) {
	      $scope.back()
	  });

	  $scope.$on('addButton', function(e) {
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

  	})

  function onConfirm(buttonIndex,$scope,doc) {
    if (buttonIndex=1)
    $scope.deleteDoc(doc)
  }
