class Leaderboard  {
    constructor(width, height) {
        //width and height 
        this.width = width;
        this.height = height;
        //possition of elemetns
        this.x_pos = {
            x1:this.width/18,
            x2:3*this.width/18,
            x3:8*this.width/18,
            x4:13*this.width/18,
            x5:17*this.width/18,
            c1:this.width/18,
            c2:7*this.width/18,
            c3:11*this.width/18,
        }
        this.y_pos = {
            title:((this.height*3/4)*2/10)*2/5, //text middle line y
            divider:((this.height*3/4)*2/10)*3/5, //divider middle line
            entries:[ 
                ((this.height*3/4)*2/10)+0*((this.height*3/4)/10),
                ((this.height*3/4)*2/10)+1*((this.height*3/4)/10),
                ((this.height*3/4)*2/10)+2*((this.height*3/4)/10),
                ((this.height*3/4)*2/10)+3*((this.height*3/4)/10),
                ((this.height*3/4)*2/10)+4*((this.height*3/4)/10),
                ((this.height*3/4)*2/10)+5*((this.height*3/4)/10),
                ((this.height*3/4)*2/10)+6*((this.height*3/4)/10),
                ((this.height*3/4)*2/10)+7*((this.height*3/4)/10)
            ],
            //maybe anotehr divider here?
            controls_title:(this.height*3/4)+(this.height/4)/3,   //text middle line
            controls_entries:(this.height*3/4)+(this.height/4)*2/3    //control text middle line
        };
        //box sizes
        this.boxes = {
            x0:this.width/36,
            w1:17*this.width/18,
            h:((this.height*3/4)/20),
            y:[ 
                ((this.height*3/4)*2/10)+0*((this.height*3/4)/20)-((this.height*3/4)/40),
                ((this.height*3/4)*2/10)+1*((this.height*3/4)/10)-((this.height*3/4)/40),
                ((this.height*3/4)*2/10)+2*((this.height*3/4)/10)-((this.height*3/4)/40),
                ((this.height*3/4)*2/10)+3*((this.height*3/4)/10)-((this.height*3/4)/40),
                ((this.height*3/4)*2/10)+4*((this.height*3/4)/10)-((this.height*3/4)/40),
                ((this.height*3/4)*2/10)+5*((this.height*3/4)/10)-((this.height*3/4)/40),
                ((this.height*3/4)*2/10)+6*((this.height*3/4)/10)-((this.height*3/4)/40),
                ((this.height*3/4)*2/10)+7*((this.height*3/4)/10)-((this.height*3/4)/40)
            ]
        }
        //size of text
        this.text_size = {
            title: ((this.height*3/4)*2/10)/4,
            entry: ((this.height*3/4)*2/10)/8,
            divider_width:this.height/100,
        };
        //select_best toggle
        this.select_best = true;
    }

    //handles the initial drawing 
    draw(ctx) {
        //draw the text labels
        ctx.fillStyle="rgba(0, 0, 0, 0.8)";
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.font = this.text_size.title+"px bold";
        ctx.fillText("Current rankings", this.x_pos.x1, this.y_pos.title);
        ctx.fillText("Vehicle selection:", this.x_pos.x1, this.y_pos.controls_title);
        ctx.font = this.text_size.entry+"px bold";
        ctx.fillText("Z/C - prev/next car", this.x_pos.c1, this.y_pos.controls_entries);
        ctx.fillText("X - best car", this.x_pos.c2, this.y_pos.controls_entries);
        ctx.fillText("V - assume control", this.x_pos.c3, this.y_pos.controls_entries);
        //draw the delimiter
        ctx.strokeStyle="rgb(185,187,190)";
        ctx.lineWidth=this.text_size.divider_width/2;
        ctx.beginPath();
        ctx.moveTo(this.x_pos.x1,this.y_pos.divider);
        ctx.lineTo(this.x_pos.x5,this.y_pos.divider);
        ctx.closePath();
        ctx.stroke();
    }

    //updates the leaderboard
    update(ctx, traffic, start_time) {
        //clear the canvas
        ctx.clearRect(0, 0, this.width, this.height);
        //draw the time 
        ctx.fillStyle="rgba(0, 0, 0, 0.8)";
        ctx.textBaseline = "middle";
        ctx.textAlign = "right";
        ctx.font = this.text_size.title+"px bold";
        ctx.fillText(millisToMinutesAndSeconds(Date.now()-start_time), this.x_pos.x5, this.y_pos.title);
        //sort traffic array by score
        //traffic.sort((a, b) => b.score - a.score);
        //draw the first 8 entries in the leaderboard
        for (let index = 0; index < traffic.length; index++) {
            ctx.fillStyle=(traffic[index].selected)?"rgb(185,187,190)":"rgba(0, 0, 0, 0.5)";
            ctx.beginPath();
            ctx.roundRect(this.boxes.x0, this.boxes.y[index], this.boxes.w1, this.boxes.h, 5);
            ctx.fill();
            //draw text
            ctx.fillStyle=(traffic[index].selected)?"rgb(0, 0, 0)":"rgb(185,187,190)";
            ctx.font = this.text_size.entry+"px bold";
            ctx.textAlign = "left";
            ctx.fillText(index+1, this.x_pos.x1, this.y_pos.entries[index]);
            ctx.fillText("ID: " + traffic[index].id, this.x_pos.x2, this.y_pos.entries[index]);
            ctx.textAlign = "right";
            ctx.fillText((traffic[index].total_distance_traveled/1000).toFixed(2) + "km", this.x_pos.x3, this.y_pos.entries[index]);
            ctx.fillText(traffic[index].score.toFixed(0) + "pts", this.x_pos.x5, this.y_pos.entries[index]);   
        }   
    }
}