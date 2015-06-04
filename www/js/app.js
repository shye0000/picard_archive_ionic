// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])
.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
})
.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    })
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.dataaccess', {
    url: "/dataaccess",
    views: {
      'menuContent': {
        templateUrl: "templates/dataaccess.html",
        controller: 'DataAccessCtrl'
      }
    }
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.user', {
    url: "/user",
    views: {
      'menuContent': {
        templateUrl: "templates/user.html",
        controller: 'UserCtrl'
      }
    }
  })
  .state('app.documents', {
    url: "/documents",
    views: {
      'menuContent': {
        templateUrl: "templates/documents.html",
        controller: 'DocumentsCtrl'
      }
    }
  })
  .state('app.document', {
    url: "/documentlists/:documentlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/documentlist.html",
        controller: 'DocumentlistCtrl'
      }
    }
  })
  .state('app.dse', {
    url: "/dataaccess/dse",
    views: {
      'menuContent': {
        templateUrl: "templates/dse.html",
        controller: 'dseCtrl'
      }
    }
  })
  .state('app.qf', {
    url: "/dataaccess/qf",
    views: {
      'menuContent': {
        templateUrl: "templates/qf.html",
        controller: 'qfCtrl'
      }
    }
  })
  .state('app.pt', {
    url: "/dataaccess/pt",
    views: {
      'menuContent': {
        templateUrl: "templates/pt.html",
        controller: 'ptCtrl'
      }
    }
  })
  .state('app.datatable', {
    url: "/dataaccess/dse/datatable/:url/:dsname",
    views: {
      'menuContent': {
        templateUrl: "templates/datatable.html",
        controller: 'DatatableCtrl'
      }
    }
  })
  .state('app.datatableQeryForm', {
    url: "/dataaccess/dse/datatable/:url/:dsname/:datefrom/:dateto/:telescop/:level_pro/:obs_mode/:obs_type/:lambda",
    views: {
      'menuContent': {
        templateUrl: "templates/datatable.html",
        controller: 'DatatableQueryFormCtrl'
      }
    }
  })
  .state('app.downloadasyn', {
    url: "/dataaccess/downloadasyn/:url",
    views: {
      'menuContent': {
        templateUrl: "templates/downloadasyn.html",
        controller: 'downloadAsynCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

