app2.controller('kyc_document', function ($scope,$http,$state,$translate,$timeout,$stateParams,$interval,$rootScope,$filter) {
  //gestisco lo state parameter
	  $scope.curr_page=$state.current.name
	  $scope.pages=$stateParams.pages
		if ($scope.pages===null || $scope.pages===undefined){
			$scope.pages=JSON.parse(localStorage.getItem('pages'));
		}
		$scope.page=$scope.pages[$state.current.name]
    $scope.back=function(passo){
      if (passo>0){
        $scope.pages['kyc_signature' ]={action:'',location:$scope.page.location,prev_page:$state.current.name,agg:$scope.page.agg}
        localstorage('pages', JSON.stringify($scope.pages));
        $state.go('kyc_signature' ,{pages:$scope.pages})
        return;
      }
      if (passo==-1){
         $state.go($scope.page.prev_page)
         return;
      }
      $state.go($scope.page.location)
    }

  $scope.main.Back=true
  $scope.main.Add=true
	$scope.main.AddPage="add_documents"
	$scope.main.AddLabel="Nuovo Documento"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $scope.main.loader=true
  $scope.deleted=0
	$scope.Kyc={}


	$scope.imageurl=function(Doc){

    if (Doc===undefined || Doc.doc_image===undefined ||  Doc.doc_image== null || Doc.doc_image.length==0){
			imageurl= BASEURL + 'img/customer-listing1.png'
			return imageurl
			}
			else if (Doc.isImage){
			imageurl= SERVICEDIRURL +"file_down.php?file=" + Doc.doc_image +"&resize=1&doc_per="+ Doc.per+ "&per_id=" +Doc.per_id + $scope.agent.pInfoUrl

		}
		else{
			imageurl= BASEURL+'img/'+ Doc.file_type.substr(1)+'.png'

		}
		if (!Doc.loaded){
			imageurl=BASEURL+'/img/loading_image.gif'

		}
		if (Doc.downloading){
			imageurl=BASEURL+'/img/downloading.gif'

		}




    //  Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   imageurl

  }



	$scope.loadItem=function(){
    appData=$scope.Contract
    data={"action":"kycAx",appData:appData,agg:$scope.page.agg,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post( SERVICEURL2,  data )
    .then(function(responceData) {
      $('#loader_img').hide();
      if(responceData.data.RESPONSECODE=='1') 			{
        var data=responceData.data.RESPONSE;
				$('input[type="date"]').each(function(){
				 d=$(this).attr('ng-model')
				 res=d.split('.')
				 data[res.slice(-1)[0]]=new Date(data[res.slice(-1)[0] ])
			 })


        $scope.Kyc=data;
				$scope.Kyc.Docs=IsJsonString($scope.Kyc.Docs,true)
				settings={table:'kyc',id:'id',
									fields :{
										'uno.Docs':'Docs',
										'j1.CPU' :'CPU'
									},
									where: {
										'uno.id': {'opcond':'<>',valore:$scope.Kyc.id},
										'j1.contractor_id': {valore:$scope.Contract.contractor_id},
										'CHAR_LENGTH(uno.Docs)':{'opcond':'>', valore:20}
									},
									join:{
								    'j1':{'table':'contract',
								          'condition':'uno.contract_id=j1.id '
								        }

									},
									limit:1,
									order:{'uno.id':'desc'}
								}
				data= {"action":"ListObjs",settings:settings,pInfo:$scope.agent.pInfo}
				$http.post(SERVICEURL2,  data )
				.then(function(responceData)  {
					if(responceData.data.RESPONSECODE=='1') 			{
						data=responceData.data.RESPONSE
						$scope.precAVDocs=IsJsonString(data[0].Docs);
						angular.forEach($scope.precAVDocs, function(doc,key){
							 var prec=""
								if ($scope.precAVDocs[key].doc_name!==undefined){
									prec=$scope.precAVDocs[key].doc_name
								}
								$scope.precAVDocs[key].doc_name= prec+ " - importato da CPU" + data[0].cpu
						})
					}
					else   {
						if (responceData.data.RESPONSECODE=='-1'){
							localstorage('msg','Sessione Scaduta ');
							$state.go('login');;;
						}
					}})
					, (function() {
						console.log("error");
					});


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
		if ($scope.pages[$scope.page.location]!==undefined)
		$scope.Contract=$scope.pages[$scope.page.location].Contract
		if ($scope.Contract===undefined){
			$scope.Contract=$scope.page.Contract

		}
		$scope.action="saveKyc"
	  $scope.main.viewName="Documenti AV"
  }

	$scope.saveDocs= function (passo){
		dbData={}
		dbData.Docs=JSON.stringify($scope.Kyc.Docs )

   data={ "action":"saveKycAx", appData:$scope.Contract,agg:$scope.page.agg,dbData:dbData,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
      if(data.data.RESPONSECODE=='1') 			{
        //swal("",data.data.RESPONSE);
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
      console.log("error");
    });


  }
	if (isObject($scope.page.newOb)){
		$scope.Kyc.Docs=$scope.page.Docs

		if ($scope.page.edit){
			if (Array.isArray($scope.page.newOb)){
				angular.forEach($scope.page.newOb, function(value,key){
					 $scope.Kyc.Docs[value.indice]=value
				})


			}	else {
				$scope.Kyc.Docs[$scope.page.indice]=$scope.page.newOb
			}
		}
		else{
			if (Array.isArray($scope.page.newOb)){
				angular.forEach($scope.page.newOb, function(value){
					 $scope.Kyc.Docs.push(value);
				})


			}	else {
				$scope.Kyc.Docs[$scope.Kyc.Docs.length]=$scope.page.newOb
			}
		}
		$scope.page.newOb=1
		$scope.saveDocs()
		$scope.pages[$state.current.name].newOb=1
		localstorage('pages',JSON.stringify($scope.pages))
	}
	else{
			$scope.loadItem()
	}
  $scope.fillKycData=function(){
		swal({
			title: $filter('translate')("Sei Sicuro?"),
			text: $filter('translate')("Saranno Caricati i documenti allegati all'ultima AV sul Soggetto"),
			icon: "warning",
			buttons: {
			'procedi':{text:$filter('translate')('Procedi'),value:true},
			'annulla':{text:$filter('translate')('Annulla'),value:false},

			},

		})
		.then((Value) => {
			if (Value) {
				if (Array.isArray($scope.precAVDocs)){
					angular.forEach($scope.precAVDocs, function(value){
						 $scope.Kyc.Docs.push(value);
					})
				}
				$scope.saveDocs()


				swal($filter('translate')('importazione effettuata'), {
					icon: "success",
				});
			} else {
				swal($filter('translate')('importazione Annulata'));
			}
	  })
	}
  $scope.deleteDoc=function(ob,index ){
	swal({
		title: $filter('translate')("Sei Sicuro?"),
		text: $filter('translate')("la Cancelazione del documento sarà non reversibile"),
		icon: "warning",
		buttons: {
		'procedi':{text:$filter('translate')('Procedi'),value:true},
		'annulla':{text:$filter('translate')('Annulla'),value:false},

		},

	})
	.then((Value) => {
		if (Value) {
			if (ob.per_id==$scope.pages.currentObId){
				data={action:'delete',table:'tmp_image','primary':'imagename',id:ob.doc_image,pInfo:$scope.agent.pInfo}
				$http.post(SERVICEURL2,data)
		    .then(function(responceData)  {
					$scope.Kyc['Docs'].splice(index,1)
					$scope.saveDocs()
		      console.log(responceData);
		    })
		    , (function(error) {
		      console.log("error");
		    })

			}
			else {
				$scope.Kyc['Docs'].splice(index,1)
				$scope.saveDocs()

			}
			swal($filter('translate')('Cancellazione effettuata'), {
				icon: "success",
			});
		} else {
			swal($filter('translate')('Cancellazione Annulata'));
		}
  })
}




  $scope.save_kyc= function (passo){
		dbData={}
		dbData.Docs=JSON.stringify($scope.Kyc.Docs )
    $scope.main.loader=true;

   data={ "action":"saveKycAx", appData:$scope.Contract,dbData:dbData,pInfo:$scope.agent.pInfo}
    $http.post( SERVICEURL2,  data )
    .then(function(data) {
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
      console.log("error");
    });


  }


  $scope.showAC=function($search,$word){
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

    if (( $word  !== "undefined" && $word.length>3 &&  $word!=$scope.oldWord)){

     data={ "action":"ACWord", id:id,usertype:usertype,  word:res[1] ,search:$word ,table:$table,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
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
  $scope.addWord=function($search,$word){
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
  }
	$scope.download = function(Doc,indice) {
		url=SERVICEDIRURL +"file_down.php?file=" + Doc.doc_image +"&doc_per="+Doc.per+"&per_id="+Doc.per_id+"&isImage="+Doc.isImage+$scope.agent.pInfoUrl
		if (Doc.isImage){
			url=SERVICEDIRURL +"file_down.php?resize=m&file=" + Doc.doc_image +"&doc_per="+Doc.per+"&per_id="+Doc.per_id+"&isImage="+Doc.isImage+$scope.agent.pInfoUrl
			dialog.showModal();
			$timeout(function(){
				init_canvas_image('DocCanvas',url, Doc)

			},500)
		}
		else{
			if ($scope.main.web){
				var anchor = angular.element('<a/>');
				angular.element(document.body).append(anchor);
				var ev = document.createEvent("MouseEvents");
				ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				$scope.Kyc.Docs[indice].downloading=false
				anchor.attr({
					href: url,
					target: '_blank',
					download: Doc.doc_image
				})[0].dispatchEvent(ev);

			}

			else {
				var fileTransfer = new FileTransfer();
				//		var uri = encodeURI(url);
				var uri = url;

				fileTransfer.download(
					uri,
					cordova.file.externalApplicationStorageDirectory+'download/doc'+ Doc.file_type,
					function(entry) {
						cordova.plugins.SitewaertsDocumentViewer.viewDocument(
							cordova.file.externalApplicationStorageDirectory+'download/MyPdf.pdf', extToMime(Doc.file_type.substr(1)));

							console.log("download complete: " + entry.fullPath);
						},
						function(error) {
							console.log("download error source " + error.source);
							console.log("download error target " + error.target);
							console.log("upload error code" + error.code);
						}
					);

				}
			}
		}

  $scope.add_document=function(){
		$scope.pages['add_document']={action:'add_document_for_kyc',location:$state.current.name,
		Doc:{agency_id:$scope.agent.agency_id,per_id:$scope.pages.currentObId,per:$scope.pages.currentOb,edit:false, indice:$scope.Kyc.Docs.length}}
		$scope.pages[$state.current.name].Docs=$scope.Kyc.Docs
		localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_document',{pages:$scope.pages})


  }
  $scope.edit_document=function(doc,indice){

		$scope.edit_documentb(doc,indice)
	}
  $scope.edit_documentb=function(doc,indice){
		$scope.pages['add_document']={action:'edit_document_for_kyc', location:$state.current.name,Doc:doc, edit:true,indice:indice}
		$scope.pages[$state.current.name].Docs=$scope.Kyc.Docs
  	localstorage('pages',JSON.stringify($scope.pages))
		$state.go('add_document',{pages:$scope.pages})


  }
	$scope.$on('fileUploaded', function(e,filename) {
		if ($scope.Kyc.Docs!==undefined && $scope.Kyc.Docs.length>0){
			angular.forEach($scope.Kyc.Docs, function(doc,key){
				if (filename==$scope.Kyc.Docs[key].doc_image){
					$scope.Kyc.Docs[key].loaded=true
				}

			})
		}

	});

  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
    $scope.add_document()
  })

	$scope.$on('updateImageDialog', function(e,args) {
		  indice=args.doc.indice

			if (args.doc.changed){
				$scope.Kyc.Docs[indice].loaded=false
				$scope.Kyc.Docs[indice].image_type='.png';
				$scope.Kyc.Docs[indice].doc_image=baseName($scope.Kyc.Docs[indice].doc_name)+ Math.random().toString(36).slice(-16)+'.png'
				var f={}
				f.name=$scope.Kyc.Docs[indice].doc_image
				filename=f.name

				f.data=canvasDoc.toDataURL()
				data={action:"upload_document_ax",userid:$scope.Kyc.Docs[indice].per_id,for:$scope.Kyc.Docs[indice].per, indice:indice,f:f,filename:filename,pInfo:$scope.agent.pInfo}
				$http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
				.then(function(data){
					$timeout(function() {
						$scope.Kyc.Docs[indice].loaded=true
						$scope.saveDocs()
						$rootScope.$broadcast('fileUploaded',data.data.response)
						}
						,200)
					if (data.data.RESPONSECODE=='-1'){
						 localstorage('msg','Sessione Scaduta ');
						 $state.go('login');;;
					}
						console.log('success');
				})
				, (function(){
						console.log('error');
				});

			}
			else {
				$scope.Kyc.Docs[indice].rotate=args.gradi
				$scope.saveDocs()

			}


  })


  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
							 	setDefaults($scope)
								 $('.mdl-layout__drawer-button').hide()
               $scope.main.loader=false
            }, 200);
  });

});
