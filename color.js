var netvalue;
var may,miy;
//color #FF6A6A
function polyfill(polygon, color)
{
	var aet = [];
	var net = [];
    var all_points_set = [];

	var max_y = 0, min_y = my_canvas.height;
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
    
    for(var i = 0; i < polygon.inner_rings.length; i++)
    {
    	var len = polygon.inner_rings[i].length - 1;
        for(var j = 0; j < len ; j++)
        {
            all_points_set.push(polygon.inner_rings[i][j]);
        }
    }
    
    //console.log(all_points_set);
    var imgData=my_context.createImageData(1,1);
    //imgData.data[0] = 255;
    //imgData.data[1] = 106;
    //imgData.data[2] = 106;
    imgData.data[3] = 255;
    imgData.data[0] = color[0];
    imgData.data[1] = color[1];
    imgData.data[2] = color[2];

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

    netvalue = net;
    may = max_y;
    miy = min_y;

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
                if(new_scan_lines[k][0] >= p_low.x)
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
        
        //console.log(new_scan_lines);
        aet.push(new_scan_lines);

        for(var j = 0; j+1 < new_scan_lines.length; j+=2)
        {
        	var max_x, min_x;
        	min_x = new_scan_lines[j][0];
        	max_x = new_scan_lines[j+1][0];
        	if(new_scan_lines[j][0] > new_scan_lines[j+1][0])
        	{
                max_x = new_scan_lines[j][0];
                min_x = new_scan_lines[j+1][0];
        	}
            for(var w = min_x + 1; w < max_x; w++)
            {
            	
                my_context.putImageData(imgData,w,i+min_y);
            }
        }
    }

    //console.log(aet);
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