var my_canvas = document.getElementById('my_canvas');
var my_context = my_canvas.getContext('2d');
my_context.lineWidth = 1;
my_context.strokeStyle="#8B8B7A";//#CDCDB4
var new_polygon_flag = 0; //0 for nothing to do,1 for start a polygon, 2 for add outer points, 3 for outer is done
var inner_ring_flag = 0; //0 for nothing to do, 1 for start an inner ring, 2 for add inner ring's points
var new_polygon, new_inner_ring;
var all_polygons = new Array();
var all_polygons_color = new Array();

$("#my_canvas").click(function(e){
	var clickpoint = {x:e.layerX, y:e.layerY};
	if(new_polygon_flag == 1 && inner_ring_flag == 0)
	{
        new_polygon_flag = 2;

		var polygon = Polygon.createNew();
		all_polygons.push(polygon);
		
		new_polygon = polygon;
		new_polygon.outer_points.push(clickpoint);
	}
	else if(new_polygon_flag == 2 && inner_ring_flag == 0)
	{
        new_polygon.outer_points.push(clickpoint);
	}
	else if(inner_ring_flag == 1)
	{
        inner_ring_flag = 2;

        var ring = new Array();
        new_polygon.inner_rings.push(ring);
        
        new_inner_ring = ring;
        new_inner_ring.push(clickpoint);
	}
	else if(inner_ring_flag == 2)
	{
		new_inner_ring.push(clickpoint);
	}

	draw_polygons();
});

$("#new_button").click(function(){
	if(new_polygon_flag != 0 && new_polygon_flag != 3 || inner_ring_flag != 0){
		return;
	}
	else{
        new_polygon_flag = 1;
	}
});

$("#outer_done_button").click(function(){
	var len = new_polygon.outer_points.length - 1;
	if(len < 2)
	{
		alert("Points of the polygon should be more than 2.");
		return;
	}
	else if(new_polygon.outer_points[0].x != new_polygon.outer_points[len].x || new_polygon.outer_points[0].y != new_polygon.outer_points[len].y)
	{
		new_polygon.outer_points.push({x:new_polygon.outer_points[0].x, y:new_polygon.outer_points[0].y});
	}
	new_polygon_flag = 3;
	draw_polygons();
});

$("#inner_button").click(function(){
	if(inner_ring_flag == 0 && new_polygon_flag == 3)
	{
        inner_ring_flag = 1;
	}
});

$("#inner_done_button").click(function(){
	if(inner_ring_flag == 2)
	{
        inner_ring_flag = 0;
	}
    else
    {
    	return;
    }
	var numOfRings = new_polygon.inner_rings.length;
    var current_ring = new_polygon.inner_rings[numOfRings-1];
    var len = current_ring.length - 1;
	if(len < 2)
	{
		alert("Points of the inner ring should be more than 2.");
		return;
	}
	else if(current_ring[0].x != current_ring[len].x || current_ring[0].y != current_ring[len].y)
	{
		current_ring.push({x:current_ring[0].x, y:current_ring[0].y});
	}
	draw_polygons();
});

$("#poly_done").click(function(){
    if(new_polygon_flag == 3 && inner_ring_flag == 0)
    {
        new_polygon_flag = 0;
        var poly_color = document.getElementById("poly_color").value;
        document.getElementById("poly_color").value = "";
        if(poly_color.length == 7 && poly_color[0] == "#" && /[0-9a-fA-F]{6,6}/.test(poly_color))
        {
            var color_data = [];
            color_data[0] = parseInt("0x"+poly_color.slice(1,3));
            color_data[1] = parseInt("0x"+poly_color.slice(3,5));
            color_data[2] = parseInt("0x"+poly_color.slice(5,7));
            all_polygons_color[all_polygons.length-1] = color_data;
        }
        draw_polygons();
    }
});

var Polygon = {
    createNew: function(){
    	var polygon = {};
    	polygon.outer_points = new Array();
    	polygon.inner_rings = new Array();
    	return polygon;
    }
};

function draw_polygons() {
	my_context.clearRect(0,0,my_canvas.width,my_canvas.height);
    my_context.beginPath();

	for (var i = 0; i < all_polygons.length; i++) {
	    draw_polygon(all_polygons[i].outer_points)
        for(var j = 0; j < all_polygons[i].inner_rings.length; j++)
        {
        	draw_polygon(all_polygons[i].inner_rings[j]);
        }
        
        if(all_polygons_color[i] != undefined)
        {
            polyfill(all_polygons[i],all_polygons_color[i]);
        }
	};

	my_context.stroke();
}

function draw_polygon(polygon_points){
    my_context.moveTo(polygon_points[0].x,polygon_points[0].y);
	for(var j = 1; j < polygon_points.length; j++)
	{
	    my_context.lineTo(polygon_points[j].x,polygon_points[j].y);
	}
}