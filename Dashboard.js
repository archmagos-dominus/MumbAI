class Dashboard{
    constructor(width,height){
        //size of the canvas
        this.size={
            width:width,
            height:height
        }

        //build the dashboard
        this.dash_data = {
            circle_center:{
                x:this.size.width/4,
                y:this.size.height/2
            },
            r_outer: this.size.height*3/8,
            r_middle: this.size.height*0.32,
            r_inner: this.size.height*9/32,
            angle_alpha: 3*Math.PI/4,
            angle_beta: 7*Math.PI/4,
            angle_gamma: 9*Math.PI/4,
            cluster_bottom: this.size.height/2,
            cluster_top: this.size.height/2-(this.size.height*9/32)/Math.sqrt(2),
            cluster_left: this.size.width/4-(this.size.height*9/32)/Math.sqrt(2),
            cluster_right: this.size.width/4+(this.size.height*9/32)/Math.sqrt(2),
            speed_value_y: this.size.height/2-(this.size.height*9/32)/Math.sqrt(2) + 1.5*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/6,
            speed_value_size:2*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/3,
            speed_unit_y: this.size.height/2-(this.size.height*9/32)/Math.sqrt(2) + 1.6*5*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/12,
            speed_unit_size: 2*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/6,
            rpm_value_y: this.size.height/2-(this.size.height*9/32)/Math.sqrt(2) + 1.7*5*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/9,
            rpm_value_size: 2*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/9,
            rpm_unit_y: this.size.height/2-(this.size.height*9/32)/Math.sqrt(2) + 1.7*23*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/36,
            rpm_unit_size: 2*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/18,
            gear_value_y: this.size.height/2-(this.size.height*9/32)/Math.sqrt(2) + 1.7*15*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/18,
            gear_value_size: 2*2*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/9,
            gear_unit_y: this.size.height/2-(this.size.height*9/32)/Math.sqrt(2) + 1.85*17*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/18,
            gear_unit_size: 2*(this.size.height/2-(this.size.height*9/32)/Math.sqrt(2))/9,
            engine_icon: [],
            gearbox_icon: [],
            clutch_icon: [],
            brakes_icon: [],
            data_rect_coords:{
                x: this.size.width/2,
                x0: this.size.width/2-this.size.width*0.025,
                x1: this.size.width/2+this.size.width*0.05 + (this.size.width/2*0.9)/2,
                x2: this.size.width/2+this.size.width*0.05 + (this.size.width/2)*0.8,
                y: this.size.height*0.05,
                w: (this.size.width/2)+this.size.width*0.005,
                h: this.size.height*0.9
            },
            data_rect_entries: [
                3*(this.size.height*0.9)/16,
                5*(this.size.height*0.9)/16,
                7*(this.size.height*0.9)/16,
                9*(this.size.height*0.9)/16,
                11*(this.size.height*0.9)/16,
                13*(this.size.height*0.9)/16
            ],
            stop_icon: {
                x: this.size.width/2-this.size.width*0.025 +( (this.size.width/2)+this.size.width*0.005)/4,
                y: 14*(this.size.height*0.9)/16,
                w: ((this.size.width/2)+this.size.width*0.005)/2,
                h: 2*(this.size.height*0.9)/16
            },
            //x positions of the gears too 
        };

        //create the icons
        //engine
        let icon_height = this.dash_data.speed_unit_size/2;
        let icon_width = icon_height*8/5;
        let icon_step = icon_height/5;
        let icon_y = this.dash_data.speed_unit_y - icon_height/2;
        let icon_x = this.dash_data.cluster_left - icon_width/2;
        this.dash_data.engine_icon.push({x: icon_x + 0,y: icon_y + icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 0,y: icon_y + 5*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 0,y: icon_y + 3*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + icon_step,y: icon_y + 3*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + icon_step,y: icon_y + 2*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 2*icon_step,y: icon_y + 2*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 3*icon_step,y: icon_y + icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 4*icon_step,y: icon_y + icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 4*icon_step,y: icon_y + 0});
        this.dash_data.engine_icon.push({x: icon_x + 3*icon_step,y: icon_y + 0});
        this.dash_data.engine_icon.push({x: icon_x + 5*icon_step,y: icon_y + 0});
        this.dash_data.engine_icon.push({x: icon_x + 4*icon_step,y: icon_y + 0});
        this.dash_data.engine_icon.push({x: icon_x + 4*icon_step,y: icon_y + icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 5*icon_step,y: icon_y + icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 6*icon_step,y: icon_y + 2*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 7*icon_step,y: icon_y + 2*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 7*icon_step,y: icon_y + icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 8*icon_step,y: icon_y + icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 8*icon_step,y: icon_y + 5*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 7*icon_step,y: icon_y + 5*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 7*icon_step,y: icon_y + 4*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 6*icon_step,y: icon_y + 5*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 4*icon_step,y: icon_y + 5*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 3*icon_step,y: icon_y + 4*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + icon_step,y: icon_y + 4*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + icon_step,y: icon_y + 3*icon_step});
        this.dash_data.engine_icon.push({x: icon_x + 0,y: icon_y + 3*icon_step});

        //gearbox icon
        icon_y = this.dash_data.speed_unit_y + icon_height*1.5;
        icon_x = icon_x + icon_width/2;
        this.dash_data.gearbox_icon.push({x: icon_x,y: icon_y});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step,y: icon_y });
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 2,y: icon_y + icon_step});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 3,y: icon_y + icon_step});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 4,y: icon_y});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 5,y: icon_y});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 7,y: icon_y + icon_step * 2});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 8,y: icon_y + icon_step * 2});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 8,y: icon_y + icon_step * 3});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 7,y: icon_y + icon_step * 3});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 6,y: icon_y + icon_step * 4});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 2,y: icon_y + icon_step * 4});
        this.dash_data.gearbox_icon.push({x: icon_x + icon_step * 1,y: icon_y + icon_step * 5});
        this.dash_data.gearbox_icon.push({x: icon_x,y: icon_y + icon_step * 5});

        //abs incon
        icon_y = this.dash_data.speed_unit_y - icon_height/2;
        icon_x = this.dash_data.cluster_right - icon_width/2;
        this.dash_data.brakes_icon.push({x: icon_x+icon_width/2, y: icon_y+icon_height/2}); //center of icon
        this.dash_data.brakes_icon.push(icon_height/2); //radius of inner circle
        this.dash_data.brakes_icon.push(icon_width/2); //radius of outer circle
        let sign_size = icon_height*3/4;
        this.dash_data.brakes_icon.push({x: icon_x+icon_width/2, y: icon_y+icon_height/2-sign_size/2}); //start of line
        this.dash_data.brakes_icon.push({x: icon_x+icon_width/2, y: icon_y+icon_height/2+sign_size/10}); //end of line
        this.dash_data.brakes_icon.push({x: icon_x+icon_width/2, y: icon_y+icon_height/2+sign_size/5}); //center of the point
        this.dash_data.brakes_icon.push(sign_size/10); //radius of the point

        //clutch icon
        icon_y = this.dash_data.speed_unit_y + icon_height*1.5;
        icon_x = icon_x - icon_width/2;
        this.dash_data.clutch_icon.push({x: icon_x, y: icon_y+icon_step*2});
        this.dash_data.clutch_icon.push({x: icon_x, y: icon_y+icon_step*3});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step, y: icon_y+icon_step*3});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step, y: icon_y+icon_step*5});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*2, y: icon_y+icon_step*5});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*2, y: icon_y+icon_step*4});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*3, y: icon_y+icon_step*4});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*3, y: icon_y+icon_step*3});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*2, y: icon_y+icon_step*3});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*2, y: icon_y+icon_step*2});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*3, y: icon_y+icon_step*2});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*3, y: icon_y+icon_step*1});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*2, y: icon_y+icon_step*1});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*2, y: icon_y});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step, y: icon_y});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step, y: icon_y+icon_step*2});
        //second part 16->
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*4, y: icon_y+icon_step*0});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*4, y: icon_y+icon_step*1});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*5, y: icon_y+icon_step*1});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*5, y: icon_y+icon_step*2});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*4, y: icon_y+icon_step*2});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*4, y: icon_y+icon_step*3});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*5, y: icon_y+icon_step*3});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*5, y: icon_y+icon_step*4});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*4, y: icon_y+icon_step*4});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*4, y: icon_y+icon_step*5});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*6, y: icon_y+icon_step*5});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*6, y: icon_y+icon_step*4});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*7, y: icon_y+icon_step*4});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*7, y: icon_y+icon_step*3});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*8, y: icon_y+icon_step*3});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*8, y: icon_y+icon_step*2});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*7, y: icon_y+icon_step*2});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*7, y: icon_y+icon_step*1});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*6, y: icon_y+icon_step*1});
        this.dash_data.clutch_icon.push({x: icon_x+icon_step*6, y: icon_y+icon_step*0});


        //using width and heigt, calculate the position of all elements
        this.throttle_position=0;
        this.brake_position=0;
        this.speed=0;
        this.rpm=0;
        this.gear=0;
        this.engine_status=0;
        this.gearbox_status=0;
        this.clutch_indicator=false;
        this.abs_indicator=false;
        this.air_usage=0;
        this.fuel_usage=0;
        this.fuel_total=0;
        this.fuel_economy=0;
        this.steering_angle=0;
        this.stopped=false;


    }

    draw(ctx_bg,ctx_fg){
        //draw the background and the outlines
        ////create the circle
        ctx_bg.beginPath();
        ctx_bg.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_outer, 0, 2*Math.PI);
        ctx_bg.closePath();
        ctx_bg.fillStyle="rgba(0, 0, 0, 0.5)";
        ctx_bg.fill();
        ////create the cirlce edges
        ctx_fg.beginPath();
        ctx_fg.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_outer, this.dash_data.angle_alpha, this.dash_data.angle_beta);
        ctx_fg.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_inner, this.dash_data.angle_beta, this.dash_data.angle_alpha, true);
        ctx_fg.closePath();
        ctx_fg.strokeStyle="rgb(185,187,190)";
        ctx_fg.lineWidth=this.dash_data.r_outer/20;
        ctx_fg.stroke();
        ctx_fg.beginPath();
        ctx_fg.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_outer, this.dash_data.angle_beta, this.dash_data.angle_gamma);
        ctx_fg.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_inner, this.dash_data.angle_gamma, this.dash_data.angle_beta, true);
        ctx_fg.closePath();
        ctx_fg.strokeStyle="rgb(185,187,190)";
        ctx_fg.lineWidth=this.dash_data.r_outer/20;
        ctx_fg.stroke();

        //dash text
        ctx_bg.fillStyle = "rgb(185,187,190)";
        ctx_fg.fillStyle = "rgb(185,187,190)";
        //throttle text
        ctx_fg.font = this.dash_data.gear_unit_size+"px bold";
        ctx_fg.textBaseline = "middle";
        ctx_fg.textAlign = "center";
        let str = "THROTTLE";
        ctx_fg.save();
        ctx_fg.translate(this.dash_data.circle_center.x, this.dash_data.circle_center.y);
        ctx_fg.rotate(-1 * this.dash_data.angle_alpha);
        ctx_fg.rotate((this.dash_data.angle_beta-this.dash_data.angle_alpha)/8);
        for (var n = 0; n < 8; n++) {
            ctx_fg.rotate((this.dash_data.angle_beta-this.dash_data.angle_alpha)/12);
            ctx_fg.save();
            ctx_fg.translate(0, -1 * this.dash_data.r_middle);
            ctx_fg.fillText(str[n], 0, 0);
            ctx_fg.restore();
        }
        ctx_fg.restore();
        //brake text
        let strb = "BRAKE";
        ctx_fg.save();
        ctx_fg.translate(this.dash_data.circle_center.x, this.dash_data.circle_center.y);
        ctx_fg.rotate(-1 * this.dash_data.angle_beta);
        ctx_fg.rotate((this.dash_data.angle_gamma-this.dash_data.angle_beta)/10);
        for (var n = 0; n < 5; n++) {
            ctx_fg.rotate((this.dash_data.angle_gamma-this.dash_data.angle_beta)/8);
            ctx_fg.save();
            ctx_fg.translate(0, -1 * this.dash_data.r_middle);
            ctx_fg.fillText(strb[n], 0, 0);
            ctx_fg.restore();
        }
        ctx_fg.restore();
        //speed units
        ctx_bg.font = this.dash_data.speed_unit_size+"px bold";
        ctx_bg.textBaseline = "middle";
        ctx_bg.textAlign = "center";
        ctx_bg.fillText("km/h", this.dash_data.circle_center.x, this.dash_data.speed_unit_y);
        //rpm units
        ctx_bg.font = this.dash_data.rpm_unit_size+"px bold";
        ctx_bg.textBaseline = "middle";
        ctx_bg.textAlign = "center";
        ctx_bg.fillText("rpm", this.dash_data.circle_center.x, this.dash_data.rpm_unit_y);
        //gear text
        ctx_bg.font = this.dash_data.gear_unit_size+"px bold";
        ctx_bg.textBaseline = "middle";
        ctx_bg.textAlign = "center";
        ctx_bg.fillText("GEAR", this.dash_data.circle_center.x, this.dash_data.gear_unit_y);

        //dash icons (bg)
        ctx_bg.strokeStyle="rgba(0, 0, 0, 0.5)";
        //engine
        ctx_bg.beginPath();
        ctx_bg.moveTo(this.dash_data.engine_icon[0].x,this.dash_data.engine_icon[0].y);
        for (let index = 0; index < this.dash_data.engine_icon.length; index++) {
            ctx_bg.lineTo(this.dash_data.engine_icon[index].x,this.dash_data.engine_icon[index].y);
        }
        ctx_bg.closePath();
        //ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/60;
        ctx_bg.stroke();

        //gearbox
        ctx_bg.beginPath();
        ctx_bg.moveTo(this.dash_data.gearbox_icon[0].x,this.dash_data.gearbox_icon[0].y);
        
        for (let index = 0; index < this.dash_data.gearbox_icon.length; index++) {
            ctx_bg.lineTo(this.dash_data.gearbox_icon[index].x,this.dash_data.gearbox_icon[index].y);
        }
        ctx_bg.closePath();
        //ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/60;
        ctx_bg.stroke();

        //abs icon
        ////draw the circles
        ctx_bg.beginPath();
        ctx_bg.arc(this.dash_data.brakes_icon[0].x, this.dash_data.brakes_icon[0].y, this.dash_data.brakes_icon[1], 0, 2*Math.PI);
        //ctx_bg.closePath();
        //ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/60;
        ctx_bg.stroke();
        ctx_bg.beginPath();
        ctx_bg.arc(this.dash_data.brakes_icon[0].x, this.dash_data.brakes_icon[0].y, this.dash_data.brakes_icon[2], 3*Math.PI/4, 5*Math.PI/4);
        //ctx_bg.closePath();
        //ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/40;
        ctx_bg.stroke();
        ctx_bg.beginPath();
        ctx_bg.arc(this.dash_data.brakes_icon[0].x, this.dash_data.brakes_icon[0].y, this.dash_data.brakes_icon[2], -Math.PI/4, Math.PI/4)
        //ctx_bg.closePath();
        //ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/40;
        ctx_bg.stroke();
        ctx_bg.beginPath();
        ctx_bg.arc(this.dash_data.brakes_icon[5].x, this.dash_data.brakes_icon[5].y, this.dash_data.brakes_icon[6], 0, 2*Math.PI);
        ctx_bg.closePath();
        ctx_bg.fillStyle="rgba(0, 0, 0, 0.5)";
        ctx_bg.fill();
        //line of the exclamation mark
        ctx_bg.beginPath();
        ctx_bg.moveTo(this.dash_data.brakes_icon[3].x,this.dash_data.brakes_icon[3].y);
        ctx_bg.lineTo(this.dash_data.brakes_icon[4].x,this.dash_data.brakes_icon[4].y);
        //ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/60;
        ctx_bg.stroke();

        //clutch indicator
        ctx_bg.beginPath();
        ctx_bg.moveTo(this.dash_data.clutch_icon[0].x,this.dash_data.clutch_icon[0].y);
        for (let index = 1; index < 16; index++) {
            ctx_bg.lineTo(this.dash_data.clutch_icon[index].x,this.dash_data.clutch_icon[index].y);
        }
        ctx_bg.closePath();
        //ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/60;
        ctx_bg.stroke();
        ctx_bg.beginPath();
        ctx_bg.moveTo(this.dash_data.clutch_icon[16].x,this.dash_data.clutch_icon[16].y);
        for (let index = 17; index < this.dash_data.clutch_icon.length; index++) {
            ctx_bg.lineTo(this.dash_data.clutch_icon[index].x,this.dash_data.clutch_icon[index].y);
        }
        ctx_bg.closePath();
        //ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/60;
        ctx_bg.stroke();

        //rectangel data entries
        //background
        ctx_bg.beginPath();
        ctx_bg.rect(this.dash_data.data_rect_coords.x0, this.dash_data.data_rect_coords.y, this.dash_data.data_rect_coords.w, this.dash_data.data_rect_coords.h);
        ctx_bg.fillStyle="rgba(0, 0, 0, 0.5)";
        ctx_bg.fill();
        //edges
        ctx_bg.beginPath();
        ctx_bg.rect(this.dash_data.data_rect_coords.x0, this.dash_data.data_rect_coords.y, this.dash_data.data_rect_coords.w, this.dash_data.data_rect_coords.h);
        ctx_bg.strokeStyle="rgb(185,187,190)";
        ctx_bg.lineWidth=this.dash_data.r_outer/60;
        ctx_bg.stroke();
        //text
        ctx_bg.fillStyle = "rgb(185,187,190)";
        //descriptors
        ctx_bg.font = this.dash_data.data_rect_coords.h/16+"px bold";
        ctx_bg.textBaseline = "middle";
        ctx_bg.textAlign = "left";
        ctx_bg.fillText("Air Intake", this.dash_data.data_rect_coords.x, this.dash_data.data_rect_entries[0]);
        ctx_bg.fillText("Fuel Intake", this.dash_data.data_rect_coords.x, this.dash_data.data_rect_entries[1]);
        ctx_bg.fillText("Fuel Used", this.dash_data.data_rect_coords.x, this.dash_data.data_rect_entries[2]);
        ctx_bg.fillText("Total Distance", this.dash_data.data_rect_coords.x, this.dash_data.data_rect_entries[3]);
        ctx_bg.fillText("Fuel Efficiency", this.dash_data.data_rect_coords.x, this.dash_data.data_rect_entries[4]);
        ctx_bg.fillText("Steering angle", this.dash_data.data_rect_coords.x, this.dash_data.data_rect_entries[5]);
        //units
        ctx_bg.textAlign = "right";
        ctx_bg.fillText("g/s", this.dash_data.data_rect_coords.x2, this.dash_data.data_rect_entries[0]);
        ctx_bg.fillText("g/s", this.dash_data.data_rect_coords.x2, this.dash_data.data_rect_entries[1]);
        ctx_bg.fillText("l", this.dash_data.data_rect_coords.x2, this.dash_data.data_rect_entries[2]);
        ctx_bg.fillText("km", this.dash_data.data_rect_coords.x2, this.dash_data.data_rect_entries[3]);
        ctx_bg.fillText("l/100km", this.dash_data.data_rect_coords.x2, this.dash_data.data_rect_entries[4]);
        ctx_bg.fillText("°", this.dash_data.data_rect_coords.x2, this.dash_data.data_rect_entries[5]);
        //stop icon
        ctx_bg.beginPath();
        ctx_bg.moveTo(this.dash_data.stop_icon.x, this.dash_data.stop_icon.y);
        ctx_bg.lineTo(this.dash_data.stop_icon.x+this.dash_data.stop_icon.w, this.dash_data.stop_icon.y);
        ctx_bg.arc(this.dash_data.stop_icon.x+this.dash_data.stop_icon.w, this.dash_data.stop_icon.y+this.dash_data.stop_icon.h/2, this.dash_data.stop_icon.h/2, -Math.PI/2, Math.PI/2);
        ctx_bg.lineTo(this.dash_data.stop_icon.x, this.dash_data.stop_icon.y+this.dash_data.stop_icon.h);
        ctx_bg.arc(this.dash_data.stop_icon.x, this.dash_data.stop_icon.y+this.dash_data.stop_icon.h/2, this.dash_data.stop_icon.h/2, Math.PI/2, 3*Math.PI/2);
        ctx_bg.closePath();
        ctx_bg.fillStyle="rgba(0, 0, 0, 0.2)";
        ctx_bg.fill();

        ctx_bg.fillStyle="rgba(0, 0, 0, 0.5)";
        ctx_bg.font = this.dash_data.gear_unit_size+"px bold";
        ctx_bg.textBaseline = "middle";
        ctx_bg.textAlign = "center";
        ctx_bg.fillText("S T O P", this.dash_data.stop_icon.x+this.dash_data.stop_icon.w/2, this.dash_data.stop_icon.y+this.dash_data.stop_icon.h/2);

    }   

    update(ctx, car){
        //update the data layer
        //update all values

        //clear the canvas
        ctx.clearRect(0,0,this.size.width,this.size.height);
        //draw them
        //throttle
        //normalize
        //draw
        ctx.beginPath();
        ctx.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_outer, this.dash_data.angle_alpha, this.dash_data.angle_alpha+(this.dash_data.angle_beta-this.dash_data.angle_alpha)*car.data.throttle_pos/100);
        ctx.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_inner,  this.dash_data.angle_alpha+(this.dash_data.angle_beta-this.dash_data.angle_alpha)*car.data.throttle_pos/100, this.dash_data.angle_alpha, true);
        ctx.closePath();
        ctx.fillStyle="rgb(26,136,26)";
        ctx.fill();
        
        //brakes 
        //normalize
        //draw
        ctx.beginPath();
        ctx.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_outer, this.dash_data.angle_gamma, this.dash_data.angle_gamma-(this.dash_data.angle_gamma-this.dash_data.angle_beta)*car.data.brake_pos/100, true);
        ctx.arc(this.dash_data.circle_center.x, this.dash_data.circle_center.y, this.dash_data.r_inner, this.dash_data.angle_gamma-(this.dash_data.angle_gamma-this.dash_data.angle_beta)*car.data.brake_pos/100, this.dash_data.angle_gamma);
        ctx.closePath();
        ctx.fillStyle="rgb(170,23,21)";
        ctx.fill();
        
        //update text
        ctx.fillStyle = "rgb(185,187,190)";
        //speed 
        ctx.font = this.dash_data.speed_value_size+"px bold";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(car.data.spd, this.dash_data.circle_center.x,this.dash_data.speed_value_y);
        //rpm
        ctx.font = this.dash_data.rpm_value_size+"px bold";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(car.data.rpm, this.dash_data.circle_center.x, this.dash_data.rpm_value_y);
        //gear
        ctx.font = this.dash_data.gear_value_size+"px bold";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(car.data.current_gear, this.dash_data.circle_center.x, this.dash_data.gear_value_y);
        //REST OF THE TEXIES
        ctx.font = this.dash_data.data_rect_coords.h/16+"px bold";
        ctx.textBaseline = "middle";
        ctx.textAlign = "right";
        ctx.fillText(car.data.air, this.dash_data.data_rect_coords.x1, this.dash_data.data_rect_entries[0]);
        ctx.fillText(car.data.fuel, this.dash_data.data_rect_coords.x1, this.dash_data.data_rect_entries[1]);
        ctx.fillText(car.data.fuel_total, this.dash_data.data_rect_coords.x1, this.dash_data.data_rect_entries[2]);
        ctx.fillText(car.data.distance_total, this.dash_data.data_rect_coords.x1, this.dash_data.data_rect_entries[3]);
        ctx.fillText(car.data.fuel_usage, this.dash_data.data_rect_coords.x1, this.dash_data.data_rect_entries[4]);
        ctx.fillText(car.data.steering_angle, this.dash_data.data_rect_coords.x1, this.dash_data.data_rect_entries[5]);

        //update icons
        //engine
        if (car.data.engine_dmg) {
            ctx.strokeStyle="rgb(255, " + (2*(100/car.data.engine_dmg)).toFixed(0) + ", 0)";
            ctx.lineWidth=this.dash_data.r_outer/60;

            ctx.beginPath();
            ctx.moveTo(this.dash_data.engine_icon[0].x,this.dash_data.engine_icon[0].y);
            for (let index = 0; index < this.dash_data.engine_icon.length; index++) {
                ctx.lineTo(this.dash_data.engine_icon[index].x,this.dash_data.engine_icon[index].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        //gearbox
        if (car.data.gearbox_dmg) {
            ctx.strokeStyle="rgb(255, " + 2*(100/car.data.gearbox_dmg).toFixed(0) + ", 0)";
            ctx.lineWidth=this.dash_data.r_outer/60;

            ctx.beginPath();
            ctx.moveTo(this.dash_data.gearbox_icon[0].x,this.dash_data.gearbox_icon[0].y);
            for (let index = 0; index < this.dash_data.gearbox_icon.length; index++) {
                ctx.lineTo(this.dash_data.gearbox_icon[index].x,this.dash_data.gearbox_icon[index].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        //abs
        if (car.data.abs_warn) {
            //abs icon - red
            ctx.strokeStyle="rgb(255, 42, 0)";
            ctx.fillStyle="rgb(255, 42, 0)";

            ctx.beginPath();
            ctx.arc(this.dash_data.brakes_icon[0].x, this.dash_data.brakes_icon[0].y, this.dash_data.brakes_icon[1], 0, 2*Math.PI);
            ctx.lineWidth=this.dash_data.r_outer/60;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.dash_data.brakes_icon[0].x, this.dash_data.brakes_icon[0].y, this.dash_data.brakes_icon[2], 3*Math.PI/4, 5*Math.PI/4);
            ctx.lineWidth=this.dash_data.r_outer/40;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.dash_data.brakes_icon[0].x, this.dash_data.brakes_icon[0].y, this.dash_data.brakes_icon[2], -Math.PI/4, Math.PI/4)
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.dash_data.brakes_icon[5].x, this.dash_data.brakes_icon[5].y, this.dash_data.brakes_icon[6], 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(this.dash_data.brakes_icon[3].x,this.dash_data.brakes_icon[3].y);
            ctx.lineTo(this.dash_data.brakes_icon[4].x,this.dash_data.brakes_icon[4].y);
            ctx.lineWidth=this.dash_data.r_outer/60;
            ctx.stroke();
        }
        //clutch
        if (car.data.clutch_engaged) {
            //clutch icon - yellow
            ctx.strokeStyle="rgb(255, 191, 0)";
            ctx.fillStyle="rgba(255, 191, 0)";
            ctx.lineWidth=this.dash_data.r_outer/60;

            ctx.beginPath();
            ctx.moveTo(this.dash_data.clutch_icon[0].x,this.dash_data.clutch_icon[0].y);
            for (let index = 1; index < 16; index++) {
                ctx.lineTo(this.dash_data.clutch_icon[index].x,this.dash_data.clutch_icon[index].y);
            }
            ctx.closePath();            
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.dash_data.clutch_icon[16].x,this.dash_data.clutch_icon[16].y);
            for (let index = 17; index < this.dash_data.clutch_icon.length; index++) {
                ctx.lineTo(this.dash_data.clutch_icon[index].x,this.dash_data.clutch_icon[index].y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        //stop
        if (car.data.engine_dmg>90 || car.data.gearbox_dmg>90) {
            //stop icon
            ctx.beginPath();
            ctx.moveTo(this.dash_data.stop_icon.x, this.dash_data.stop_icon.y);
            ctx.lineTo(this.dash_data.stop_icon.x+this.dash_data.stop_icon.w, this.dash_data.stop_icon.y);
            ctx.arc(this.dash_data.stop_icon.x+this.dash_data.stop_icon.w, this.dash_data.stop_icon.y+this.dash_data.stop_icon.h/2, this.dash_data.stop_icon.h/2, -Math.PI/2, Math.PI/2);
            ctx.lineTo(this.dash_data.stop_icon.x, this.dash_data.stop_icon.y+this.dash_data.stop_icon.h);
            ctx.arc(this.dash_data.stop_icon.x, this.dash_data.stop_icon.y+this.dash_data.stop_icon.h/2, this.dash_data.stop_icon.h/2, Math.PI/2, 3*Math.PI/2);
            ctx.closePath();
            ctx.fillStyle="rgba(255, 0, 0, 0.5)";
            ctx.fill();

            ctx.fillStyle="rgba(100, 0, 0, 1)";
            ctx.font = this.dash_data.gear_unit_size+"px bold";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText("S T O P", this.dash_data.stop_icon.x+this.dash_data.stop_icon.w/2, this.dash_data.stop_icon.y+this.dash_data.stop_icon.h/2);}
    }
}