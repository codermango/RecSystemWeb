'use strict';

angular.module('RecSystemWebApp')
    .controller('SimilarCtrl', function ($scope, $http, $routeParams, $location, ENV) {
        $scope.movieID = $routeParams.movieid;
        $scope.recNum = $routeParams.recnum;
        $scope.hasColorData = false;
        $scope.server = ENV.server;
        $scope.web_port = ENV.web_port;
        // console.log(this);

        $http.get($scope.server + '/rec/' + $scope.movieID + '/' + $scope.recNum + '/').success(function(data) {
            console.log(data);
            $scope.recMovies = data;

            // let movies = {weighted: [], unweighted: []};



            // for (let movie in data.weighted) {
            //     // console.log(movie);

            //     movies['weighted'].push({movieid: movie, features: data.weighted[movie]});
            // }

            // for (let movie in data.unweighted) {
            //     // console.log(movie);

            //     movies['unweighted'].push({movieid: movie, features: data.unweighted[movie]});
            // }
            // console.log(movies);

            // $scope.recMovies = movies;
        });


        $http.get('../../data/plot_data/' + $scope.movieID + '.json').success(function(data) {
            // console.log(data);

            $scope.hasColorData = true;
            let colorData = data[$scope.movieID];
            let points = [];
            let xs = [];
            let ys = [];
            let zs = [];
            let axis = {
                minX: 0,
                maxX: 255,
                minY: 0,
                maxY: 255,
                minZ: 0,
                maxZ: 255
            }
            points = colorData.map(function(colorItem) {
                let color = "rgb(" + colorItem.r + ", " + colorItem.g + ", " + colorItem.b + ")";
                let point = {
                    x: colorItem.L,
                    y: colorItem.B,
                    z: colorItem.A,
                    fillColor: color
                };
                return point;
            });

            xs = points.map(function(point) {
                return point.x;
            });
            ys = points.map(function(point) {
                return point.y;
            });
            zs = points.map(function(point) {
                return point.z;
            });
            axis = {
                minX: Math.min(...xs),
                maxX: Math.max(...xs),
                minY: Math.min(...ys),
                maxY: Math.max(...ys),
                minZ: Math.min(...zs),
                maxZ: Math.max(...zs)
            }

            console.log(axis);
            
            colorChart('color-chart', points, axis);

            
            
        }).error(function(data) {
            $scope.hasColorData = false;
        });




        $scope.recommend = function(imdbid, recNum) {
            if (imdbid == undefined || imdbid.trim() == '' ) {
                var inputErrorDialog = $("#inputErrorDialog").data('dialog');
                if (!inputErrorDialog.element.data('opened')) {
                    inputErrorDialog.open();
                } else {
                    inputErrorDialog.close();
                }
                return;
            }
            $location.path('/similar/' + imdbid + '/' + recNum + '/');
        };


        $scope.showFeatureChart = function(e) {

            let feature_labels = [];
            let feature_values = [];
            // console.log(this);
            for (let key in this.movie.features) {
                if (key !== 'sum' && key !== 'words') {
                    feature_labels.push(key);
                    feature_values.push(this.movie.features[key]);
                }
            }

            let currentDiv = $(e.currentTarget);
            let featureChartDiv = $("#feature-chart");

            featureChartDiv.highcharts({

                chart: {
                    polar: true,
                    type: 'line'
                },

                // title: {
                //     text: 'Features',
                //     x: -80
                // },

                pane: {
                    size: '80%'
                },

                xAxis: {
                    categories: feature_labels,
                    tickmarkPlacement: 'on',
                    lineWidth: 0
                },

                yAxis: {
                    gridLineInterpolation: 'polygon',
                    lineWidth: 0,
                    min: 0
                },

                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{series.color}"><b>${point.y:,.0f}</b><br/>'
                },

                // legend: {
                //     align: 'right',
                //     verticalAlign: 'top',
                //     y: 70,
                //     layout: 'vertical'
                // },

                series: [{
                    name: 'Recommendation',
                    data: feature_values,
                    pointPlacement: 'on'
                }]

            });
            featureChartDiv.css('display', 'block');
            let left = currentDiv.offset()['left'] + currentDiv.outerWidth() / 2 - featureChartDiv.outerWidth() / 2;
            let top = currentDiv.offset()['top'] - featureChartDiv.outerHeight();
            featureChartDiv.offset({ top: top, left: left });


        }

        $scope.hideFeatureChart = function(e) {
            $("#feature-chart").css('display', 'none');
        }


        // $scope.showChart = function(e) {
        //     let feature_labels = [];
        //     let feature_values = [];
        //     for (let key in this.features) {
        //         if (key !== 'sum' && key !== 'words') {
        //             feature_labels.push(key);
        //             feature_values.push(this.features[key]);
        //         }
        //     }
        //     $scope.labels = feature_labels;
        //     $scope.data = [feature_values];

        //     // console.log($scope.labels);
        //     console.log($scope.data);

        //     // get the position of current div
        //     // let currentDiv = $("#div-" + this.movie);
        //     let currentDiv = $(e.currentTarget);
        //     // console.log(currentDiv[0]);
        //     // console.log($(e.currentTarget));
        //     // console.log(currentDiv.width());

        //     Chart.defaults.global.tooltipFontColor = "#FA6800";
        //     Chart.defaults.global.tooltipFontSize = 58;
        //     let chartDiv = $("#reason-chart");

        //     chartDiv.css('display', 'block');
        //     let left = currentDiv.offset()['left'] + currentDiv.outerWidth() / 2 - chartDiv.outerWidth() / 2;
        //     let top = currentDiv.offset()['top'] - chartDiv.outerHeight();
        //     // console.log(left + " " + top); 
        //     // console.log(chartDiv.height());
        //     chartDiv.offset({ top: top, left: left });


        // }

        // $scope.hideChart = function() {
        //     $("#reason-chart").css('display', 'none');
        // }
    });
