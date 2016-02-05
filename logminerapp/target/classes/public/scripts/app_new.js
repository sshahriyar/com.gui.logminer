/**
 * Created by shekhargulati on 10/06/14.
 */

var app = angular.module('logminerapp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
]);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl'
    }).when('/create', {
        templateUrl: 'views/pedigreetree.html',
        controller: 'TreeCtrl' //'CreateCtrl'
    }).otherwise({
        redirectTo: '/'
    })
});

app.controller('ListCtrl', function ($scope, $http) {
    $http.get('/api/v1/adlog').success(function (data) {
        $scope.events = data;
    }).error(function (data, status) {
        console.log('Error ' + data)
    })

    $scope.todoStatusChanged = function (todo) {
        console.log(todo);
        $http.put('/api/v1/todos/' + todo.id, todo).success(function (data) {
            console.log('status changed');
        }).error(function (data, status) {
            console.log('Error ' + data)
        })
    }
});

app.controller('CreateCtrl', function ($scope, $http, $location) {
    $scope.todo = {
        done: false
    };

    $scope.createTodo = function () {
        console.log($scope.todo);
        $http.post('/api/v1/todos', $scope.todo).success(function (data) {
            $location.path('/');
        }).error(function (data, status) {
            console.log('Error ' + data)
        })
    }
});


app.controller('TreeCtrl', function ($scope, $http) {
    $http.get('/api/v1/adlog').success(function (data) {
        $scope.events = data;
    }).error(function (data, status) {
        console.log('Error ' + data)
    })

   
});

app.directive("treeChart",function(){
return {
	restrict: 'EA',
	template:'<div id="chart"></div>',
	scope:{info: '@'},
	link: function (scope,element,attrs){
	
							function generateTree(data,tree,svg){
							
									   var nodes = tree.nodes(data);//.reverse(),
									    var links = tree.links(nodes);
									    console.log(nodes);
									    
									     var node = svg.selectAll("g.node")
									  			.data(nodes).enter().append("g").attr("class","node")
									 			 .attr("transform", function(d) { 
									 			      	  return "translate(" + d.y + "," + d.x+ ")"; });
									 			      	  
									 	  node.append("circle")
										  .attr("r", 10)
										  .style("stroke",  "grey")
										  .style("fill",  "red" );
										  
										   node.append("text")
										   .text(function(d) { return d.fEvent; })
										  .style("fill-opacity", 1);
										   
										  var diagonal = d3.svg.diagonal()
										.projection(function(d) { return [d.y, d.x]; });
										
										   var link = svg.selectAll("path.link")
										  .data(links, function(d) { return d.target.id; });
									
									  // Enter the links.
									  link.enter().insert("path", "g")
										  .attr("class", "link")
									  	  .style("stroke", function(d) { return d.target.level; })
										  .attr("d", diagonal);
							}
				
				
				
				function display(myData,tree,svg){
					
									 angular.forEach(myData, function(item){
								                   console.log(item.fEvent); 
								                   
								                 //  generateTree(item.fEvent,tree,svg); 
								                 
								                  if (item.fBranches)
								                     for (var i=0; i<item.fBranches.length;i++){
									                      
									                      display(item.fBranches[i],tree,svg);
									                      // angular.forEach(item.fBranches[i], function(it){
									                   		//	console.log("-->"+it.fEvent);
									                   	//	});  
								                     }
								                      
								         });
				}
				
				
				
				function drawTree(){
							// ************** Generate the tree diagram	 *****************
									var margin = {top: 20, right: 120, bottom: 20, left: 120},
										width = 960 - margin.right - margin.left,
										height = 500 - margin.top - margin.bottom;
										
								
									
									var tree = d3.layout.tree()
										.size([height, width]);
									
									
									
									var svg = d3.select("#chart").append("svg")
										.attr("width", width + margin.right + margin.left)
										.attr("height", height + margin.top + margin.bottom)
									  .append("g")
										.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
									
									root = JSON.parse(scope.info);
								
									 var customJson= JSON.stringify(root['tree'])
									 customJson=customJson.replace(/\[\[/g,"[");
									 customJson=customJson.replace(/\]\]/g,"]"); 
									 customJson='{"fEvent":"start", "fBranches":'+customJson+'}';
									 
									 root=JSON.parse(customJson);
										console.log(root);					
									generateTree(root,tree,svg);
									
									
									
							


				  }
				  
				  
				  
				  
				  scope.$watch('info', function(){
    					if(!scope.info) return; //If there is no data, do nothing
			 	
						console.log("hey i m in console "+scope.info);
			
    					//	now call your draw function
    				drawTree();
				});
				
  	
     }
};
});