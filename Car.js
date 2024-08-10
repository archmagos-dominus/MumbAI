class Car{
    //class constructor
    constructor(x,y,width,height, id, neural_net){
        this.id=id;
        //store the image object 
        //this.img = img;
        //if the control type is AI, use the neural network to control the car
        this.useBrain=true;
        //[x,y] - postion of the car
        this.x=x;
        this.y=y;
        //[width,height] - size of the car 
        this.width=width;
        this.height=height;
        //array to store the car data used for diplay 
        this.data={
            spd:"0",
            rpm:"0",
            air:"0",
            fuel:"0",
            fuel_total:" 0",
            distance_total:"0",
            throttle_pos:"0",
            brake_pos:"0",
            clutch_engaged:false, //this lights up an icon
            current_gear:"N", //R->N->1..
            steering_angle:"0° ", //L/R
            abs_warn:false,
            engine_dmg:0, //this will be used to change the colour of the icon from green to red as the engine sustains damage
            gearbox_dmg:0 //same as above
        }; 
        //is the car currently selected?
        this.selected;
        this.best;
        this.total_distance_traveled=0;
        this.total_fuel_used=0;
        //this will be used to decide if the car should stop or not
        this.damaged = false;
        this.engineDamage = 0;
        this.gearboxDamage = 0;
        //scoring related vars
        this.score=0;
        this.stationary_ms=null;
        this.on_intersection=null;
        this.intersection=false;
        this.intersection_mistakes=0;
        //VEHICLE PARAMETERS
        //gearbox
        //positive gears - forward gears 
        //0 - neutral
        //negative gears - reverse gears
        this.currentGear=0;
        this.maxGearsFw=5;
        this.maxGearsRv=-1;
        this.changingGear=false;
        this.gearDiscrepancy=0;
        //mass of the car
        //this.weight=1;
        //initial steering parameters
        this.steeringAngle=0;
        this.wheelAngle=0;
        this.steeringRatio=0.05;
        this.maxWheelAngle=degrees_to_radians(30);
        this.turnRadius=0;
        // this.steeringStep=Math.floor(Math.PI/252);
        //initial speed (0)
        this.speed=0;
        //rolling resistence parameters
        //(fricition between tires and road surface)
        //simplified
        this.rollResistence=0.001;//average roll coeficient for car tires over asphalt
        this.rollResistenceAcc=0.0015*Math.abs(this.steeringAngle); 
        // //Rolling resistence can be calculated using
        // this.rollResistence = this.rollCoeficient*this.weight;
        // //roll resistence increases when applying torque to the wheels (accelerating)
        // this.rollResistenceAcc = this.rollCoeficient*1.5*this.weight;
        //drag simlation
        //the drag force is equal to 1/2*dragCoeficient*frontArea*fluidDensity*speed^2
        //this can be simplified as constant*speed^2 later in the code
        //normal car drag coeficient*front area of the vehicle is around 0.5 - 0.65
        //this is aproximated as a 0.0002 value for our simaltion 
        this.dragCoeficient=0.0002;
        //brakes
        this.brakePedal=0;
        this.currentBrakingPower = 0;
        this.desiredBrakingPower = 0;
        this.maxBrakingPower = 5;
        //based on data from a Opel Vectra VXR
        //0-160km/h - 15.4s
        //0-160-0km/h - 22.25
        //inference results in braking being 2.2 times more powerful than the acceleration 
        this.brakingStep = 0.005;
        //abs
        this.abs = true;
        this.brakingThreshhold=4;
        this.abs_on = false;
        //ENGINE PARAMETERS
        //throttle position (as %)
        this.currThrottle = 0;
        this.minThrottle = 0;
        this.maxThrottle = 100;
        //engine revolutions (as RPM)
        this.minRevs = 1000; //engine RPM @ idle
        this.maxRevs = 7000; //engine RPM @ redline (engine will suffer damage if taken over it)
        this.desiredRevs = this.minRevs + (((this.maxRevs-this.minRevs)*this.currThrottle)/100); //engine RPM corresponding to the throttle position
        this.coeficientRevs = 1000;
        this.stepRevs = (this.currentGear!=0)?Math.floor(this.coeficientRevs/Math.abs(this.currentGear)):this.coeficientRevs;   //the amount by which to increase the revs every tick
        //init current revs to prevent some laps in logic later
        this.currtRevs = 1000;
        this.currtRevs = (this.currtRevs<this.desiredRevs)?this.currtRevs+this.stepRevs:this.currtRevs; //current engine RPM
        //engine torque and horsepower calculations
        //engine specs are 127Nm and 144HP
        //those functions simulate a torque/power to RPM chart
        this.currTorque = Math.floor((-0.000006*(this.currtRevs**2))+(0.06*this.currtRevs)-23);
        this.currPower = Math.floor((-0.000003*(this.currtRevs**2))+(0.047*this.currtRevs)-40);
        //calculate acceleration according to torque
        //acc = torque/current gear
        //make a gear ratio that makes sense
        this.currAcceleration = (this.currentGear)?this.currTorque/(this.currentGear*10):0;
        //calculate top speed according to power
        //60kmph in 1st gear at max rev
        //topspeed = hp * current gear
        //actually let's just calc that from the drag and acceleration
        this.currentTopSpeed = (this.currentGear)?this.currPower*this.currentGear:0;
        
        //airflow and fuel flow for cool gauges in the dashboard fufu~
        this.stoichiometricRatio=15;            //air/fuel ratio
        this.minAirflow=3;                      //aiflow @ idle
        this.maxAirflow=30;                     //airflow @ maxRPM
        this.minFuelflow=this.minAirflow/this.stoichiometricRatio;    //fuelflow @ idle
        this.maxFuelflow=this.maxAirflow/this.stoichiometricRatio;    //fuelflow @ maxRPM
        this.currentAirflow=this.minAirflow+((this.maxAirflow-this.minAirflow)*this.currThrottle)/100;  //current airflow
        this.currentFuelflow=this.currentAirflow/this.stoichiometricRatio;       

        
        //select the sprite for the car
        this.sprite = 1;
        //set the car angle at the start
        this.angle=0;
        //assign a set of controls to the vehicle
        this.clutch=false;
        this.gearUp=false;
        this.gearDown=false;
        this.increaseThrottle=false;
        this.decreaseThrottle=false;
        this.brakePress=false;
        this.brakeRelease=false;
        this.steerCW=false;
        this.steerCCW=false;
        //attach the brain/sensor pairs to the cars
        this.brain = neural_net;
        this.sensor = new Sensor(this,neural_net.data.neuron_layers[0].length/2); //input number of sensors (input neuros/2 atm)
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //current location stored the road segemnts that the car is on in order to calculate lane changing and other stuff
        this.currentLocation = [];
        this.car_center = {
            x:(this.x + (this.height*0.5) * Math.cos(this.angle+Math.PI/2)) + (this.height*0.5) * Math.cos(this.angle-Math.PI/2),
            y:(this.y + (this.height*0.5) * Math.sin(this.angle+Math.PI/2)) + (this.height*0.5) * Math.sin(this.angle-Math.PI/2)
        };

        //create the collision box
        this.polygon =  this.createPolygon();
        

        //those are not really needed, so maybe replace with funciton vars instead
        //this.rear_axle_coords={x:x,y:y};
        this.turning_center={x:x,y:y};
        this.angular_velocity;
    }

    #move(){
        //get the values of the control inputs to the car
        //throttle input
        //one if-elif because we can't increase and decrease throttle at the same time
        if (this.increaseThrottle) {
            //if we can increase the current throttle posistion (less than 100%) do it
            (this.currThrottle==this.maxThrottle)?this.currThrottle=this.maxThrottle:this.currThrottle++;
        } else if (this.decreaseThrottle) {
            //if we can decrease the current throttle posistion (more than 0%) do it
            (this.currThrottle==this.minThrottle)?this.currThrottle=this.minThrottle:this.currThrottle--;
        }

        //gear selection input
        if (!(this.gearDown)&&!(this.gearUp)) {
            this.changingGear=true;
        }
        if (this.gearDown&&this.changingGear) {
            //check if clutch is pressed
            //if not, damage the car
            if (!this.clutch){
                this.gearboxDamage++;
            }   
            //check if shifting to reverse
            if (this.speed>0&&this.currentGear==0) {
                this.gearboxDamage++;
            } else {
                //change teh gear
                if ((this.currentGear==this.maxGearsRv)) {
                    this.currentGear=this.maxGearsRv;
                } else {
                    this.currentGear--;
                    //increase revs to simulate a gear change into an inferior gear (not owhen selecting reverse gear)
                    if (this.currentGear==-1) {
                        this.gearDiscrepancy=this.gearDiscrepancy-1000;
                    } else {
                        this.gearDiscrepancy=this.gearDiscrepancy+1000;
                    }
                }
            }
            this.changingGear=false;
            this.stepRevs = (this.currentGear!=0)?Math.floor(this.coeficientRevs/Math.abs(this.currentGear)):this.coeficientRevs;   //the amount by which to increase the revs every tick
        }
        if (this.gearUp&&this.changingGear) {
            //check if clutch is pressed
            //if not, damage the car
            if (!this.clutch){
                this.gearboxDamage++;
            } 
            //check if shifting from reverse
            if (this.speed<0&&this.currentGear==0) {
                this.gearboxDamage++;
            } else {
                //change the gear
                if ((this.currentGear==this.maxGearsFw)) {
                    this.currentGear=this.maxGearsFw;
                } else {
                    this.currentGear++;
                    //decrease revs to simulate a gear change into a superior gear
                    this.gearDiscrepancy=this.gearDiscrepancy-1000;
                }
            }
            
            this.changingGear=false;
            this.stepRevs = (this.currentGear!=0)?Math.floor(this.coeficientRevs/Math.abs(this.currentGear)):this.coeficientRevs;   //the amount by which to increase the revs every tick
        }
        //clutch pedal input
        if (this.clutch) {
            this.gear = 0;
            this.stepRevs = this.coeficientRevs;
        } else {
            if (this.currentGear) {
                this.gear = this.currentGear;
                this.currtRevs = this.currtRevs + this.gearDiscrepancy;
                this.gearDiscrepancy=0;
            } else {
                this.gear = this.currentGear;
                this.gearDiscrepancy=0;
            }
        }
        //brake pedal input
        if (this.brakePress){
            (this.brakePedal==100)?this.brakePedal=100:this.brakePedal++;
        } else if (this.brakeRelease){
            (this.brakePedal==0)?this.brakePedal=0:this.brakePedal--;
        }
        //steering input
        if (this.steerCW && this.wheelAngle<this.maxWheelAngle) {
            this.steeringAngle++;
            this.wheelAngle=this.steeringAngle*this.steeringRatio;
            //calculate roll resistence according to steeering input
            this.rollResistenceAcc=0.0015*Math.pow(Math.abs(this.steeringAngle),2); 
            //this.rollResistence=0.001*Math.abs(this.steeringAngle);
            //for reverse, simplyfy it
            if (this.speed<0) {
                this.turnRadius = (this.wheelAngle!=0)?this.width/this.wheelAngle:0;
            } else {
                //when not near to 0 calculate new radius of rotation
                if(Math.abs(this.wheelAngle) > 0.001) {
                    this.turnRadius = (this.height*8/10)/Math.tan(this.wheelAngle) + this.width/2;    
                }
                //when theta near 0 make it 0 and give NR some value
                else { 
                    this.wheelAngle = 0;
                    this.turnRadius = 0;
                }
            }
        } 
        if (this.steerCCW && this.wheelAngle>-this.maxWheelAngle) {
            this.steeringAngle--;
            this.wheelAngle=this.steeringAngle*this.steeringRatio;
            //calculate roll resistence according to steeering input
            this.rollResistenceAcc=0.0015*Math.pow(Math.abs(this.steeringAngle),2); 
            //this.rollResistence=0.001*Math.abs(this.steeringAngle);
            //for reverse, simplyfy it
            if (this.speed<0) {
                this.turnRadius = (this.wheelAngle!=0)?this.width/this.wheelAngle:0;
            } else {
                //when not near to 0 calculate new radius of rotation
                if(Math.abs(this.wheelAngle) > 0.001) {
                    this.turnRadius = (this.height*8/10)/Math.tan(this.wheelAngle) - this.width/2;    
                }
                //when theta near 0 make it 0 and give NR some value
                else { 
                    this.wheelAngle = 0;
                    this.turnRadius = 0;
                }
            }
        }
        //calculate all the car parameters
        //engine revolutions (as RPM)
        this.desiredRevs = this.minRevs + (((this.maxRevs-this.minRevs)*this.currThrottle)/100); //engine RPM corresponding to the throttle position
        this.coeficientRevs = 1000;

        if (this.currtRevs==this.desiredRevs) {
            this.currtRevs=this.desiredRevs;
        } else {
            if (this.gear) {
                this.currtRevs = (this.currtRevs<this.desiredRevs)?Math.floor(this.currtRevs+this.stepRevs/50):Math.floor(this.currtRevs-this.stepRevs/100); //current engine RPM
            } else {
                this.currtRevs = (this.currtRevs<this.desiredRevs)?Math.floor(this.currtRevs+this.stepRevs/30):Math.floor(this.currtRevs-this.stepRevs/30); //current engine RPM
            }
        }

        //if the current revs are below 700, kill the car (engine stalling)
        if (this.currtRevs<500 || this.currtRevs>7100) {
            this.engineDamage++;
            //this.score-=this.engineDamage*this.engineDamage;
        }

        //engine torque and horsepower calculations
        //engine specs are 127Nm and 144HP
        //those functions simulate a torque/power to RPM chart
        this.currTorque = Math.floor((-0.000006*(this.currtRevs**2))+(0.06*this.currtRevs)-23);//REDO
        this.currPower = Math.floor((-0.000003*(this.currtRevs**2))+(0.047*this.currtRevs)-40);//REDO
        //console.log("RPM",this.currtRevs,"NPM", this.currTorque, "HP", this.currPower)
        //calculate acceleration according to torque
        //acc = torque/current gear
        //make a gear ratio that makes sense
        this.currAcceleration = (this.gear)?(this.currTorque/(this.gear*200)):0;
        //console.log(this.currAcceleration)
        //calculate top speed according to power
        //60kmph in 1st gear at max rev
        //topspeed = hp * current gear
        //actually let's just calc that from the drag and acceleration
        this.currentTopSpeed = (this.gear)?this.currPower*this.gear/35:0;
        //airflow and fuel flow for cool gauges in the dashboard fufu~
        // this.stoichiometricRatio=15;            //air/fuel ratio
        // this.minAirflow=3;                      //aiflow @ idle
        // this.maxAirflow=30;                     //airflow @ maxRPM
        // this.minFuelflow=this.minAirflow/this.stoichiometricRatio;    //fuelflow @ idle
        // this.maxFuelflow=this.maxAirflow/this.stoichiometricRatio;    //fuelflow @ maxRPM
        //convert (this.maxAirflow-this.minAirflow)/100 to a coef at init and then only do this.minAirflow+coef*currenttrottle
        this.currentAirflow=this.minAirflow+((this.maxAirflow-this.minAirflow)*this.currThrottle)/100;  //current airflow
        this.currentFuelflow=this.currentAirflow/(this.stoichiometricRatio/this.currThrottle+1);   

        //calculate braking parameters
        this.desiredBrakingPower = (this.brakePedal*this.maxBrakingPower)/100;
        if (this.speed!=0) {
            if (this.currentBrakingPower<this.desiredBrakingPower) {
                this.currentBrakingPower=this.currentBrakingPower+this.brakingStep;
                this.brakingStep=this.brakingStep*2;
            } else {
                this.currentBrakingPower=this.desiredBrakingPower;
                this.brakingStep=0.005;
            }
        } else {
            this.currentBrakingPower=this.desiredBrakingPower;
            this.brakingStep=0.005;
        }
        this.abs_on=false;
        //brake lock and abs area
        if (this.currentBrakingPower>this.brakingThreshhold) {
            //if no abs, reduce it to zero
            if (this.abs) {
                //when the braking power goes above the limit
                //reduce it to around 95% of the limit
                this.currentBrakingPower=this.brakingThreshhold*95/100;
                //keep the brakign step constant to further simulate the effect of abs on braking
                this.brakingStep=this.brakingStep/2;
                this.abs_on=true;
            } else {
                //no abs
                //reduce current braking power by 50% and reset braking step, simulating a slide of sorts
                this.currentBrakingPower=this.brakingThreshhold*5/10;
                this.brakingStep=0.005;
            }
        }

        //calculate car dynamics according to said parameters
        //calculate drag and brakes according to direction of travel (if applicable)
        let drag, brake;
        if (this.speed>0) {
            //if speed is over 0, increase air resistence exponentially
            drag = this.rollResistenceAcc+(this.dragCoeficient * Math.pow(Math.floor(this.speed),2));
            brake = (this.currentBrakingPower*this.maxBrakingPower)/100;
        } else if (this.speed<0) {
            //if speed is negative, vehicle moving backwards so drag vector is reversed
            drag = -(this.rollResistenceAcc+(this.dragCoeficient * Math.pow(Math.floor(this.speed),2)));
            brake = -(this.currentBrakingPower*this.maxBrakingPower)/100;
        } else {
            //no movement = no drag
            drag = 0
            brake = 0;
        }
        
        //calculate total speed according to acceleration, braking and drag
        if (this.currentTopSpeed<0){
            this.speed = (this.speed<this.currentTopSpeed)?this.speed-drag/60:this.speed+(this.currAcceleration-drag)/60;
            this.speed = (this.speed<brake)?this.speed-brake:0;
        } else if (this.currentTopSpeed>0){
            this.speed = (this.speed>this.currentTopSpeed)?this.speed-drag/60:this.speed+(this.currAcceleration-drag)/60;
            this.speed = (this.speed>brake)?this.speed-brake:0;
        } else {
            this.speed = this.speed-(drag/60);
            this.speed = this.speed-brake;
        }
        
        //stop the car if the speed is to low
        if(Math.abs(this.speed)<(this.rollResistenceAcc/10)){
           this.speed=0;
        }

        //turn the car
        if (this.turnRadius && this.speed) {
            //check for tire slip
            if (this.angular_velocity>0.04) {
                this.turnRadius+=(this.speed>0)?100*Math.abs(this.angular_velocity):0;
                //(this.speed>0)?this.turnRadius+=100*Math.abs(this.angular_velocity):null;
            }
            //calculate car rear axle possition (10% from the back)
            let rear_axle_coords = {
                x:this.x + (this.height*0.35) * Math.cos(this.angle+Math.PI/2),
                y:this.y + (this.height*0.35) * Math.sin(this.angle+Math.PI/2)
            }
            //using the radius, calculate the turning circle center postion
            this.turning_center = {
                x:rear_axle_coords.x + this.turnRadius * Math.cos(this.angle),
                y:rear_axle_coords.y + this.turnRadius * Math.sin(this.angle)
            }
            //calculate angular velocity from linear velocity w = v/r
            this.angular_velocity = this.speed/this.turnRadius;
            //console.log(this.angular_velocity,this.turnRadius)
            //using the angular velocity, calculate the next point of the car's rear axle presence starting from the center of the turning point
            let rear_axle_coords_new = {
                x:this.turning_center.x + this.turnRadius * Math.cos(this.angle+Math.PI+this.angular_velocity),
                y:this.turning_center.y + this.turnRadius * Math.sin(this.angle+Math.PI+this.angular_velocity)
            }
            //using the angular velocity, calulate the current car orientation
            this.angle = this.angle+this.angular_velocity;
            //using all of the above, calculate the new possition of the center of the car
            this.x = rear_axle_coords_new.x + (this.height*0.35) * Math.cos(this.angle-Math.PI/2);
            this.y = rear_axle_coords_new.y + (this.height*0.35) * Math.sin(this.angle-Math.PI/2)
        } else {
            //no turning required, go straight
            //updating the car possition according to it's speed and direction
            this.x=this.x+Math.cos(this.angle-Math.PI/2)*this.speed;
            this.y=this.y+Math.sin(this.angle-Math.PI/2)*this.speed;
        }
        
        //see if the gearbox/engine are damaged beyond saving
        if (this.gearboxDamage==100||this.engineDamage==100) {
            this.damaged=true;
        }

        //check to see if car is being viewed by the observer
        if (this.selected) {    
            //increment total distance
            this.total_distance_traveled+=Math.abs(this.speed)/60; //maybe we'll need something more for angular distance but oh well
            //increment the fuel usage
            this.total_fuel_used+=this.currentFuelflow/60;
            //calculate all car data for display
            this.calculate_car_data();
        } else {
            //increment total distance
            this.total_distance_traveled+=Math.abs(this.speed)/60; //maybe we'll need something more for angular distance but oh well
            //increment the fuel usage
            this.total_fuel_used+=this.currentFuelflow/60;
        }
    }

    calculate_car_data(){
        //array to store the car data used for diplay 
        this.data={
            spd:Math.abs((this.speed*3.6).toFixed(0)),
            rpm:this.currtRevs.toFixed(0),
            air:this.currentAirflow.toFixed(2),
            fuel:this.currentFuelflow.toFixed(2),
            fuel_total:(this.total_fuel_used*0.0013).toFixed(2),
            distance_total:(this.total_distance_traveled/1000).toFixed(2),
            fuel_usage:(this.total_distance_traveled==0)?"--":((this.total_fuel_used*0.0013)/((this.total_distance_traveled+1)/1000)).toFixed(2),
            throttle_pos:this.currThrottle,
            brake_pos:this.brakePedal,
            clutch_engaged:this.clutch, //this lights up an icon
            current_gear:(this.currentGear>0)?this.currentGear:(this.currentGear<0)?"R":"N", //R->N->1..
            steering_angle:this.wheelAngle.toFixed(2), //L/R
            abs_warn:this.abs_on,
            engine_dmg:this.engineDamage, //this will be used to change the colour of the icon from green to red as the engine sustains damage
            gearbox_dmg:this.gearboxDamage //same as above
        }; 

        
    }

    // update(roadBorders, traffic, map, controls){
    //     if (!this.damaged) {
    //         this.#move();
    //         //create the collision box
    //         this.polygon =  this.createPolygon();
    //         //if the car was not damaged before, check to see if it hit anything
    //         if (!this.damaged) {
    //             this.damaged = this.assesDamage(roadBorders,traffic,map);
    //         }
    //         //score calculations
    //         //negatives - damage, fuel usage
    //         this.score-=(Math.pow(this.data.engine_dmg,2)/100+Math.pow(this.data.gearbox_dmg,2)/100+this.currentFuelflow/60000);


    //         //check for current lane possitioning
    //         var score_calc = 0;
    //         //get car center
    //         this.car_center = {
    //             x:(this.x + (this.height*0.5) * Math.cos(this.angle+Math.PI/2)) + (this.height*0.5) * Math.cos(this.angle-Math.PI/2),
    //             y:(this.y + (this.height*0.5) * Math.sin(this.angle+Math.PI/2)) + (this.height*0.5) * Math.sin(this.angle-Math.PI/2)
    //         }
    //         //iterate through the road segments that the car is on
    //         this.currentLocation.forEach(road_segment=>{
    //             //check for the speed limit
    //             //iterate throught hte directional boxes of the road segment (if any)
    //             road_segment.directionBoxes.forEach(directional_box =>{
    //                 if (road_segment.type=="road") {
    //                     //check if the car is on this box
    //                     //please refractor the road/curve/intersection classes to simplify this retardation
    //                     if (inside(this.car_center,[directional_box.coords.bottomLeft,directional_box.coords.topLeft,directional_box.coords.topRight,directional_box.coords.bottomRight])) {
    //                         //check if the current directional box is correct for the current car angle (after transformation with the road angle of course)
    //                         //calculate the relative angle
    //                         var grand_angle = (road_segment.angle-90>0)?degrees_to_radians(road_segment.angle-90)-(this.angle%(2*Math.PI)):degrees_to_radians(Math.PI*2+road_segment.angle-90)-(this.angle%(2*Math.PI));
    //                         grand_angle=Math.abs(grand_angle)

    //                         if ((grand_angle>Math.PI/2)&&(grand_angle<3*Math.PI/2)) {
    //                             if (directional_box.direction=="left") {
    //                                 //score - wrong way
    //                                 score_calc = -1*(Math.pow(this.speed,2));
    //                             } else {
    //                                 //correct way
    //                                 //check for speed limits
    //                                 if (this.speed<road_segment.speedLimit) {
    //                                     //score - withing speed limit  
    //                                     score_calc = this.speed;
    //                                 } else {
    //                                     //score - withing speed limit  
    //                                     score_calc = road_segment.speedLimit-this.speed;
    //                                 }
                                    
    //                             }
    //                         } else {
    //                             if (directional_box.direction=="right") {
    //                                 //score - wrong way
    //                                 score_calc = -1*(Math.pow(this.speed,2));
    //                             } else {
    //                                 //correct way
    //                                 //check for speed limits
    //                                 if (this.speed<road_segment.speedLimit) {
    //                                     //score - withing speed limit  
    //                                     score_calc = this.speed;
    //                                 } else {
    //                                     //score - withing speed limit  
    //                                     score_calc = road_segment.speedLimit-this.speed;
    //                                 }
    //                             }
    //                         }                       
    //                     }
    //                 } else if (road_segment.type=="curve"){
    //                     //console.log("car on curve")
    //                     //this shit is hard, I'll just do it at some later date
    //                 } else {
    //                     //console.log("car on intersection")
    //                     //this one is a bit complicated too, same
    //                 }
                    
                    
    //             });
    //             //check for any lines that the car is on
    //             //use the polygon intersects with the lines from teh lanes
    //             if (road_segment.type=="road"){
    //                 //console.log("car on curve")
    //                 //make sure to remove this check after we refactor the road, curve and intersection as well

    //                 road_segment.interdirectionalLineCoords.forEach(lane_line =>{
    //                     if(polygonIntersects(this.polygon, lane_line)){
    //                         //zap the car with penalties if it stays on the line (slightly larger for the inster directional lines)
    //                         score_calc -= this.speed*2.5;
    //                     }
    //                 });
    //                 road_segment.interlaneLinesCoords.forEach(lane_line =>{
    //                     if(polygonIntersects(this.polygon, lane_line)){
    //                         //zap the car with penalties if it stays on the line (slightly smaller for those inter lane lines)
    //                         score_calc -= this.speed/2;
    //                     }
    //                 });
    //             } 
    //         });

    //         //check if vehicle is stationary
    //         if (this.speed==0) {
    //             if (this.stationary_ms==null) {
    //                 this.stationary_ms=Date.now();
    //             } else if (Date.now()-this.stationary_ms>30000) {
    //                 //pentalties
    //                 this.score-=(Date.now()-this.stationary_ms)/100000;
    //             }
    //         } else {
    //             this.stationary_ms=null;
    //         }

    //         //add what we have figured out from the speed and position of the car
    //         this.score+=score_calc/100;
    //         //console.log(this.score)
    //         //update the sensors
    //         if (this.sensor) {
    //             //update the sensor object attached to this car
    //             this.sensor.update(roadBorders,traffic,this.currentLocation,this.id);

    //             let offsets=this.sensor.readings.map(
    //                 //s is the sensor offset
    //                 //if it is zero, then 0
    //                 //if it is somethime then
    //                 //the closer it is the higher the value received
    //                 s=>s==null?0:1-s.offset
    //             );

    //             let lane_offsets=this.sensor.laneReadings.map(
    //                 //s is the sensor offset
    //                 //if it is zero, then 0
    //                 //if it is somethime then
    //                 //the closer it is the higher the value received
    //                 s=>s==null?0:1-s.offset
    //             );

    //             //let normalized_speed = (Math.abs(this.speed)/275);
    //             let inputs = offsets.concat(lane_offsets);//,normalized_speed);
  
    //             //put the data through the NN and get the outputs
    //             let outputs=NeuralNetwork.feedForward(inputs,this.brain);

    //             //control the car accordingly
    //             if (this.useBrain) {
    //                 this.clutch=outputs[0];
    //                 this.gearUp=outputs[1];
    //                 this.gearDown=outputs[2];
    //                 this.increaseThrottle=outputs[3];
    //                 this.decreaseThrottle=outputs[4];
    //                 this.brakePress=outputs[5];
    //                 this.brakeRelease=outputs[6];
    //                 this.steerCW=outputs[7];
    //                 this.steerCCW=outputs[8];
    //             } else {
    //                 //manual control
    //                 this.clutch=controls.clutch;
    //                 this.gearUp=controls.gearUp;
    //                 this.gearDown=controls.gearDown;
    //                 this.increaseThrottle=controls.increaseThrottle;
    //                 this.decreaseThrottle=controls.decreaseThrottle;
    //                 this.brakePress=controls.brakePress;
    //                 this.brakeRelease=controls.brakeRelease;
    //                 this.steerCW=controls.steerCW;
    //                 this.steerCCW=controls.steerCCW;

    //                 //replace controls with an object in constructor and ouputs
    //             }
    //         }
    //     }

        
    // }

    update(roadBorders, traffic, map, controls){
        //only update non damaged vehicles
        if (this.damaged) return;
        //initialize the score var
        let score_calc = 0;
        this.#move();
        //create the collision box
        this.polygon =  this.createPolygon();
        //if the car was not damaged during the move (engine or gearbox failure), check to see if it hit anything
        if (!this.damaged) {
            this.damaged = this.assesDamage(roadBorders,traffic,map);
        }
        //score calculations
        //negatives - damage, fuel usage
        let negatives = (this.currentFuelflow/1200000); //+(this.data.engine_dmg/100+this.data.gearbox_dmg/100);
        //check for current lane possitioning
        //get car center
        this.car_center = {
            x:(this.x + (this.height*0.5) * Math.cos(this.angle+Math.PI/2)) + (this.height*0.5) * Math.cos(this.angle-Math.PI/2),
            y:(this.y + (this.height*0.5) * Math.sin(this.angle+Math.PI/2)) + (this.height*0.5) * Math.sin(this.angle-Math.PI/2)
        }
        //iterate through the road segments that the car is on
        this.currentLocation.forEach(road_segment=>{
            //check for the speed limit
            //iterate throught hte directional boxes of the road segment (if any)
            road_segment.directionBoxes.forEach((directional_box, index) =>{
                if (road_segment.type=="road") {
                    //check if the car is on this box
                    //please refractor the road/curve/intersection classes to simplify this retardation
                    if (inside(this.car_center,[directional_box.coords.bottomLeft,directional_box.coords.topLeft,directional_box.coords.topRight,directional_box.coords.bottomRight])) {
                        //check if the current directional box is correct for the current car angle (after transformation with the road angle of course)
                        //calculate the relative angle
                        let grand_angle = (road_segment.angle-90>0)?degrees_to_radians(road_segment.angle-90)-(this.angle%(2*Math.PI)):degrees_to_radians(Math.PI*2+road_segment.angle-90)-(this.angle%(2*Math.PI));
                        grand_angle=Math.abs(grand_angle)
                        //check if car is going the right way
                        if ((grand_angle>Math.PI/2)&&(grand_angle<3*Math.PI/2)) {
                            if (directional_box.direction=="left") {
                                //score - wrong way
                                score_calc = (-1*(Math.pow(this.speed,2)));
                            } else {
                                //correct way
                                //check for speed limits
                                if (this.speed<road_segment.speedLimit) {
                                    //score - within speed limit  
                                    score_calc = this.speed;
                                } else {
                                    //score - over speed limit  
                                    score_calc = (road_segment.speedLimit-this.speed);
                                }
                            }
                        } else {
                            if (directional_box.direction=="right") {
                                //score - wrong way
                                score_calc = (-1*(Math.pow(this.speed,2)));
                            } else {
                                //correct way
                                //check for speed limits
                                if (this.speed<road_segment.speedLimit) {
                                    //score - withing speed limit  
                                    score_calc = this.speed;
                                } else {
                                    //score - withing speed limit  
                                    score_calc = (road_segment.speedLimit-this.speed);
                                }
                            }
                        }                       
                    }
                } else if (road_segment.type=="curve"){
                    //console.log("car on curve")
                    //I'll just do it at some later date
                } else if (road_segment.type=="intersection")  {                    ////////////////////////still needs work
                    //check if the car is inside the intersection
                    if ((inside(this.car_center,road_segment.roadSurface))) {
                        //check if vars are set
                        if (!this.intersection) {
                            //set the vars up
                            this.intersection=true;
                            this.on_intersection=index;
                            this.intersection_mistakes=0;
                        } else {
                            //check to see if the current box is either the same of the next box (car moving CCW)
                            //special cae for the loop as well
                            if ((index==this.on_intersection) || (index==this.on_intersection+1) || ((index==0)&&(this.on_intersection==road_segment.directionBoxes.length-1))) {
                                this.on_intersection=index;
                            } else {
                                this.intersection_mistakes++;
                                this.on_intersection=index;
                            }
                        }
                    } else if (this.intersection){
                        //turn off intersection check
                        this.intersection=false;
                        this.on_intersection=-1;
                        //see what score you need to give the car 
                        console.log(this.intersection_mistakes)
                    }
                }
            });
            //check for any lines that the car is on
            //use the polygon intersects with the lines from teh lanes
            if (road_segment.type=="road"){//move this up to the other if<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //make sure to remove this check after we refactor the road, curve and intersection as well
                road_segment.interdirectionalLineCoords.forEach(lane_line =>{
                    if(polygonIntersects(this.polygon, lane_line)){
                        //zap the car with penalties if it stays on the line (slightly larger for the inster directional lines)
                        score_calc -= this.speed;
                    }
                });
                road_segment.interlaneLinesCoords.forEach(lane_line =>{
                    if(polygonIntersects(this.polygon, lane_line)){
                        //zap the car with penalties if it stays on the line (slightly smaller for those inter lane lines)
                        score_calc -= this.speed/2;
                    }
                });
            } 
        });
        //check if vehicle is stationary
        if (this.speed==0) {
            if (this.stationary_ms==null) {
                this.stationary_ms=Date.now();
            } else if (Date.now()-this.stationary_ms>30000) {
                //pentalties
                score_calc-=(Date.now()-this.stationary_ms)/100000;
            }
        } else {
            this.stationary_ms=null;
        }
        //add what we have figured out from the speed and position of the car
        this.score += (score_calc-negatives)/100;
        //update the sensors
        if (this.sensor) {
            //update the sensor object attached to this car
            this.sensor.update(roadBorders,traffic,this.currentLocation,this.id);
            let offsets=this.sensor.readings.map(
                //s is the sensor offset
                //if it is zero, then 0
                //if it is somethime then
                //the closer it is the higher the value received
                s=>s==null?0:1-s.offset
            );
            let lane_offsets=this.sensor.laneReadings.map(
                s=>s==null?0:1-s.offset
            );
            let inputs = offsets.concat(lane_offsets);//,normalized_speed);
            //put the data through the NN and get the outputs
            let outputs=NeuralNetwork.feedForward(inputs,this.brain);
            //control the car accordingly
            if (this.useBrain) {
                this.clutch=outputs[0];
                this.gearUp=outputs[1];
                this.gearDown=outputs[2];
                this.increaseThrottle=outputs[3];
                this.decreaseThrottle=outputs[4];
                this.brakePress=outputs[5];
                this.brakeRelease=outputs[6];
                this.steerCW=outputs[7];
                this.steerCCW=outputs[8];
            } else {
                //manual control
                this.clutch=controls.clutch;
                this.gearUp=controls.gearUp;
                this.gearDown=controls.gearDown;
                this.increaseThrottle=controls.increaseThrottle;
                this.decreaseThrottle=controls.decreaseThrottle;
                this.brakePress=controls.brakePress;
                this.brakeRelease=controls.brakeRelease;
                this.steerCW=controls.steerCW;
                this.steerCCW=controls.steerCCW;
            }
        }
    }

    draw(ctx){
        //decide on the image to draw
        let image;
        if (this.damaged) {
            image = images[0];
        } else if (this.best){
            image = images[1];
        } else {
            image = images[2];
        }
        
        //drawing sensors
        if (this.sensor && this.selected && !(this.damaged)) {
            this.sensor.draw(ctx);  
        }

        //draw the car on the canvas
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();

        //show the state of the car
        // ctx.beginPath();
        // ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        // ctx.lineTo(this.polygon[1].x,this.polygon[1].y);
        // ctx.lineTo(this.polygon[2].x,this.polygon[2].y);
        // ctx.lineTo(this.polygon[3].x,this.polygon[3].y);
        // ctx.fill(); 

        //show the current center of turn
        // ctx.fillStyle="white";
        // ctx.beginPath();
        // ctx.arc(this.rear_axle_coords.x, this.rear_axle_coords.y, 10, 0, 2 * Math.PI);
        // ctx.fill(); 

        //show the turning point
        // ctx.fillStyle="red";
        // ctx.beginPath();
        // ctx.arc(this.turning_center.x, this.turning_center.y, 10, 0, 2 * Math.PI);
        // ctx.fill(); 

        //show the car center
        // ctx.fillStyle="red";
        // ctx.beginPath();
        // ctx.arc(this.car_center.x, this.car_center.y, 10, 0, 2 * Math.PI);
        // ctx.fill(); 
        
    }

    draw_wireframe(ctx){
        if (this.damaged) {
            ctx.strokeStyle="#FF410D"; 
        } else if (this.best){
            ctx.strokeStyle="#6EE2FF";
        } else {
            ctx.strokeStyle="#95CC5E"; 
        }

        //drawing sensors
        if (this.sensor && this.selected) {
            this.sensor.draw(ctx);  
        } 

        //show the shape of the car
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        ctx.lineTo(this.polygon[1].x,this.polygon[1].y);
        ctx.lineTo(this.polygon[2].x,this.polygon[2].y);
        ctx.lineTo(this.polygon[3].x,this.polygon[3].y); 
        ctx.closePath();
        ctx.lineWidth=2;
        ctx.stroke(); 
    }

    //method to cheeck for damage
    //car polygon over the other borders
    assesDamage(roadBorders,traffic,map){
        //local checker var because it doesn't work at start for some reason
        let check = false;
        //check on what road the car is
        this.currentLocation=[];
        for (let index = 0; index < map.length; index++) {
            if (inside(this.car_center, map[index].road_surface)) {
                this.currentLocation.push(map[index]);
            } 
        }
        //check if car is out of bounds
        for (let index = 0; index < roadBorders.length; index++) {
            if (polygonIntersects(this.polygon,roadBorders[index])) {
                check = true;
            }
        }
        //check for collision between cars
        for (let index = 0; index < traffic.length; index++) {
            //self-collisions - no
            if (index!=this.id) {
                if (polygonIntersects(this.polygon,traffic[index].polygon)) {
                    check = true;
                }
            }
        }
        return check;
    }

    //function to create shape of car for colision detection
    createPolygon(){
        const points = [];
        //max radius of the box is half the diagonal
        const radius = Math.hypot(this.width,this.height)/2;
        //andgle of the diagonal
        const alpha = Math.atan2(this.width,this.height);
        //create the points of the rectangle
        //you can tweak this to be any shape you want actually
        points.push({
            x:this.x-Math.sin(-this.angle-alpha)*radius,
            y:this.y-Math.cos(-this.angle-alpha)*radius
        });
        points.push({
            x:this.x-Math.sin(-this.angle+alpha)*radius,
            y:this.y-Math.cos(-this.angle+alpha)*radius
        });
        points.push({
            x:this.x-Math.sin(Math.PI-this.angle-alpha)*radius,
            y:this.y-Math.cos(Math.PI-this.angle-alpha)*radius
        });
        points.push({
            x:this.x-Math.sin(Math.PI-this.angle+alpha)*radius,
            y:this.y-Math.cos(Math.PI-this.angle+alpha)*radius
        });
        return points;
    }

}