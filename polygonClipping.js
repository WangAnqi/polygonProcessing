

function polyIntr(poly_main, poly_clip){
    var pointsOfIntr = [];
    
    var outer_length = poly_main.outer_points.length - 1;
    for(var i = 0; i < outer_length; i++)
    {
        
    }
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
    	return true; //clockwise
    }
    else
    {
    	return false;//anticlockwise
    }
}