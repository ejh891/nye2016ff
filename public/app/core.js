var ratchetModule = angular.module('ratchetModule', []);

ratchetModule.controller('ratchetController', function($scope, $http) {
    $scope.formData = {};
    $scope.title = "NYE Countdown";

    $scope.range = function(n) { // returns a new array with the values 0..n
        return new Array(n);
    }

    $scope.createRatchet = function() {
        $http.post('/api/ratchets', $scope.formData)
            .success(function(res) {
                $scope.formData = {}; // clear formData for next request
                $scope.ratchets = res.data;
                console.log("data.data" + res.data);
            })
           .error(function(res) {
                console.log('Error: ' + res);
            });
    };

    $scope.deleteRatchet = function(id) {
        $http.delete('/api/ratchets' + id)
            .success(function(res) {
                $scope.ratchets = res.data;
                console.log(res.data);
            })
            .error(function(data) {
                console.log('Error: ' + res);
            });
    };


    $http.get('/api/ratchets')
        .then(function(res) {
            $scope.ratchets = res.data;
            console.log(res.data);
        })
        .catch(function(res) {
            console.log('Error: ' + res);
        });
});