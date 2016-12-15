var ratchetModule = angular.module('ratchetModule', []);

ratchetModule.controller('ratchetController', function($scope, $http) {
    $scope.formData = {};
    $scope.title = "NYE Countdown";

    $scope.hasValue = function(o) {
        return o !== null;
    };

    $scope.createRatchet = function(ratchet) {
        $http.post('/api/ratchets', { url: ratchet.url, rank: ratchet.rank})
            .then(function(res) {
                console.log(res.data);
            })
           .catch(function(res) {
                console.log('Error: ' + res);
            });
    };

    $scope.deleteRatchet = function(id) {
        $http.delete('/api/ratchets' + id)
            .then(function(res) {
                $scope.ratchets = res.data;
                console.log(res.data);
            })
            .catch(function(data) {
                console.log('Error: ' + res);
            });
    };

    function insertEmptyRatchets() {
        var n = 32;
        for (var i=n; i>0; i--) {
            var result = $.grep($scope.ratchets, function(o, index){ return o.rank == i; });
            if (result.length == 0) {
                $scope.ratchets.push({url: null, rank: i});
            } else if (result.length != 1) {
                throw "Duplicate rank";
            }
        }
        return $scope.ratchets.sort(function(a, b) {
            return b.rank - a.rank; // sort descending
        });
    };

    function updateRatchets() {
        $http.get('/api/ratchets')
            .then(function(res) {
                $scope.ratchets = res.data;
                $scope.ratchets = insertEmptyRatchets();
            })
            .catch(function(res) {
                console.log('Error: ' + res);
            });
    };

    updateRatchets(); // initialize ratchets for the page
});