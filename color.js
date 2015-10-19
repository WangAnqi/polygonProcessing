var netvalue;
var may,miy;
//color #FF6A6A
function polyfill(polygon)
{
	
    var aet = [];
    var y_value = {};
    
    getAET(polygon, aet, y_value);
    delta_y = y_value.max_y - y_value.min_y;
    var min_y = y_value.min_y;
    for(var i = 0; i <= delta_y; i++)
    {
        var new_scan_lines = aet[i];
        for(var j = 0; j+1 < new_scan_lines.length; j+=2)
        {
            var max_x, min_x;
            min_x = new_scan_lines[j][0];
            max_x = new_scan_lines[j+1][0];
            /*if(new_scan_lines[j][0] > new_scan_lines[j+1][0])
            {
                max_x = new_scan_lines[j][0];
                min_x = new_scan_lines[j+1][0];
            }*/
            if(max_x > min_x + 1){
                my_context.moveTo(min_x+1,i+min_y);
                my_context.lineTo(max_x-1,i+min_y);
            }
            
        }
    }
}

function getAET(polygon, aet, y_value){
    var net = [];
    var all_points_set = [];

    max_y = 0, min_y = my_canvas.height;
    for(var i = 0; i < polygon.outer_points.length; i++)
    {
        if(polygon.outer_points[i].y > max_y)
        {
            max_y = polygon.outer_points[i].y;
        }
        if(polygon.outer_points[i].y < min_y)
        {
            min_y = polygon.outer_points[i].y;
        }

        if(i < polygon.outer_points.length-1)
        {
            all_points_set.push(polygon.outer_points[i]);
        }
    }
    y_value.max_y = max_y;
    y_value.min_y = min_y;

    for(var i = 0; i < polygon.inner_rings.length; i++)
    {
        var len = polygon.inner_rings[i].length - 1;
        for(var j = 0; j < len ; j++)
        {
            all_points_set.push(polygon.inner_rings[i][j]);
        }
    }

    for(var i = min_y; i <= max_y; i++)
    {
        var new_sides = [];
        var index = 0;
        getNewSides(i,all_points_set,index,polygon.outer_points.length,new_sides);
        index += (polygon.outer_points.length-1);
        for(var j = 0; j < polygon.inner_rings.length; j++)
        {
            getNewSides(i,all_points_set,index,polygon.inner_rings[j].length,new_sides);
            index += (polygon.inner_rings[j].length-1);
        }
        net.push(new_sides);
    }

    //netvalue = net;
    //may = max_y;
    //miy = min_y;

    var delta_y = max_y - min_y;
    for(var i = 0; i <= delta_y; i++)
    {
        var new_scan_lines = [];
        
        if(i > 0)
        {
            var last_i = i - 1;
            var current_y = i + min_y;
            for(var j = 0; j < aet[last_i].length; j++)
            {
                if(aet[last_i][j][2] > current_y)
                {
                    var scan_point = [];
                    scan_point[0] = aet[last_i][j][0] + aet[last_i][j][1];
                    scan_point[1] = aet[last_i][j][1];
                    scan_point[2] = aet[last_i][j][2];
                    new_scan_lines.push(scan_point);
                }
            }
        }

        for(var j = 0;  j < net[i].length; j++)
        {
            var scan_side = [];
            var p_low = all_points_set[net[i][j][0]];
            var p_high = all_points_set[net[i][j][1]];
            scan_side.push(p_low.x);
            scan_side.push((p_low.x - p_high.x) / (p_low.y - p_high.y));
            scan_side.push(p_high.y);
            
            var k = 0;
            while(k < new_scan_lines.length && k >= 0)
            {
                if(new_scan_lines[k][0] > p_low.x)
                {
                    break;
                }
                else if(new_scan_lines[k][0] == p_low.x && new_scan_lines[k][1] > scan_side[1])
                {
                    break;
                }
                else
                {
                    k++;
                }
            }
            new_scan_lines.splice(k,0,scan_side);
        }
        aet.push(new_scan_lines);
    }
}

function getNewSides(i,points,start_index,length,new_sides) {
	var len = start_index + length - 1;
    for(var j = start_index; j < len; j++)
    {
    	if(points[j].y == i)
    	{
            if(j == start_index)
            {
               	if(points[len-1].y > points[j].y)
               	{
               		var new_side = [];
               		new_side.push(j);
               		new_side.push(len-1);
               		new_sides.push(new_side);
               	}
               	if(points[j+1].y > points[j].y)
                {
                	var new_side = [];
                	new_side.push(j);
                	new_side.push(j+1);
                	new_sides.push(new_side);
                }
            }
            else if(j == len-1)
            {
               	if(points[j].y < points[start_index].y)
               	{
               		var new_side = [];
               		new_side.push(j);
               		new_side.push(start_index);
               		new_sides.push(new_side);
               	}
               	if(points[j].y < points[j-1].y)
                {
                	var new_side = [];
                	new_side.push(j);
                	new_side.push(j-1);
                	new_sides.push(new_side);
                }
            }
            else
            {
                if(points[j].y < points[j+1].y)
                {
                    var new_side = [];
                	new_side.push(j);
                	if(j == len -1)
                	{
                		new_side.push(0);
                	}
                	else
                	{
                		new_side.push(j+1);
                	}
                	new_sides.push(new_side);
                }
                if(points[j].y < points[j-1].y)
                {
                	var new_side = [];
                	new_side.push(j);
                	new_side.push(j-1);
                	new_sides.push(new_side);
                }
            }
    	}
    }
}