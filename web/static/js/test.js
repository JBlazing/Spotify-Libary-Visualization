var height = 720;
var width = 1080;
var radius = 5;



function drawTextTopLeft(d){
	
	svg.append("text")
		.attr("class" , "name")
		.attr("x", 25)
		.attr("y" , 25)
		.text("Artist: " + d.id)
		
	
}
function removeText(){
	
	svg.selectAll(".name").remove()
}
	



  
function createGraph(data , svg){
	var artists = data.map(x => Object.keys(x)[0])

	console.log(artists)

	var aSet = new Set();
	edges = [];
	data.forEach(function(d,i) {
	art = Object.keys(d)[0]
	aSet.add(art);
	d[art].forEach(function (x) {
		aSet.add(x);
		edges.push({"source": art , "target": x , "value":5})
	})	
	}) 
	var ids = [... aSet].map(function(d){ return {"id" : d , "group": 1}})
	
	return {"nodes": ids , "edges" : edges , "inlib" : artists}
}
  
function artistGraph(graph){


var generatePoints = function(n){
	
	var points = [];
	for(let i = 0 ; i < n ; i++){
		points.push({"x" : d3.randomUniform( width)() , "y" : d3.randomUniform(height)()})
	}
	return points
} 

// create ids
function color(d){
	if(graph.inlib.includes(d))
	{
		return "red";
	}
	else
		return "blue";
	
}



var charge_force = d3.forceManyBody()
    .strength(-2);
    
var center_force = d3.forceCenter(width / 2, height / 2);  


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", charge_force)
    .force("center", center_force);
svg.selectAll("*").remove();

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//artists = Array.from(aSet);


//create edges

var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.edges)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
	  .style("stroke" , "black")

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", radius)
      .attr("fill", function(d) { return color(d.id); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
		  .on("mouseover" ,drawTextTopLeft)
		  .on("mouseout" ,removeText)

  node.append("title")
      .text(function(d) { return d.id; });

	svg.append("text")
		.attr("x" , 335 )
		.attr("y" , 25 )
		.text("In Libary:")
	svg.append("circle")
		.attr("r" , radius)
		.attr("cx" , 415)
		.attr("cy" , 22)
		.style("fill" , "red")
	
	svg.append("text")
		.attr("x" , 450 )
		.attr("y" , 25 )
		.text("Not In Libary:")
	svg.append("circle")
		.attr("r" , radius)
		.attr("cx" , 555)
		.attr("cy" , 22)
		.style("fill" , "Blue")
	  
	function ticked() {
    //constrains the nodes to be within a box
      node
        .attr("cx", function(d) { return d.x = Math.max(100, Math.min(width - 100, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(75, Math.min(height - 75, d.y)); });
        
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
} 	  
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.edges);


	  

}
