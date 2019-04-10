function stuff(data){

var height = 1280;
var width = 720;
var generatePoints = function(n){
	
	var points = [];
	for(let i = 0 ; i < n ; i++){
		points.push({"x" : d3.randomUniform( width)() , "y" : d3.randomUniform(height)()})
	}
	return points
} 
 /*
	Graph Viz

 */


var artists = data.map(x => Object.keys(x)[0])

console.log(artists.length)

var aSet = new Set();
edges = [];
data.forEach(function(d,i) {
	art = Object.keys(d)[0]
	aSet.add(art);
	d[art].forEach(function (x) {
		aSet.add(x);
		edges.push({"source": art , "target": x})
	})	
})

console.log(edges)

edgesR = edges.filter(function (d) {return (artists.indexOf(d.source) >= 0 && artists.indexOf(d.target) >= 0)})

console.log(edgesR)
//artists = Array.from(aSet);
var svg = d3.select('#Design1').append('svg').attr('width' , width).attr('height' , height)

//create edges





var points =  generatePoints(artists.length)

var pandL = points.map(function(e,i){ e.name = artists[i]; return e;})

edgesR.forEach(function(d){	d.source = pandL[artists.indexOf(d.source)];
							d.target = pandL[artists.indexOf(d.target)];
							})
console.log(edgesR);




svg.selectAll("g").data(points).enter().append("circle")
	.attr("r" , 5)
	.attr("cx" , function(d) {return d.x;})
	.attr("cy" , function(d) {return d.y;})

	svg.selectAll("g").data(pandL).enter().append("text")
	.attr("x", function(d) {return d.x+10;}).attr("y" , function(d){return d.y-10;} ).attr("font-size" , 12).html(function(d) {return d.name} )

svg.selectAll("g").data(edgesR).enter().append("line")
	.attr("x1" , function(d){return d.source.x;})
	.attr("y1" , function(d){return d.source.y;})
	.attr("x2" , function(d){return d.target.x;})
	.attr("y2" , function(d){return d.target.y;})
	.style("stroke", "#ccc");
	
	
/*

Word Cloud
*/
}
