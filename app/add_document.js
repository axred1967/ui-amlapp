app2.controller('add_document', function ($scope,$http,$translate,$state,$timeout,AutoComplete,$stateParams,$rootScope) {
  $scope.loader=true
  /* gestiote parametri di stato */
	$scope.curr_page=$state.current.name
	$scope.pages=$stateParams.pages
	if ($scope.pages===null || $scope.pages===undefined){
		$scope.pages=IsJsonString(localStorage.getItem('pages'));
	}
	$scope.page=$scope.pages[$state.current.name]
  var currentState=$state.current.name

  $scope.main.Back=true
  $scope.main.Add=false
	$scope.main.AddPage="add_document"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $scope.Doc={}
  $scope.Docs=[]
  $scope.word={};

  //localstorage("back","view_contract");
  switch ($scope.page.action){

    case 'add_document_for_contract' :
    $scope.Doc=$scope.page.Doc
    //convertDateStringsToDates($scope.Doc)
    $scope.Doc.doc_date=new Date()
    $scope.action='add'
    $scope.loaded=false

    break;

    case 'add_document_for_customer' :
    $scope.Doc=$scope.page.Doc
    //convertDateStringsToDates($scope.Doc)
    $scope.Doc.doc_date=new Date()
    $scope.action='add'
    $scope.loaded=false

    break;
    case 'add_document_for_company' :
    $scope.Doc=$scope.page.Doc
    //convertDateStringsToDates($scope.Doc)
    $scope.Doc.doc_date=new Date()
    $scope.action='add'
    $scope.loaded=false
    break;

    case 'add_document_for_kyc' :
    $scope.Doc=$scope.page.Doc
    //convertDateStringsToDates($scope.Doc)
    $scope.Doc.doc_date=new Date()
    $scope.action='add'
    $scope.loaded=false
    break;


    default :
    $scope.Doc=$scope.page.Doc
    //convertDateStringsToDates($scope.Doc)
    $scope.loaded=true
    //$scope.Doc.doc_per='contract'
    $scope.action='edit'
    $scope.main.viewName="Modifica Documento"

  }
  $('input[type="date"]').each(function(){
   d=$(this).attr('ng-model')
   var res=d.split('.')
   if ($scope.Doc[res.slice(-1)[0]]!=undefined ){
     $scope.Doc[res.slice(-1)[0]]=new Date($scope.Doc[res.slice(-1)[0] ])

   }
    if ($scope.Doc[res.slice(-1)[0]]!=null ){
      $scope.Doc[res.slice(-1)[0]]=new Date()
    }


 })

$scope.loadItem=function(){
  dbData=$scope.Doc
  data={ "action":"documentList", dbData:dbData,pInfo:$scope.agent.pInfo}
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
  $scope.image_type=['.png','.gif','.png','.tif','.bmp','.jpg','.jpeg']
  $scope.Doc.isImage=true
  if($scope.image_type.indexOf($scope.Doc.file_type) === -1) {
    $scope.Doc.isImage=false
  }

  /*
  var fd = new FormData();
          fd.append('file', data);
          fd.append('file_name',$scope.f.name.name);
          fd.append('action',"upload_document_ax")
          fd.append('userid',$scope.Doc.per_id)
          fd.append('for',$scope.Doc.per)

  */
  $scope.uploadfileweb=function(e){
            f=e.files[0]
            r = new FileReader();
             $scope.f=f
         r.onloadend = function(e) {
             var data = e.target.result;
             f={}
             f.data=data
             f.name=$scope.f.name
             var extn = "." +f.name.split(".").pop();
             if ($scope.Doc.doc_name===undefined || $scope.Doc.doc_name.length==0)
              $scope.Doc.doc_name=baseName(f.name)
             filename=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
             //f.name=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
             $scope.Doc.loaded=false
             $scope.Doc.doc_image=filename
              $scope.Doc.IMAGEURI=UPLOADSURL +'document/'+$scope.Doc.per+'_'+$scope.Doc.per_id +'/resize/'
             $scope.Doc.file_type=extn;
             if($scope.image_type.indexOf($scope.Doc.file_type) === -1) {
               $scope.Doc.isImage=false
             }
             else {
               $scope.Doc.isImage=true

             }
             $scope.Docs.push($scope.Doc);
             data={action:"upload_document_ax",userid:$scope.Doc.per_id,for:$scope.Doc.per, indice:$scope.Doc.indice,f:f,filename:filename,pInfo:$scope.agent.pInfo}
             $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
             .then(function(data){

               $timeout(function() {
                 $scope.Doc.loaded=true
                 $rootScope.$broadcast('fileUploaded',data.data.response)

                 $("#msds").val('')
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
         };
         r.readAsDataURL(f);


  }
  $scope.uploadmfileweb=function(  e){
            files=e.files
            var nfile=files.length
            var $i=$scope.Docs.length;
            var image_type=['.png','.gif','.png','.tif','.bmp','.jpg','.jpeg']
            angular.forEach(files, function(value){
              var f = value
              r = new FileReader();
              var file=f
              r.onloadend = function(e) {
                var data = e.target.result;
                f={}
                f.data=data
                f.name=file.name
                var extn = "." +f.name.split(".").pop();
                filename=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn

                if ($scope.Docs[$i]===undefined){
                  $scope.Docs[$i]={}
                }
                if ($scope.Doc.doc_name!==undefined && $scope.Doc.doc_name.length>0 && $i==0){
                  $scope.Docs[$i].doc_name=$scope.Doc.doc_name;

                }else{
                  $scope.Docs[$i].doc_name=file.name;
                }
                $scope.Docs[$i].doc_type=$scope.Doc.doc_type
                $scope.Docs[$i].loaded=false
                $scope.Docs[$i].per=$scope.Doc.per
                $scope.Docs[$i].per_id=$scope.Doc.per_id
                $scope.Docs[$i].indice=$scope.Doc.indice+$i
                $scope.Docs[$i].doc_image=filename
                $scope.Docs[$i].file_type=extn;
                if(image_type.indexOf($scope.Docs[$i].file_type) === -1) {
                  $scope.Docs[$i].isImage=false
                }
                else {
                  $scope.Docs[$i].isImage=true
                }
                data={action:"upload_document_ax",userid:$scope.Doc.per_id,for:$scope.Doc.per, filename:filename,indice:$scope.Doc.indice+$i,f:f,pInfo:$scope.agent.pInfo}
                $i++;
                if ($i>=nfile)
                  $('#multiup').val('')

                $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
                .then(function(data){
                  if (data.data.RESPONSECODE=='1'){
                    $rootScope.$broadcast('fileUploaded',data.data.response);
                  }
                  if (data.data.RESPONSECODE=='-1'){
                    localstorage('msg','Sessione Scaduta ');
                    $state.go('login');;;
                  }
                  console.log('success');
                })
                , (function(){
                  console.log('error');
                });
              };
              r.readAsDataURL(f);
          })


  }

  $scope.imageurl=function(Doc){
    if (Doc===undefined || Doc.doc_image===undefined ||  Doc.doc_image== null || Doc.doc_image.length==0){
			imageurl= BASEURL+ 'img/customer-listing1.png'
			return imageurl
			}
			else if (Doc.isImage){
			imageurl= SERVICEDIRURL +"file_down.php?action=file&file=" + Doc.doc_image +"&resize=1&doc_per="+ Doc.per+ "&per_id=" +Doc.per_id + $scope.agent.pInfoUrl
		}
		else{
			imageurl= BASEURL+ '/img/'+ Doc.file_type.substr(1)+'.png'

		}
    if (!Doc.loaded)
      imageurl=BASEURL+ 'img/loading_image.gif'


    return   imageurl

  }



  $scope.showAC=function($search,$word, settings){
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
      $('#'+par.id).parent('div.mdl-textfield').addClass('ng-touched');
      $('#'+par.id).parent('div.mdl-textfield').removeClass('is-invalid');

    }

    if (par.countries){
      $scope.word['countries']=[]
    }
  }
  $scope.deleteDoc=function()
  {
    $scope.Doc.doc_image=""
  }
  $scope.deleteDocs=function(Doc,index)
  {
    if (Doc.per_id==$scope.pages.currentObId){
      data={action:'delete',table:'tmp_image','primary':'imagename',id:Doc.doc_image,pInfo:$scope.agent.pInfo}
      $http.post(SERVICEURL2,data)
      .then(function(responceData)  {
        $scope.Docs.splice(index,1)
        console.log(responceData);
      })
      , (function(error) {
        console.log("error");
      })

    }
    else {
      $scope.Docs.splice(index,1)

    }

  }

  $scope.uploadfromgallery=function()
  {
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
    //mi sono rotto leggo il file e poi lo passo ...altrimenti non controllo nulla
    window.resolveLocalFileSystemURI(imageURI, $scope.gotFileEntry, $scope.fail);
  }
$scope.gotFileEntry= function(fileEntry) {
  //metodo per leggere il file
     // alert(fileEntry.fullPath);
      console.log("got image file entry: " +  fileEntry.fullPath);
  //convert all file to base64 formats
      fileEntry.file( function(file) {
  //uncomment the code if you need to check image size
         //if(file.size>(1049576/2))
        // {
             //alert('File size exceeds 500kb');
            // return false;
        // }
          var reader = new FileReader();
          reader.onloadend = function(e) {
            var data = e.target.result;
            f={}
            f.data=data
            spedat=data.split(',')
            data1=spedat[1]
            f.name=file.name
            /*
            var extn
            if(data1.charAt(0)=='/'){
              extn=".jpeg";
            }else if(data1.charAt(0)=='R'){
              extn=".gif";
            }else if(data1.charAt(0)=='i'){
              extn=".png";
            }
            */
            var extn
            var ext=spedat[0].split('/')
            spedat=''
            ext=ext[1].split(';')
            extn='.' + ext[0]

            var filename=baseName(f.name).substr(0,20) + Math.random().toString(36).slice(-16) + extn
            f.name=filename
            $scope.$apply(function () {

              $scope.Doc.file_type=extn
              if($scope.image_type.indexOf($scope.Doc.file_type) === -1) {
                $scope.Doc.isImage=false
              }
              else {
                $scope.Doc.isImage=true

              }
              $scope.Doc.loaded=false
              $scope.Doc.per=$scope.Doc.per
              $scope.Doc.per_id=$scope.Doc.per_id
              $scope.Doc.indice=$scope.Doc.indice
              $scope.Doc.doc_image=filename
              $scope.Doc.isImage=true
            })
            $scope.Docs.push($scope.Doc);
            data={action:"upload_document_ax",userid:$scope.Doc.per_id,for:$scope.Doc.per, filename:filename,indice:$scope.Doc.indice,f:f,pInfo:$scope.agent.pInfo}

            $http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
            .then(function(data){
              if (data.data.RESPONSECODE=='1'){
                $rootScope.$broadcast('fileUploaded',data.data.response);
              }
              if (data.data.RESPONSECODE=='-1'){
                localstorage('msg','Sessione Scaduta ');
                $state.go('login');;;
              }
              console.log('success');
            })
            , (function(){
              console.log('error');
            });
          };
          reader.readAsDataURL(file);

        })



  }
  $scope.win=function (r)
  {
    var  r=IsJsonString(r.response)

    $scope.$apply(function () {
      $timeout(function() {
        $scope.Doc.loaded=true
        if ($state.current.name!=currentState)
          $state.go($state.current, {} , {reload: true, inherit: false});              }
        ,200)
    });
  }
  $scope.fail =function (error)
  {
    $scope.Docs.doc_image=$scope.prev_image
    $scope.main.loader=false

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
    dbData=angular.extend({},$scope.Doc)
    if ($scope.page.action=="add_document_for_kyc" || $scope.page.action=="edit_document_for_kyc" || $scope.page.action=="add_document_for_kyc_owner" || $scope.page.action=="edit_document_for_kyc_owner"){
      if ($scope.Docs.length>0){
        $scope.pages[$scope.page.location].newOb=[]
  			$scope.pages[$scope.page.location].newOb=$scope.Docs
  			$scope.pages[$scope.page.location].indice=$scope.page.indice
        $scope.pages[$scope.page.location].edit=$scope.page.edit

      }else {
        $scope.pages[$scope.page.location].newOb={}
  			$scope.pages[$scope.page.location].newOb=dbData
  			$scope.pages[$scope.page.location].edit=$scope.page.edit
  			$scope.pages[$scope.page.location].indice=$scope.page.indice

      }
			$scope.back()
	    return;
		}


    var langfileloginchk = localStorage.getItem("language");
    data={"action":"savedocument",type:$scope.action, dbData:dbData,pInfo:{user_id:$scope.agent.user_id,agent_id:$scope.agent.id,agency_id:$scope.agent.agency_id,user_type:$scope.agent.user_type,priviledge:$scope.agent.priviledge,cookie:$scope.agent.cookie}}
    $http.post(SERVICEURL2,data)
    .then(function(data){
      $('#loader_img').hide();
      if(data.data.RESPONSECODE=='1')
      {
        //$scope.Doc=data
        //swal("",data.data.RESPONSE);
        if (data.lastid !==undefined && data.lastid>0)
        $scope.lastid=data.lastid
        $scope.back()
      }
      else      {
        if (data.data.RESPONSECODE=='-1'){
           localstorage('msg','Sessione Scaduta ');
           $state.go('login');;;
        }
        swal("",data.data.RESPONSE);
      }
    })
    , (function(){
      console.log('error');
    })
  }

  $scope.download = function(Doc) {
    if (Doc.doc_image!==undefined &&  Doc.doc_image.length>0){
    url=SERVICEDIRURL +"file_down.php?action=file&file=" + Doc.doc_image +"&doc_per="+Doc.per+"&per_id="+Doc.per_id+"&isImage="+Doc.isImage+$scope.agent.pInfoUrl
		if (Doc.isImage) {
			url=SERVICEDIRURL +"file_down.php?action=file&resize=m&file=" + Doc.doc_image +"&doc_per="+Doc.per+"&per_id="+Doc.per_id+$scope.agent.pInfoUrl
			dialog.showModal();
			$timeout(function(){
				init_canvas_image('DocCanvas',url,Doc)

			},500)
		}
		else{
			if ($scope.main.web){
				var anchor = angular.element('<a/>');
				angular.element(document.body).append(anchor);
				var ev = document.createEvent("MouseEvents");
				ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
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
							cordova.file.externalApplicationStorageDirectory+'download/MyDoc'+ Doc.image_type, extToMime(Doc.file_type.substr(1)));

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
   }

  $scope.back=function(){
    switch ($scope.page.action){


    }
    localstorage('pages',JSON.stringify($scope.pages))
    $state.go($scope.page.location,{pages:$scope.pages})
    }
    $scope.preUploaded=function(Docs) {
            $scope.Docs=Docs;

    };
    $scope.uploadedMFile=function(Doc) {
            $rootScope.$broadcast('fileUploaded',Doc);
    };
    $scope.loadCanvas=function(CanvasId) {
        init_canvas_image(CanvasId,$scope.imageurl($scope.Doc))
    };


    $scope.$on('fileUploaded', function(e,filename) {
      if ($scope.Docs!==undefined && $scope.Docs.length>0){
        angular.forEach($scope.Docs, function(doc,key){
          if (filename==$scope.Docs[key].doc_image){
            $scope.Docs[key].loaded=true

          }

        })
      }
      if ($scope.Doc!==undefined && filename== $scope.Doc.doc_image){
        $scope.$apply(function(){

          $scope.Doc.loaded=true

        })
      }

    });

  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {

  })
  $scope.$on('updateImageDialog', function(e,args) {
		  indice=args.doc.indice

			if (args.doc.changed){
        if  ($scope.page.edit){
          $scope.Doc.loaded=false
  				$scope.Doc.image_type='.png';
  				$scope.Doc.doc_image=baseName($scope.Doc.doc_name)+ Math.random().toString(36).slice(-16)+'.png'
  				var f={}
  				f.name=$scope.Doc.doc_image
  				filename=f.name
  				f.data=canvasDoc.toDataURL()
  				data={action:"upload_document_ax",userid:$scope.Doc.per_id,for:$scope.Doc.per, indice:indice,f:f,filename:filename,pInfo:$scope.agent.pInfo}
        }
        else {
          $scope.Docs['indice'].loaded=false
  				$scope.Docs[indice].image_type='.png';
  				$scope.Docs[indice].doc_image=baseName($scope.Docs[indice].doc_name)+ Math.random().toString(36).slice(-16)+'.png'
  				var f={}
  				f.name=$scope.Docs[indice].doc_image
  				filename=f.name
  				f.data=canvasDoc.toDataURL()
  				data={action:"upload_document_ax",userid:$scope.Docs[indice].per_id,for:$scope.Docs[indice].per, indice:indice,f:f,filename:filename,pInfo:$scope.agent.pInfo}

        }
				$http.post(SERVICEURL2,data,{ headers: {'Content-Type': undefined}  })
				.then(function(data){
					$timeout(function() {

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
				$scope.Docs[indice].rotate=args.gradi


			}


  })

  $scope.loader=false
  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               setDefaults($scope)
               $('.mdl-layout__drawer-button').hide()
               $scope.main.loader=false
            }, 200);
  });
})
