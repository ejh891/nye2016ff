var ratchetModule = angular.module('ratchetModule', []);

function mainController($scope, $http) {
    $scope.formData = {};

    $http.get('/api/ratches')
        .success(function(data) {
            $scope.ratchets = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.createRatchet = function() {
        $http.post('/api/ratchets', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear formData for next request
                $scope.ratchets = data;
                console.log(data);
            })
           .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteRatchet = function(id) {
        $http.delete('/api/ratchets' + id)
            .success(function(data) {
                $scope.ratchets = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}