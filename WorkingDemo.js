//Service

(function() {
  var module = angular.module("listingsApp", []);
  var global = [];

  function dataCtrl($scope, dataService) {
    var onDataFetch = function(data) {
      data = data.replace("var vObject=", "");
      data = data.replace(";", "");
      data = "" + data + "";
      global = data;
      data=eval(data);
      $scope.dataBack=data;
      //console.log(data);      
    };
    var onError = function(reason) {
      $scope.error = "Could not fetch data!";
    };
    
    dataService.getListing().then(onDataFetch, onError);
    
    //$scope.name = "Vishnu";
  };
  module.controller("dataCtrl", dataCtrl);
}());

(function() {
  var myArray = [];
  var dataService = function($http) {
    var getListing = function() {
      return $http.get("https://cdn.rawgit.com/VishnuPrabhuT/angularJS/2dba2ba2/vObject.js")
        .then(function(response) {
          return myArray=response.data;
        });
    };
    
    return {
      getListing: getListing      
    };
  };
  var module = angular.module("listingsApp");
  module.factory("dataService", dataService);
}());
