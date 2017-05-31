//Angular app
(function() {
  var module = angular.module("listingsApp", []);

  function dataCtrl($filter, $scope, dataService, mapService) {
    $scope.parseDate = function(date, startTime, endTime) {
      var parts = date.split('/');
      var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
      var now = new Date();
      if (mydate > now.getTime()) {
        var suffixes = ["th", "st", "nd", "rd"];
        var datefilter = $filter('date')(mydate, 'MMM');
        var day = parseInt(parts[0]);
        var relevantDigits = (day < 30) ? day % 20 : day % 30;
        var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];

        var timeParts = startTime.split(":");
        var time = new Date(1970, 0, 1, timeParts[0], timeParts[1], "00");
        var startTimeFilter = $filter('date')(time, 'h:mm a');
        timeParts = endTime.split(":");
        time = new Date(1970, 0, 1, timeParts[0], timeParts[1], "00");
        var endTimeFilter = $filter('date')(time, 'h:mm a');
        return datefilter + ". " + parts[1] + suffix + " " + startTimeFilter + " to " + endTimeFilter;
      }
      return "";
    }
    $scope.locations = [];
    var onMapFetch = function(data) {
      $scope.locations.push(data);
      //console.log($scope.locations[0].location);
      var location = {
        lat: data.location.lat,
        lng: data.location.lng
      };
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: location
      });
      if ($scope.locations.length == $scope.dataBack.length) {
      var markerStore=[];
        for (var i = 0; i < $scope.dataBack.length; i++) {
          var marker = new google.maps.Marker({
            position: $scope.locations[i].location,
            map: map,
            myData: $scope.dataBack[i].Listing.ID
          });
          markerStore.push(marker);
          google.maps.event.addListener(markerStore, 'click', function() {          
          if(marker.myData==124)
          {
          $('.item-0').addClass('selected');
          }
          else
          {
            $('.item-1').addClass('selected');
          }
          });
        }
      }
    };
    var onMapError = function(reason) {
      $scope.error = "Could not fetch data!";
    };

    var onDataFetch = function(data) {
      data = data.replace("var vObject=", "");
      data = data.replace(";", "");
      data = "" + data + "";
      data = eval(data);
      $scope.dataBack = data;
      var len = data.length;
      var antilen = 0;
      while (len > antilen) {
        mapService.getMap(data[antilen].Property.Address.StreetNumber + ", " + data[antilen].Property.Address.StreetName + ", " + data[antilen].Property.Address.City).then(onMapFetch, onMapError);
        antilen = antilen + 1;
      }
    };
    var onError = function(reason) {
      $scope.error = "Could not fetch data!";
    };

    dataService.getListing().then(onDataFetch, onError);
  };
  module.controller("dataCtrl", dataCtrl);
}());
//Data Service
(function() {
  var myArray = [];
  var dataService = function($http) {
    var getListing = function() {
      return $http.get("https://cdn.rawgit.com/VishnuPrabhuT/angularJS/2dba2ba2/vObject.js")
        .then(function(response) {
          return myArray = response.data;
        });
    };
    return {
      getListing: getListing
    };
  };

  var mapService = function($http) {
    var getMap = function(address) {
      return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
          address + '&key=AIzaSyAA3SNfCgzsI8M3dxhI1Q92X5241D1VAMs')
        .then(function(_results) {
            return _results.data.results[0].geometry;
          },
          function error(_error) {
            $scope.queryError = _error;
          })
    };
    return {
      getMap: getMap
    };
  };
  //Services and App reference
  var module = angular.module("listingsApp");
  module.factory("dataService", dataService);
  module.factory("mapService", mapService);
}());
//
