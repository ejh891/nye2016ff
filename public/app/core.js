var ratchetModule = angular.module('ratchetModule', []);

ratchetModule.controller('ratchetController', function($scope, $http) {
    $scope.formData = {};
    $scope.title = 'NYE Countdown';

    $scope.calculateDate = function(daysTilBlastOff) {
        var msPerDay = 60*60*24*1000;
        var blastOff = new Date(2016, 11, 30);
        var dateStr = new Date(blastOff - (daysTilBlastOff*msPerDay)).toString();

        var days = "days";
        if (daysTilBlastOff === 1) days = "day";
        return dateStr.substring(0, 16) + "(" + daysTilBlastOff + " " + days + " left)";
    };

    $scope.createRatchet = function(ratchet) {
        $http.post('/api/ratchets', { url: ratchet.url, rank: ratchet.rank})
            .then(function(res) {
                console.log(res.data);
                updateRatchets();
            })
           .catch(function(res) {
                console.error(res);
            });
    };

    $scope.deleteRatchet = function(ratchet) {
        $http.delete('/api/ratchets/' + ratchet._id)
            .then(function(res) {
                console.log(res.data);
                updateRatchets();
            })
            .catch(function(res) {
                console.error(res);
            });
    };

    $scope.updateRatchet = function(ratchet) {
        $http.put('/api/ratchets/' + ratchet._id, { url: ratchet.url, rank: ratchet.rank})
            .then(function(res) {
                console.log(res.data);
                updateRatchets();
            })
            .catch(function(res) {
                console.error(res);
            })
    }
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