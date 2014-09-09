var visualization, dd;

$(function () {
	/// Initialization function - binds event with buttons and prepare the stage
	
	/// React to the screen size change
	$(window).bind('resize', adjustMainMenu);
	adjustMainMenu();
	
	$('#search-button').bind('click', function() {
		/// 'Visualize' button interaction - JSONP call and flow
		  var resume = $('#search-text').val(),
		      url = 'http://microformat2-node.jit.su/?url=' + encodeURIComponent(resume) + '&formats=hResume';
		  $.ajax({
			   type: 'GET',
				url: url,
				async: false,
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(json) {
				   visualization = generateVisualization();
				   var data = prepareData(json);
				   dd = json;
				   d3.select('#visualization').data([data]).call(visualization);
				},
				error: function(e) {
				   console.log(e.message);
				}
			});
		});
	
});
	
function prepareData (data) {
	/// This will transform data received by web service parser and return data ready for D3 component
	var r = {name: 'resume', children: []}
	
	function nest (json, anchor) {
		var acc = [];
		d3.keys(json).forEach(function (d) {
		if (typeof json[d] == 'string') {
			acc.push( {
				name : d, 
				value : json[d]
			})
		} else {
			acc.push( {
				name : d, 
				value: d,
				children : nest(json[d])
			})

		}
		});
		return acc;
	}
	
	//r.children = nest(data.microformats.hresume[0]);
	r.children = nest(data.items[0].properties);
	
	return r;
}

function generateVisualization () {
	/// D3 component responsible for rendering tree
	
	var width = 720,
        height = 80;

	  function chart(selection) {
		selection.each(function(data, i) {
			//$(this).html(JSON.stringify(data));
			
			var diameter = 1200;

			var tree = d3.layout.tree()
				.size([360, diameter / 2 - 120])
				.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

			var diagonal = d3.svg.diagonal.radial()
				.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

			var svg = d3.select("body").append("svg")
				.attr("width", diameter)
				.attr("height", diameter - 150)
			  .append("g")
				.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

			
			  var nodes = tree.nodes(data),
				  links = tree.links(nodes);

			  var link = svg.selectAll(".link")
				  .data(links)
				.enter().append("path")
				  .attr("class", "link")
				  .attr("d", diagonal);

			  var node = svg.selectAll(".node")
				  .data(nodes)
				.enter().append("g")
				  .attr("class", "node")
				  .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

			  node.append("circle")
				  .attr("r", 4.5);

			  node.append("text")
				  .attr("dy", ".31em")
				  .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
				  .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
				  .text(function(d) { return d.value; });

			d3.select(self.frameElement).style("height", diameter - 150 + "px");
			
		  });
	  }

	  chart.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return chart;
	  };

	  chart.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return chart;
	  };

	  return chart;
};

function adjustMainMenu () {
	/// This will put search box under logo if screen narrow
	if(document.width && document.width < 900) {
			d3.select('body').classed('narrow', true);
		} else {
			d3.select('body').classed('narrow', false);
		}
}

///Example of resumes with hResume markup
//http://veerasundar.com/resume/ http://leek.github.io/
