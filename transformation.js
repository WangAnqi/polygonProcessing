function scale_all_poly(scale)
{
	var ref_point = {};
    ref_point.x = my_canvas.width / 2;
    ref_point.y = my_canvas.height / 2;
   
    

    var scale_args = [];
    scale_args.push(scale);
    scale_args.push(scale);
    scale_args.push(ref_point.x*(1-scale_args[0]));
    scale_args.push(ref_point.y*(1-scale_args[1]));
    
    for(var i = 0; i < all_polygons.length; i++)
	{
        scale_poly(scale_args,all_polygons[i].outer_points);
        for(var j = 0; j < all_polygons[i].inner_rings.length; j++)
        {
        	scale_poly(scale_args,all_polygons[i].inner_rings[j]);
        }
	}
}
function scale_poly(scale_args, points)//scale
{
	var tmp_x, tmp_y;
    for(var i = 0; i < points.length; i++)
    {
        tmp_x = points[i].x;
        tmp_y = points[i].y;

        points[i].x = Math.ceil(tmp_x*scale_args[0] + scale_args[2]);
        points[i].y = Math.ceil(tmp_y*scale_args[1] + scale_args[3]);
    }
}



function rotate_all_poly(offset)
{
	var ref_point = {};
    ref_point.x = my_canvas.width / 2;
    ref_point.y = my_canvas.height / 2;

    var angle = Math.PI / 10 * (offset / 120);

    var rotate_args = [];
    rotate_args.push(Math.sin(angle));
    rotate_args.push(Math.cos(angle));
    rotate_args.push(ref_point.x*(1-rotate_args[1])+ref_point.y*rotate_args[0]);
    rotate_args.push(ref_point.y*(1-rotate_args[1])-ref_point.x*rotate_args[0]);
    
    for(var i = 0; i < all_polygons.length; i++)
	{
        rotate_poly(rotate_args,all_polygons[i].outer_points);
        for(var j = 0; j < all_polygons[i].inner_rings.length; j++)
        {
        	rotate_poly(rotate_args,all_polygons[i].inner_rings[j]);
        }
	}
}
function rotate_poly(rotate_args, points)//rotate_args[0] sin, [1] cos, [2] x(1-cos)+ysin, [3] y(1-cos) - xsin
{
	var tmp_x, tmp_y;
    for(var i = 0; i < points.length; i++)
    {
        tmp_x = points[i].x;
        tmp_y = points[i].y;

        points[i].x = Math.ceil(tmp_x*rotate_args[1] - tmp_y*rotate_args[0] + rotate_args[2]);
        points[i].y = Math.ceil(tmp_x*rotate_args[0] + tmp_y*rotate_args[1] + rotate_args[3]);
    }
}


function translate_all_poly(direction){//direction 37 for left, 39 for right, 38 for up, 40 for down
	var delta = {x:3,y:3};
	switch(direction)
	{
	case 37:
        delta.x = 0 - delta.x;
        delta.y = 0;
	    break;
	case 39:
        delta.y = 0;
	    break;
	case 38:
        delta.x = 0;
        delta.y = 0 - delta.y;
	    break;
	case 40:
	    delta.x = 0;
	    break;
	default:
	    return;
	}

	for(var i = 0; i < all_polygons.length; i++)
	{
        translate_poly(delta,all_polygons[i].outer_points);
        for(var j = 0; j < all_polygons[i].inner_rings.length; j++)
        {
        	translate_poly(delta,all_polygons[i].inner_rings[j]);
        }
	}
}

function translate_poly(delta, points)
{
    for(var i = 0; i < points.length; i++)
    {
    	points[i].x += delta.x;
    	points[i].y += delta.y;
    }
}