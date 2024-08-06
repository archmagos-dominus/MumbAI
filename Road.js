//ROAD class
//handles the creation and behaviour of straigh roads

class Road{
    constructor(startCoords, length, angle, lanes, speedLimit, laneWidth=100, intersections={startLeft:false,startCenter:false,startRight:false,endLeft:false,endCenter:false,endRight:false}) {
        //set the speed limit value
        this.speedLimit=speedLimit;
        //set type as road
        this.type="road";
        //define road dimensions and calculate additional variables for later
        //the width of one lane (should be constant)
        this.laneWidth = laneWidth;
        //total road width
        this.width = this.laneWidth*lanes.length;
        this.length=length;
        //convert road angle to radians and calculate additional angles for the rectangle of the road
        this.angle = angle;
        const radAngle = degrees_to_radians(angle);
        const radAnglePlus90 = degrees_to_radians(angle+90);
        const radAngleMinus90 = degrees_to_radians(angle-90);
        //calculate and store the start and end coords of the road
        this.startCoords=startCoords;
        this.endCoords = {
            x:startCoords.x + length * Math.cos(radAngle),
            y:startCoords.y + length * Math.sin(radAngle)
        }

        //in the first iterations of this, I used the start coords as the center
        //of the road piece, but upon further pondering decided to simply have the
        //start coords as the TopLeft point instead, and keep the TopRight point
        //in memory to help with aligning all the road peices and the curves togetehr
        //if any of this feels weird or redundant, it's because it most likely is a
        //code line that was written with the first iteration of this algorithm in mind

        //calculate the points of the road rectangle 
        const topLeft = this.startCoords;
        const topRight = this.endCoords;
        const bottomLeft={
            x:this.startCoords.x + this.width * Math.cos(radAngleMinus90),
            y:this.startCoords.y + this.width * Math.sin(radAngleMinus90)
        };
        const bottomRight={
            x:this.endCoords.x + this.width * Math.cos(radAngleMinus90),
            y:this.endCoords.y + this.width * Math.sin(radAngleMinus90)
        };      
        //store the points into an array            ////////////////////////////////////////////////////////////////////    choose one lmao
        this.roadSurface = {
            topLeft:topLeft,
            topRight:topRight,
            bottomRight:bottomRight,
            bottomLeft:bottomLeft
        }
        this.road_surface = [
            topLeft,topRight,bottomRight,bottomLeft
        ];

        //calculate and store the coords of the road borders            ////here too, just make one single array or object
        this.border = [[topLeft,topRight],[bottomLeft,bottomRight]];
        
        
        //define direction borders
        //they help the car not drive in the wrong way 
        //hopefully

        //aslo store the coords for the lane divisions awawawa
        this.lanes = lanes;
        this.interdirectionalLineCoords=[];
        this.interlaneLinesCoords=[];
        let tempSTARTCoords = bottomLeft;
        let tempENDCoords = bottomRight;
        this.directionBoxes = [{
            direction:lanes[0],
            coords:{
                topLeft:bottomLeft,
                bottomLeft:bottomLeft,
                bottomRight:bottomRight,
                topRight:bottomRight
            }
        }];

        let templanetype = lanes[0];

        for (let i = 1; i < lanes.length; i++) {
            if (lanes[i] == templanetype) {
                let tempSTART = {
                    x:tempSTARTCoords.x + laneWidth * (i) * Math.cos(radAnglePlus90),
                    y:tempSTARTCoords.y + laneWidth * (i) * Math.sin(radAnglePlus90)
                };
                let tempFINISH = {
                    x:tempENDCoords.x + laneWidth * (i) * Math.cos(radAnglePlus90),
                    y:tempENDCoords.y + laneWidth * (i) * Math.sin(radAnglePlus90)
                }
                //store the line coords
                this.interlaneLinesCoords.push([tempSTART,tempFINISH]);
            } else {
                let tempSTART = {
                    x:tempSTARTCoords.x + laneWidth * (i) * Math.cos(radAnglePlus90),
                    y:tempSTARTCoords.y + laneWidth * (i) * Math.sin(radAnglePlus90)
                };
                let tempFINISH = {
                    x:tempENDCoords.x + laneWidth * (i) * Math.cos(radAnglePlus90),
                    y:tempENDCoords.y + laneWidth * (i) * Math.sin(radAnglePlus90)
                }
                //store the line coords
                this.interdirectionalLineCoords.push([tempSTART,tempFINISH]);
                //enlarge box
                this.directionBoxes[this.directionBoxes.length-1].coords.topLeft=tempSTART;
                this.directionBoxes[this.directionBoxes.length-1].coords.topRight=tempFINISH;
                templanetype=lanes[i];
                this.directionBoxes.push({
                    direction: lanes[i],
                    coords:{
                        topLeft:tempSTART,
                        bottomLeft:tempSTART,
                        bottomRight:tempFINISH,
                        topRight:tempFINISH
                    }
                });
            }
        }
        
        let tempSTART = {
            x:tempSTARTCoords.x + laneWidth * (lanes.length) * Math.cos(radAnglePlus90),
            y:tempSTARTCoords.y + laneWidth * (lanes.length) * Math.sin(radAnglePlus90)
        };
        let tempFINISH = {
            x:tempENDCoords.x + laneWidth * (lanes.length) * Math.cos(radAnglePlus90),
            y:tempENDCoords.y + laneWidth * (lanes.length) * Math.sin(radAnglePlus90)
        }
        //enlarge box
        this.directionBoxes[this.directionBoxes.length-1].coords.topLeft=tempSTART;
        this.directionBoxes[this.directionBoxes.length-1].coords.topRight=tempFINISH;

        //lets create the arrows and endlines for the lanes
        this.roadEndLinesMain = [];
        this.roadEndLinesAux = [];                  ////create aux lines as well
        this.roadArrows = [];
        this.intersections = intersections;
        lanes.forEach((lane, pos)=>{
            if ((lane=="left")&&(intersections.endCenter||intersections.endLeft||intersections.endRight)) {
                //create the end lien and the road arrows
                //calc coords for the end line  (near the start of the line)
                var lineOrigin = {
                    x:startCoords.x + (length-5) * Math.cos(radAngle),
                    y:startCoords.y + (length-5) * Math.sin(radAngle)
                }
                var lineStart, lineEnd;
                if (pos==0) {
                    lineStart = lineOrigin;
                    lineEnd={
                        x:lineStart.x + this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineStart.y + this.laneWidth * Math.sin(radAngleMinus90)
                    };
                } else {
                    lineStart = {
                        x:lineOrigin.x + pos*this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineOrigin.y + pos*this.laneWidth * Math.sin(radAngleMinus90)
                    }
                    lineEnd={
                        x:lineStart.x + this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineStart.y + this.laneWidth * Math.sin(radAngleMinus90)
                    };
                }
                
                //store end line coords
                this.roadEndLinesMain.push(
                    [
                        lineStart,
                        lineEnd
                    ]
                );

                //createa a thinner line behind it as well
                var lineOrigin = {
                    x:startCoords.x + (length-20) * Math.cos(radAngle),
                    y:startCoords.y + (length-20) * Math.sin(radAngle)
                }
                var lineStart, lineEnd;
                if (pos==0) {
                    lineStart = lineOrigin;
                    lineEnd={
                        x:lineStart.x + this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineStart.y + this.laneWidth * Math.sin(radAngleMinus90)
                    };
                } else {
                    lineStart = {
                        x:lineOrigin.x + pos*this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineOrigin.y + pos*this.laneWidth * Math.sin(radAngleMinus90)
                    }
                    lineEnd={
                        x:lineStart.x + this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineStart.y + this.laneWidth * Math.sin(radAngleMinus90)
                    };
                }
                //store end line coords
                this.roadEndLinesAux.push(
                    [
                        lineStart,
                        lineEnd
                    ]
                )

                //calculate arrows coord points
                var arrowPoints=[];
                var arrowPoint={
                    x:startCoords.x + ((pos)*laneWidth+(laneWidth/2)) * Math.cos(radAngleMinus90),
                    y:startCoords.y + ((pos)*laneWidth+(laneWidth/2)) * Math.sin(radAngleMinus90)
                };
                //start from point and create the front arrow
                var arrowPoint0 = {
                    x:arrowPoint.x + (length-40) * Math.cos(radAngle),
                    y:arrowPoint.y + (length-40) * Math.sin(radAngle)
                }
                //the arrow extremities
                var arrowPoint1 = {
                    x:arrowPoint0.x + (20) * Math.cos(degrees_to_radians(angle+220)),
                    y:arrowPoint0.y + (20) * Math.sin(degrees_to_radians(angle+220))
                };
                var arrowPoint2 = {
                    x:arrowPoint0.x + (20) * Math.cos(degrees_to_radians(angle-220)),
                    y:arrowPoint0.y + (20) * Math.sin(degrees_to_radians(angle-220))
                };
                //connection points to the shaft
                var arrowPoint3 = {
                    x:arrowPoint1.x + (9) * Math.cos(degrees_to_radians(angle+90)),
                    y:arrowPoint1.y + (9) * Math.sin(degrees_to_radians(angle+90))
                };
                var arrowPoint4 = {
                    x:arrowPoint2.x + (9) * Math.cos(degrees_to_radians(angle-90)),
                    y:arrowPoint2.y + (9) * Math.sin(degrees_to_radians(angle-90))
                };
                //shaft coords to the branch inner
                var arrowPoint5 = {
                    x:arrowPoint3.x + (20) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint3.y + (20) * Math.sin(degrees_to_radians(angle-180))
                };
                var arrowPoint6 = {
                    x:arrowPoint4.x + (20) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint4.y + (20) * Math.sin(degrees_to_radians(angle-180))
                };
                //shaft coords to the branch outer
                var arrowPoint7 = {
                    x:arrowPoint5.x + (9) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint5.y + (9) * Math.sin(degrees_to_radians(angle-180))
                };
                var arrowPoint8 = {
                    x:arrowPoint6.x + (9) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint6.y + (9) * Math.sin(degrees_to_radians(angle-180))
                };
                //shaft end points
                var arrowPoint9 = {
                    x:arrowPoint7.x + (30) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint7.y + (30) * Math.sin(degrees_to_radians(angle-180))
                };
                var arrowPoint10 = {
                    x:arrowPoint8.x + (30) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint8.y + (30) * Math.sin(degrees_to_radians(angle-180))
                };
                //special point, only to be added if no center arrwo is present, making the arrow markings look better
                var arrowPointX = {
                    x:arrowPoint.x + (length-75) * Math.cos(radAngle),
                    y:arrowPoint.y + (length-75) * Math.sin(radAngle)
                };

                if (intersections.endCenter) {
                    //add first batch of points to the polygon array
                    arrowPoints.push(arrowPoint5);
                    arrowPoints.push(arrowPoint3);
                    arrowPoints.push(arrowPoint1);
                    arrowPoints.push(arrowPoint0);
                    arrowPoints.push(arrowPoint2);
                    arrowPoints.push(arrowPoint4);
                    arrowPoints.push(arrowPoint6);
                } else {
                    arrowPoints.push(arrowPointX);
                }

                //check if we have an arrow to the left as well
                if ((pos==0)&&intersections.endRight) {
                    //shaft end points
                    var arrowPoint11 = {
                        x:arrowPoint6.x + (20) * Math.cos(degrees_to_radians(angle+50)),
                        y:arrowPoint6.y + (20) * Math.sin(degrees_to_radians(angle+50))
                    };
                    var arrowPoint12 = {
                        x:arrowPoint8.x + (20) * Math.cos(degrees_to_radians(angle+50)),
                        y:arrowPoint8.y + (20) * Math.sin(degrees_to_radians(angle+50))
                    };
                    //arrow side points
                    var arrowPoint13 = {
                        x:arrowPoint11.x + (6) * Math.cos(radAngle),
                        y:arrowPoint11.y + (6) * Math.sin(radAngle)
                    };
                    var arrowPoint14 = {
                        x:arrowPoint12.x + (6) * Math.cos(degrees_to_radians(angle-180)),
                        y:arrowPoint12.y + (6) * Math.sin(degrees_to_radians(angle-180))
                    };
                    //arrow point
                    var temppoint = {
                        x:arrowPoint11.x + (0) * Math.cos(degrees_to_radians(angle-180)),
                        y:arrowPoint11.y + (0) * Math.sin(degrees_to_radians(angle-180))
                    };
                    var arrowPoint15 = {
                        x:temppoint.x + (12) * Math.cos(radAnglePlus90),
                        y:temppoint.y + (12) * Math.sin(radAnglePlus90)
                    };
                    //add the stuff to the polygon
                    arrowPoints.push(arrowPoint11);
                    arrowPoints.push(arrowPoint13);
                    arrowPoints.push(arrowPoint15);
                    arrowPoints.push(arrowPoint14);
                    arrowPoints.push(arrowPoint12);
                }

                //add the secondary batch of points for the straight arrow
                arrowPoints.push(arrowPoint8);
                arrowPoints.push(arrowPoint10);
                arrowPoints.push(arrowPoint9);
                arrowPoints.push(arrowPoint7);

                
                //check if we have an arrow to the right as well
                if ((lane!==lanes[pos+1])&&intersections.endLeft) {
                    //shaft end points
                    var arrowPoint16 = {
                        x:arrowPoint5.x + (20) * Math.cos(degrees_to_radians(angle-50)),
                        y:arrowPoint5.y + (20) * Math.sin(degrees_to_radians(angle-50))
                    };
                    var arrowPoint17 = {
                        x:arrowPoint7.x + (20) * Math.cos(degrees_to_radians(angle-50)),
                        y:arrowPoint7.y + (20) * Math.sin(degrees_to_radians(angle-50))
                    };
                    //arrow side points
                    var arrowPoint18 = {
                        x:arrowPoint16.x + (6) * Math.cos(radAngle),
                        y:arrowPoint16.y + (6) * Math.sin(radAngle)
                    };
                    var arrowPoint19 = {
                        x:arrowPoint17.x + (6) * Math.cos(degrees_to_radians(angle-180)),
                        y:arrowPoint17.y + (6) * Math.sin(degrees_to_radians(angle-180))
                    };
                    //arrow point
                    var temppoint = {
                        x:arrowPoint16.x + (0) * Math.cos(degrees_to_radians(angle-180)),
                        y:arrowPoint16.y + (0) * Math.sin(degrees_to_radians(angle-180))
                    };
                    var arrowPoint20 = {
                        x:temppoint.x + (12) * Math.cos(radAngleMinus90),
                        y:temppoint.y + (12) * Math.sin(radAngleMinus90)
                    };
                    //add the stuff to the polygon
                    arrowPoints.push(arrowPoint17);
                    arrowPoints.push(arrowPoint19);
                    arrowPoints.push(arrowPoint20);
                    arrowPoints.push(arrowPoint18);
                    arrowPoints.push(arrowPoint16);
                }

                //add it to the main array
                this.roadArrows.push(arrowPoints);

            } 
            //add decors for the other lanes too
            else if ((lane=="right")&&(intersections.startCenter||intersections.startLeft||intersections.startRight)){
                //calc coords for the end line 
                var lineOrigin = {
                    x:startCoords.x + (5) * Math.cos(radAngle),
                    y:startCoords.y + (5) * Math.sin(radAngle)
                }
                var lineStart, lineEnd;
                lineStart = {
                    x:lineOrigin.x + pos*this.laneWidth * Math.cos(radAngleMinus90),
                    y:lineOrigin.y + pos*this.laneWidth * Math.sin(radAngleMinus90)
                }
                lineEnd={
                    x:lineStart.x + this.laneWidth * Math.cos(radAngleMinus90),
                    y:lineStart.y + this.laneWidth * Math.sin(radAngleMinus90)
                };
                
                //store end line coords
                this.roadEndLinesMain.push(
                    [
                        lineStart,
                        lineEnd
                    ]
                );

                //createa a thinner line behind it as well
                var lineOrigin = {
                    x:startCoords.x + (20) * Math.cos(radAngle),
                    y:startCoords.y + (20) * Math.sin(radAngle)
                }
                var lineStart, lineEnd;
                if (pos==0) {
                    lineStart = lineOrigin;
                    lineEnd={
                        x:lineStart.x + this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineStart.y + this.laneWidth * Math.sin(radAngleMinus90)
                    };
                } else {
                    lineStart = {
                        x:lineOrigin.x + pos*this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineOrigin.y + pos*this.laneWidth * Math.sin(radAngleMinus90)
                    }
                    lineEnd={
                        x:lineStart.x + this.laneWidth * Math.cos(radAngleMinus90),
                        y:lineStart.y + this.laneWidth * Math.sin(radAngleMinus90)
                    };
                }
                //store end line coords
                this.roadEndLinesAux.push(
                    [
                        lineStart,
                        lineEnd
                    ]
                )                

                //calculate arrows coord points
                var arrowPoints=[];
                var arrowPoint={
                    x:startCoords.x + ((pos)*laneWidth+(laneWidth/2)) * Math.cos(radAngleMinus90),
                    y:startCoords.y + ((pos)*laneWidth+(laneWidth/2)) * Math.sin(radAngleMinus90)
                };
                //start from point and create the front arrow
                var arrowPoint0 = {
                    x:arrowPoint.x + (40) * Math.cos(radAngle),
                    y:arrowPoint.y + (40) * Math.sin(radAngle)
                }
                //the arrow extremities
                var arrowPoint1 = {
                    x:arrowPoint0.x - (20) * Math.cos(degrees_to_radians(angle+220)),
                    y:arrowPoint0.y - (20) * Math.sin(degrees_to_radians(angle+220))
                };
                var arrowPoint2 = {
                    x:arrowPoint0.x - (20) * Math.cos(degrees_to_radians(angle-220)),
                    y:arrowPoint0.y - (20) * Math.sin(degrees_to_radians(angle-220))
                };
                //connection points to the shaft
                var arrowPoint3 = {
                    x:arrowPoint1.x - (9) * Math.cos(degrees_to_radians(angle+90)),
                    y:arrowPoint1.y - (9) * Math.sin(degrees_to_radians(angle+90))
                };
                var arrowPoint4 = {
                    x:arrowPoint2.x - (9) * Math.cos(degrees_to_radians(angle-90)),
                    y:arrowPoint2.y - (9) * Math.sin(degrees_to_radians(angle-90))
                };
                //shaft coords to the branch inner
                var arrowPoint5 = {
                    x:arrowPoint3.x - (20) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint3.y - (20) * Math.sin(degrees_to_radians(angle-180))
                };
                var arrowPoint6 = {
                    x:arrowPoint4.x - (20) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint4.y - (20) * Math.sin(degrees_to_radians(angle-180))
                };
                //shaft coords to the branch outer
                var arrowPoint7 = {
                    x:arrowPoint5.x - (9) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint5.y - (9) * Math.sin(degrees_to_radians(angle-180))
                };
                var arrowPoint8 = {
                    x:arrowPoint6.x - (9) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint6.y - (9) * Math.sin(degrees_to_radians(angle-180))
                };
                //shaft end points
                var arrowPoint9 = {
                    x:arrowPoint7.x - (30) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint7.y - (30) * Math.sin(degrees_to_radians(angle-180))
                };
                var arrowPoint10 = {
                    x:arrowPoint8.x - (30) * Math.cos(degrees_to_radians(angle-180)),
                    y:arrowPoint8.y - (30) * Math.sin(degrees_to_radians(angle-180))
                };
                //special point, only to be added if no center arrwo is present, making the arrow markings look better
                var arrowPointX = {
                    x:arrowPoint.x + 75 * Math.cos(radAngle),
                    y:arrowPoint.y + 75 * Math.sin(radAngle)
                };
                

                if(intersections.startCenter){        //add first batch of points to the polygon array
                    arrowPoints.push(arrowPoint5);
                    arrowPoints.push(arrowPoint3);
                    arrowPoints.push(arrowPoint1);
                    arrowPoints.push(arrowPoint0);
                    arrowPoints.push(arrowPoint2);
                    arrowPoints.push(arrowPoint4);
                    arrowPoints.push(arrowPoint6);
                } else  {
                    arrowPoints.push(arrowPointX);
                }

                //check if we have an arrow to the left as well
                if ((pos==lanes.length-1)&&intersections.startRight) {
                    //shaft end points
                    var arrowPoint11 = {
                        x:arrowPoint6.x - (20) * Math.cos(degrees_to_radians(angle+50)),
                        y:arrowPoint6.y - (20) * Math.sin(degrees_to_radians(angle+50))
                    };
                    var arrowPoint12 = {
                        x:arrowPoint8.x - (20) * Math.cos(degrees_to_radians(angle+50)),
                        y:arrowPoint8.y - (20) * Math.sin(degrees_to_radians(angle+50))
                    };
                    //arrow side points
                    var arrowPoint13 = {
                        x:arrowPoint11.x - (6) * Math.cos(radAngle),
                        y:arrowPoint11.y - (6) * Math.sin(radAngle)
                    };
                    var arrowPoint14 = {
                        x:arrowPoint12.x - (6) * Math.cos(degrees_to_radians(angle-180)),
                        y:arrowPoint12.y - (6) * Math.sin(degrees_to_radians(angle-180))
                    };
                    //arrow point
                    var temppoint = {
                        x:arrowPoint11.x - (0) * Math.cos(degrees_to_radians(angle-180)),
                        y:arrowPoint11.y - (0) * Math.sin(degrees_to_radians(angle-180))
                    };
                    var arrowPoint15 = {
                        x:temppoint.x - (12) * Math.cos(radAnglePlus90),
                        y:temppoint.y - (12) * Math.sin(radAnglePlus90)
                    };
                    //add the stuff to the polygon
                    arrowPoints.push(arrowPoint11);
                    arrowPoints.push(arrowPoint13);
                    arrowPoints.push(arrowPoint15);
                    arrowPoints.push(arrowPoint14);
                    arrowPoints.push(arrowPoint12);
                }

                //add the secondary batch of points for the straight arrow
                arrowPoints.push(arrowPoint8);
                arrowPoints.push(arrowPoint10);
                arrowPoints.push(arrowPoint9);
                arrowPoints.push(arrowPoint7);

                
                //check if we have an arrow to the right as well
                if ((lane!==lanes[pos-1])&&intersections.startLeft) {
                    //shaft end points
                    var arrowPoint16 = {
                        x:arrowPoint5.x - (20) * Math.cos(degrees_to_radians(angle-50)),
                        y:arrowPoint5.y - (20) * Math.sin(degrees_to_radians(angle-50))
                    };
                    var arrowPoint17 = {
                        x:arrowPoint7.x - (20) * Math.cos(degrees_to_radians(angle-50)),
                        y:arrowPoint7.y - (20) * Math.sin(degrees_to_radians(angle-50))
                    };
                    //arrow side points
                    var arrowPoint18 = {
                        x:arrowPoint16.x - (6) * Math.cos(radAngle),
                        y:arrowPoint16.y - (6) * Math.sin(radAngle)
                    };
                    var arrowPoint19 = {
                        x:arrowPoint17.x - (6) * Math.cos(degrees_to_radians(angle-180)),
                        y:arrowPoint17.y - (6) * Math.sin(degrees_to_radians(angle-180))
                    };
                    //arrow point
                    var temppoint = {
                        x:arrowPoint16.x - (0) * Math.cos(degrees_to_radians(angle-180)),
                        y:arrowPoint16.y - (0) * Math.sin(degrees_to_radians(angle-180))
                    };
                    var arrowPoint20 = {
                        x:temppoint.x - (12) * Math.cos(radAngleMinus90),
                        y:temppoint.y - (12) * Math.sin(radAngleMinus90)
                    };
                    //add the stuff to the polygon
                    arrowPoints.push(arrowPoint17);
                    arrowPoints.push(arrowPoint19);
                    arrowPoints.push(arrowPoint20);
                    arrowPoints.push(arrowPoint18);
                    arrowPoints.push(arrowPoint16);
                }

                //add it to the main array
                this.roadArrows.push(arrowPoints);
            }
        });

    }

    draw(ctx){
        //create teh road surface rectangle
        ctx.fillStyle="#706E6A"
        ctx.beginPath();
        ctx.moveTo(this.roadSurface.topLeft.x,this.roadSurface.topLeft.y);
        ctx.lineTo(this.roadSurface.topRight.x,this.roadSurface.topRight.y);
        ctx.lineTo(this.roadSurface.bottomRight.x,this.roadSurface.bottomRight.y);
        ctx.lineTo(this.roadSurface.bottomLeft.x,this.roadSurface.bottomLeft.y);
        ctx.closePath();
        ctx.fill();

        //create directional division lines
        this.interdirectionalLineCoords.forEach( line => {
            ctx.setLineDash([]);
            ctx.lineWidth=10;
            ctx.strokeStyle="#E9EDF0";
            ctx.beginPath();
            ctx.moveTo(line[0].x,line[0].y);
            ctx.lineTo(line[1].x,line[1].y);
            ctx.stroke();
            //draw some decorations
            ctx.lineWidth=5;
            ctx.strokeStyle="#ffad00";
            ctx.setLineDash([5,100]);
            ctx.beginPath();
            ctx.moveTo(line[0].x,line[0].y);
            ctx.lineTo(line[1].x,line[1].y);
            ctx.stroke();
        });

        //create lane division lines
        ctx.lineWidth=8;
        ctx.strokeStyle="#E9EDF0";
        ctx.setLineDash([20,20]);
        this.interlaneLinesCoords.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line[0].x,line[0].y);
            ctx.lineTo(line[1].x,line[1].y);
            ctx.stroke();
        })

        //draw the road borders        
        ctx.setLineDash([]);
        ctx.lineWidth=10;
        ctx.strokeStyle="#E9EDF0";
        this.border.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });

        //draw decorations
        ctx.lineWidth=10;
        ctx.strokeStyle="#E9EDF0";
        this.roadEndLinesMain.forEach(line=>{
            ctx.beginPath();
            ctx.moveTo(line[0].x,line[0].y);
            ctx.lineTo(line[1].x,line[1].y);
            ctx.stroke();
        });
        ctx.lineWidth=5;
        this.roadEndLinesAux.forEach(line=>{
            ctx.beginPath();
            ctx.moveTo(line[0].x,line[0].y);
            ctx.lineTo(line[1].x,line[1].y);
            ctx.stroke();
        });
        ctx.fillStyle="#E9EDF0";
        this.roadArrows.forEach(polygon=>{
            ctx.beginPath();
            ctx.moveTo(polygon[0].x,polygon[0].y);
            for (let i = 1; i < polygon.length; i++) {
                ctx.lineTo(polygon[i].x,polygon[i].y);
            }
            ctx.closePath();
            ctx.fill();
        });
        
    }   

    //draw wireframe 
    draw_wireframe(ctx){
        //create directional division lines
        this.interdirectionalLineCoords.forEach( line => {
            ctx.setLineDash([]);
            ctx.lineWidth=10;
            ctx.strokeStyle="#D0DFE6";
            ctx.beginPath();
            ctx.moveTo(line[0].x,line[0].y);
            ctx.lineTo(line[1].x,line[1].y);
            ctx.stroke();
        });

        //create lane division lines
        ctx.lineWidth=8;
        ctx.strokeStyle="#D0DFE6";
        ctx.setLineDash([20,20]);
        this.interlaneLinesCoords.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line[0].x,line[0].y);
            ctx.lineTo(line[1].x,line[1].y);
            ctx.stroke();
        })

        //draw the road borders        
        ctx.setLineDash([]);
        ctx.lineWidth=10;
        ctx.strokeStyle="#748AA6";
        this.border.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }
}
