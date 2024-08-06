//function to calculate Linear Interpolation
function linearInterpolation(A,B,t){
    return A+(B-A)*t;
}

//function to convert degrees to radians
function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

//function to get the point of intersection of two lines
function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:linearInterpolation(A.x,B.x,t),
                y:linearInterpolation(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

//function to see if polygons intersect
function polygonIntersects(polygon_a, polygon_b) {
    for (let i = 0; i < polygon_a.length; i++) {
        for (let j = 0; j < polygon_b.length; j++) {
            const touch = getIntersection(
                polygon_a[i],
                polygon_a[(i+1)%polygon_a.length],
                polygon_b[j],
                polygon_b[(j+1)%polygon_b.length]
            );
            if (touch){
                return true;
            }
        }
    }
    return false;
}

//function to check if a point is within a polygon using ray casting
function inside(point, polygon) {
    var x = point.x, y = point.y;
    //vs = [[vs.bottomLeft.x, vs.bottomLeft.y],[vs.bottomRight.x, vs.bottomRight.y],[vs.topRight.x, vs.topRight.y],[vs.topLeft.x ,vs.topLeft.y]]
    //poly defined as [point1,point2...]
    var vs = polygon;
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

//time conversion function
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }