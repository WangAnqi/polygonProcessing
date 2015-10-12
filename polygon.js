var my_canvas = document.getElementById('my_canvas');
var my_context = my_canvas.getContext('2d');
my_context.lineWidth = 1;
my_context.strokeStyle="#8B8B7A";//#CDCDB4
var new_polygon_flag = 0; //0 for nothing to do,1 for start a polygon, 2 for add outer points, 3 for outer is done
var inner_ring_flag = 0; //0 for nothing to do, 1 for start an inner ring, 2 for add inner ring's points
var new_polygon, new_inner_ring;
var all_polygons = new Array();
var all_polygons_color = new Array();


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
            polyfill(all_polygons[i]);
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