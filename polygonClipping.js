function all_polygon_Clipping()
{
    polygonClipping(1, all_polygons[1], all_polygons[0]);
}

function polygonClipping(poly_main_index, poly_main, poly_clip)
{
    var main = {}, clip = {}, holes = {};
    var numOfIntrPoints = polyIntr(poly_main, poly_clip, main, clip, holes);
    var IntrPoints_visited = [];
    var main_list = main.list;
    var clip_list = clip.list;
    var holes_list = holes.list;
    /*console.log(main_list);
    console.log(clip_list);
    console.log(holes_list);*/

    for(var i = 0; i < numOfIntrPoints; i++)
    {
        IntrPoints_visited[i] = false;
    }
    //console.log("28");

    var clipping_results = [];
    while(1)
    {
        var index = checkList(main_list, IntrPoints_visited);
        if(index == false)
        {
            break;
        }
        /*console.log(38);
        console.log(index);*/
        var new_polygon = Polygon.createNew();
        clipping_results.push(new_polygon);
        
        var list = main_list;
        var k = 0;
        while(1)
        {
            k++;
            if(k > 100)
            {
                break;
            }
            new_polygon.outer_points.push({x:list[index].x, y:list[index].y});
            /*console.log(46);
            if(list[index].index != undefined){
                console.log("list_index "+index+" "+list[index].type+" "+list[index].index+" "+list[index].x+" "+list[index].y);
            }
            else
                console.log("list_index "+index+" "+list[index].type+" "+list[index].x+" "+list[index].y);*/

            if(new_polygon.outer_points.length > 3 && new_polygon.outer_points[0].x == list[index].x && new_polygon.outer_points[0].y == list[index].y)
            {
                if(list[index].type == 2 || list[index].type == 3)
                {
                    IntrPoints_visited[list[index].index] = true;
                }
                break;
            }

            switch(list[index].type)
            {

                case 0:
                case 1:
                    index = findVertexInList(list[index], list, index) + 1;
                    break;
                case 2:
                    IntrPoints_visited[list[index].index] = true;
                    if(list == main_list)
                    {
                        index++;
                    }
                    else
                    {
                        index = findPointInList(list[index].index, main_list) + 1;
                        list = main_list;
                    }
                    break;
                case 3:
                    IntrPoints_visited[list[index].index] = true;
                    if(list == clip_list)
                    {
                        index++;
                    }
                    else{
                        index = findPointInList(list[index].index, clip_list) + 1;
                        list = clip_list;
                    }
                    break;
                default:
                    console.log("wrong type");
            }//switch end
        }//while end
    }//while end
    //console.log("92");
    if(clipping_results.length == 0)
    {
        if(isPolyInPoly(poly_main.outer_points, poly_clip) == 2)
        {
            var new_polygon = Polygon.createNew();
            new_polygon.outer_points = poly_main.outer_points;
            clipping_results.push(new_polygon);
        }
        else if(isPolyInPoly(poly_clip.outer_points, poly_main) == 2)
        {
            var new_polygon = Polygon.createNew();
            new_polygon.outer_points = poly_clip.outer_points;
            clipping_results.push(new_polygon);
        }
    }

    for(var i = 0, len = clipping_results.length; i < len; i++)
    {
        for(var j = 0, h_len = holes_list.length; j < h_len; j++)
        {
            if(holes_list[j] != 0 && isPolyInPoly(holes_list[j], clipping_results[i]) == 2)
            {
                clipping_results[i].inner_rings.push(holes_list[j]);
                holes_list[j] = 0;
            }
        }
        all_polygons_color.push(1);

        for(var j = 0, r_len = clipping_results[i].outer_points.length; j < r_len; j++)
        {
            //console.log("Yes");
            x = Math.floor(clipping_results[i].outer_points[j].x);
            y = Math.floor(clipping_results[i].outer_points[j].y);
            clipping_results[i].outer_points[j].x = x;
            clipping_results[i].outer_points[j].y = y;
        }
    }
    //console.log("121");

    if(clipping_results.length > 0)
    {
        all_polygons.splice(poly_main_index, 1);
        all_polygons_color.splice(poly_main_index, 1);
        all_polygons = all_polygons.concat(clipping_results);
    }
    else
    {
        var main_in_clip = isPolyInPoly(poly_main.outer_points,poly_clip);
        var clip_in_main = isPolyInPoly(poly_clip.outer_points,poly_main);
        if((main_in_clip == 0 && clip_in_main == 2) || (main_in_clip == 0 && clip_in_main == 0))
        {
            all_polygons.splice(poly_main_index, 1);
            all_polygons_color.splice(poly_main_index, 1);
        }
    }
    return clipping_results.length;
}

function checkList(list, p_visited)
{
    for(var i = 0, len = list.length; i < len; i++)
    {
        if((list[i].type == 2 || list[i].type == 3) && !p_visited[list[i].index])
        {
            return i;
        }
    }
    return false;
}

function findVertexInList(point, list, index)
{
    for(var i = list.length-1; i >= 0; i--)
    {
        if(list[i].x == point.x && list[i].y == point.y)
        {
            if(i < index)
            {
                return i;
            }
        }
    }
    return index;
}

function findPointInList(index, list)
{
    for(var i = 0, len = list.length; i < len; i++)
    {
        if((list[i].type == 2 || list[i].type == 3) && list[i].index == index)
        {
            return i;
        }
    }
    return false;
}

function polyIntr(poly_main, poly_clip, main_list, clip_list, hole_list){//main_list 主边形顶点列表
    //clip_list裁剪多边形顶点列表，hole_list完全属于裁剪区域的主多边形和裁剪多边形的holes
    var numOfIntrPoints = 0;

    correctDirectionOfRotation(poly_main);
    correctDirectionOfRotation(poly_clip);

    isPolyInPoly(poly_main.outer_points, poly_clip);
    isPolyInPoly(poly_clip.outer_points, poly_main);

    main_list.list = poly_main.outer_points.concat();
    clip_list.list = poly_clip.outer_points.concat();

    var main_ring_index = [];
    var clip_ring_index = [];
    main_ring_index.push(poly_main.outer_points.length-1);
    clip_ring_index.push(poly_clip.outer_points.length-1);

    var main_inners = poly_main.inner_rings;
    var main_inner_num = main_inners.length;
    var clip_inners = poly_clip.inner_rings;
    var clip_inner_num = clip_inners.length;
    
    var tmp_index = 1;
    hole_list.list = [];
    for(var i = 0; i < main_inner_num; i++)
    {   
        var k = isPolyInPoly(main_inners[i], poly_clip);
        var m = isHoleIntrPoly(main_inners[i], poly_clip);
        if(k == 2 && !m)
        {
            hole_list.list.push(main_inners[i].concat());
        }
        else if(k == 1 || m)
        {
            main_list.list = main_list.list.concat(main_inners[i].concat());
            main_ring_index[tmp_index] = main_inners[i].length + main_ring_index[tmp_index-1];
            tmp_index++;
        }
    }
    
    tmp_index = 1;
    for(var i = 0; i < clip_inner_num; i++)
    {
        var k = isPolyInPoly(clip_inners[i], poly_main);
        var m = isHoleIntrPoly(clip_inners[i], poly_main);
        if(k == 2 && !m)
        {
            hole_list.list.push(clip_inners[i].concat());
        }
        else if(k == 1 || m)
        {
            clip_list.list = clip_list.list.concat(clip_inners[i].concat());
            clip_ring_index[tmp_index] = clip_inners[i].length + clip_ring_index[tmp_index-1];
            tmp_index++;
        }
    }
    
    var main_sides_intr_points = [];
    var clip_sides_intr_points = [];
    var Msip_dist = [];
    var Csip_dist = [];
    for(var i = 0, len = main_list.list.length - 1, tmp_index_main = 0, intr_result = false; i < len; i++)
    {
        if(i == main_ring_index[tmp_index_main])
        {
            i++;
            if(i >= len)
            {
                break;
            }
            tmp_index_main++;
        }
        
        for(var j = 0, tmp_index_clip = 0, len_clip = clip_list.list.length - 1; j < len_clip; j++)
        {
            if(j == clip_ring_index[tmp_index_clip])
            {
                j++;
                if(j >= len_clip)
                {
                    break;
                }
                tmp_index_clip++;
            }

            intr_result = segmentsIntr(main_list.list[i], main_list.list[i+1], clip_list.list[j], clip_list.list[j+1]);
            if(intr_result != false)
            {
                intr_result.index = numOfIntrPoints;
                numOfIntrPoints++;

                dist = Math.pow(intr_result.x-main_list.list[i].x, 2)+Math.pow(intr_result.y-main_list.list[i].y, 2);
                if(main_sides_intr_points[i] == undefined)
                {
                    main_sides_intr_points[i] = [];
                    main_sides_intr_points[i].push(intr_result);
                    Msip_dist[i] = [];
                    Msip_dist[i].push(dist);
                }
                else
                {
                    var w = 0;
                    for(nums = main_sides_intr_points[i].length; w < nums; w++)
                    {
                         if(dist < Msip_dist[i][w])
                         {
                            break;
                         }
                    }
                    main_sides_intr_points[i].splice(w,0,intr_result);
                    Msip_dist[i].splice(w,0,dist);
                }

                dist = Math.pow(intr_result.x-clip_list.list[j].x, 2)+Math.pow(intr_result.y-clip_list.list[j].y, 2);
                if(clip_sides_intr_points[j] == undefined)
                {
                    clip_sides_intr_points[j] = [];
                    clip_sides_intr_points[j].push(intr_result);
                    Csip_dist[j] = [];
                    Csip_dist[j].push(dist);
                }
                else
                {
                    var w = 0;
                    for(nums = clip_sides_intr_points[j].length; w < nums; w++)
                    {
                        if(dist < Csip_dist[j][w])
                        {
                            break;
                        }
                    }
                    clip_sides_intr_points[j].splice(w,0,intr_result);
                    Csip_dist[j].splice(w,0,dist);
                }
            }
        }
    }
    
    for(var i = 0, len = main_list.list.length, tmp_index_main = 0; i < len; i++)
    {
        if(i == main_ring_index[tmp_index_main])
        {
            i++;
            if(i >= len)
            {
                break;
            }
            tmp_index_main++;
        }
        
        if(main_sides_intr_points[i] != undefined)
        {
            main_sides_intr_points[i][0].type = main_list.list[i].type + 2;// 2 for into point of intersection, 3 for out point
            for(var j = 1, nums = main_sides_intr_points[i].length; j < nums; j++)
            {
               if(main_sides_intr_points[i][j-1].type == 2)
               {
                    main_sides_intr_points[i][j].type = 3;
               }
               else
               {
                    main_sides_intr_points[i][j].type = 2;
               }
            }
        }
    }
    
    for(var i = 0, j = 0; i < main_list.list.length && j < main_sides_intr_points.length; i++, j++)
    {
        if(main_sides_intr_points[j] != undefined)
        {
            i++;
            for(var w = 0, num_intr = main_sides_intr_points[j].length; w < num_intr; w++, i++)
            {
                main_list.list.splice(i,0,main_sides_intr_points[j][w]);
            }
            i--;
        }
    }

    for(var i = 0, j = 0; i < clip_list.list.length && j < clip_sides_intr_points.length; i++, j++)
    {
        if(clip_sides_intr_points[j] != undefined)
        {
            i++;
            for(var w = 0, num_intr = clip_sides_intr_points[j].length; w < num_intr; w++, i++)
            {
                clip_list.list.splice(i,0,clip_sides_intr_points[j][w]);
            }
            i--;
        }
    }
    return numOfIntrPoints;
}

function isHoleIntrPoly(hole, poly){
    for(var i = 0, len = hole.length - 1; i < len; i++)
    {
        for(var j = 0, p_out = poly.outer_points, p_len = p_out.length - 1; j < p_len; j++)
        {
            if(segmentsIntr(hole[i], hole[i+1], p_out[j], p_out[j+1]) != false)
            {
                return true;
            }
        }

        for(var j = 0, p_inner = poly.inner_rings, p_inner_num = p_inner.length; j < p_inner_num; j++)
        {
            for(var w = 0, p_inner_now = p_inner[j], pin_length = p_inner_now.length - 1; w < pin_length; w++)
            {
                if(segmentsIntr(hole[i], hole[i+1], p_inner_now[w], p_inner_now[w+1]) != false)
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function segmentsIntr(a, b, c, d){

/** 1 解线性方程组, 求线段交点. **/
// 如果分母为0 则平行或共线, 不相交
    var denominator = (b.y - a.y)*(d.x - c.x) - (a.x - b.x)*(c.y - d.y);
    if (denominator==0) {
        return false;
    }
 
// 线段所在直线的交点坐标 (x , y)    
    var x = ( (b.x - a.x) * (d.x - c.x) * (c.y - a.y) 
                + (b.y - a.y) * (d.x - c.x) * a.x 
                - (d.y - c.y) * (b.x - a.x) * c.x ) / denominator ;
    var y = -( (b.y - a.y) * (d.y - c.y) * (c.x - a.x) 
                + (b.x - a.x) * (d.y - c.y) * a.y 
                - (d.x - c.x) * (b.y - a.y) * c.y ) / denominator;

/** 2 判断交点是否在两条线段上 **/
    if (
        // 交点在线段1上
        (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
        // 且交点也在线段2上
         && (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
        ){

        // 返回交点p
        return {
                x :  x,
                y :  y
            }
    }
    //否则不相交
    return false

}

function correctDirectionOfRotation(polygon){
    if(isClockwise(polygon.outer_points))
    {
        polygon.outer_points.reverse();
    }
    for(var i = 0, rings = polygon.inner_rings, len = rings.length; i < len; i++)
    {
        if(!isClockwise(rings[i]))
        {
            rings[i].reverse();
        }
    }
}

function  isClockwise(ring) {
	var p1 = {}, p2 = {}, p3 = {};
	var p1_index;
	var max_y = 0;
	for(var i = 0; i < ring.length-1; i++)
    {
        if(ring[i].y > max_y)
        {
            max_y = ring[i].y;
            p1_index = i;
        }
    }
    p1.x = ring[p1_index].x;
    p1.y = ring[p1_index].y;

    if(p1_index == 0)
    {
    	p2.x = ring[ring.length - 2].x;
    	p2.y = ring[ring.length - 2].y;
    }
    else
    {
    	p2.x = ring[p1_index - 1].x;
    	p2.y = ring[p1_index - 1].y;
    }

    p3.x = ring[p1_index+1].x;
    p3.y = ring[p1_index+1].y;

    var v1 = {};
    var v2 = {};
    
    v1.x = p1.x - p2.x;
    v1.y = p1.y - p2.y;

    v2.x = p3.x - p1.x;
    v2.y = p3.y - p1.y;

    var cross_jion_z = v1.x*v2.y - v1.y*v2.x;
    if(cross_jion_z > 0)
    {
    	return true;//clockwise
    }
    else
    {
        return false; //anticlockwise
    }
}

//return 0 for not in, 1 not all in, 2 all in
function isPolyInPoly(poly1_points, poly2)
{
    var p1_nums = poly1_points.length;
    var in_flag = false, out_flag = false;
    for(var i = 0; i < p1_nums; i++)
    {
        if(isPointInPoly(poly1_points[i], poly2))
        {
            in_flag = true;
        }
        else
        {
            out_flag = true;
        }
    }
    if(in_flag && out_flag)
    {
        return 1;
    }
    else if(in_flag && !out_flag){
        return 2;
    }
    else if(!in_flag && out_flag){
        return 0;
    }
    else{
        return 1;
    }
}

function isPointInPoly(point, poly)
{
    var segmentsIntr_Times = 0;
    var polypoints = poly.outer_points;
    var poly_sides_num = polypoints.length - 1;
    for(var i = 0; i < poly_sides_num; i++)
    {
        if(segmentsIntr_POINTIP(point, {x:my_canvas.width, y:point.y}, polypoints[i], polypoints[i+1]) != false)
        {
            segmentsIntr_Times++;
        }

    }
    
    for(var i = 0, rings = poly.inner_rings, len = rings.length; i < len; i++)
    {
        for(var j = 0, ring = rings[i], r_len = ring.length - 1; j < r_len; j++)
        {
            if(segmentsIntr_POINTIP(point, {x:my_canvas.width, y:point.y}, ring[j], ring[j+1]) != false)
            {
                segmentsIntr_Times++;
            }
        }
    }

    //console.log(segmentsIntr_Times);
    if(segmentsIntr_Times % 2 == 1)
    {
        point.type = 1; //1 for in vertex
        return true;
    }
    else
    {
        point.type = 0;//0 for out vertex
        return false;
    }
}

function segmentsIntr_POINTIP(a, b, c, d){

/** 1 解线性方程组, 求线段交点. **/
// 如果分母为0 则平行或共线, 不相交
    var denominator = (b.y - a.y)*(d.x - c.x) - (a.x - b.x)*(c.y - d.y);
    if (denominator==0) {
        return false;
    }
 
// 线段所在直线的交点坐标 (x , y)    
    var x = ( (b.x - a.x) * (d.x - c.x) * (c.y - a.y) 
                + (b.y - a.y) * (d.x - c.x) * a.x 
                - (d.y - c.y) * (b.x - a.x) * c.x ) / denominator ;
    var y = -( (b.y - a.y) * (d.y - c.y) * (c.x - a.x) 
                + (b.x - a.x) * (d.y - c.y) * a.y 
                - (d.x - c.x) * (b.y - a.y) * c.y ) / denominator;

/** 2 判断交点是否在两条线段上 **/
    if (
        // 交点在线段1上
        (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
        // 且交点也在线段2上
         && (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
        ){
        
            if((x == c.x && y == c.y && c.y >= d.y) || (x == d.x && y == d.y && d.y >= c.y))
            {
                return false;
            }
            // 返回交点p
            return {
                    x :  x,
                    y :  y
                }
    }
    //否则不相交
    return false

}

//use aet for judging a set of points is or not in another polygon
//return 0 for not in, 1 not all in, 2 all in
function isInPolygon_aet(points, aet, y_value)
{
    var points_num = points.length - 1;
    var y_min = y_value.min_y;
    var y_max = y_value.max_y;
    var in_flag = false, out_flag = false;

    for(var i = 0; i < points_num; i++)
    {
        if(in_flag && out_flag)
        {
            return 1;
        }

        var j = points[i].y - y_min;
        var p_x = points[i].x;

        if(points[i].y > y_value.max_y || points[i].y < y_value.min_y)
        {
            out_flag = true;
            continue;
        }

        var w, tmp_len;
        for(w = 0, tmp_aet_line = aet[j], tmp_len = aet[j].length; w < tmp_len; w += 2)
        {
            if(p_x > tmp_aet_line[w][0] && p_x < tmp_aet_line[w+1][0])
            {
                in_flag = true;
            }
        }

        if(w >= tmp_len && !in_flag)
        {
            out_flag = true;
        }
    }
    
    if(in_flag && !out_flag)
    {
        return 2;
    }
    else
    {
        return 0;
    }
}