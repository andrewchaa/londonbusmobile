// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.factory('Projects', function () {
  return {
    all : function () {
      var projectsString = window.localStorage['projects'];
      if (projectsString)
        return angular.fromJson(projectsString);

      return [];
    },

    save : function (projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },

    newProject : function (title) {
      return {
        title : title,
        tasks : []
      };
    },

    getLastActiveIndex : function () {
      return parseInt(window.localStorage['lastActiveProject']);
    },

    setLastActiveIndex : function (index) {
      window.localStorage['lastActiveProject'] = index;
    }
  };
})

.controller('starterCtrl', function (
    $scope
  , $timeout
  , $ionicModal
  , Projects
  , $ionicSideMenuDelegate
  , $http) {

  var createProject = function (title) {
    var newProject = Projects.newProject(title);
    $scope.projects.push(newProject);

    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length - 1);
  };

  $scope.projects = Projects.all();
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
  
  $scope.stopsNearMe = function() {
    var url = '/data/stopsnearme.json';
    if (window.cordova) {
      url = 'http://countdown.tfl.gov.uk/search?searchTerm=91&_dc=1405030266331';  
    }
    
    $http({ method : 'GET', url : url })
      .success(function (data, status, headers, config) {
        data.markers.map(function (marker) {
          var stopIndicator = marker.stopIndicator;
          if (stopIndicator) {
            marker.stopIndicatorText = '[' + stopIndicator + ']';
            
            if (stopIndicator.length > 1) {
              marker.stopIndicatorImgSrc = '0.jpg';  
            } else {
              marker.stopIndicatorImgSrc = stopIndicator + '0.jpg'
            }
            
          } else {
            marker.stopIndicatorImgSrc = '0.jpg'
          }


        });
        $scope.stops = data.markers;
        console.log(data.markers[0])
      })
  };

  $scope.newProject = function () {
    var title = prompt('Project Name');
    if (title)
      createProject(title);
  }

  $scope.selectProject = function (project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

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
    if (!$scope.activeProject || !task)
      return;

    $scope.activeProject.tasks.push({ title : task.title });
    $scope.taskModal.hide();

    Projects.save($scope.projects);
    task.title = '';
  };

  $scope.newTask = function () {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function () {
    $scope.taskModal.hide();
  }

  $timeout(function () {
    if ($scope.projects.length == 0) {
      while(true) {
        var title = prompt('Your first project title');
        createProject(title);
        break;
      }
    }
  })
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
