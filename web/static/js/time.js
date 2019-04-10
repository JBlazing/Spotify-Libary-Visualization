function drawText(d){
	svg.append("text")
		.attr("class" , "name")
		.attr("x" , 25)
		.attr("y", 25 )
		.text("Track: " + d.track.name)
	var x = d.track.artists.map(x => x.name)
	svg.append("text")
		.attr("class" , "name")
		.attr("x" , 25)
		.attr("y", 45)
		.text("Artists: " + x.join())
}

function drawTextTop(d){
	svg.append("text")
		.attr("class" , "name")
		.attr("x" , 25)
		.attr("y", 25 )
		.text("Track: " + d.name)
	var x = d.artists.map(x => x.name)
	svg.append("text")
		.attr("class" , "name")
		.attr("x" , 25)
		.attr("y", 45)
		.text("Artists: " + x.join())
}
function removeText(d){

	svg.selectAll(".name")
		.remove()
	
}

function colorSimilar(d, idx,t){

	var g = genres.genre[idx].genres
	
	svg.selectAll('.node')
		.style("fill" , function(d , idx){
			var gg = genres.genre[idx].genres
			let x = _.intersection(gg , g)
			if(x.length > 0)
			{
				return "red";
			}
			else if (gg.length == g.length) 
				return "red";
			else return "black"
		})
	

	
	
	
	
}
function fixColor(){
	
	svg.selectAll(".node").style("fill" ,"black");
	
}

function timeGraph(tracks)
{
	svg.selectAll("*").remove();
	
	//parse UTC time 
	var iso = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");;
	
	var maxdate = d3.max(tracks , function(d){
			return iso(d.added_at);
		
	});
	
	var mindate = d3.min(tracks , function(d){
		
		return iso(d.added_at);
		
	})
	
	
	var extent = d3.extent(tracks , x => x.track.popularity*2)
	
	var y = d3.scaleLinear().domain(extent).range([100 , height-100])
	
	console.log([mindate,maxdate])
	var xScale = d3.scaleTime()
	        .domain([mindate, maxdate])    // values between for month of january
			.range([100, width - 100]); 
	
	var xAxis = d3.axisBottom(xScale);
	svg.append("g").attr("transform", "translate(0," + (height - 30 - 20) + ")")
      .call(xAxis);
	//var g = svg.append("g").attr("transform", "translate(" + 80 + "," + 50 + ")");
	/*g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(7));
	*/ //draw the stuff
	//console.log(xScale(tracks[0]).added_at)
	
	
	
	var node = svg.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(tracks)
		.enter().append("circle")
		.attr("class" , "node")
		.attr("r", radius)
		.attr("cx" , x => xScale(iso(x.added_at)))
		.attr("cy" , x => y(x.track.popularity*2))
		.on("mouseover", function(d,idx){
							drawText(d);
							colorSimilar(d,idx,this);
		})
		.on("mouseout" , function() {
						removeText();
						fixColor();
		})
	svg.append("text")
		.attr("x" , 335 )
		.attr("y" , 25 )
		.text("Related:")
	svg.append("circle")
		.attr("r" , radius)
		.attr("cx" , 400)
		.attr("cy" , 25)
		.style("fill" , "red")
	
	//x axis
	
	
	//figure out 
	
}


function topTime(topTracks){
	
		//parse UTC time 
	var iso = d3.utcParse("%Y-%m-%d");
	var test = []
	var max = d3.max(topTracks.long.items , function(d){
			return iso(d.album.release_date);
		
	});
	
	var min = d3.min(topTracks.long.items , function(d){
		
		return iso(d.album.release_date);
		
	});
	test.push(min)
	test.push(max)
	
	max = d3.max(topTracks.med.items , function(d){
			
			return iso(d.album.release_date);
		
	});
	
	min = d3.min(topTracks.med.items , function(d){
		
		return iso(d.album.release_date);
		
	});
	test.push(min)
	test.push(max)
	max = d3.max(topTracks.long.items , function(d){
			return iso(d.album.release_date);
		
	});
	
	min = d3.min(topTracks.long.items , function(d){
		
		return iso(d.album.release_date);
		
	});
	test.push(min)
	test.push(max)
	
	var ex = d3.extent(test)
	console.log(ex)
	
	////////////
	test = []
	 max = d3.max(topTracks.long.items , function(d){
			return d.popularity*2;
		
	});
	
	 min = d3.min(topTracks.long.items , function(d){
			return d.popularity*2;
		
	});
	test.push(min)
	test.push(max)
	
	max = d3.max(topTracks.med.items , function(d){
			return d.popularity*2;
		
	});
	
	min = d3.min(topTracks.med.items , function(d){
			return d.popularity*2;
		
	});
	test.push(min)
	test.push(max)
	max = d3.max(topTracks.long.items , function(d){
			return d.popularity*2;
		
	});
	
	min = d3.min(topTracks.long.items , function(d){
			return d.popularity*2;
		
	});
	test.push(min)
	test.push(max)
	var extent = d3.extent(test)
	svg.selectAll("*").remove()
	
	var xScale = d3.scaleTime()
	        .domain(ex)    // values between for month of january
			.range([100, width - 100]); 
	
	var y = d3.scaleLinear().domain(extent).range([100 , height-100])
	
	var xAxis = d3.axisBottom(xScale);
	svg.append("g").attr("transform", "translate(0," + (height - 30 - 20) + ")")
      .call(xAxis);
	
	var nodeL = svg.append("g")
		.attr("class", "longnodes")
		.selectAll("circle")
		.data(topTracks.long.items)
		.enter().append("circle")
		.attr("class" , "long")
		.attr("r", radius)
		.attr("cx" , x => xScale(iso(x.album.release_date)))
		.attr("cy" , x => y(x.popularity*2))
		.on("mouseover", function(d,idx){
							drawTextTop(d);
							//colorSimilar(d,idx,this);
		})
		.on("mouseout" , function() {
						removeText();
						//fixColor();
		})
	
	var nodeM = svg.append("g")
		.attr("class", "mednodes")
		.selectAll("circle")
		.data(topTracks.med.items)
		.enter().append("circle")
		.attr("class" , "med")
		.attr("r", radius)
		.attr("cx" , x => xScale(iso(x.album.release_date)))
		.attr("cy" , x => y(x.popularity*2))
		.on("mouseover", function(d,idx){
							drawTextTop(d);
							//colorSimilar(d,idx,this);
		})
		.on("mouseout" , function() {
						removeText();
						//fixColor();
		})
	var nodeS = svg.append("g")
		.attr("class", "longnodes")
		.selectAll("circle")
		.data(topTracks.short.items)
		.enter().append("circle")
		.attr("class" , "short")
		.attr("r", radius)
		.attr("cx" , x => xScale(iso(x.album.release_date)))
		.attr("cy" , x => y(x.popularity*2))
				.on("mouseover", function(d,idx){
							drawTextTop(d);
							//colorSimilar(d,idx,this);
		})
		.on("mouseout" , function() {
						removeText();
						//fixColor();
		})
		
		
			svg.append("text")
		.attr("x" , 335 )
		.attr("y" , 25 )
		.text("Long Term:")
	svg.append("circle")
		.attr("r" , radius)
		.attr("cx" , 425)
		.attr("cy" , 22)
		.style("fill" , "red")
	
	svg.append("text")
		.attr("x" , 450 )
		.attr("y" , 25 )
		.text("Medium Term:")
	svg.append("circle")
		.attr("r" , radius)
		.attr("cx" , 555)
		.attr("cy" , 22)
		.style("fill" , "Blue")
		
		
		svg.append("text")
		.attr("x" , 585 )
		.attr("y" , 25 )
		.text("Short Term:")
	svg.append("circle")
		.attr("r" , radius)
		.attr("cx" , 670)
		.attr("cy" , 22)
		.style("fill" , "green")

}