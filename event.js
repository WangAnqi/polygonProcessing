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
        /*var poly_color = document.getElementById("poly_color").value;
        document.getElementById("poly_color").value = "";
        if(poly_color.length == 7 && poly_color[0] == "#" && /[0-9a-fA-F]{6,6}/.test(poly_color))
        {
            all_polygons_color[all_polygons.length-1] = poly_color;
        }*/
        all_polygons_color[all_polygons.length-1] = 1;
        draw_polygons();
    }
});

$("#clip").click(function(){
    alert("Under construction.");
});

$('body').keydown(function(event){
 if (event.which == 37 || event.which == 39 || event.which == 38 || event.which == 40) { 
    translate_all_poly(event.which);
    draw_polygons();
 }
 if(event.which == 187) //=
 {
 	scale_all_poly(1.001);
 	draw_polygons();
 }
 if(event.which == 189) //-
 {
 	scale_all_poly(0.009);
 	draw_polygons();
 }
});

!function () {
        var EventUtil = {
            addHandler: function (element, type, handler) {
                if (element.addEventListener) {
                    element.addEventListener(type, handler, false);
                } else if (element.attachEvent) {
                    element.attachEvent('on' + type, handler);
                } else {
                    element['on' + type] = handler;
                }
            },
            getEvent: function (event) {
                return event ? event : window.event;
            },
            stopPropagation: function (event) {
                event = event || window.event;
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    event.cancelBubble = true;
                }
            }
        };
 
        function handleMouseWheel(event) {
            EventUtil.stopPropagation(event);
            event = EventUtil.getEvent(event);
            var value = event.wheelDelta || -event.detail;
            //console.log(value);
            rotate_all_poly(value);
            //var delta = Math.max(-1, Math.min(1, value));
            //console.log(delta < 0 ? 'down' : 'up');
            draw_polygons();
        }
 
        EventUtil.addHandler(document, 'mousewheel', handleMouseWheel);
        EventUtil.addHandler(document, 'DOMMouseScroll', handleMouseWheel);
}();