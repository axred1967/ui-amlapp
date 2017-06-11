app2.controller('language', function ($scope,$http,$translate,$rootScope,$timeout,$state,$timeout) {
  $scope.main.Back=false
  $scope.main.Add=false
  $scope.main.Search=false
  $scope.main.viewName=""
  $scope.main.Sidebar=false
  $('.mdl-layout__drawer-button').hide()


$scope.clang=function(lang)
{
    localstorage("language",lang);
    var chksession = localStorage.getItem('userId');
    var typesi = localStorage.getItem('userType');
    var langfile = localStorage.getItem("language");
    if (!chksession)
    {
      $state.go("login");
    }

}

})
