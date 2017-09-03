app2.controller('kyc_company', function ($scope,$http,$state,$translate,$timeout,AutoComplete,$stateParams,$interval) {
  //gestisco lo state parameter
	  $scope.curr_page=$state.current.name
	  $scope.pages=$stateParams.pages
		if ($scope.pages===null || $scope.pages===undefined){
			$scope.pages=JSON.parse(localStorage.getItem('pages'));
		}
		$scope.page=$scope.pages[$state.current.name]
    $scope.back=function(passo){
      if (passo>0){
        $scope.pages['kyc_owners' ]={action:'',location:$scope.page.location,prev_page:$state.current.name}
        localstorage('pages', JSON.stringify($scope.pages));
        $state.go('kyc_owners' ,{pages:$scope.pages})
        return;
      }
      if (passo==-1){
         $state.go($scope.page.prev_page)
         return;
      }
      $state.go($scope.page.location)
    }

  $scope.main.Back=true
  $scope.main.Add=false
//		$scope.main.AddPage="add_contract"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Nuova Società"
  $scope.main.loader=true
 $scope.Company={}
  $scope.loadItem=function(){
    $scope.Contract=$scope.pages[$scope.page.location].Contract
    appData=$scope.Contract
    data={"action":"kycAx",appData:appData,country:true,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      $('#loader_img').hide();
      if(responceData.data.RESPONSECODE=='1') 			{
        var data=responceData.data.RESPONSE;
				//getione date


        $scope.Kyc=data;
				$scope.Kyc.company_data=IsJsonString($scope.Kyc.company_data)
				$scope.Company=angular.extend({},$scope.Kyc.company_data);
				if ($scope.Company.name===undefined || $scope.Company.name===null || $scope.Company.name==null){

				settings={table:'company',id:'company_id',
									fields:{'name':'uno.name',
									'company_type':'uno.company_type',
									'address':'uno.address',
									'country':'uno.country',
									'town':'uno.town'
									},
									where:{company_id:{valore:$scope.Contract.other_id}}
									}
				data= {"action":"ListObjs",settings:settings,pInfo:$scope.agent.pInfo}
				$http.post(SERVICEURL2,  data )
				.then(function(responceData)  {
					if(responceData.data.RESPONSECODE=='1') 			{
						data=responceData.data.RESPONSE
						$scope.Company.name=data[0].name
						$scope.Company.address=data[0].address
						$scope.Company.country=data[0].country
						$scope.Company.town=data[0].town
						$scope.Company.company_type=data[0].company_type
					}
					else   {
						if (responceData.data.RESPONSECODE=='-1'){
							localstorage('msg','Sessione Scaduta ');
							$state.go('login');;;
						}
					}})
				}
      }
      else
      {
        if (responceData.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        console.log('error');
      }
    })
    , (function() {
      console.log("error");
    });

  }
  switch ($scope.page.action){
    default:
    $scope.action="saveKyc"
    $scope.main.viewName="Dati Persona Giuridica"
  }

  $scope.loadItem()
	$scope.loadCompany=function(){
		ob={}
		ob.settings={}
		ob.settings.table="company"
		ob.settings.id="company_id"
		ob.settings.where={'company_id':{opcond:'=',valore:$scope.Contract.other_id}}
    data={"action":"ListObjs",settings:ob.settings,pInfo:$scope.agent.pInfo}
    $scope.main.loader=true
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        $scope.Company=  data[0];
				$scope.main.loader=false
        //convertDateStringsToDates($scope.Customer)
        $('input.mdl-textfield__input').each(
          function(index){
            $(this).parent('div.mdl-textfield').addClass('is-dirty');
            $(this).parent('div.mdl-textfield').removeClass('is-invalid');
          }
        );
      }
      else
      {
        if (responceData.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
				$scope.main.loader=false
        console.log('error');
      }
    })
    , (function() {
      console.log("error");
			$scope.main.loader=false
    });

  }

  $scope.save_kyc= function (passo){
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
    var langfileloginchk = localStorage.getItem("language");
		dbData={}
		dbData.company_data=JSON.stringify(angular.extend({},$scope.Kyc_company_data,$scope.Company))

    $scope.main.loader=true
   data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      $scope.main.loader=false
      if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
        $scope.lastid=data.lastid

        $scope.back(passo)

      }
      else
      {
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        console.log('error');
        swal("",data.data.RESPONSE);
      }
    })
    , (function() {
      $scope.main.loader=true
      console.log("error");
    });


  }


	$scope.showAC=function($search,$word, settings){
		if (settings.ob !==undefined && settings.ob.settings!==undefined){
			settings.ob.settings.where={
				'name':{ 'valore' :$('#'+$word).val(), 'opcond': 'like', 'pre':'%','post':'%' },
			}
		}
		settings.pInfo=$scope.agent.pInfo
		AutoComplete.showAC($search,$word, settings)
		.then(function(data) {
			if(data.data.RESPONSECODE=='1') 			{
				//$word=$($search.currentTarget).attr('id');
				$search=res[1]
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
	$scope.resetAC=function(){
		$scope.word={}
		$scope.list={}
		$scope.listOther={}
		$scope.listCompany={}


	}
	$scope.addWord=function($search,$word,par){
		angular.forEach(par.other,function(obj,key){
					res=par.other[key].d.split('.')
					switch(res.length){
						case 2:
						$scope[res[0]][res[1]]=par.other[key].s
						break;
						case 3:
						$scope[res[0]][res[1]][res[2]]=par.other[key].s
						break;
					}
		});
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
		if (par.res!==undefined){
			$scope.word[par.res]=[]

		}

		if (par.id!==undefined){
			$timeout(function() {
				$('#'+par.id).parent('div.mdl-textfield').addClass('is-dirty');
				$('#'+par.id).parent('div.mdl-textfield').removeClass('is-invalid');
			},10)
		}

		if (par.countries){
			$scope.word['countries']=[]
		}
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
     data={ "action":"get_document_image_name_multi", id:id,DocId: $scope.Doc.id,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
      $http.post( SERVICEURL2,  data )
          .then(function(data) {
                    if(data.data.RESPONSECODE=='1') 			{
                      //$word=$($search.currentTarget).attr('id');
                      $scope.Cotnract.Docs[Doc.index].doc_image=data.data.RESPONSE;
                      $("#loader_img").hide()
                    }
                    if (data.data.RESPONSECODE=='-1'){
                       localstorage('msg','Sessione Scaduta ');
                       $state.go('login');;;
                    }
           })
          , (function() {
            $("#loader_img").hide()
             console.log("error");
           });
  }
  $scope.failFT =function (error)
  {
    $("#loader_img").hide()

  }


   $scope.$on('backButton', function(e) {
       $scope.back()
   });

   $scope.$on('addButton', function(e) {
   })
   $scope.$on('$viewContentLoaded',
            function(event){
              $timeout(function() {
  							setDefaults($scope)
                $scope.main.loader=false
             }, 200);
   });

})
