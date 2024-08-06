//CURVE class
//dealing with curved sections of road
class Curve{
    constructor(roadCoords, direction=true, startAngle, curveAngle, lanes=["left","right"], speedLimit=50, laneWidth=100){
        this.speedLimit=speedLimit;
        this.type="curve";
        //detail - larger means less detailed curves (better performance)
        this.detail = 7;
        //store the direction
        //BOOL - TRUE = CW, FALSE = CCW
        this.direction = direction;
        this.nextLanes = lanes;
        //store total angle for next item in line
        this.trueAngle=startAngle+curveAngle;
        //decide the start point and the angle according to the direction
        let tempStart=null;
        if(direction){
            //store start coords (center)
            //if curve is CW, start at topRight of the last road piece
            this.startCoords = roadCoords.topRight;
            this.startAngle = degrees_to_radians(startAngle-90);
            this.endAngle = degrees_to_radians(startAngle+curveAngle-90);
            //store this for borders start later
            tempStart = roadCoords.bottomRight;
            //revert lanes
            this.lanes = lanes.reverse();
        } else {
            //store start coords (center)
            //if curve is CCW, start at bottomRight of the last road piece
            this.startCoords = roadCoords.bottomRight;
            this.startAngle = degrees_to_radians(startAngle+90);
            this.endAngle = degrees_to_radians(startAngle-curveAngle+90);
            //store this for borders start later
            tempStart = roadCoords.topRight;
            //store the lanes as they are given
            this.lanes = lanes
        }
        //calculate the radius
        this.radius = this.lanes.length*laneWidth;
        //generate the directionla boxes
        //and the coords for the decorative lines
        this.interdirectionalLineRs=[];
        this.interlaneLinesRs=[];
        this.directionBoxes=[];

        var templane = lanes[0];
        //make more sense of this bullshit later lmfaoooooo
        var arcCoords =[];
        var directionalPoly = [this.startCoords];
        for (let i = 1; i < curveAngle+this.detail; i+=this.detail) {
            let angle = 0;
            if (direction) {
                angle = degrees_to_radians(startAngle+i-90);
            } else {
                angle = degrees_to_radians(startAngle-i+90);
            }
            let tempPoint = {
                x:this.startCoords.x + this.laneWidth * Math.cos(angle),
                y:this.startCoords.y + this.laneWidth * Math.sin(angle)
            };
            arcCoords.push(
                tempPoint
            );
        }

        //WE GETTING OUT OF THE HOOD WITH THIS ONE
        for (let i = 0; i < lanes.length-1; i++) {
            //check if next lane goes in the same direction
            if (lanes[i+1] == templane) {
                //just store the coords for the interlane lines
                this.interlaneLinesRs.push(laneWidth*(i+1));
                templane=lanes[i+1];
                //expand directional box
                arcCoords =[];
                for (let j = 1; j < curveAngle+this.detail; j+=this.detail) {
                    let angle = 0;
                    if (direction) {
                        angle = degrees_to_radians(startAngle+j-90);
                    } else {
                        angle = degrees_to_radians(startAngle-j+90);
                    }
                    let tempPoint = {
                        x:this.startCoords.x + laneWidth*(i+2) * Math.cos(angle),
                        y:this.startCoords.y + laneWidth*(i+2) * Math.sin(angle)
                    };
                    
                    arcCoords.push(
                        tempPoint
                    );
                }
            } else {
                //store coords for the interdirectional line
                this.interdirectionalLineRs.push(laneWidth*(i+1));
                templane=lanes[i+1];
                //store coords for the directional box
                this.directionBoxes.push({
                    direction:lanes[i],
                    coords:directionalPoly.concat(arcCoords)
                });
                //create new directional box
                //we need to take into accound the past arc
                //reverse the points of the past arc
                directionalPoly = arcCoords.reverse();
                arcCoords = [];
                 //expand directional box
                for (let j = 1; j < curveAngle+this.detail; j+=this.detail) {
                    let angle = 0;
                    if (direction) {
                        angle = degrees_to_radians(startAngle+j-90);
                    } else {
                        angle = degrees_to_radians(startAngle-j+90);
                    }
                    let tempPoint = {
                        x:this.startCoords.x + laneWidth*(i+2) * Math.cos(angle),
                        y:this.startCoords.y + laneWidth*(i+2) * Math.sin(angle)
                    };
                    arcCoords.push(
                        tempPoint
                    );
                }
            }
        }
        //store teh last of teh box coords
        this.directionBoxes.push({
            direction:lanes[lanes.length-1],
            coords:directionalPoly.concat(arcCoords)
        });
        
        //define te borders - in this case is an "arc" on the outside of the curve
        this.borders = [];
        for (let i = 1; i < curveAngle+this.detail; i+=this.detail) {
            let angle = 0;
            if (direction) {
                angle = degrees_to_radians(startAngle+i-90);
            } else {
                angle = degrees_to_radians(startAngle-i+90);
            }
            let tempEnd = {
                x:this.startCoords.x + this.radius * Math.cos(angle),
                y:this.startCoords.y + this.radius * Math.sin(angle)
            };
            this.borders.push(
                {
                    start:tempStart,
                    end:tempEnd
                }
            );
            tempStart=tempEnd;
        }
        
        //define the end of the arc in case we need it for roads later
        this.endCoords = this.borders[this.borders.length-1].end;
        
        //we are just going to fix this with a bandaid here lmao
        this.border = [];
        this.borders.forEach((segment)=>{
            this.border.push([segment.start,segment.end])
        });

        this.road_surface=[];
        this.road_surface.push(this.startCoords);
        this.borders.forEach((segment)=>{
            this.road_surface.push(segment.start)
        });
        this.road_surface.push(this.borders[this.borders.length-1].end);

    }

    draw(ctx){
        //create teh road surface rectangle
        ctx.fillStyle="#706E6A"
        ctx.lineWidth=10;
        ctx.beginPath();
        ctx.moveTo(this.startCoords.x,this.startCoords.y);
        ctx.arc(this.startCoords.x,this.startCoords.y,this.radius,this.startAngle,this.endAngle,!this.direction);
        ctx.lineTo(this.startCoords.x,this.startCoords.y);
        ctx.closePath();
        ctx.fill();

        //draw external borders
        ctx.strokeStyle="#E9EDF0";  
        ctx.lineWidth=10;
        ctx.beginPath();
        this.borders.forEach(borders=>{
            ctx.moveTo(borders.start.x,borders.start.y);
            ctx.lineTo(borders.end.x,borders.end.y);
            ctx.stroke();
        });
        ctx.closePath();

        //draw interlane lines
        ctx.lineWidth=8;
        ctx.strokeStyle="#E9EDF0";
        ctx.setLineDash([20,20]);
        this.interlaneLinesRs.forEach(r=>{
            ctx.beginPath();
            ctx.arc(this.startCoords.x,this.startCoords.y,r,this.startAngle,this.endAngle,!this.direction);
            ctx.stroke();
            ctx.closePath();
        });

        //create directional division lines
        this.interdirectionalLineRs.forEach(r=>{
            ctx.setLineDash([]);
            ctx.lineWidth=10;
            ctx.strokeStyle="#E9EDF0";
            ctx.beginPath();
            ctx.arc(this.startCoords.x,this.startCoords.y,r,this.startAngle,this.endAngle,!this.direction);
            ctx.stroke();
            ctx.closePath();
        });

        //some debug code to show direction boxes I think
        // this.directionBoxes.forEach(box=>{
        //     console.log("blep",box)
        //     ctx.fillStyle='#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
        //     ctx.beginPath();
        //     ctx.moveTo(box.coords[0].x,box.coords[0].y);
        //     box.coords.forEach(coord=>{
        //         ctx.lineTo(coord.x,coord.y);
        //     })
        //     ctx.closePath();
        //     ctx.fill();
        //     })
    }

    //draw wireframe 
    draw_wireframe(ctx){
        //draw external borders
        ctx.strokeStyle="#748AA6";  
        ctx.lineWidth=10;
        ctx.beginPath();
        this.borders.forEach(borders=>{
            ctx.moveTo(borders.start.x,borders.start.y);
            ctx.lineTo(borders.end.x,borders.end.y);
            ctx.stroke();
        });
        ctx.closePath();

        //draw interlane lines
        ctx.lineWidth=8;
        ctx.strokeStyle="#D0DFE6";
        ctx.setLineDash([20,20]);
        this.interlaneLinesRs.forEach(r=>{
            ctx.beginPath();
            ctx.arc(this.startCoords.x,this.startCoords.y,r,this.startAngle,this.endAngle,!this.direction);
            ctx.stroke();
            ctx.closePath();
        });

        //create directional division lines
        this.interdirectionalLineRs.forEach(r=>{
            ctx.setLineDash([]);
            ctx.lineWidth=10;
            ctx.strokeStyle="#D0DFE6";
            ctx.beginPath();
            ctx.arc(this.startCoords.x,this.startCoords.y,r,this.startAngle,this.endAngle,!this.direction);
            ctx.stroke();
            ctx.closePath();
        });
    }
}