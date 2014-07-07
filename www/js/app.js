// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('starterCtrl', function ($scope, $ionicModal) {
    // $scope.tasks = [
    //   { title: 'Collect coins' },
    //   { title: 'Eat mushrooms' },
    //   { title: 'Get high enough to grab the flag' },
    //   { title: 'Find the Princess' }
    // ];
    $scope.tasks = [];

    $ionicModal.fromTemplateUrl(
      'new-task.html', 
      function (modal) {
        $scope.taskModal = modal;
      }, {
        scope : $scope,
        animation : 'slide-in-up'
      }
    );

    $scope.createTask = function (task) {
      $scope.tasks.push({ title : task.title });
      $scope.taskModal.hide();
      task.title = '';
    };

    $scope.newTask = function () {
      $scope.taskModal.show();
    };

    $scope.closeNewTask = function () {
      $scope.taskModal.hide();
    }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
