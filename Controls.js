//class defining the agent controls of the car
class Controls{
    //class constructor
    constructor(car_amount, id){
        this.clutch=false;
        this.gearUp=false;
        this.gearDown=false;
        this.increaseThrottle=false;
        this.decreaseThrottle=false;
        this.brakePress=false;
        this.brakeRelease=false;
        this.steerCW=false;
        this.steerCCW=false;

        //lb controls
        this.max_id=car_amount-1;
        this.current_id=id;
        this.auto_best=true;
        this.assume_control=false;

        this.#addKeyboardListeners();
    }

    //use this private method to listen for keypresses
    //as long as a key is pressed down the car responds
    //to a certain command. exception is only the gearshifts
    //that engages when pressed to switch gears
    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "j":
                    this.clutch=true;
                    break;
                case "i":
                    this.gearUp=true;
                    break;
                case "k":
                    this.gearDown=true;
                    break;
                case "w":
                    this.increaseThrottle=true;
                    break;
                case "s":
                    this.decreaseThrottle=true;
                    break;
                case "b":
                    this.brakePress=true;
                    break;
                case "n":
                    this.brakeRelease=true;
                    break;
                case "a":
                    this.steerCCW=true;
                    break;
                case "d":
                    this.steerCW=true;
                    break;

                case "z":
                    (this.current_id==this.max_id)?this.current_id=0:this.current_id++;
                    this.auto_best=false;
                    this.assume_control=false;
                    break;
                case "x":
                    this.auto_best=true;
                    break;
                case "c":
                    (this.current_id==0)?this.current_id=this.max_id:this.current_id--;
                    this.auto_best=false;
                    this.assume_control=false;
                    break;
                case "v":
                    this.assume_control=!this.assume_control;
                    this.auto_best=false;
                    break;
            }
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "j":
                    this.clutch=false;
                    break;
                case "i":
                    this.gearUp=false;
                    break;
                case "k":
                    this.gearDown=false;
                    break;
                case "w":
                    this.increaseThrottle=false;
                    break;
                case "s":
                    this.decreaseThrottle=false;
                    break;
                case "b":
                    this.brakePress=false;
                    break;
                case "n":
                    this.brakeRelease=false;
                    break;
                case "a":
                    this.steerCCW=false;
                    break;
                case "d":
                    this.steerCW=false;
                    break;    
            }
        }
    }
}