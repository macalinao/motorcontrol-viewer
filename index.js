var sets = [];

var app = angular.module('motorcontrol', []);

app.config(function($routeProvider) {
  $routeProvider.
    when('/graphs', {
      templateUrl: './partials/graphs.html',
      controller: function GraphsCtrl($scope) {
        $scope.graph = {
          title: {
            text: 'Data Set Graphs'
          },
          xAxis: {
            title: {
              text: 'Time'
            }
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0
          },
          credits: {
            enabled: false
          },
          series: sets
        };
      }
    }).

    when('/upload', {
      templateUrl: './partials/upload.html', 
      controller: function UploadCtrl($scope, $location) {
        $scope.parseSet = function(content) {
          var setsText = content.split("\n##");
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

            sets.push({
              name: setName,
              data: setData
            });

            $location.path('/graphs');
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

// Chart directive https://github.com/rootux/angular-highcharts-directive/
app.directive('chart', function () {
  return {
    restrict: 'E',
    template: '<div></div>',
    scope: {
        chartData: "=value"
    },
    transclude:true,
    replace: true,

    link: function (scope, element, attrs) {
      var chartsDefaults = {
        chart: {
          renderTo: element[0],
          type: attrs.type || null,
          height: attrs.height || null,
          width: attrs.width || null
        }
      };
      
      //Update when charts data changes
      scope.$watch(function() { return scope.chartData; }, function(value) {
        if(!value) return;
          // We need deep copy in order to NOT override original chart object.
          // This allows us to override chart data member and still the keep
          // our original renderTo will be the same
          var deepCopy = true;
          var newSettings = {};
          $.extend(deepCopy, newSettings, chartsDefaults, scope.chartData);
          var chart = new Highcharts.Chart(newSettings);
      });
    }
  };
});
