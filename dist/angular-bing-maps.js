/*! angular-bing-maps 0.8.0 2015-09-30
 *  AngularJS directives for Microsfot Bing Maps
 *  git: https://github.com/edezacas/angular-bing-maps
 */

 /*
!
The MIT License
Copyright (c) 2010-2013 Google, Inc. http://angularjs.org
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
angular-bing-maps
https://github.com/edezacas/angular-bing-maps
@authors
Eduard Deza - https://twitter.com/edezacas
 */

(function () {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Modules
  angular.module('angularBingMaps.directives', []);
  angular.module('angularBingMaps.services', []);
  angular.module('angularBingMaps.providers', []);

  angular.module('angularBingMaps',
      [
          'angularBingMaps.directives',
          'angularBingMaps.factories',
          'angularBingMaps.providers',
      ]);
})();

(function () {


  angular.module('angularBingMaps.factories', [])
  .factory('angularBingMapsFactories', function ($q){

    return {
      createRoute: function(map, fromPoint, toPoint){

        function createDirectionsManager()
        {
            if (!directionsManager)
            {
                directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
            }

            directionsManager.resetDirections();
            directionsErrorEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function(arg) {
              deferred.reject(arg);
            });
            directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function() {
              deferred.resolve(true);
            });
        }

        function createWalkingRoute()
        {
          if (!directionsManager) { createDirectionsManager(); }
          directionsManager.resetDirections();
          // Set Route Mode to walking
          directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });

          var fromWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(fromPoint.lat, fromPoint.long)  });
          directionsManager.addWaypoint(fromWaypoint);
          var toWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(toPoint.lat, toPoint.long) });
          directionsManager.addWaypoint(toWaypoint);
          // Set the element in which the itinerary will be rendered
          directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('directionsItinerary') });

          directionsManager.calculateDirections();
        }

        function createDirections()
        {
          if (!directionsManager)
          {
            Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: createWalkingRoute });
          }
          else
          {
            createWalkingRoute();
          }
        }

        var deferred = $q.defer();
        var directionsManager;
        var directionsErrorEventObj;
        var directionsUpdatedEventObj;

        createDirections();

        return deferred.promise;
      }
    };

  });


  angular.module('angularBingMaps.providers', [])
  .provider('angularBingMaps', function angularBingMapsProvider(){
      var defaultBingMapsOptions = false;

      return {
        setBingMapsOptions: function (userOptions) {
          defaultBingMapsOptions = userOptions;
        },
        $get: function () {
          return {
            getBingMapsOptions: defaultBingMapsOptions
          };
        }
      };

  });


  angular.module('angularBingMaps.directives', [])
  .directive('myBingMaps', function(angularBingMaps) {
    return {
      restrict: 'E',
      scope: {
        onCreate: '&',
        latitude:"@latitude",
        longitude:"@longitude"
      },
      link: function (scope, iElement, iAttrs) {
        function initialize(){

          var defaultBingMapsOptions = angularBingMaps.getBingMapsOptions;
          var credentials = false;

          // check if user has credentials for Bing Maps
          if(defaultBingMapsOptions.hasOwnProperty('credentials')){
            credentials = defaultBingMapsOptions.credentials;
          }

          var mapOptions = {credentials: credentials,
                            center: new Microsoft.Maps.Location(scope.latitude, scope.longitude),
                            mapTypeId: Microsoft.Maps.MapTypeId.road,
                            zoom: 16,
                            showDashboard: false
          };

          var map = new Microsoft.Maps.Map(iElement[0], mapOptions);

          scope.onCreate({map: map});
        }

        if (document.readyState === "complete") {
          initialize();
        };

      }
    };
  });

})();
