class Sensor{
    constructor(car){
        //car object the proximity sensor is attached to
        this.car=car;
        //number of rays
        this.rayCount=12; //16

        //length of rays
        this.rayLength=200;
        //agle of spread (forward/backward)
        this.raySpread=Math.PI*4/3;


        this.rays=[];

        //the collision sensor readings
        this.readings=[];
        //the lane detection sensor readings
        this.laneReadings=[];
    }

    #getReadings(ray,roadBorders,traffic,id){
        let touches=[];
        for (let index = 0; index < roadBorders.length; index++) {
            const touch=getIntersection(
                ray[0],
                ray[1],
                roadBorders[index][0],
                roadBorders[index][1]
            );
            if(touch){
                touches.push(touch);
            } 
        }
        for (let index = 0; index < traffic.length; index++) {
            if (index!=id) {
                const poly = traffic[index].polygon;
                for (let i = 0; i < poly.length; i++){
                    const value = getIntersection(
                        ray[0],
                        ray[1],
                        poly[i],
                        poly[(i+1)%poly.length]
                    );
                    if (value) {
                        touches.push(value);
                    }
                }
            }
        }
        if(touches.length==0){
            return null;
        } else {
            const offsets=touches.map(e=>e.offset);
            //spread array into many individual values using ... and find the minimum
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    #getLaneReadings(ray,current_location){
        let touches=[];
        //iterate through the lane lines
        current_location.forEach(road_segment=>{
            if(road_segment.type=="road"){    
                road_segment.interdirectionalLineCoords.forEach(lane_line =>{
                    const touch=getIntersection(
                        ray[0],
                        ray[1],
                        lane_line[0],
                        lane_line[1]
                    );
                    if(touch){
                        touches.push(touch);
                    } 
                });
                road_segment.interlaneLinesCoords.forEach(lane_line =>{
                    const touch=getIntersection(
                        ray[0],
                        ray[1],
                        lane_line[0],
                        lane_line[1]
                    );
                    if(touch){
                        touches.push(touch);
                    } 
                });
            }
        }); 
        //check if the ray touched any lane lines
        if(touches.length==0){
            return null;
        } else {
            const offsets=touches.map(e=>e.offset);
            //spread array into many individual values using ... and find the minimum
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
        
    }

    //cast the rays from the source
    #castRays(){
        //reset the ray array
        this.rays=[];
        //cast the forward rays
        for (let index = 0; index < this.rayCount; index++) {
            const rayAngle = linearInterpolation(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:index/(this.rayCount-1)
            )-this.car.angle;

            const start={x:this.car.x ,y:this.car.y};
            const end={
                x:this.car.x-
                    Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-
                    Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]);
        }
    }

    update(roadBorders, traffic, road_segment, id){
        this.#castRays();       //cast the rays from the source
        this.readings=[];       //reset readings var
        this.laneReadings=[];   //reset the lane readings var
        //iterate through the rays
        for (let index = 0; index < this.rays.length; index++) {
            //get readings to the road edge and traffic
            this.readings.push(
                this.#getReadings(this.rays[index],roadBorders,traffic,id)
            );
            //get readings to the lane lines
            this.laneReadings.push(
                this.#getLaneReadings(this.rays[index],road_segment)
            )    
        }
    }

    draw(ctx){
        //iterate throught the rays
        for(let i=0;i<this.rayCount;i++){
            //define the endpoints for the two sesor readings
            var start_lane_detect = this.rays[i][1];;
            var start_collision_detect = this.rays[i][1];;

            //check if we are reading lane lines
            if (this.laneReadings[i]) {
                start_lane_detect=this.laneReadings[i];
            }
            //check if we are reading collisions
            if(this.readings[i]){
                start_collision_detect=this.readings[i];
            }

            //check if the lane detect is closer than the collsion
            //or just draw them one on top of the other?
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="green";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="blue";
            ctx.moveTo(
                start_lane_detect.x,
                start_lane_detect.y
            );
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="red";
            ctx.moveTo(
                start_collision_detect.x,
                start_collision_detect.y
            );
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.stroke();

            //define the end of the ray as the actual end
            // let end=this.rays[i][1];
            

            // ctx.beginPath();
            // ctx.lineWidth=2;
            // ctx.strokeStyle="green";
            // ctx.moveTo(
            //     this.rays[i][0].x,
            //     this.rays[i][0].y
            // );
            // ctx.lineTo(
            //     end.x,
            //     end.y
            // );
            // ctx.stroke();

            // ctx.beginPath();
            // ctx.lineWidth=2;
            // ctx.strokeStyle="red";
            // ctx.moveTo(
            //     this.rays[i][1].x,
            //     this.rays[i][1].y
            // );
            // ctx.lineTo(
            //     end.x,
            //     end.y
            // );
            // ctx.stroke();
        }
    }
}