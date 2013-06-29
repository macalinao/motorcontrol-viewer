var sets = {};

var app = angular.module('motorcontrol', []);

app.config(function($routeProvider) {
  $routeProvider.
    when('/upload', {
      templateUrl: './partials/upload.html', 
      controller: function UploadCtrl($scope) {
        $scope.parseSet = function(content) {
          var setsText = content.split('\n##');
          for (var i = 0; i < setsText.length; i++) {
            var setLines = setsText[i].split('\n');

            var setData = [];
            for (var j = 1; j < setLines.length; j++) {
              setData.push(parseFloat(setLines[j]));
            }

            var setName = setLines[0].substring(0, setLines[0].length - 2);
            if (setName.substring(0, 2) == '##') {
              setName = setName.substring(2, setName.length);
            }

            sets[setName] = setData;
          }
        }
      }
    }).
    
    otherwise({
      redirectTo: '/upload'
    });
});
  
app.config(function($locationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');
});

app.directive('fileUpload', function($parse) {
  return {
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.fileUpload);

      element      
        .on('dragover', function(e) {
          $(this).addClass('hover');
          e.preventDefault();
        })      
        .on('dragend', function() {
          $(this).removeClass('hover');
        })
        .on('drop', function(e) {
          $(this).removeClass('hover');
          e.stopPropagation();
          e.preventDefault();

          var file = e.originalEvent.dataTransfer.files[0];
          var reader = new FileReader();

          $(reader).on('load', function(e) {
            scope.$apply(function() {
              fn(scope, {content: e.target.result});
            });
          });

          reader.readAsText(file, 'UTF-8');
        });
    }
  }
});
