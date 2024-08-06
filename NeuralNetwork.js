
class NeuralNetwork{
    constructor(neuronCounts, width, height, neural_net=null){
        if (neural_net==null) {
            this.levels=[];
            for(let i=0;i<neuronCounts.length-1;i++){
                this.levels.push(new Level(
                    neuronCounts[i],neuronCounts[i+1]
                ));
            }
            this.neuron_count = neuronCounts;
        } else {
            //import the data
            this.levels  = neural_net.levels;
            this.neuron_count = neural_net.neuron_count;
        }
        
        //vizualizer 
        //store the dimensions
        this.size={
            width:width,
            height:height
        }
        //generate the main elements
        //input layer text (x,y,textsize)
        this.input_txt = {
            text:"Input Layer",
            x:width/10,
            y:height/10,
            text_size:(height/15)+"px bold"
        };
        //hidden layer text (x,y,textsize)
        this.hidden_txt = {
            text:"Hidden Layers",
            x:width/2,
            y:height/10,
            text_size:(height/15)+"px bold"
        };
        //ouput layer text (x,y,textsize)
        this.output_txt = {
            text:"Output Layer",
            x:9*width/10,
            y:height/10,
            text_size:(height/15)+"px bold"
        };
        //dotted line separators x2 [(x,y,width),(x,y,width)]
        this.lines=[
            [{
                x:width/5,
                y:0
            },
            {
                x:width/5,
                y:height
            }],
            [{
                x:4*width/5,
                y:0
            },
            {
                x:4*width/5,
                y:height
            }]
        ];
        this.line_width=width/100; 

        //stores all the neccessary data for the network viewer itself
        this.data={
            neuron_layers:[],
            connections:[]
        };

        //neurons
        //input layer
        let y_temp = ((this.size.height*0.875)/this.neuron_count[0]);
        let y_coords = [];
        for (let a = 0; a < this.neuron_count[0]; a++) {
            y_coords.push(this.size.height*0.1+((+y_temp)*(a+1)));
        }
        this.data.neuron_layers.push(
            {
                x:this.size.width/10,               //horizontal coord
                R:(y_temp*2/3)*0.8,                 //radius of the outer circle
                r:(y_temp*2/3)*0.5,                 //radius of the inner circel
                y:y_coords                          //array of y coords
            }
        );
        //iterate through the neural layers
        for (let a = 1; a < this.neuron_count.length-1; a++) {
            let y_t = ((this.size.height*0.8)/this.neuron_count[a])
            let y_c = [];
            for (let b = 0; b < this.neuron_count[a]; b++) {
                y_c.push(this.size.height*0.1+(y_t*(b+1)));
            }
            this.data.neuron_layers.push(
                {
                    x:(this.size.width*0.2)+a*((this.size.width*0.6)/(this.neuron_count.length-1)),
                    R:(y_t*2/3)*0.8,
                    r:(y_t*2/3)*0.5,
                    y:y_c
                }
            );
        }
        //output layer
        y_temp = ((this.size.height*0.8)/this.neuron_count[this.neuron_count.length-1])
        y_coords = [];
        for (let a = 0; a < this.neuron_count[this.neuron_count.length-1]; a++) {
            y_coords.push(this.size.height*0.1+((+y_temp)*(a+1)));
        }
        this.data.neuron_layers.push(
            {
                x:this.size.width*0.9,
                R:(y_temp*2/3)*0.8,
                r:(y_temp*2/3)*0.5,
                y:y_coords
            }
        );
    }

    redraw_visualizer(width, height){
        //store the dimensions
        this.size={
            width:width,
            height:height
        }
        //generate the main elements
        //input layer text (x,y,textsize)
        this.input_txt = {
            text:"Input Layer",
            x:width/10,
            y:height/10,
            text_size:(height/15)+"px bold"
        };
        //hidden layer text (x,y,textsize)
        this.hidden_txt = {
            text:"Hidden Layers",
            x:width/2,
            y:height/10,
            text_size:(height/15)+"px bold"
        };
        //ouput layer text (x,y,textsize)
        this.output_txt = {
            text:"Output Layer",
            x:9*width/10,
            y:height/10,
            text_size:(height/15)+"px bold"
        };
        //dotted line separators x2 [(x,y,width),(x,y,width)]
        this.lines=[
            [{
                x:width/5,
                y:0
            },
            {
                x:width/5,
                y:height
            }],
            [{
                x:4*width/5,
                y:0
            },
            {
                x:4*width/5,
                y:height
            }]
        ];
        this.line_width=width/100; 

        //stores all the neccessary data for the network viewer itself
        this.data={
            neuron_layers:[],
            connections:[]
        };

        //neurons
        //input layer
        let y_temp = ((this.size.height*0.875)/this.neuron_count[0]);
        let y_coords = [];
        for (let a = 0; a < this.neuron_count[0]; a++) {
            y_coords.push(this.size.height*0.1+((+y_temp)*(a+1)));
        }
        this.data.neuron_layers.push(
            {
                x:this.size.width/10,               //horizontal coord
                R:(y_temp*2/3)*0.8,                 //radius of the outer circle
                r:(y_temp*2/3)*0.5,                 //radius of the inner circel
                y:y_coords                          //array of y coords
            }
        );
        //iterate through the nerual layers
        for (let a = 1; a < this.neuron_count.length-1; a++) {
            let y_t = ((this.size.height*0.8)/this.neuron_count[a])
            let y_c = [];
            for (let b = 0; b < this.neuron_count[a]; b++) {
                y_c.push(this.size.height*0.1+(y_t*(b+1)));
            }
            this.data.neuron_layers.push(
                {
                    x:(this.size.width*0.2)+a*((this.size.width*0.6)/(this.neuron_count.length-1)),
                    R:(y_t*2/3)*0.8,
                    r:(y_t*2/3)*0.5,
                    y:y_c
                }
            );
        }
        //output layer
        y_temp = ((this.size.height*0.8)/this.neuron_count[this.neuron_count.length-1])
        y_coords = [];
        for (let a = 0; a < this.neuron_count[this.neuron_count.length-1]; a++) {
            y_coords.push(this.size.height*0.1+((+y_temp)*(a+1)));
        }
        this.data.neuron_layers.push(
            {
                x:this.size.width*0.9,
                R:(y_temp*2/3)*0.8,
                r:(y_temp*2/3)*0.5,
                y:y_coords
            }
        );
    }

    static feedForward(givenInputs,network){
        let outputs=Level.feedForward(
            givenInputs,network.levels[0]);
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]);
        }
        return outputs;
    }


    //mutate a neural network
    static mutate(net,mutation_val){
        //iterate through the levels in the network
        net.levels.forEach(level => {
            //iterate through the biases
            for (let index = 0; index < level.biases.length; index++) {
                //go from initial value to the new value ([-1,1]) by mutation factor
                level.biases[index]=linearInterpolation(
                    level.biases[index],
                    Math.random()*2-1,
                    mutation_val
                );
            }
            //iterate though the weights
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    //go from initial value to the new value ([-1,1]) by mutation factor
                    level.weights[i][j] = linearInterpolation(
                        level.weights[i][j],
                        Math.random()*2-1,
                        mutation_val
                    );
                }
            }
        });
        return net;
    }

    //draws all the unchanging stuff in the foreground
    draw(ctx){
        //draw the text labels
        ctx.fillStyle="rgba(0, 0, 0, 0.8)";
        ctx.textBaseline = "bottom";
        ctx.textAlign = "center";
        ctx.font = this.input_txt.text_size;
        ctx.fillText(this.input_txt.text, this.input_txt.x, this.input_txt.y);
        ctx.fillText(this.output_txt.text, this.output_txt.x, this.output_txt.y);
        ctx.fillText(this.hidden_txt.text, this.hidden_txt.x, this.hidden_txt.y);

        //draw the demarcation lines
        ctx.strokeStyle="rgba(185,187,190,0.5)";
        ctx.lineWidth=this.line_width;
        ctx.setLineDash([20,10]);
        ctx.beginPath();
        ctx.moveTo(this.lines[0][0].x,this.lines[0][0].y);
        ctx.lineTo(this.lines[0][1].x,this.lines[0][1].y);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([20,10]);
        ctx.beginPath();
        ctx.moveTo(this.lines[1][0].x,this.lines[1][0].y);
        ctx.lineTo(this.lines[1][1].x,this.lines[1][1].y);
        ctx.closePath();
        ctx.stroke();

        //draw the fg
        for (let i = 0; i < this.data.neuron_layers.length; i++) {
            for (let j = 0; j < this.data.neuron_layers[i].y.length; j++) {
                ctx.fillStyle="rgb(185,187,190)";
                ctx.beginPath();
                ctx.arc(this.data.neuron_layers[i].x, this.data.neuron_layers[i].y[j], this.data.neuron_layers[i].r, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
    }


    //updates teh neuron and connection values, and redraws them
    update(ctx){
        //clear canvas
        ctx.clearRect(0,0,this.size.width,this.size.height);
        //update the rings around the neurons and the connections weights
        for (let a = 0; a < this.data.neuron_layers.length-1; a++) {
            for (let b = 0; b < this.data.neuron_layers[a].y.length; b++) {
                //update connection weights
                for (let c = 0; c < this.data.neuron_layers[a+1].y.length; c++) {
                    ctx.strokeStyle="rgba(185,187,190," + this.levels[a].weights[b][c] + ")";
                    ctx.lineWidth=3*this.line_width/this.data.neuron_layers[a].y.length;
                    ctx.beginPath();
                    ctx.moveTo(this.data.neuron_layers[a].x, this.data.neuron_layers[a].y[b]);
                    ctx.lineTo(this.data.neuron_layers[a+1].x, this.data.neuron_layers[a+1].y[c]);
                    ctx.closePath();
                    ctx.stroke();
                }
                //update ring
                ctx.fillStyle="rgba(30, 30, 30, " + this.levels[a].inputs[b] + ")";
                ctx.beginPath();
                ctx.arc(this.data.neuron_layers[a].x, this.data.neuron_layers[a].y[b], this.data.neuron_layers[a].R, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }            
        }
        //ouput layer special case
        for (let c = 0; c < this.data.neuron_layers[this.data.neuron_layers.length-1].y.length; c++) {
            ctx.fillStyle="rgba(30, 30, 30, " + this.levels[this.data.neuron_layers.length-2].outputs[c] + ")";
            ctx.beginPath();
            ctx.arc(this.data.neuron_layers[this.data.neuron_layers.length-1].x, this.data.neuron_layers[this.data.neuron_layers.length-1].y[c], this.data.neuron_layers[this.data.neuron_layers.length-1].R, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }  
        
    }

    //export neural network to a file
    static export(network,score){
        //create a json object
        const nn = {
            levels:network.levels,
            neuron_count:network.neuron_count
        }
        //create a JSON file and download it
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(nn, null, 0)], {
            type: "text/plain"
        }));
        a.setAttribute("download", "data_"+Math.round(score)+".nn");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

}