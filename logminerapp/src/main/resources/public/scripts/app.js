/**
 * Created by Syed Shariyar Murtaza
 */

var app = angular.module('logminerapp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
]);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/pedigreetree.html',
        controller: 'SelectCtrl'
    }).when('/fp', {
        templateUrl: 'views/frequentpattern.html',
        controller: 'FpCtrl'
    }).
    otherwise({
        redirectTo: '/'
    })
    
    
});


app.controller('SelectCtrl', function ($scope, $http) {
  	
	$scope.selectedResource=null;
	//$scope.selectedLog="RawADLogs";
	//$scope.selectedLog=null;
	
	$http.get('/api/v1/logtypes').success(function (data) {
	   	
	  	$scope.logTypes=data;
	  	
	}).error(function (data, status) {

			window.alert('Error '+data);
	})
	
	/**
	 * function get resources on the selection of log type
	 */
   $scope.getResources= function (logVal){
		
  
		$http.get('/api/v1/keylist/'+logVal).success(function (data) {
		//$http.get('/api/v1/keylist/'+$scope.selectedLog).success(function (data) {
		        
		    	$scope.keys = data.sort();
		      
		     
		    }).error(function (data, status) {
		        console.log('Error ' + data);
		    })
  
	}
	    
    $scope.drawTreeForKey=function (){
		 
             
        $http.get('/api/v1/tree?key='+$scope.selectedResource+'&log='+$scope.selectedLog).success(function (data) {
   		    	
   		    	 $scope.events = data;
   		    	
   		 }).error(function (data, status) {
        	
        	window.alert('Error '+data);
   		 })
          
    }

   
});



app.controller('FpCtrl', function ($scope, $http) {
  
	$http.get('/api/v1/logtypes').success(function (data) {
	   	
	  	$scope.logTypes=data;
	  	
	}).error(function (data, status) {

			window.alert('Error '+data);
	})
  
	$scope.numPatterns=[100,200,500,1000];
 
  
   $scope.showFrequentPatterns=function(logVal, numPattern){
              console.log(logVal+" "+numPattern);
             
			  $http.get('/api/v1/fp?num='+numPattern+'&log='+logVal).success(function (data) {
				  	  
					  $scope.fp=data;
					  var doc=document.getElementById('chart');
 		 			  if (doc!=null){
 		    				doc.innerHTML= "";
 		  			   }    
					  
 		 			var doc=document.getElementById('legend');
		 			  if (doc!=null){
		    				doc.innerHTML= "";
		  			   }    
					  
 		 			  drawSunBurstChart(data);
				 
			    }).error(function (data, status) {
			        console.log('Error ' + data);
			    })
	}
   
});


/**
 * Directive 
 */
app.directive("treeChart",function(){
return {
	restrict: 'EA',
	template:'<div id="chart"></div>',
	scope:{info: '@'},
	link: function (scope,element,attrs){
				
				function drawTree(){
							var adjustSize=scope.info.length/5;
							var root = angular.fromJson(scope.info);
							//console.log(root);
							
								
							var margin = {top: 10, right: 320, bottom: 0, left: 0},
							    width = 1200 - margin.left - margin.right + adjustSize,
							    height = 500 - margin.top - margin.bottom + adjustSize;
							
							var tree = d3.layout.tree()
							    .separation(function(a, b) { return a.parent === b.parent ? 1 : .5; })
							    .children(function(d) { return d.fBranches; })
							    .size([height, width]);
							
							var svg = d3.select("#chart").append("svg")
							    .attr("width", width + margin.left + margin.right)
							    .attr("height", height + margin.top + margin.bottom)
							  .append("g")
							    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
							
							var nodes = tree.nodes(root);
							//console.log(nodes.length);
							//console.log(nodes);
							
							
								
							  var diagonal = d3.svg.diagonal()
										.projection(function(d) { return [d.y, d.x]; });
							
							  var link = svg.selectAll(".link")
							      .data(tree.links(nodes))
							    .enter().append("path")
							      .attr("class", "link")
							     //.attr("d", elbow);
							    .attr("d",diagonal);
							
							  var node = svg.selectAll(".node")
							      .data(nodes)
							    .enter().append("g")
							      .attr("class", "node")
							      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
							
							  node.append("text")
							      .attr("class", "name")
							      .attr("x", 8)
							      .attr("y", -5)
							      .text(function(d) { return d.fEvent; })
							      .attr("dy", ".35em");
							      
							 
							  node.append("circle")
										  .attr("r", 5)
										  .style("stroke",  "grey")
										  .style("fill",  "blue" );
							
							 // node.append("text")
							  //    .attr("x", 8)
							  //   .attr("y", 8)
							  //    .attr("dy", ".71em")
							  //    .attr("class", "about lifespan")
							   //  .text(function(d) { return d.born + "–" + d.died; });
							
							 // node.append("text")
							   //   .attr("x", 8)
							    //  .attr("y", 8)
							      //.attr("dy", "1.86em")
							      //.attr("class", "about location")
							      //.text(function(d) { return d.fBranches.length; });
							//});
							
							function elbow(d, i) {
							  return "M" + d.source.y + "," + d.source.x
							       + "H" + d.target.y + "V" + d.target.x
							       + (d.target.children ? "" : "h" + margin.right);
							}
				  }
				  
				  
				  scope.$watch('info', function(){
    					if(!scope.info) return; //If there is no data, do nothing
			 			
						//console.log("hey i m in console "+scope.info);
						//	now call your draw function
						 var doc=document.getElementById('chart');
   		 				if (doc!=null){
   		    				doc.innerHTML= "";
   		  				 }    
    				     drawTree();
				});
				
					
				
				
  	
     }
};
});