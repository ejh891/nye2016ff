var ratchetModule = angular.module('ratchetModule', []);

ratchetModule.controller('ratchetController', function($scope, $http) {
    $scope.formData = {};
    $scope.title = "NYE Countdown";

    $scope.hasValue = function(o) {
        return o !== null;
    };

    $scope.createRatchet = function(ratchet) {
        $http.post('/api/ratchets', { url: ratchet.new.url, rank: ratchet.new.rank})
            .then(function(res) {
                $scope.ratchets = res.data;
                console.log("res.data" + res.data);
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


    $http.get('/api/ratchets')
        .then(function(res) {
            $scope.ratchets = res.data;
            $scope.tiles = function() {
                var n = 32;
                var arr = new Array(n);
                for (var i=n; i>0; i--) {
                    var result = $.grep($scope.ratchets, function(o, index){ return o.rank == i; });
                    if (result.length == 0) {
                        arr[i] = {url: null, rank: i};
                    } else if (result.length == 1) {
                        arr[i] = result[0];
                    } else {
                        throw "Duplicate rank";
                    }
                }
                return arr.reverse();
            }();
        })
        .catch(function(res) {
            console.log('Error: ' + res);
        });


});