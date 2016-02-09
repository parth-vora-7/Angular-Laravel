var app = angular.module('pagination', ['ngAnimate', 'ui.bootstrap', 'ngResource', 'picardy.fontawesome', 'angularSpinner', 'dragtable']);
app.constant('END_POINT', 'angular_api/public');
app.controller('PaginationDemoCtrl', function ($scope, $log, GetData, usSpinnerService) {
  $scope.totalItems;
  $scope.currentPage = 1; 
  $scope.maxSize = 10;
  $scope.pageSizeRanges = [10, 30, 50, 100, 500];
  $scope.recPerPage = 10; 
  $scope.users; 
  $scope.sortField; 
  $scope.sortOrder; 
  $scope.searchObj = {};        
  
  $scope.columns = [
    {field: 'first_name', label: 'First name'},
    {field: 'last_name', label: 'Last name'},
    {field: 'address', label: 'Address'},
    {field: 'phone_no', label: 'Phone no'},
    {field: 'email', label: 'Email'}
  ];

  $scope.getData = function () {
    $scope.users = null;
    GetData.getData({currentPage: $scope.currentPage, recPerPage: $scope.recPerPage,
      sortField: $scope.sortField, sortOrder: $scope.sortOrder, searchFields: $scope.searchFields}).$promise.then(function (res) {
	usSpinnerService.stop('spinner');
	$scope.totalItems = res.userCount;
	$scope.users = res.users;           
    }).catch(function (err) {
	$log.error(err);
    });
  };
  
  $scope.setRecordLimit = function (recPerPage) {
    $scope.currentPage = 1;
    $scope.recPerPage = recPerPage;
    $scope.getData();
  };
  
  $scope.colSort = function(field) {
    if($scope.sortField === field) {
      if($scope.sortOrder === 'asc') {
	$scope.sortOrder = 'desc';
      } else {
	$scope.sortOrder = 'asc';
      }
    } else {
      $scope.sortField = field;
      $scope.sortOrder = 'asc';
    }
    $scope.currentPage = 1;
    $scope.getData();
  };
  
  $scope.search = function(search_type) {
    if(search_type === 'common') {
      $scope.searchFields = null;
      $scope.searchFields = $scope.searchObj.common;
    } else if (search_type === 'separate') {
      $scope.searchFields = {};
      angular.forEach($scope.searchObj, function(value, key) {
        if(value) {
          $scope.searchFields[key] = value;
        }
      });
      $scope.currentPage = 1;
    }
    $scope.getData();
  };
  
  $scope.getData();
  
  $scope.reOrderColumn = function (start, target) {
    /*var temp = $scope.columns[target];
    $scope.columns[target] = $scope.columns[start]; 
    $scope.columns[start] = temp;
    console.log($scope.columns);
    return; // */
    
    $scope.newColumns = [];
    
    angular.forEach($scope.columns, function(value, key) {
      $scope.newColumns .push({field: value.field, label: value.label, $$hashKey: value.$$hashKey});
    });
    
    $scope.columns = [];
    
    var i = 0;
    angular.element('table.data-table th').each(function( index ) { 
      var field = $( this ).attr('data-field');
      var label = $( this ).attr('data-label');
      
      for(i=0; i<$scope.newColumns.length; i++ ) {
        if(field === $scope.newColumns[i].field) {
          var objKey = $scope.newColumns[i].$$hashKey;
          break;
        }
      }
        $scope.columns.push({field: field, label: label, $$hashKey: objKey });
    }); 
  };
});
app.factory('GetData', function ($resource, END_POINT) {
  return $resource(END_POINT + '/getdata', {}, {
    'getData': {
      method: 'POST',
      isArray: false
    }
  });
});
