//Intersection class
//handles the creation and behaviour of intersections
class Intersection{
    constructor(connectedRoads=[], connectedRoadsCoords=[]){
        this.speedLimit=20;
        //create borders
        this.borders = [];
        for (let index = 0; index < connectedRoadsCoords.length; index++) {
            //chekc if it is the last entry (if it is, loop the coords)
            if (index == connectedRoadsCoords.length-1) {
                //check if coords the are the same (road extremes touching)
                if (connectedRoadsCoords[index][1]!=connectedRoadsCoords[0][0]) {
                    this.borders.push(
                        {
                            start:connectedRoadsCoords[index][1],
                            end:connectedRoadsCoords[0][0]
                        }
                    );
                }
            } else {
                //check if coords are the same
                if (connectedRoadsCoords[index][1]!=connectedRoadsCoords[index+1][0]) {
                    this.borders.push(
                        {
                            start:connectedRoadsCoords[index][1],
                            end:connectedRoadsCoords[index+1][0]
                        }
                    );
                }
            }
        }
        this.border  = [];
        this.borders.forEach((border)=>{
            let temp=[]
            temp.push(border.start);
            temp.push(border.end);
            this.border.push(temp);
        })
        //this.border = [this.border];
        //create a surface area to draw
        this.roadSurface = [];
        for (let index = 0; index < connectedRoadsCoords.length; index++) {
            //check if road surfaces are touching
            //special case for last entry in the array
            if (index == connectedRoadsCoords.length-1) {
                if (connectedRoadsCoords[index][1]==connectedRoadsCoords[0][0]) {
                    this.roadSurface.push(connectedRoadsCoords[index][0]);
                } else {
                    this.roadSurface.push(connectedRoadsCoords[index][0]);
                    this.roadSurface.push(connectedRoadsCoords[index][1]);
                }
            } else {
                if (connectedRoadsCoords[index][1]==connectedRoadsCoords[index+1][0]) {
                    this.roadSurface.push(connectedRoadsCoords[index][0]);
                } else {
                    this.roadSurface.push(connectedRoadsCoords[index][0]);
                    this.roadSurface.push(connectedRoadsCoords[index][1]);
                }
            }
        }

        this.road_surface=[]; //not needed for now, maybe we can do it later but better


        //intersection decoration
        //get center point
        let x_sum=0;
        let y_sum=0;
        for (let index = 0; index < this.roadSurface.length; index++) {
            x_sum += this.roadSurface[index].x;
            y_sum += this.roadSurface[index].y;
        }
        let center = {
            x: (x_sum/this.roadSurface.length),
            y: (y_sum/this.roadSurface.length)
        }
        //calculate extreme points and the maximum size of the rectangle containing the shape
        this.decoration_poly_coords=[];
        let extremes = {
            x_min: Infinity,
            x_max: -Infinity,
            y_min: Infinity,
            y_max: -Infinity
        }
        let lambda = 0.8;
        //homothetically scale the intersection to a smaller size for the decoration border
        for (let index = 0; index < this.roadSurface.length; index++) {
            this.decoration_poly_coords.push(
                {
                    x: (center.x+lambda*(this.roadSurface[index].x-center.x)),
                    y: (center.y+lambda*(this.roadSurface[index].y-center.y))
                }
            );
            //check if the current point is the most extreme i nthe same loop
            extremes.x_min=(this.decoration_poly_coords[index].x<extremes.x_min)?this.decoration_poly_coords[index].x:extremes.x_min;
            extremes.x_max=(this.decoration_poly_coords[index].x>extremes.x_max)?this.decoration_poly_coords[index].x:extremes.x_max;
            extremes.y_min=(this.decoration_poly_coords[index].y<extremes.y_min)?this.decoration_poly_coords[index].y:extremes.y_min;
            extremes.y_max=(this.decoration_poly_coords[index].y>extremes.y_max)?this.decoration_poly_coords[index].y:extremes.y_max;
        }
        // //create teh criss cross origins
        // this.extreme_rect = [
        //     {
        //         x:extremes.x_min,
        //         y:extremes.y_min,
        //     },
        //     {
        //         x:extremes.x_max,
        //         y:extremes.y_min,
        //     },
        //     {
        //         x:extremes.x_max,
        //         y:extremes.y_max,
        //     },
        //     {
        //         x:extremes.x_min,
        //         y:extremes.y_max,
        //     }
        // ];

        //create TB diagonal
        let diagonal_tb = [
            {
                x:extremes.x_max,
                y:extremes.y_min,
            },
            {
                x:extremes.x_max+extremes.y_max-extremes.y_min,
                y:extremes.y_max,
            }
        ];
        //crete BL-TR diagonal
        let diagonal_bt = [
            {
                x:extremes.x_max,
                y:extremes.y_max,
            },
            {
                x:extremes.x_max+extremes.y_max-extremes.y_min,
                y:extremes.y_min,
            }
        ];
        this.criss_cross_segments=[];
        let cc_segs=[];
        //set the distance between decoration lines
        let decoration_segment_size = 19; //prevents the lines from crossing directly over points
        //fill the shape with diagonals, offset by the var above, in order to create a right angled criss cross pattern
        //until we reach the end of the shape (moving towards the origin)
        do {
            //translate the diagonals to the left
            diagonal_tb[0].x-=decoration_segment_size;
            diagonal_tb[1].x-=decoration_segment_size;
            diagonal_bt[0].x-=decoration_segment_size;
            diagonal_bt[1].x-=decoration_segment_size;
            //store the current diagonals
            cc_segs.push(structuredClone(diagonal_tb));
            cc_segs.push(structuredClone(diagonal_bt));
        } while (diagonal_bt[1].x>extremes.x_min);

        //cut each segment to fit within the shape of the actual intersection
        for (let i = 0; i < cc_segs.length; i++) {
            //init contact points
            let contact_points=[];
            //iterate through the segments of the intersection edge
            for (let j = 0; j < this.decoration_poly_coords.length; j++) {
                let temp=null;
                //get the intersection between the criss-cross line and the edge (special case for last element to loop back to 0)
                temp=getIntersection(cc_segs[i][0],cc_segs[i][1],this.decoration_poly_coords[j],this.decoration_poly_coords[(j==this.decoration_poly_coords.length-1)?0:j+1]);
                //if there is an intersection add it to the contacts
                if (temp) {
                    contact_points.push({x:temp.x,y:temp.y});
                }
            }
            //add the contact points to the main array
            if (contact_points.length) {
                this.criss_cross_segments.push(structuredClone(contact_points));
            }
        }
        console.log(this.criss_cross_segments)

    }

    draw(ctx){
        //create teh road surface rectangle
        ctx.fillStyle="#706E6A"//
        ctx.beginPath();
        ctx.moveTo(this.roadSurface[0].x,this.roadSurface[0].y);
        for (let index = 1; index < this.roadSurface.length; index++) {
            ctx.lineTo(this.roadSurface[index].x,this.roadSurface[index].y);
        }
        ctx.closePath();
        ctx.fill();
        //draw borders (if any)
        if (this.borders.length) {
            //draw external border
            ctx.strokeStyle="#E9EDF0";  
            ctx.lineWidth=10;
            ctx.beginPath();
            this.borders.forEach(border=>{
                ctx.moveTo(border.start.x,border.start.y);
                ctx.lineTo(border.end.x,border.end.y);
                ctx.stroke();
            });
            ctx.closePath();
        }
        //draw decoration borders
        ctx.strokeStyle="rgb(255, 191, 0)";
        ctx.lineWidth=4;
        ctx.beginPath();
        ctx.moveTo(this.decoration_poly_coords[0].x,this.decoration_poly_coords[0].y);
        for (let index = 1; index < this.decoration_poly_coords.length; index++) {
            ctx.lineTo(this.decoration_poly_coords[index].x,this.decoration_poly_coords[index].y);
        }
        ctx.closePath();
        ctx.stroke();
        //draw criss-cross
        ctx.lineWidth=2;
        for (let index = 0; index < this.criss_cross_segments.length; index++) {
            ctx.beginPath();
            ctx.moveTo(this.criss_cross_segments[index][0].x,this.criss_cross_segments[index][0].y);
            ctx.lineTo(this.criss_cross_segments[index][1].x,this.criss_cross_segments[index][1].y);
            ctx.stroke();
        }
        //debug (shows rect)
        // ctx.beginPath();
        // ctx.strokeStyle="rgb(255, 0, 255)";
        // ctx.moveTo(this.extreme_rect[0].x,this.extreme_rect[0].y);
        // for (let index = 0; index < this.extreme_rect.length; index++) {
        //     ctx.lineTo(this.extreme_rect[index].x,this.extreme_rect[index].y);
        // }
        // ctx.closePath();
        // ctx.stroke();
    }

    //draw wireframe 
    draw_wireframe(ctx){
        //draw borders (if any)
        if (this.borders.length) {
            //draw external border
            ctx.strokeStyle="#748AA6";  
            ctx.lineWidth=10;
            ctx.beginPath();
            this.borders.forEach(border=>{
                ctx.moveTo(border.start.x,border.start.y);
                ctx.lineTo(border.end.x,border.end.y);
                ctx.stroke();
            });
            ctx.closePath();
        }
    }
    
}