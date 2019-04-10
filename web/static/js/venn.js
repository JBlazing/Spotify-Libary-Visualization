
function vennDiagram(topTracks){
	
	
	//extract names
	var l = topTracks.long.items.map(x => x.name)
	var m = topTracks.med.items.map(x => x.name)
	var s = topTracks.short.items.map(x => x.name)
	var data = {Set:["Long Term"] , name:"tezt" }
	
	//calc intersections
	l_m_s = _.intersection(l,m,s)
	l_m = _.intersection(l,m)
	l_s = _.intersection(l,s)
	m_s = _.intersection(m,s)
	
	
	var sets = [ {sets:['Long Term'] , size : l.length , data:l.join("<br>")}, {sets:['Short Term'] , size : s.length , data: s.join("<br>")},
				{sets:['Medium Term'] , size : m.length , data:m.join("<br>")}, {sets:['Long Term' , "Short Term" , "Medium Term"] , size : l_m_s.length , data: l_m_s.join("<br>")},
				{sets:['Long Term', 'Medium Term'] , size : l_m.length , data: l_m.join("<br>")},
				{sets:['Long Term', 'Short Term' ] , size : l_s.length , data: l_s.join("<br>")},
				{sets:['Short Term' , 'Medium Term'] , size : m_s.length , data: m_s.join("<br>")}  ]
				
	var ven = venn.VennDiagram().height(height).width(width)
	
	svg.selectAll("*").remove()
	
	svg.datum(sets).call(ven);
	var tooltip = d3.select("body").append("div")
    .attr("class", "venntooltip");
    
	
	svg.select("svg").selectAll("g")  .on("mouseover", function(d, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(svg, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(400).style("opacity", .9);
        tooltip.html(d.data);
        
        // highlight the current path
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 3)
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 1);
    })

    .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })
    
    .on("mouseout", function(d, i) {
        tooltip.transition().duration(400).style("opacity", 0);
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 0)
            .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
            .style("stroke-opacity", 0);
    })	
}