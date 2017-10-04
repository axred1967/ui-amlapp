app2.factory('Docs_inf', function($http,$state) {
  var Docs_inf = function() {
    this.Docs = [];
    this.busy = false;
    this.after = '';
    this.loaded=0;
    this.CompanyId=-1
    this.user_id=-1
    this.Contract={}
    this.Docload={}
    this.pInfo={}
  };

  Docs_inf.prototype.nextPage = function(agent) {
    if (this.busy || this.loaded==-1) return;
    this.busy = true;
    last=99999999999
    if ( this.Docs!==undefined && this.Docs.length>0){
      lastkey= Object.keys(this.Docs).pop() ;
      last=this.Docs[lastkey].id;
    }
   dbData=this.Docload
   data={ "action":"documentList", dbData:dbData,last:last,pInfo:this.pInfo}
    $http.post(SERVICEURL2,  data )
    .then(function(responceData)  {
      $('#loader_img').hide();
      if(responceData.data.RESPONSECODE=='1') 			{
        data=responceData.data.RESPONSE;
        angular.forEach(data,function(value,key) {
          image_type=['.png','.gif','.png','.tif','.bmp','.jpg']
          data[key].IMAGEURI=UPLOADSURL +'document/'+data[key].per+'_'+data[key].per_id +'/resize/'
          data[key]['isImage']=false
          if(image_type.indexOf(data[key]['file_type']) !== -1) {
            data[key]['isImage']=true
          }

        })
        this.loaded=data.length
        if (last==99999999999)
        this.Docs=data;
        else
        this.Docs=this.Docs.concat(data);
        this.busy = false;
        if (data.length<5){
          this.loaded=-1
        }

      }

      else   {
        if (responceData.data.RESPONSECODE=='-1'){
          localstorage('msg','Sessione Scaduta ');
          $state.go('login');;;
        }
        this.busy = false;
        this.loaded=-1
        console.log('no docs')
      }
    }.bind(this))
    , (function() {
      this.busy = false;
      this.loaded=-1
      console.log("error");
    })


  }
  return Docs_inf;

});

app2.controller('my_document', function ($scope,$http,$translate, $state, Docs_inf,$timeout,$stateParams) {
  //gestisco lo state parameter
    $scope.curr_page=$state.current.name
    $scope.pages=$stateParams.pages
  	if ($scope.pages===null || $scope.pages===undefined){
  		$scope.pages=JSON.parse(localStorage.getItem('pages'));
  	}
  	$scope.page=$scope.pages[$state.current.name]

  $scope.loader=true
  $scope.main.Back=true
  $scope.main.Add=true
	$scope.main.AddPage="add_document"
  $scope.main.AddLabel="nuovo documento"
  $scope.main.Search=false
  $scope.main.Sidebar=false
  $scope.deleted=0
  $('.mdl-layout__drawer-button').hide()
  $scope.main.viewName="Documenti"

  $scope.loader=true

  $scope.Docload={}
  switch ($scope.page.action){
    case 'list_from_view_contract' :
    $scope.Contract=$scope.page.Contract
    //convertDateStringsToDates($scope.Contract)
    $scope.DocFor="CPU Contratto: " + $scope.Contract.CPU
    $scope.main.viewName="Documenti Contratto"
    $scope.Docload.per_id=$scope.Contract.contract_id
    $scope.Docload.per="contract"


    break;
    case 'list_from_my_company' :
    $scope.Company=$scope.page.Company
    //convertDateStringsToDates($scope.Company)
    $scope.DocFor=$scope.Company.name;
    $scope.Docload.per_id=$scope.Company.company_id
    $scope.Docload.per="company"
    $scope.main.viewName="Documenti Società"
    $scope.main.action="add_document_for_company"


    break;
    case 'list_from_my_customer' :
    $scope.Customer=$scope.page.Customer
    //convertDateStringsToDates($scope.Customer)
    $scope.DocFor=$scope.Customer.fullname;
    $scope.main.viewName="Documenti persona"
    $scope.Docload.per_id=$scope.Customer.user_id
    $scope.Docload.per="customer"
    $scope.main.action="add_document_for_customer"


    break;
    default :
    $scope.viewName="Documenti"
    break;
  }

/*  if ($scope.page.editDoc) {
    $scope.Docs_inf.Docs=JSON.parse(localStorage.getItem('Docs'))
    //convertDateStringsToDates($scope.Docs_inf.Docs)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    //convertDateStringsToDates(Doc)
    $scope.Docs_inf.Docs[Doc.indice]=Doc
//    $scope.Kyc.contractor_data.Docs[Doc.indice]=Doc

  }

  else if ($scope.page.addDoc){
    $scope.Docs_inf.Docs=JSON.parse(localStorage.getItem('Docs'))
    //convertDateStringsToDates($scope.Docs_inf.Docs)
    Doc=JSON.parse(localStorage.getItem('Doc'))
    //convertDateStringsToDates(Doc)

    if ($scope.Docs_inf.Docs.length!==undefined|| $scope.Docs_inf.Docs.length>0 ){
        $scope.Docs_inf.Docs[Doc.indice]=Doc

    //  $scope.Docs[$scope.Kyc.contractor_data.Docs.length]=Doc
    }
    else {
      $scope.Docs_inf.Docs[Doc.indice]=Doc

      //$scope.Kyc.contractor_data.Docs={}
      //$scope.Kyc.contractor_data.Docs[0]=Doc
    }

  }

  else {
*/
    $scope.Docs_inf=new Docs_inf
    $scope.Docs_inf.pInfo=$scope.agent.pInfo
    $scope.Docs_inf.Docload=$scope.Docload
/*
  }
*/

  $scope.imageurl=function(Doc){

    if (Doc===undefined || Doc.doc_image===undefined ||  Doc.doc_image== null || Doc.doc_image.length==0)
      imageurl= BASEURL + 'img/customer-listing1.png'
    else
      imageurl= SERVICEDIRURL +"file_down.php?action=file&file=" + Doc.doc_image +"&resize=1&doc_per="+ Doc.per+ "&per_id=" +Doc.per_id + $scope.agent.pInfoUrl

    //  Customer.imageurl= Customer.IMAGEURI +Customer.image
    return   imageurl

  }
  $scope.deleteDoc=function(Doc,index )
  {
    if ($scope.main.web){
      r=confirm("Vuoi Cancellare il documento?");
      if (r == true) {
        $scope.deleteDoc2(Doc,index);
      }
    }
    else{
      navigator.notification.confirm(
        'Vuoi cancellare il Documento!', // message
        function(button) {
          if ( button == 1 ) {
            $scope.deleteDoc2(Doc,index);
          }
        },            // callback to invoke with index of button pressed
        'Sei sicuro?',           // title
        ['Si','No']     // buttonLabels
      );
    }

  }
  $scope.deleteDoc2=function(Doc,index){
    data={action:'delete',table:'documents','primary':'id',id:Doc.id,pInfo:$scope.agent.pInfo}

    $http.post(SERVICEURL2,data)
    .then(function(responceData)  {
      console.log(responceData);
    })
    , (function(error) {
      console.log("error");
    })

    $state.reload();
  }
  $scope.download = function(Doc) {
     url=SERVICEDIRURL +"file_down.php?action=file&file=" + Doc.doc_image +"&doc_per="+Doc.per+"&per_id="+Doc.per_id+"&isImage="+Doc.isImage+$scope.agent.pInfoUrl

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


  $scope.edit_doc=function(Doc,Index){
    switch($scope.page.action){
      case 'list_from_my_customer':
      $scope.pages['add_document']={action:'edit_document_for_customer', location:$state.current.name,Doc:Doc}
      localstorage('pages',JSON.stringify($scope.pages))

      break
      case 'list_from_my_company':
      $scope.pages['add_document']={action:'edit_document_for_company', location:$state.current.name,Doc:Doc}
      localstorage('pages',JSON.stringify($scope.pages))
      break
      case 'list_from_view_contract' :
      $scope.pages['add_document']={action:'edit_document_for_contract', location:$state.current.name,Doc:Doc}
      localstorage('pages',JSON.stringify($scope.pages))
      break;
      default:
    }
    $state.go('add_document',{pages:$scope.pages})


  }
  $scope.back=function(){
    $state.go($scope.page.location)

  }
  $scope.$on('backButton', function(e) {
      $scope.back()
  });

  $scope.$on('addButton', function(e) {
     switch($scope.page.action){
       case 'list_from_my_customer':
       $scope.pages['add_document']={action:'add_document_for_customer',location:$state.current.name,
                          Doc:{agency_id:localStorage.getItem('agencyId'),per_id:$scope.Customer.user_id,per:'customer'}  }
       localstorage('pages',JSON.stringify($scope.pages))
       break
       case 'list_from_my_company':
       $scope.pages['add_document']={action:'add_document_for_company', location:$state.current.name,
                          Doc:{agency_id:localStorage.getItem('agencyId'),per_id:$scope.Company.company_id,per:'company'}  }
       localstorage('pages',JSON.stringify($scope.pages))

       break
       case 'list_from_view_contract' :
       $scope.pages['add_document']={action:'add_document_for_contract',location:$state.current.name,
                          Doc:{agency_id:localStorage.getItem('agencyId'),per_id:$scope.Contract.contract_id,per:'contract'}  }
       localstorage('pages',JSON.stringify($scope.pages))
       break;
       default:
     }
     $state.go('add_document',{pages:$scope.pages})
  })
  $scope.$on('$viewContentLoaded',
           function(event){
             $timeout(function() {
               $('input.mdl-textfield__input').each(
                 function(index){
                   $(this).parent('div.mdl-textfield').addClass('is-dirty');
                   $(this).parent('div.mdl-textfield').removeClass('is-invalid');
                 })
								 $('.mdl-layout__drawer-button').hide()
               $scope.main.loader=false
							 $timeout(function() {
							 	resize_img()
							 },300);
            }, 100);
  });

  $scope.loader=false;
})
function onConfirm(buttonIndex,$scope,doc) {
  if (buttonIndex=1)
  $scope.deleteDoc(doc)
}
