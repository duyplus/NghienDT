app.controller('u-ctrl', ['$scope','UserCRUDService', 
$scope.addUser = function () {
    if ($scope.user != null && $scope.user.id) {
        UserCRUDService.addUser($scope.user.name, $scope.user.email)
          .then (function success(response){
              $scope.message = 'User added!';
              $scope.errorMessage = '';
          },
          function error(response){
              $scope.errorMessage = 'Error adding user!';
              $scope.message = '';
        });
    }
    else {
        $scope.errorMessage = 'Please enter a name!';
        $scope.message = '';
    }
}]);