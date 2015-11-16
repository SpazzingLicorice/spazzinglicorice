angular.module('whiteboard', ['ui.router'])
  .config(function($stateProvider) {
    $stateProvider
      .state('eraser', {
        controller: 'toolbar'
      });
  })
  .controller('canvas', function($rootScope, $scope, tools) {
    $rootScope.app = App;
  })

.controller('toolbar', function($scope, tools) {
  $scope.changePen = function(option) {
    tools.changePen(option);
  };
})

.service('tools', function($rootScope) {
  var changePen = function(option) {
    console.log($rootScope.app.pen);
    if (option === 'eraser') {
      console.log("User is using the eraser");
      $rootScope.app.pen.lineWidth = 50;
      $rootScope.app.pen.strokeStyle = '#fff';
    } else {
      console.log("User is using the pen");
      $rootScope.app.pen.lineWidth = 5;
      $rootScope.app.pen.strokeStyle = option;
    }
  };
  return {
    changePen: changePen
  };

});
