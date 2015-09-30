# angular-bing-maps

Angular Bing Maps is a set of directives and services for AngularJs to work with [Microsoft Bing Maps](https://msdn.microsoft.com/en-us/library/gg427610.aspx)

### Services available

* createRoute --> Calculate/Draw the walking route between to points

### Getting started

1.- Add angular-bing-maps module to your angular module:

```html
angular.module('starter', ['angularBingMaps']);
```

2.- Use angularBingMapsProvider to config your credentials:

```html
.config(function(angularBingMapsProvider) {

  // set credentials for Bing Maps
  angularBingMapsProvider.setBingMapsOptions({
    credentials : 'your_microsoft_bing_maps_credentials'
  });

})
```

3.- Insert the directive in your View

```html
<my-bing-maps
  on-create="mapCreated(map)"
  latitude="41.242525"
  longitude="2.436153">
</my-bing-maps>
```

4.- (Optional) Calculate/Draw the walking route between to points in your Controller

```html

.controller('MapCtrl', function($scope, angularBingMapsFactories){

  $scope.mapCreated = function(map) {

    var fromPosition = {
      lat: '',
      long: ''
    };
    var toPosition = {
      lat: '',
      long: ''
    };

    angularBingMapsFactories.createRoute(map, fromPosition, toPosition).then(function(res){
      // OK
       console.log(res);
    }, function(err){
      // KO    
      console.log(err);
    });

  };

});

```
