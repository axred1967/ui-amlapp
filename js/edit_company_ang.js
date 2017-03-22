var app2 = angular.module('myApp', []);


app2.controller('personCtrl', function ($scope,$http) {
    $scope.datalang = DATALANG;
    $scope.Companies= [];
    var CompanyID=localStorage.getItem("CompanyID");
  	var email=localStorage.getItem("userEmail");
    $('#loader_img').hide();
    var usertype = localStorage.getItem('userType');
     var image = localStorage.getItem("Profileimageagencyuser");
     var priviledge = localStorage.getItem("priviligetype");
     if(priviledge == 0 && usertype  == '2'  )
     {
         redirect("my_profile_agent_noprve.html");
     }
    if(image != null)
    {
            $('#Profileimageagencyuser').attr("src",BASEURL+"uploads/user/small/"+image);

    }
    $('#Profileimageagencyusername').html(name);
    $('#Profileimageagencyuseremail').html(email);
    data= {"action":"show_edit_company",company_id:CompanyID}

    $http.post(
      SERVICEURL2,  data
      )
        .success(function(responceData)
                 {
                  $('#loader_img').hide();
                  if(responceData.RESPONSECODE=='1') 			{
                    data=responceData.RESPONSE;

                    $scope.Company=data;



                   }
                   else
                   {
                      console.log('no customer')
                   }

         })
        .error(function() {
                 console.log("error");
         });

         $scope.tocompany = function(d){
            tocompany(d)
          };
          $scope.edit_company= function (){
          var langfileloginchk = localStorage.getItem("language");
          if(langfileloginchk == 'en' )
          {
              var company_name_msg ="Please enter  Company Name";
             var company_addressmsg = "Please enter  Company Address";
             var comany_fiscal_idmsg ="Please enter  Fiscal Id";

          }
          else
          {
            var company_name_msg ="Si prega di inserire Nome Società";
             var company_addressmsg = "Si prega di inserire  Indirizzo Azienda ";
             var comany_fiscal_idmsg ="Si prega di inserire Partita iva o COE";
          }


          var company_name = $.trim($('#company_name').val());
          var company_address = $.trim($('#company_address').val());
          var company_fiscal_id = $.trim($('#company_fiscal_id').val());

           if(company_name=="") swal("",company_name_msg)
           else if(company_address=="") swal("",company_addressmsg)
           else if(company_fiscal_id=="") swal("",comany_fiscal_idmsg)


            else
            {

                var id=localStorage.getItem("userId");
                var email=localStorage.getItem("userEmail");
                var usertype = localStorage.getItem('userType');
                $('#loader_img').show();
                data={ "action":"edit_company", id:id,email:email,usertype:usertype,lang:langfileloginchk, dbData: $scope.Company}
                $http.post( SERVICEURL2,  data )
                    .success(function(data) {
                              $('#loader_img').hide();
                              if(data.RESPONSECODE=='1') 			{
                                 $scope.Company=[]
                                 swal("",data.RESPONSE);
                                 redirect(back)

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
        }

});
