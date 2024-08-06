//get canvases from html
const mainCanvas = document.getElementById("main_canvas");
const carDataBGCanvas = document.getElementById("car_data_canvas_bg");
const carDataCanvas = document.getElementById("car_data_canvas");
const carDataFGCanvas = document.getElementById("car_data_canvas_fg");
const leaderboardCanvas = document.getElementById("leaderboard_canvas");
const leaderboardCanvasBG = document.getElementById("leaderboard_canvas_bg");
const NNvisualizerCanvas = document.getElementById("neural_network_visualizer_canvas");
const NNvisualizerCanvasBG = document.getElementById("neural_network_visualizer_canvas_bg");
//get the canvas contexts
const mainCtx = mainCanvas.getContext("2d");
const carDataBGCtx = carDataBGCanvas.getContext("2d");
const carDataCtx = carDataCanvas.getContext("2d");
const carDataFGCtx = carDataFGCanvas.getContext("2d");
const leaderboardCtx = leaderboardCanvas.getContext("2d");
const LBBGCtx = leaderboardCanvasBG.getContext("2d");
const NNCtx = NNvisualizerCanvas.getContext("2d");
const NNBGCtx = NNvisualizerCanvasBG.getContext("2d");
//get containers from html
const mainContainer = document.getElementById("main_screen");
var car_data_cont = document.getElementById("car_data_container");
var nn_visualizer_cont = document.getElementById("neural_network_visualizer_container");
var leaderboard_container = document.getElementById("leaderboard_container");
var options_container = document.getElementById("custom_option_container");
//script vars
var traffic_array=[];
var sorted_traffic=[];
var screen_width, screen_height, map, controls, start_time, selected_car_data, road_borders, images, selected_car, best_car, neural_visualizer, leaderboard;

//training vars 
var max_epochs, curr_epoch, curr_round, training_cars, loop_id, layer_val, neuron_val, mutation_val, fitness_val, nn_size, total_training_time, start_time, total_training_time;
var training_in_progress=false;
var max_rounds = 20;
//coords var
var menu_coords={
    title_train:{
        x:0,
        y:0,
        size:0
    },
    title_test:{
        x:0,
        y:0,
        size:0
    },
    or:{
        x:0,
        y:0,
        size:0
    },
    hidden_layers:{
        x:0,
        y:0,
        size:0
    },
    neurons:{
        x:0,
        y:0,
        size:0
    },
    car_amount:{
        x:0,
        y:0,
        size:0
    },
    epochs:{
        x:0,
        y:0,
        size:0
    },
    fitness:{
        x:0,
        y:0,
        size:0
    },
    mutation:{
        x:0,
        y:0,
        size:0
    },
    cars_train:{
        x:0,
        y:0,
        size:0
    },
    select:{
        x:0,
        y:0,
        size:0
    },
    cars_test:{
        x:0,
        y:0,
        size:0
    },
    lines:{
        x:0,
        yit:0,
        yft:0,
        yib:0,
        yfb:0,
        width:0
    },
    loading_bar:{
        x:0,
        y:0,
        w:0,
        h:0,
        t:0
    }
};
//state vars
var show_nn=true;
var show_cd=true;
var show_lb=true;
var wireframe_mode=false;
var running=false;

var traffic_array=[];
var neural_nets_array=[];
var neural_net, car_amount;
var default_nn_data= {
    "levels": [
      {
        "inputs": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        "outputs": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        "biases": [
          -0.9372023423612408,
          -0.07780547166297747,
          -0.693462107462604,
          0.4690624310697642,
          0.014363325972887253,
          -0.28852637035411144,
          -0.9882017472137017,
          0.9088189028635192
        ],
        "weights": [
          [
            0.7153575319802947,
            0.8627491392510578,
            -0.5060272330178748,
            -0.6879967584463453,
            0.7775732607703858,
            -0.5029744266841525,
            0.43151649683958193,
            0.09888252812261511
          ],
          [
            -0.5419545371051306,
            0.5911101970655332,
            -0.6876152746511066,
            -0.6071117454460591,
            0.08836357837013598,
            0.022931917168502514,
            -0.49870736093325174,
            -0.3746460492072745
          ],
          [
            0.43309397891235846,
            0.7811796282535155,
            -0.2656369949175721,
            -0.38048149706582457,
            -0.4951562882065843,
            0.0024170051620329147,
            -0.5100889353718387,
            0.18210708766331152
          ],
          [
            -0.45275195183274386,
            -0.592266186962203,
            -0.3052293045739809,
            0.14382776930202135,
            0.49034987589761037,
            -0.42770010804639824,
            0.18971517193838827,
            -0.9348976174693613
          ],
          [
            -0.17322496682954824,
            -0.08725545786964628,
            -0.611295890409874,
            -0.6999819648949979,
            0.06329567748979881,
            0.22092829126070646,
            -0.21713161372537804,
            -0.7633456028346244
          ],
          [
            0.47731699764295277,
            -0.6728202203205471,
            0.01627671159560551,
            0.7690918261343256,
            0.8480296507146192,
            0.9225832928190216,
            0.27142678219188987,
            0.24452412295553705
          ],
          [
            0.12246292568317907,
            -0.11525534556739303,
            0.29574055673567967,
            -0.23064654081403213,
            0.3954162786205708,
            -0.9319394941842376,
            -0.21342385977947598,
            -0.3444432277208085
          ],
          [
            -0.8100893289679285,
            -0.22124430276345697,
            0.012382882009481122,
            0.9384333348463791,
            0.7694175289601612,
            -0.28484769665514564,
            -0.15831533384406793,
            -0.5274249977542067
          ],
          [
            -0.10758863045972689,
            -0.8088065204770818,
            -0.8521600063863892,
            -0.1542387366047222,
            -0.05201249438661981,
            -0.7384188188636933,
            0.7303006977803916,
            0.4843066061521355
          ],
          [
            -0.5647576115147446,
            0.7256144408761387,
            -0.024684750166803937,
            -0.894167287014519,
            -0.4465383990538825,
            0.3002488527668845,
            0.8381803459941735,
            -0.061888176042512955
          ],
          [
            -0.10991553059821335,
            -0.888160635556352,
            0.7760161313591143,
            0.2776318760847396,
            -0.37721446216424104,
            0.627105305531745,
            -0.7353301099291434,
            0.5438831184352917
          ],
          [
            0.25188158622124646,
            -0.053671661574524965,
            0.6603923025652076,
            0.20191978378038278,
            0.4730593814558941,
            0.4129927033625216,
            0.5299964881385097,
            -0.705181189420524
          ],
          [
            0.54326677916649,
            -0.19188744052800244,
            0.3447165999020976,
            0.8915976997464696,
            0.8978989481055568,
            -0.3343741681677912,
            -0.4153046614112279,
            0.7437007777991556
          ],
          [
            0.16751833859652399,
            0.5976331005357196,
            -0.8739432404552636,
            -0.7609470949960095,
            -0.1480568049286426,
            -0.24444247942441844,
            -0.5801215836431695,
            -0.0022595008420018825
          ],
          [
            0.15039423572421318,
            0.8564827794899983,
            -0.631857691580064,
            -0.8352374133090887,
            0.30253564923869636,
            0.9151390828161889,
            0.5817338926432143,
            -0.48246145696710463
          ],
          [
            -0.6539958715227616,
            0.8079998102043178,
            -0.537182215597052,
            -0.943449247911075,
            -0.48628723017641073,
            -0.662432440553377,
            -0.13968289397201117,
            -0.6265355884568364
          ],
          [
            -0.42990181465056754,
            -0.475185806691963,
            0.7536612595728722,
            -0.22015727565561694,
            0.6380165680052705,
            0.895524019876129,
            0.1671665641092468,
            0.17485811393363315
          ],
          [
            0.7017018648555189,
            -0.16430025055063502,
            -0.002031323287033926,
            -0.45494527231315085,
            0.5182322077723744,
            -0.6055259010824692,
            -0.02802160993791314,
            0.9259393383328336
          ],
          [
            0.12589678918365999,
            -0.6665784570338262,
            -0.48417425522394675,
            -0.463166710817849,
            -0.9451208559756352,
            0.6049543314360504,
            -0.09245670316171561,
            -0.43604374726819684
          ],
          [
            -0.2943976699683559,
            -0.9364466346538896,
            0.6412646849708037,
            0.8280003715844482,
            -0.8732608842336791,
            0.7659576102581598,
            -0.6364493881902016,
            -0.2502486021905952
          ],
          [
            -0.6805267872307601,
            0.46937400037145505,
            0.7145142802134539,
            -0.2707183105226856,
            0.29659648702979924,
            -0.6579550253257991,
            -0.8124873542106696,
            0.13336568012338224
          ],
          [
            -0.40849115682729553,
            0.8568936660172133,
            0.725791432850492,
            -0.21368312143917212,
            -0.37952548671457165,
            -0.9790879391934326,
            0.8727120097217715,
            -0.20071142910105477
          ],
          [
            0.8443608805720801,
            -0.4584739208455215,
            0.1537765130625557,
            -0.40275570896275203,
            -0.7033105886938031,
            -0.5115201030702754,
            0.017983553185218604,
            -0.8625213039810726
          ],
          [
            -0.8878519617591771,
            -0.20019374878669405,
            -0.3862226019299042,
            -0.060814488643652576,
            -0.6783622876750217,
            -0.5915801902104663,
            -0.20917503773756074,
            -0.6659523315567561
          ]
        ]
      },
      {
        "inputs": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        "outputs": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        "biases": [
          0.7016059254320335,
          0.35539516932053217,
          -0.15325983982631208,
          -0.7454120037355803,
          -0.37565672176866105,
          0.20810835514111625,
          0.627408605464123,
          0.7553460139343113
        ],
        "weights": [
          [
            -0.037172781083059325,
            0.5732341331445783,
            -0.5168066871718096,
            0.4774837012701125,
            -0.2495329857403381,
            -0.3092831241116165,
            0.47199376698353057,
            0.7447988265546261
          ],
          [
            -0.9142829662818102,
            -0.26897279554590825,
            0.5600725620034563,
            -0.9615881400565514,
            0.29093869761161084,
            -0.3182922226847926,
            -0.42402826925272663,
            0.8424235141371783
          ],
          [
            -0.6563486412978619,
            -0.97056370966934,
            0.2612419728314763,
            -0.2631781465768488,
            -0.011879144957621435,
            -0.5293947599454889,
            -0.9733207989315502,
            -0.3068843094745608
          ],
          [
            0.8071395740785985,
            0.4184001808621991,
            0.021674978662300726,
            -0.8150283407930854,
            -0.7628312470806917,
            -0.20298830120156963,
            -0.7437279438422952,
            -0.7501975799151273
          ],
          [
            0.683048354938449,
            -0.010517717622092304,
            -0.5466292573775238,
            -0.5236782687232211,
            0.4887402451016165,
            -0.19800165230964728,
            0.5233707265753056,
            -0.9903261286903502
          ],
          [
            -0.38131075124225555,
            0.2920841488612407,
            0.26311345272829745,
            -0.45822726938423486,
            0.6623802003629746,
            -0.18710874061694827,
            0.32605707839765175,
            -0.09720472514273037
          ],
          [
            -0.4190733341109183,
            0.4051876785422359,
            -0.05533456799633307,
            0.15274782284111676,
            -0.8055199828876762,
            -0.1024223590579354,
            -0.9236383502934769,
            -0.9225166752294662
          ],
          [
            0.9372222441486631,
            -0.3724494411712078,
            -0.33427706094254583,
            0.6823407635145202,
            0.7333024745373937,
            0.3579699845613806,
            -0.38598816979066597,
            0.6304585740646524
          ]
        ]
      },
      {
        "inputs": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        "outputs": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        "biases": [
          0.8094160996348254,
          -0.39788089108297187,
          -0.8229577291552153,
          -0.22000839502333536,
          0.9187566549015718,
          0.06075731492354919,
          0.5922262591450085,
          0.9723622044093783,
          -0.5831042458767393
        ],
        "weights": [
          [
            -0.21286253852914472,
            0.6533092717825906,
            0.2122034634553711,
            -0.31072482924096323,
            0.15720322012466736,
            0.6810859622887617,
            -0.5533819475867734,
            0.6839305418468615,
            -0.04198297593472344
          ],
          [
            0.9136377614789661,
            0.7456334300764278,
            -0.2290169687678152,
            0.4664848947573417,
            0.6166833709575281,
            0.2851163326664161,
            -0.3973303353631723,
            -0.3223897281710577,
            0.6300746600285863
          ],
          [
            -0.9924858052341574,
            0.03834358586103437,
            0.3285127960505265,
            0.1125394874032466,
            -0.27866743180030284,
            0.9138253227588213,
            0.11927433015623956,
            -0.5306686812877857,
            -0.3051315193025572
          ],
          [
            0.7913680908560075,
            0.28795720264754676,
            0.9152512626901146,
            -0.21400578452150332,
            -0.20624312888663066,
            0.22825130629510748,
            0.6681225577536356,
            0.2963991243785866,
            0.9796072018737763
          ],
          [
            -0.24131781779416617,
            0.9761776028382156,
            0.8568952645266668,
            0.15681102016452697,
            -0.19063780634850924,
            0.9621716561613878,
            0.14992475924694393,
            -0.8961006599091708,
            -0.24098976447513776
          ],
          [
            0.838885919705493,
            0.479369311141969,
            -0.4830166500917845,
            0.8875090809583877,
            0.032670420032420155,
            0.4235593024336768,
            0.1054294789859298,
            -0.3623199985167842,
            -0.020975347784660814
          ],
          [
            -0.20686569508553232,
            0.8475951688286048,
            0.7147725515784216,
            0.7513426075508889,
            -0.23506235689686195,
            0.3743859393023452,
            -0.1766853312932466,
            -0.584171211365748,
            0.7755427708094316
          ],
          [
            -0.8766929333777225,
            -0.4401657584184471,
            0.05778487024736556,
            -0.5185559227858831,
            0.8088834174000605,
            -0.28982903107443025,
            -0.18119861234733992,
            0.7209621659387262,
            -0.4692425249133898
          ]
        ]
      }
    ],
    "neuron_count": [
      24,
      8,
      8,
      9
    ]
}

//load car image files
const grayCar = new Image();
grayCar.onload = () =>{
    console.log("loaded gray image");
}
grayCar.src = `res/npc.png`;
const redCar = new Image();
redCar.onload = () =>{
    console.log("loaded damaged image");
}
redCar.src = `res/mc.png`;  
const blueCar = new Image();
blueCar.onload = () =>{
    console.log("loaded best car image");
}
blueCar.src = `res/best.png`; 
images = [redCar,blueCar,grayCar];

//initialize page elements sizes on start and resize
function initilize_page_elements() {
    //get the size of the current viewport
    screen_width = window.innerWidth;
    screen_height = window.innerHeight;

    //check screen ratio
    if (screen_height>screen_width) {
        //probably a phone, show warning
        car_data_cont.style.visibility = "hidden";
        leaderboard_container.style.visibility = "hidden";
        options_container.style.visibility = "hidden";
        nn_visualizer_cont.style.visibility = "hidden";
        mainCanvas.style.visibility = "hidden";
        //draw the main cont at the req size too
        mainContainer.style.height=screen_height*0.98+"px";
        mainContainer.style.width=screen_width*0.98+"px";
        mainContainer.style.top=screen_height/100+"px";
        mainContainer.style.left=screen_width/100+"px";
        //warning screen text box
        document.getElementById("warning_box").style.position = "absolute";
        document.getElementById("warning_box").style.width=screen_width*0.8+"px";
        document.getElementById("warning_box").style.height=screen_width*0.8+"px";
        document.getElementById("warning_box").style.top=screen_height/2+"px";
        document.getElementById("warning_box").style.left=(screen_width-document.getElementById("warning_box").offsetWidth)/2+"px";
        //make the warning text box visible
        document.getElementById("warning_box").style.visibility = "visible";
    } else {
        //just in case
        document.getElementById("warning_box").style.visibility = "hidden";
        mainCanvas.style.visibility = "visible";
        ////size and position all the elements according to it
        //main container (holds the canvas)
        mainContainer.style.height=screen_height*0.98+"px";
        mainContainer.style.width=screen_width*0.98+"px";
        mainContainer.style.top=screen_height/100+"px";
        mainContainer.style.left=screen_width/100+"px";
        //main canvas
        mainCanvas.style.height=mainContainer.style.height;
        mainCanvas.style.width=mainContainer.style.width;
        mainCanvas.height=screen_height*0.9;
        mainCanvas.width=screen_width*0.9;
        mainCanvas.style.position = "absolute";
        let border = +getComputedStyle(mainContainer).borderTopWidth.slice(0, -2)
        mainCanvas.style.top=mainContainer.offsetTop+border;
        mainCanvas.style.left=mainContainer.offsetLeft+border;
        //car data view container
        car_data_cont.style.width=screen_width*0.25+"px";
        car_data_cont.style.height=screen_width*0.125+"px";
        car_data_cont.style.top=screen_height/32+"px";
        car_data_cont.style.left=screen_width-car_data_cont.offsetWidth-screen_width/50+"px";
        //car data view canvases
        //background (static)
        carDataBGCanvas.style.position = "absolute"
        carDataBGCanvas.style.height=car_data_cont.style.height;
        carDataBGCanvas.style.width=car_data_cont.style.width;
        carDataBGCanvas.height=car_data_cont.offsetHeight;
        carDataBGCanvas.width=car_data_cont.offsetWidth;
        carDataBGCanvas.style.top="0px";
        carDataBGCanvas.style.left="0px";
        //main (animated)
        carDataCanvas.style.position = "absolute"
        carDataCanvas.style.height=car_data_cont.style.height;
        carDataCanvas.style.width=car_data_cont.style.width;
        carDataCanvas.height=car_data_cont.offsetHeight;
        carDataCanvas.width=car_data_cont.offsetWidth;
        carDataCanvas.style.top="0px";
        carDataCanvas.style.left="0px";
        //foreground (static)
        carDataFGCanvas.style.position = "absolute"
        carDataFGCanvas.style.height=car_data_cont.style.height;
        carDataFGCanvas.style.width=car_data_cont.style.width;
        carDataFGCanvas.height=car_data_cont.offsetHeight;
        carDataFGCanvas.width=car_data_cont.offsetWidth;
        carDataFGCanvas.style.top="0px";
        carDataFGCanvas.style.left="0px";
        //neural network viewer container
        nn_visualizer_cont.style.width=screen_width*0.35+"px";
        nn_visualizer_cont.style.height=screen_width*0.125+"px";
        nn_visualizer_cont.style.top=screen_height-nn_visualizer_cont.offsetHeight-screen_height/32+"px";
        nn_visualizer_cont.style.left=screen_width-nn_visualizer_cont.offsetWidth-screen_width/50+"px";
        //neural network viewer canvases
        //main (animated)
        NNvisualizerCanvas.style.position = "absolute"
        NNvisualizerCanvas.style.height=nn_visualizer_cont.style.height;
        NNvisualizerCanvas.style.width=nn_visualizer_cont.style.width;
        NNvisualizerCanvas.height=nn_visualizer_cont.offsetHeight;
        NNvisualizerCanvas.width=nn_visualizer_cont.offsetWidth;
        NNvisualizerCanvas.style.top="0px";
        NNvisualizerCanvas.style.left="0px";
        //background (static)
        NNvisualizerCanvasBG.style.position = "absolute"
        NNvisualizerCanvasBG.style.height=nn_visualizer_cont.style.height;
        NNvisualizerCanvasBG.style.width=nn_visualizer_cont.style.width;
        NNvisualizerCanvasBG.height=nn_visualizer_cont.offsetHeight;
        NNvisualizerCanvasBG.width=nn_visualizer_cont.offsetWidth;
        NNvisualizerCanvasBG.style.top="0px";
        NNvisualizerCanvasBG.style.left="0px";  
        //leaderboard viewer container
        leaderboard_container.style.width=screen_width*0.25+"px";
        leaderboard_container.style.height=screen_height*0.75+"px";
        leaderboard_container.style.top=screen_height/32+"px";
        leaderboard_container.style.left=screen_width/50+"px";
        //leaderbaord canvases
        //main (animated)
        leaderboardCanvas.style.position = "absolute";
        leaderboardCanvas.style.height=leaderboard_container.style.height;
        leaderboardCanvas.style.width=leaderboard_container.style.width;
        leaderboardCanvas.height=leaderboard_container.offsetHeight;
        leaderboardCanvas.width=leaderboard_container.offsetWidth;
        //background (static)
        leaderboardCanvasBG.style.position = "absolute"
        leaderboardCanvasBG.style.height=leaderboard_container.style.height;
        leaderboardCanvasBG.style.width=leaderboard_container.style.width;
        leaderboardCanvasBG.height=leaderboard_container.offsetHeight;
        leaderboardCanvasBG.width=leaderboard_container.offsetWidth;
        //options container
        options_container.style.width=screen_width*0.2+"px";
        options_container.style.height=screen_width*0.0625+"px";
        options_container.style.top=screen_height-options_container.offsetHeight-screen_height/32+"px";
        options_container.style.left=screen_width/50+"px";
        //possition all options elements
        //wireframe checkbox
        document.getElementById("check_wf").style.position = "absolute";
        document.getElementById("check_wf").style.width=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_wf").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_wf").style.top="0px";
        document.getElementById("check_wf").style.left="5px";
        document.getElementById("check_wf").checked = wireframe_mode;
        //leaderboard checkbox
        document.getElementById("check_lb").style.position = "absolute";
        document.getElementById("check_lb").style.width=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_lb").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_lb").style.top=(options_container.offsetHeight/4)+"px";
        document.getElementById("check_lb").style.left="5px";
        document.getElementById("check_lb").checked = show_lb;
        //neural network checkbox
        document.getElementById("check_nn").style.position = "absolute";
        document.getElementById("check_nn").style.width=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_nn").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_nn").style.top=(options_container.offsetHeight/2)+"px";
        document.getElementById("check_nn").style.left="5px";
        document.getElementById("check_nn").checked = show_nn;
        //car data checkbox
        document.getElementById("check_cd").style.position = "absolute";
        document.getElementById("check_cd").style.width=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_cd").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_cd").style.top=(3*options_container.offsetHeight/4)+"px";
        document.getElementById("check_cd").style.left="5px";
        document.getElementById("check_cd").checked = show_cd;
        //wireframe label
        document.getElementById("check_wf_l").style.position = "absolute";
        document.getElementById("check_wf_l").style.width=(options_container.offsetWidth/2)-(options_container.offsetHeight/6)+"px";
        document.getElementById("check_wf_l").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_wf_l").style.top="2px";
        document.getElementById("check_wf_l").style.left=(options_container.offsetHeight/3)+"px";
        //leaderboard label
        document.getElementById("check_lb_l").style.position = "absolute";
        document.getElementById("check_lb_l").style.width=(options_container.offsetWidth/2)-(options_container.offsetHeight/6)+"px";
        document.getElementById("check_lb_l").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_lb_l").style.top=(options_container.offsetHeight/4)+2+"px";
        document.getElementById("check_lb_l").style.left=(options_container.offsetHeight/3)+"px";
        //neural network label
        document.getElementById("check_nn_l").style.position = "absolute";
        document.getElementById("check_nn_l").style.width=(options_container.offsetWidth/2)-(options_container.offsetHeight/6)+"px";
        document.getElementById("check_nn_l").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_nn_l").style.top=(options_container.offsetHeight/2)+2+"px";
        document.getElementById("check_nn_l").style.left=(options_container.offsetHeight/3)+"px";
        //car data label
        document.getElementById("check_cd_l").style.position = "absolute";
        document.getElementById("check_cd_l").style.width=(options_container.offsetWidth/2)-(options_container.offsetHeight/6)+"px";
        document.getElementById("check_cd_l").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("check_cd_l").style.top=(3*options_container.offsetHeight/4)+2+"px";
        document.getElementById("check_cd_l").style.left=(options_container.offsetHeight/3)+"px";
        //calculate the possition of all the elements of the main menu
        //title train
        menu_coords.title_train.x = mainCanvas.width/4;
        menu_coords.title_train.y = mainCanvas.height/10;
        menu_coords.title_train.size = mainCanvas.height/30;
        //title test
        menu_coords.title_test.x = 3*mainCanvas.width/4;
        menu_coords.title_test.y = mainCanvas.height/10;
        menu_coords.title_test.size = mainCanvas.height/30;
        //dividers
        menu_coords.lines.yit = mainCanvas.height/10;
        menu_coords.lines.yft = 4.25*mainCanvas.height/10;
        menu_coords.lines.yib = 5.75*mainCanvas.height/10;
        menu_coords.lines.yfb = 9*mainCanvas.height/10;
        menu_coords.lines.width = mainCanvas.height/200;
        menu_coords.lines.x = mainCanvas.width/2-menu_coords.lines.width/2;
        //or
        menu_coords.or.x = mainCanvas.width/2;
        menu_coords.or.y = mainCanvas.height/2;
        menu_coords.or.size = mainCanvas.height/20;
        //layers label
        menu_coords.hidden_layers.x = mainCanvas.width/4;
        menu_coords.hidden_layers.y = mainCanvas.height/5+mainCanvas.height/25;
        menu_coords.hidden_layers.size = mainCanvas.height/42;
        //neurons label
        menu_coords.neurons.x = mainCanvas.width/4;
        menu_coords.neurons.y = mainCanvas.height/5+2*mainCanvas.height/25;
        menu_coords.neurons.size = mainCanvas.height/42;
        //cars label
        menu_coords.car_amount.x = mainCanvas.width/4;
        menu_coords.car_amount.y = mainCanvas.height/5+3*mainCanvas.height/25;
        menu_coords.car_amount.size = mainCanvas.height/42;
        //total epochs label
        menu_coords.epochs.x = mainCanvas.width/4;
        menu_coords.epochs.y = mainCanvas.height/5+4*mainCanvas.height/25;
        menu_coords.epochs.size = mainCanvas.height/42;
        //fitness label
        menu_coords.fitness.x = mainCanvas.width/4;
        menu_coords.fitness.y = mainCanvas.height/5+5*mainCanvas.height/25;
        menu_coords.fitness.size = mainCanvas.height/42;
        //mutation label
        menu_coords.mutation.x = mainCanvas.width/4;
        menu_coords.mutation.y = mainCanvas.height/5+6*mainCanvas.height/25;
        menu_coords.mutation.size = mainCanvas.height/42;
        //cars to test label
        menu_coords.cars_train.x = mainCanvas.width/4;
        menu_coords.cars_train.y = mainCanvas.height/5+10*mainCanvas.height/25;
        menu_coords.cars_train.size = mainCanvas.height/42;
        //select file label
        menu_coords.select.x = 3*mainCanvas.width/4;
        menu_coords.select.y = mainCanvas.height/5+4*mainCanvas.height/25;
        menu_coords.select.size = mainCanvas.height/42;
        //cars to test(r) label
        menu_coords.cars_test.x = 3*mainCanvas.width/4;
        menu_coords.cars_test.y = mainCanvas.height/5+10*mainCanvas.height/25;
        menu_coords.cars_test.size = mainCanvas.height/42;
        //position the menu input fields and buttons
        //input for number fo hidden neural layers
        document.getElementById("layers_number").style.position = "absolute";
        document.getElementById("layers_number").style.width=mainCanvas.width/10+'px';
        document.getElementById("layers_number").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("layers_number").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+"px";
        document.getElementById("layers_number").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //input for number of neurons per hiddenb layer
        document.getElementById("neurons_number").style.position = "absolute";
        document.getElementById("neurons_number").style.width=mainCanvas.width/10+'px';
        document.getElementById("neurons_number").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("neurons_number").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+mainCanvas.height/24+"px";
        document.getElementById("neurons_number").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //input for number of simultaneous cars per epoch
        document.getElementById("cars_number").style.position = "absolute";
        document.getElementById("cars_number").style.width=mainCanvas.width/10+'px';
        document.getElementById("cars_number").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("cars_number").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+2*mainCanvas.height/23+"px";
        document.getElementById("cars_number").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //input for number of epochs
        document.getElementById("epochs_number").style.position = "absolute";
        document.getElementById("epochs_number").style.width=mainCanvas.width/10+'px';
        document.getElementById("epochs_number").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("epochs_number").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+3*mainCanvas.height/23+"px";
        document.getElementById("epochs_number").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //input for the fitness cutoff
        document.getElementById("fitness_number").style.position = "absolute";
        document.getElementById("fitness_number").style.width=mainCanvas.width/10+'px';
        document.getElementById("fitness_number").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("fitness_number").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+4*mainCanvas.height/23+"px";
        document.getElementById("fitness_number").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //input for the mutation factor
        document.getElementById("mutation_number").style.position = "absolute";
        document.getElementById("mutation_number").style.width=mainCanvas.width/10+'px';
        document.getElementById("mutation_number").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("mutation_number").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+5*mainCanvas.height/23+"px";
        document.getElementById("mutation_number").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //train button
        document.getElementById("train_button").style.position = "absolute";
        document.getElementById("train_button").style.width=mainCanvas.width/12+'px';
        document.getElementById("train_button").style.height=(options_container.offsetHeight/5)+"px";
        document.getElementById("train_button").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+6*mainCanvas.height/23+"px";
        document.getElementById("train_button").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4-mainCanvas.width/24+"px";
        //loading bar (in canvas?)
        menu_coords.loading_bar.x=mainCanvas.width/10;
        menu_coords.loading_bar.y=mainCanvas.height/5+mainCanvas.height/20+6*mainCanvas.height/23;
        menu_coords.loading_bar.w=3*mainCanvas.width/10;
        menu_coords.loading_bar.h=mainCanvas.height/23;
        menu_coords.loading_bar.t=mainCanvas.height/42;
        //input for number of cars to test
        document.getElementById("cart_number").style.position = "absolute";
        document.getElementById("cart_number").style.width=mainCanvas.width/10+'px';
        document.getElementById("cart_number").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("cart_number").style.top=mainCanvas.offsetTop+mainCanvas.height/5+11*mainCanvas.height/25+"px";
        document.getElementById("cart_number").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //test button
        document.getElementById("testl_button").style.position = "absolute";
        document.getElementById("testl_button").style.width=mainCanvas.width/12+'px';
        document.getElementById("testl_button").style.height=(options_container.offsetHeight/2.5)+"px";
        document.getElementById("testl_button").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+11*mainCanvas.height/23+"px";
        document.getElementById("testl_button").style.left=mainCanvas.offsetLeft+mainCanvas.offsetWidth/4-mainCanvas.width/24+"px";
        //file selection
        document.getElementById("nn_file_input").style.position = "absolute";
        document.getElementById("nn_file_input").style.width=mainCanvas.width/10+'px';
        document.getElementById("nn_file_input").style.height=(options_container.offsetHeight/3)+"px";
        document.getElementById("nn_file_input").style.top=mainCanvas.offsetTop+mainCanvas.height/5+4*mainCanvas.height/26+document.getElementById("nn_file").offsetHeight/2+"px";
        document.getElementById("nn_file_input").style.left=mainCanvas.offsetLeft+3*mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //select default button
        document.getElementById("default_nn_button").style.position = "absolute";
        document.getElementById("default_nn_button").style.width=mainCanvas.width/12+'px';
        document.getElementById("default_nn_button").style.height=(options_container.offsetHeight/2.5)+"px";
        document.getElementById("default_nn_button").style.top=mainCanvas.offsetTop+mainCanvas.height/5+7*mainCanvas.height/26+"px";
        document.getElementById("default_nn_button").style.left=mainCanvas.offsetLeft+3*mainCanvas.offsetWidth/4-mainCanvas.width/24+"px";
        //input for number of cars to test (r)
        document.getElementById("carr_number").style.position = "absolute";
        document.getElementById("carr_number").style.width=mainCanvas.width/10+'px';
        document.getElementById("carr_number").style.height=(options_container.offsetHeight/6)+"px";
        document.getElementById("carr_number").style.top=mainCanvas.offsetTop+mainCanvas.height/5+11*mainCanvas.height/25+"px";
        document.getElementById("carr_number").style.left=mainCanvas.offsetLeft+3*mainCanvas.offsetWidth/4+(options_container.offsetHeight/3)+"px";
        //test button
        document.getElementById("testr_button").style.position = "absolute";
        document.getElementById("testr_button").style.width=mainCanvas.width/12+'px';
        document.getElementById("testr_button").style.height=(options_container.offsetHeight/2.5)+"px";
        document.getElementById("testr_button").style.top=mainCanvas.offsetTop+(mainCanvas.height/5+mainCanvas.height/20)+11*mainCanvas.height/23+"px";
        document.getElementById("testr_button").style.left=mainCanvas.offsetLeft+3*mainCanvas.offsetWidth/4-mainCanvas.width/24+"px";

        //show the menu screen
        initial_state();

    }
}

//initialize the main menu
function initial_state(){
    //make sure initlize page elements function only handles DOM elements sizes and positions (including the menu ones)
    //instead of starting ALL from the begining when resizeing, we shall only change the dimensions of the stuff but continue
    if (running) {
        //testing in progress, resize the containers and redraw them
        //some parts are not designed well enough for squarish monitors but I can't be bothered blep
        selected_car_data = new Dashboard(carDataBGCanvas.width,carDataBGCanvas.height);
        selected_car_data.draw(carDataBGCtx,carDataFGCtx);
        selected_car.brain.redraw_visualizer(NNvisualizerCanvas.width, NNvisualizerCanvas.height);
        selected_car.brain.draw(NNCtx);
        leaderboard = new Leaderboard(leaderboardCanvas.width,leaderboardCanvas.height,traffic_array.length,selected_car.id);
        leaderboard.draw(LBBGCtx);
    } else {
        //stuff not running, show the menu on the canvas
        //draw elements to canvas
        mainCtx.fillStyle="rgb(185,187,190)";
        mainCtx.strokeStyle="rgb(185,187,190)";
        mainCtx.textBaseline = "middle";
        mainCtx.textAlign = "center";
        mainCtx.font = menu_coords.title_train.size+"px bold ";
        mainCtx.fillText("Train a new Autonomous Driving Neural Network", menu_coords.title_train.x, menu_coords.title_train.y);
        mainCtx.font = menu_coords.title_test.size+"px bold";
        mainCtx.fillText("Load existing Neural Network for testing", menu_coords.title_test.x, menu_coords.title_test.y);
        mainCtx.font = menu_coords.or.size+"px bold";
        mainCtx.fillText("or", menu_coords.or.x, menu_coords.or.y);
        mainCtx.textAlign = "right";
        mainCtx.font = menu_coords.hidden_layers.size+"px bold";
        mainCtx.fillText("Amount of hidden layers: ", menu_coords.hidden_layers.x, menu_coords.hidden_layers.y);
        mainCtx.font = menu_coords.neurons.size+"px bold";
        mainCtx.fillText("Amount of neurons/layer: ", menu_coords.neurons.x, menu_coords.neurons.y);
        mainCtx.font = menu_coords.car_amount.size+"px bold";
        mainCtx.fillText("Amount of cars/round: ", menu_coords.car_amount.x, menu_coords.car_amount.y);
        mainCtx.font = menu_coords.epochs.size+"px bold";
        mainCtx.fillText("Amount of epochs: ", menu_coords.epochs.x, menu_coords.epochs.y);
        mainCtx.font = menu_coords.fitness.size+"px bold";
        mainCtx.fillText("Fitness cutoff (%): ", menu_coords.fitness.x, menu_coords.fitness.y);
        mainCtx.font = menu_coords.mutation.size+"px bold";
        mainCtx.fillText("Mutation factor (%): ", menu_coords.mutation.x, menu_coords.mutation.y);
        mainCtx.font = menu_coords.cars_train.size+"px bold";
        mainCtx.fillText("Amount of cars in testing: ", menu_coords.cars_train.x, menu_coords.cars_train.y);
        mainCtx.font = menu_coords.cars_train.size+"px bold";
        mainCtx.fillText("Select Neural Network file: ", menu_coords.select.x, menu_coords.select.y);
        mainCtx.font = menu_coords.cars_train.size+"px bold";
        mainCtx.fillText("Amount of cars in testing: ", menu_coords.cars_test.x, menu_coords.cars_test.y);

        mainCtx.lineWidth=menu_coords.lines.width;
        mainCtx.beginPath();
        mainCtx.moveTo(menu_coords.lines.x,menu_coords.lines.yit);
        mainCtx.lineTo(menu_coords.lines.x,menu_coords.lines.yft);
        mainCtx.closePath();
        mainCtx.stroke();
        mainCtx.beginPath();
        mainCtx.moveTo(menu_coords.lines.x,menu_coords.lines.yib);
        mainCtx.lineTo(menu_coords.lines.x,menu_coords.lines.yfb);
        mainCtx.closePath();
        mainCtx.stroke();
        //loading bar
        if (training_in_progress) {
            mainCtx.lineWidth=menu_coords.lines.width/2;
            mainCtx.fillStyle="rgb(185,187,190)";
            mainCtx.strokeStyle="rgb(185,187,190)";
            mainCtx.clearRect(menu_coords.loading_bar.x, menu_coords.loading_bar.y, menu_coords.loading_bar.w, menu_coords.loading_bar.h);
            mainCtx.beginPath();
            let w = menu_coords.loading_bar.w * (curr_epoch+1)*(curr_round)/(max_epochs*max_rounds);
            mainCtx.fillRect(menu_coords.loading_bar.x, menu_coords.loading_bar.y, w, menu_coords.loading_bar.h);
            mainCtx.beginPath();
            mainCtx.moveTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y);
            mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y);
            mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
            mainCtx.lineTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
            mainCtx.closePath();
            mainCtx.stroke();
            mainCtx.textAlign = "center";
            mainCtx.font = menu_coords.loading_bar.t+"px bold";
            mainCtx.strokeStyle="rgb(57,61,71)";
            mainCtx.strokeText("Training - Epoch " + (curr_epoch+1) + " Round " + (curr_round+1), menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
            mainCtx.fillText("Training - Epoch " + (curr_epoch+1) + " Round " + (curr_round+1), menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2); 
        } else {
            mainCtx.lineWidth=menu_coords.lines.width/2;
            mainCtx.beginPath();
            mainCtx.moveTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y);
            mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y);
            mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
            mainCtx.lineTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
            mainCtx.closePath();
            mainCtx.stroke();
            mainCtx.textAlign = "center";
            mainCtx.font = menu_coords.loading_bar.t+"px bold";
            mainCtx.strokeStyle="rgb(57,61,71)";
            mainCtx.strokeText("No training in progress", menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
            mainCtx.fillText("No training in progress", menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
        }
        //make buttons enabled/disabled
        document.getElementById("train_button").disabled = false;
        document.getElementById("testl_button").disabled = true;
        document.getElementById("default_nn_button").disabled = false;
        document.getElementById("testr_button").disabled = true;
        //add listener to the file upload
        document.getElementById("nn_file_input").addEventListener("change", file_uploaded, false);
        //make menu elements visible
        document.getElementById("layers_number").style.visibility = "visible";
        document.getElementById("neurons_number").style.visibility = "visible";
        document.getElementById("cars_number").style.visibility = "visible";
        document.getElementById("epochs_number").style.visibility = "visible";
        document.getElementById("fitness_number").style.visibility = "visible";
        document.getElementById("mutation_number").style.visibility = "visible";
        document.getElementById("train_button").style.visibility = "visible";
        document.getElementById("cart_number").style.visibility = "visible";
        document.getElementById("testl_button").style.visibility = "visible";
        document.getElementById("nn_file_input").style.visibility = "visible";
        document.getElementById("default_nn_button").style.visibility = "visible";
        document.getElementById("carr_number").style.visibility = "visible";
        document.getElementById("testr_button").style.visibility = "visible";
        document.getElementById("layers_number").style.visibility = "visible";
        document.getElementById("layers_number").style.visibility = "visible";
        document.getElementById("layers_number").style.visibility = "visible";
    }
}

//function handling testing
function test_arena(){
    //make menu invisible
    document.getElementById("layers_number").style.visibility = "hidden";
    document.getElementById("neurons_number").style.visibility = "hidden";
    document.getElementById("cars_number").style.visibility = "hidden";
    document.getElementById("epochs_number").style.visibility = "hidden";
    document.getElementById("fitness_number").style.visibility = "hidden";
    document.getElementById("mutation_number").style.visibility = "hidden";
    document.getElementById("train_button").style.visibility = "hidden";
    document.getElementById("cart_number").style.visibility = "hidden";
    document.getElementById("testl_button").style.visibility = "hidden";
    document.getElementById("nn_file_input").style.visibility = "hidden";
    document.getElementById("default_nn_button").style.visibility = "hidden";
    document.getElementById("carr_number").style.visibility = "hidden";
    document.getElementById("testr_button").style.visibility = "hidden";
    //generate map
    map = createMap();
    //create the borders array
    road_borders=[];
    map.forEach((element)=>{
        element.border.forEach((border)=>{
            road_borders.push(border);
        })
    });

    //show the data containers once the testing is started
    car_data_cont.style.visibility = "visible";
    leaderboard_container.style.visibility = "visible";
    options_container.style.visibility = "visible";
    nn_visualizer_cont.style.visibility = "visible";

    //draw the cardata bg and fg
    selected_car_data = new Dashboard(carDataBGCanvas.width,carDataBGCanvas.height);
    selected_car_data.draw(carDataBGCtx,carDataFGCtx);

    //create the traffic array (check how many cars are present and create them randomly on the map)
    for (let index = 0; index < car_amount; index++) {
        traffic_array.push(new Car(6300,20000-index*500,60,120,index,neural_net));
        //place the car randomly on the map
        let check=true;
        let cutoff=0;
        do {
            //select random map element
            let mapid = Math.round(Math.random()*(map.length-1));
            //check if it is a road element
            if (map[mapid].type=="road") {
                //place the car somewhere random along the road
                let cheeky=true;
                let cutoff_colisions=0;
                do {
                    //get some random coords on the road
                    let random_w = Math.round(map[mapid].width*Math.random());
                    let random_h = Math.round(map[mapid].length*Math.random());
                    let x_tmp = map[mapid].startCoords.x + random_h * Math.cos(degrees_to_radians(map[mapid].angle));
                    let y_tmp = map[mapid].startCoords.y + random_h * Math.sin(degrees_to_radians(map[mapid].angle));
                    let x_pos = x_tmp + random_w * Math.cos(degrees_to_radians(map[mapid].angle-90));
                    let y_pos = y_tmp + random_w * Math.sin(degrees_to_radians(map[mapid].angle-90));
                    //place car
                    traffic_array[index].x=x_pos;
                    traffic_array[index].y=y_pos;
                    //set car at the same angel as the road
                    traffic_array[index].angle=map[mapid].angle-90;
                    //create it's collision box
                    traffic_array[index].polygon = traffic_array[index].createPolygon();

                    //check for collisions
                    if (!(traffic_array[index].assesDamage(road_borders,traffic_array,map))) {
                        //good position, set the checkers to false 
                        check=false;
                        cheeky=false;
                        cutoff=0;
                    } else {
                        //place the car at it's original coordinates
                        traffic_array[index].x=6350;
                        traffic_array[index].y=20000-index*500;
                        traffic_array[index].angle=0;
                    }                    
                    //check for cutoff
                    if (cutoff_colisions>50) {
                        //check=false;
                        cheeky=false;
                        cutoff=0;
                    } else {
                        cutoff_colisions++;
                    }
                } while (cheeky);
            }
            //can't stay here forever can we?
            if (cutoff>500) {
                check=false;
                cutoff=0;
            } else {
                cutoff++;
            }
        } while (check);
    }
    
    selected_car = traffic_array[0];
    best_car = traffic_array[0];
    traffic_array[0].selected=true;
    traffic_array[0].best = true;
    //draw the visualizer
    selected_car.brain.draw(NNCtx);
    //set the start time
    start_time = Date.now();
    //create the leaderboard object
    leaderboard = new Leaderboard(leaderboardCanvas.width,leaderboardCanvas.height,traffic_array.length,selected_car.id);
    leaderboard.draw(LBBGCtx);
    
    //controls
    controls = new Controls(traffic_array.length, 0);

    animate();
}

//create the map fucntion
function createMap() {
    //init an array that contains all the map elements
    mapElements = [];
    //add map elements to it
    //road segments - XY
    //intersection/curves - X
    var BA = new Road(
        startCoords={x:6400,y:3980},
        length=1980,
        angle=270,
        lanes=["left","left","right","right"],
        speedLimit=90,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:true,
            startRight:true,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(BA);
    //BC
    var BC = new Road(
        startCoords={x:6000,y:4220},
        length=1760,
        angle=90,
        lanes=["left","left","right","right"],
        speedLimit=90,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:true,
            startRight:false,
            endLeft:false,
            endCenter:true,
            endRight:true
        });
    mapElements.push(BC);
    //CD
    var CD = new Road(
        startCoords={x:6000,y:6220},
        length=12060,
        angle=90,
        lanes=["left","left","right","right"],
        speedLimit=90,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:true,
            startRight:false,
            endLeft:true,
            endCenter:true,
            endRight:true
        });
    mapElements.push(CD);
    //DE
    var DE = new Road(
        startCoords={x:6000,y:18580},
        length=3960,
        angle=90,
        lanes=["left","left","right","right"],
        speedLimit=90,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:true,
            startRight:true,
            endLeft:true,
            endCenter:false,
            endRight:true
        });
    mapElements.push(DE);
    //AF
    var AF = new Road(
        startCoords={x:6400,y:2000},
        length=22500,
        angle=29.5,
        lanes=["left","left","right","right"],
        speedLimit=90,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:false,
            endCenter:true,
            endRight:true
        });
    mapElements.push(AF);
    //DF
    var DF = new Road(
        startCoords={x:6500,y:18575},
        length=20250,
        angle=-15,
        lanes=["left","right"],
        speedLimit=60,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:true,
            startRight:true,
            endLeft:true,
            endCenter:false,
            endRight:true
        });
    mapElements.push(DF);
    //EG
    var EG = new Road(
        startCoords={x:6420,y:23000},
        length=39980,
        angle=0,
        lanes=["left","left","right","right"],
        speedLimit=90,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:true,
            startRight:true,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(EG);
    //G
    var G = new Curve(
        EG.roadSurface,
        false,
        0,
        155,
        EG.lanes,
        EG.speedLimit,
        EG.laneWidth);
    mapElements.push(G);
    //GF
    var GF = new Road(
        startCoords=G.endCoords,
        length=22100,
        angle=-155,
        lanes=["left","left","right","right"],
        speedLimit=90,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:true,
            endCenter:true,
            endRight:false
        });
    mapElements.push(GF);
    //BH
    var BH = new Road(
        startCoords={x:5980,y:4000},
        length=3980,
        angle=180,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:false,
            startRight:true,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(BH);
    //H
    var H = new Curve(
        BH.roadSurface,
        false,
        180,
        90,
        BH.lanes,
        BH.speedLimit,
        BH.laneWidth);
    mapElements.push(H);
    //HI
    var HI = new Road(
        startCoords={x:1800,y:4200},
        length=5980,
        angle=90,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:true,
            endCenter:true,
            endRight:false
        });
    mapElements.push(HI);
    //IR
    var IR = new Road(
        startCoords={x:2020,y:10400},
        length=1980,
        angle=0,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:false,
            startRight:true,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(IR);
    //R
    var R = new Curve(
        IR.roadSurface,
        false,
        0,
        90,
        IR.lanes,
        IR.speedLimit,
        IR.laneWidth);
    mapElements.push(R);
    //RS
    var RS = new Road(
        startCoords={x:4200,y:10200},
        length=4000,
        angle=270,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(RS);
    //S
    var S = new Curve(
        RS.roadSurface,
        true,
        270,
        90,
        RS.lanes,
        RS.speedLimit,
        RS.laneWidth);
    mapElements.push(S);
    //SC
    var SC = new Road(
        startCoords={x:4200,y:6200},
        length=1780,
        angle=0,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:true,
            endCenter:false,
            endRight:true
        });
    mapElements.push(SC);
    //IJ
    var IJ = new Road(
        startCoords={x:1800,y:10420},
        length=1960,
        angle=90,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:true,
            startRight:true,
            endLeft:true,
            endCenter:true,
            endRight:false
        });
    mapElements.push(IJ);
    //JK
    var JK = new Road(
        startCoords={x:1800,y:12620},
        length=3960,
        angle=90,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:true,
            startRight:true,
            endLeft:true,
            endCenter:true,
            endRight:false
        });
    mapElements.push(JK);
    //JQ
    var JQ = new Road(
        startCoords={x:2020,y:12600},
        length=1980,
        angle=0,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:false,
            startRight:true,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(JQ);
    //Q
    var Q = new Curve(
        JQ.roadSurface,
        true,
        0,
        90,
        JQ.lanes,
        JQ.speedLimit,
        JQ.laneWidth);
    mapElements.push(Q);
    //QP
    var QP = new Road(
        startCoords={x:4000,y:12600},
        length=4000,
        angle=90,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(QP);
    //P
    var P = new Curve(
        QP.roadSurface,
        true,
        90,
        90,
        QP.lanes,
        QP.speedLimit,
        QP.laneWidth);
    mapElements.push(P);
    //PK
    var PK = new Road(
        startCoords={x:4000,y:16600},
        length=1980,
        angle=180,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:true,
            endCenter:false,
            endRight:true
        });
    mapElements.push(PK);
    //KL
    var KL = new Road(
        startCoords={x:1800,y:16820},
        length=1460,
        angle=90,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:true,
            startRight:true,
            endLeft:true,
            endCenter:true,
            endRight:false
        });
    mapElements.push(KL);
    //LD
    var LD = new Road(
        startCoords={x:2020,y:18500},
        length=3960,
        angle=0,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:false,
            startRight:true,
            endLeft:true,
            endCenter:true,
            endRight:true
        });
    mapElements.push(LD);
    //LM
    var LM = new Road(
        startCoords={x:1800,y:18520},
        length=2460,
        angle=90,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:true,
            startRight:true,
            endLeft:true,
            endCenter:true,
            endRight:false
        });
    mapElements.push(LM);
    //MO
    var MO = new Road(
        startCoords={x:1800,y:21220},
        length=1580,
        angle=90,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:true,
            startRight:true,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(MO);
    //OE
    var OE = new Road(
        startCoords={x:2000,y:23000},
        length=3800,
        angle=0,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:true,
            endCenter:true,
            endRight:false
        });
    mapElements.push(OE);
    //O
    var O = new Curve(
        MO.roadSurface,
        false,
        90,
        90,
        MO.lanes,
        MO.speedLimit,
        MO.laneWidth);
    mapElements.push(O);
    //MN
    var MN = new Road(
        startCoords={x:2020,y:21200},
        length=460,
        angle=0,
        lanes=["left","right"],
        speedLimit=50,
        laneWidth=100,
        intersections={
            startLeft:true,
            startCenter:false,
            startRight:true,
            endLeft:false,
            endCenter:false,
            endRight:true
        });
    mapElements.push(MN);
    //N roundabout
    var N0 = new Road(
        startCoords={x:2500,y:21220},
        length=480,
        angle=90,
        lanes=["left"],
        speedLimit=30,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(N0);
    var N1 = new Curve(
        N0.roadSurface,
        false,
        90,
        90,
        N0.lanes,
        N0.speedLimit,
        N0.laneWidth);
    mapElements.push(N1);
    var N2 = new Road(
        startCoords={x:2600,y:21800},
        length=1000,
        angle=0,
        lanes=["left"],
        speedLimit=30,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(N2);
    var N3 = new Curve(
        N2.roadSurface,
        false,
        0,
        90,
        N2.lanes,
        N2.speedLimit,
        N2.laneWidth);
    mapElements.push(N3);
    var N4 = new Road(
        startCoords={x:3700,y:21700},
        length=1200,
        angle=270,
        lanes=["left"],
        speedLimit=30,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(N4);
    var N5 = new Curve(
        N4.roadSurface,
        false,
        270,
        90,
        N4.lanes,
        N4.speedLimit,
        N4.laneWidth);
    mapElements.push(N5);
    var N6 = new Road(
        startCoords={x:3600,y:20400},
        length=1000,
        angle=180,
        lanes=["left"],
        speedLimit=30,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:false,
            endCenter:false,
            endRight:false
        });
    mapElements.push(N6);
    var N7 = new Curve(
        N6.roadSurface,
        false,
        180,
        90,
        N6.lanes,
        N6.speedLimit,
        N6.laneWidth);
    mapElements.push(N7);
    var N8 = new Road(
        startCoords={x:2500,y:20500},
        length=480,
        angle=90,
        lanes=["left"],
        speedLimit=30,
        laneWidth=100,
        intersections={
            startLeft:false,
            startCenter:false,
            startRight:false,
            endLeft:false,
            endCenter:true,
            endRight:true
        });
    mapElements.push(N8);
    //A
    var A = new Curve(
        BA.roadSurface,
        true,
        270,
        120,
        BA.lanes,
        BA.speedLimit,
        BA.laneWidth);
    mapElements.push(A);
    //B
    var B = new Intersection(
        connectedRoads=[
            BA,
            BH,
            BC
        ],
        connectedRoadsCoords=[
            [
                BA.roadSurface.topLeft, 
                BA.roadSurface.bottomLeft
            ],
            [
                BH.roadSurface.topLeft,
                BH.roadSurface.bottomLeft
            ],
            [
                BC.roadSurface.topLeft,
                BC.roadSurface.bottomLeft
            ]
        ]
    )
    mapElements.push(B);
    //C
    var C = new Intersection(
        connectedRoads=[
            BC,
            SC,
            CD
        ],
        connectedRoadsCoords=[
            [
                BC.roadSurface.bottomRight, 
                BC.roadSurface.topRight
            ],
            [
                SC.roadSurface.bottomRight,
                SC.roadSurface.topRight
            ],
            [
                CD.roadSurface.topLeft,
                CD.roadSurface.bottomLeft
            ]
        ]
    )
    mapElements.push(C);
    //D
    var D = new Intersection(
        connectedRoads=[
            CD,
            LD,
            DE,
            DF
        ],
        connectedRoadsCoords=[
            [
                CD.roadSurface.bottomRight, 
                CD.roadSurface.topRight
            ],
            [
                LD.roadSurface.bottomRight,
                LD.roadSurface.topRight
            ],
            [
                DE.roadSurface.topLeft,
                DE.roadSurface.bottomLeft
            ],
            [
                DF.roadSurface.topLeft,
                DF.roadSurface.bottomLeft
            ]
        ]
    )
    mapElements.push(D);
    //E
    var E = new Intersection(
        connectedRoads=[
            DE,
            OE,
            EG
        ],
        connectedRoadsCoords=[
            [
                DE.roadSurface.bottomRight, 
                DE.roadSurface.topRight
            ],
            [
                OE.roadSurface.bottomRight,
                OE.roadSurface.topRight
            ],
            [
                EG.roadSurface.topLeft,
                EG.roadSurface.bottomLeft
            ]
        ]
    )
    mapElements.push(E);
    //F
    var F = new Intersection(
        connectedRoads=[
            AF,
            DF,
            GF
        ],
        connectedRoadsCoords=[
            [
                AF.roadSurface.bottomRight, 
                AF.roadSurface.topRight
            ],
            [
                DF.roadSurface.bottomRight,
                DF.roadSurface.topRight
            ],
            [
                GF.roadSurface.bottomRight,
                GF.roadSurface.topRight
            ]
        ]
    )
    mapElements.push(F);
    //I
    var I = new Intersection(
        connectedRoads=[
            HI,
            IR,
            IJ
        ],
        connectedRoadsCoords=[
            [
                HI.roadSurface.topRight, 
                HI.roadSurface.bottomRight
            ],
            [
                IR.roadSurface.bottomLeft,
                IR.roadSurface.topLeft
            ],
            [
                IJ.roadSurface.bottomLeft,
                IJ.roadSurface.topLeft
            ]
        ]
    )
    mapElements.push(I);
    //J
    var J = new Intersection(
        connectedRoads=[
            IJ,
            JQ,
            JK
        ],
        connectedRoadsCoords=[
            [
                IJ.roadSurface.topRight, 
                IJ.roadSurface.bottomRight
            ],
            [
                JQ.roadSurface.bottomLeft,
                JQ.roadSurface.topLeft
            ],
            [
                JK.roadSurface.bottomLeft,
                JK.roadSurface.topLeft
            ]
        ]
    )
    mapElements.push(J);
    //K
    var K = new Intersection(
        connectedRoads=[
            JK,
            PK,
            KL
        ],
        connectedRoadsCoords=[
            [
                JK.roadSurface.topRight, 
                JK.roadSurface.bottomRight
            ],
            [
                PK.roadSurface.topRight,
                PK.roadSurface.bottomRight
            ],
            [
                KL.roadSurface.bottomLeft,
                KL.roadSurface.topLeft
            ]
        ]
    )
    mapElements.push(K);
    //L
    var L = new Intersection(
        connectedRoads=[
            KL,
            LD,
            LM
        ],
        connectedRoadsCoords=[
            [
                KL.roadSurface.topRight, 
                KL.roadSurface.bottomRight
            ],
            [
                LD.roadSurface.bottomLeft,
                LD.roadSurface.topLeft
            ],
            [
                LM.roadSurface.bottomLeft,
                LM.roadSurface.topLeft
            ]
        ]
    )
    mapElements.push(L);
    //M
    var M = new Intersection(
        connectedRoads=[
            LM,
            MN,
            MO
        ],
        connectedRoadsCoords=[
            [
                LM.roadSurface.topRight, 
                LM.roadSurface.bottomRight
            ],
            [
                MN.roadSurface.bottomLeft,
                MN.roadSurface.topLeft
            ],
            [
                MO.roadSurface.bottomLeft,
                MO.roadSurface.topLeft
            ]
        ]
    );
    mapElements.push(M);
    //N
    var N = new Intersection(
        connectedRoads=[
            N8,
            MN,
            N0
        ],
        connectedRoadsCoords=[
            [
                N8.roadSurface.bottomRight, 
                N8.roadSurface.topRight
            ],
            [
                MN.roadSurface.bottomRight,
                MN.roadSurface.topRight
            ],
            [
                N0.roadSurface.topLeft,
                N0.roadSurface.bottomLeft
            ]
        ]
    );
    mapElements.push(N);
    //return for later use
    return mapElements;
}

//main animation loop function
function animate(){

    //check for LB controls
    if (selected_car.id!=controls.current_id) {
        controls.auto_best=false;
        selected_car.assume_control=false;
        selected_car.useBrain=true;
        selected_car.selected=false;
        selected_car = traffic_array[controls.current_id];
        selected_car.selected=true;
    }

    //check for assumption of control
    selected_car.useBrain=!controls.assume_control;

    //update all AI traffic 
    traffic_array.forEach(element=>{
        element.update(road_borders,traffic_array,map,controls);
    });

    //display selected car data on screen
    if (show_cd) {
        selected_car_data.update(carDataCtx, selected_car);
    }
    //display selected car NN on screen
    if (show_nn) {
        selected_car.brain.update(NNBGCtx);
    }
    //display current lb
    sorted_traffic = structuredClone(traffic_array);
    sorted_traffic.sort((a, b) => b.score - a.score);
    if (show_lb) {
        leaderboard.update(leaderboardCtx, sorted_traffic, start_time);
    }
    
    best_car.best = false;
    best_car = traffic_array[sorted_traffic[0].id];
    best_car.best = true;

    //best car automatic selection
    if (selected_car.id!=best_car.id && controls.auto_best) {
        selected_car.selected=false;
        selected_car.useBrain=true;
        selected_car.assume_control=false;
        selected_car = traffic_array[best_car.id];
        controls.current_id = selected_car.id;
        selected_car.selected=true;
    }

    //clear the main canvas for the next frame
    mainCtx.clearRect(
        0,
        0,
        mainCanvas.width,
        mainCanvas.height  
    );
    //translate the map according to the selected vehicle
    mainCtx.save();
    mainCtx.translate(-selected_car.x+mainCanvas.width*0.5,-selected_car.y+mainCanvas.height*0.5);
    
    if (wireframe_mode) {
        //draw all the map elements
        map.forEach(element=>{
            element.draw_wireframe(mainCtx);
        });
        //draw the cars on screen
        traffic_array.forEach((car)=>{
            car.draw_wireframe(mainCtx);
        });
    } else {
        //draw all the map elements
        map.forEach(element=>{
            element.draw(mainCtx);
        });
        //draw the cars on screen
        traffic_array.forEach((car)=>{
            car.draw(mainCtx);
        });
    }
    
    mainCtx.restore();

    //calls the animate method many times per second
    requestAnimationFrame(animate);
}

//function to show/hide leaderboard screen module
function lb_check (){
    show_lb=!show_lb;
    //call the the draw or clear fc
    if (show_lb) {
        leaderboard.draw(LBBGCtx);
        leaderboard_container.style.visibility='visible';
    } else {
        LBBGCtx.clearRect(0,0,leaderboard.width,leaderboard.height);
        leaderboardCtx.clearRect(0,0,leaderboard.width,leaderboard.height);
        leaderboard_container.style.visibility='hidden';
    }
}

//function to show/hide neural network screen module
function nn_check (){
    show_nn=!show_nn;
    //call the the draw or clear fc
    if (show_nn) {
        selected_car.brain.draw(NNCtx);
        nn_visualizer_cont.style.visibility='visible';
    } else {
        NNBGCtx.clearRect(0,0,selected_car.brain.size.width,selected_car.brain.size.height);
        NNCtx.clearRect(0,0,selected_car.brain.size.width,selected_car.brain.size.height);
        nn_visualizer_cont.style.visibility='hidden';
    }
}

//function to show/hide car data screen module
function cd_check (){
    show_cd=!show_cd;
    //call for bg draw func
    if (show_cd) {
        selected_car_data.draw(carDataBGCtx,carDataFGCtx);
        car_data_cont.style.visibility='visible';
    } else {
        carDataBGCtx.clearRect(0,0,selected_car_data.size.width,selected_car_data.size.height);
        carDataFGCtx.clearRect(0,0,selected_car_data.size.width,selected_car_data.size.height);
        carDataCtx.clearRect(0,0,selected_car_data.size.width,selected_car_data.size.height);
        car_data_cont.style.visibility='hidden';
    }
}

//function to switch between normal and wireframe modes
function wireframe_check (){
    wireframe_mode=!wireframe_mode;
}

//what to do when the select defualt button is clicked
function select_default_nn() {
    //make button unclickable
    document.getElementById("default_nn_button").disabled = true;
    //initialize the nn as the default one (load it from your own after you're done trainig a few of them)////////////////////////////////////////////////////////////////////////TODO
    neural_net = new NeuralNetwork(
        null, 
        NNvisualizerCanvas.width, NNvisualizerCanvas.height,
        default_nn_data
    );
    //activate the test button
    document.getElementById("testr_button").disabled = false;
}

//file upload handler
function file_uploaded() {
    //get the file
    const fileList = document.getElementById("nn_file").files;
    const file = fileList[0];
    //convert the content into an usable neural network
    conver_to_network(file);
    //activate the test button
    document.getElementById("testr_button").disabled = false;
}

//converts the NN data file into a neural network
function conver_to_network(file) {
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt) => {
        let nn=JSON.parse(evt.target.result);
        neural_net = new NeuralNetwork(
            null, 
            NNvisualizerCanvas.width, NNvisualizerCanvas.height,
            nn
        );
    }
    reader.onerror = (evt) => {
        window.alert("Error reading file contents");
    }

}

function train() {
    //maybe make everything unclickable except the train button who now becomes a stop training button?
    document.getElementById("layers_number").disabled = true;
    document.getElementById("neurons_number").disabled = true;
    document.getElementById("cars_number").disabled = true;
    document.getElementById("epochs_number").disabled = true;
    document.getElementById("fitness_number").disabled = true;
    document.getElementById("mutation_number").disabled = true;
    document.getElementById("neurons_number").disabled = true;
    document.getElementById("cart_number").disabled = true;
    document.getElementById("testl_button").disabled = true;
    document.getElementById("nn_file_input").disabled = true;
    document.getElementById("default_nn_button").disabled = true;
    document.getElementById("carr_number").disabled = true;
    document.getElementById("testr_button").disabled = true;
    document.getElementById("nn_file").disabled = true;
    document.getElementById("train_button").innerHTML = "Stop Training";
    //if button is clicked after trainig started, stop it
    if (training_in_progress) {
        curr_round=100;
        curr_epoch=100;
        training_in_progress=false;
        return;
    }
    //training starts 
    training_in_progress=true;
    //get data from the screen
    layer_val = document.getElementById("layers_number").value;
    neuron_val = document.getElementById("neurons_number").value;
    max_epochs = document.getElementById("epochs_number").value;
    training_cars = document.getElementById("cars_number").value;
    fitness_val = document.getElementById("fitness_number").value;
    mutation_val = document.getElementById("mutation_number").value;
    curr_epoch=0;curr_round=0;
    //check and return error if something is off
    if (layer_val<1||layer_val>20) return window.alert("The number of hidden layers must be between 1 and 20.");
    if (neuron_val<1||neuron_val>50) return window.alert("The number of neurons per layer must be between 1 and 50");
    if (max_epochs<1||max_epochs>10) return window.alert("The number of epochs must be between 1 and 10.");
    if (training_cars<1||training_cars>500) return window.alert("The number of cars per round must be between 1 and 500.");
    if (fitness_val<1||fitness_val>100) return window.alert("The fitness value must be between 1% and 100%.");
    if (mutation_val<1||mutation_val>100) return window.alert("The mutation value must be between 1% and 100%.");
    //generate training map
    map = createMap(); //we might need to make a new one cuttign down the unnecesary stuff -> nope, not that hard on the processor for 2x if both trainig and testing tbh
    //create the borders array
    road_borders=[];
    map.forEach((element)=>{
        element.border.forEach((border)=>{
            road_borders.push(border);
        })
    });
    //create the NN shape
    nn_size=[24];//input sensors
    //add hidden layers
    for (let a = 0; a < layer_val; a++) {
        nn_size.push(neuron_val);
    }
    nn_size.push(8);//ouputs
    //create the traffic array (check how many cars are present and create them randomly on the map)
    for (let index = 0; index < training_cars; index++) {
        //generate random NN
        let random_nn = new NeuralNetwork(
            nn_size, 
            NNvisualizerCanvas.width, NNvisualizerCanvas.height,
        );
        neural_nets_array[index] = {
            net: random_nn,
            score: 0
        }
        traffic_array.push(new Car(6300,20000-index*500,60,120,index,neural_nets_array[index].net));
        //place the car randomly on the map
        let check=true;
        let cutoff=0;
        do {
            //select random map element
            let mapid = Math.round(Math.random()*(map.length-1));
            //check if it is a road element
            if (map[mapid].type=="road") {
                //place the car somewhere random along the road
                let cheeky=true;
                let cutoff_colisions=0;
                do {
                    //get some random coords on the road
                    let random_w = Math.round(map[mapid].width*Math.random());
                    let random_h = Math.round(map[mapid].length*Math.random());
                    let x_tmp = map[mapid].startCoords.x + random_h * Math.cos(degrees_to_radians(map[mapid].angle));
                    let y_tmp = map[mapid].startCoords.y + random_h * Math.sin(degrees_to_radians(map[mapid].angle));
                    let x_pos = x_tmp + random_w * Math.cos(degrees_to_radians(map[mapid].angle-90));
                    let y_pos = y_tmp + random_w * Math.sin(degrees_to_radians(map[mapid].angle-90));
                    //place car
                    traffic_array[index].x=x_pos;
                    traffic_array[index].y=y_pos;
                    //set car at the same angel as the road
                    traffic_array[index].angle=map[mapid].angle-90;
                    //create it's collision box
                    traffic_array[index].polygon = traffic_array[index].createPolygon();

                    //check for collisions
                    if (!(traffic_array[index].assesDamage(road_borders,traffic_array,map))) {
                        //good position, set the checkers to false 
                        check=false;
                        cheeky=false;
                        cutoff=0;
                    } else {
                        //place the car at it's original coordinates
                        traffic_array[index].x=6350;
                        traffic_array[index].y=20000-index*500;
                        traffic_array[index].angle=0;
                    }                    
                    //check for cutoff
                    if (cutoff_colisions>50) {
                        cheeky=false;
                        cutoff=0;
                    } else {
                        cutoff_colisions++;
                    }
                } while (cheeky);
            }
            //can't stay here forever can we?
            if (cutoff>500) {
                check=false;
                cutoff=0;
            } else {
                cutoff++;
            }
        } while (check);
    }
    //set the start times
    start_time = Date.now();
    total_training_time = Date.now();
    //controls
    controls = new Controls(traffic_array.length, 0);
    //initialize the loading bar
    mainCtx.lineWidth=menu_coords.lines.width/2;
    mainCtx.fillStyle="rgb(185,187,190)";
    mainCtx.strokeStyle="rgb(185,187,190)";
    mainCtx.clearRect(menu_coords.loading_bar.x, menu_coords.loading_bar.y, menu_coords.loading_bar.w, menu_coords.loading_bar.h);
    mainCtx.beginPath();
    mainCtx.beginPath();
    mainCtx.moveTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y);
    mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y);
    mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
    mainCtx.lineTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
    mainCtx.closePath();
    mainCtx.stroke();
    mainCtx.textAlign = "center";
    mainCtx.font = menu_coords.loading_bar.t+"px bold";
    mainCtx.strokeStyle="rgb(57,61,71)";
    mainCtx.strokeText("Training - Epoch " + (curr_epoch+1) + " Round " + (curr_round+1), menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
    mainCtx.fillText("Training - Epoch " + (curr_epoch+1) + " Round " + (curr_round+1), menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
    //begin the training loop (we're stuck at request animation frame rate for now) <- upon testing the requestanimationframe() finished in the exact time a while loop does, but without the warning that firefox is slowed down by the page
    training_loop();

}

//does one round of simulation and returns the best cars
function training_loop(){
    if (curr_epoch<max_epochs) {
        if (curr_round<max_rounds) {
            //update all AI traffic 
            let check_if_alive=false;
            traffic_array.forEach(element=>{
                element.update(road_borders,traffic_array,map,controls);            ///see what kind of mods we need to bring here (no drawing and no extra calcs for visuals)
                //is car still running
                if (!element.damaged) {
                    check_if_alive=true;
                }
            });

            //loop if there are cars still driving or if max duration not yet reached
            if (check_if_alive && (Date.now()-start_time) < 10000) {
                
            } else {
                //increment rounds
                curr_round++;
                //loading bar
                mainCtx.lineWidth=menu_coords.lines.width/2;
                mainCtx.fillStyle="rgb(185,187,190)";
                mainCtx.strokeStyle="rgb(185,187,190)";
                mainCtx.clearRect(menu_coords.loading_bar.x, menu_coords.loading_bar.y, menu_coords.loading_bar.w, menu_coords.loading_bar.h);
                mainCtx.beginPath();
                let w = menu_coords.loading_bar.w * (curr_epoch+1)*(curr_round)/(max_epochs*max_rounds);
                mainCtx.fillRect(menu_coords.loading_bar.x, menu_coords.loading_bar.y, w, menu_coords.loading_bar.h);
                mainCtx.beginPath();
                mainCtx.moveTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y);
                mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y);
                mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
                mainCtx.lineTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
                mainCtx.closePath();
                mainCtx.stroke();
                mainCtx.textAlign = "center";
                mainCtx.font = menu_coords.loading_bar.t+"px bold";
                mainCtx.strokeStyle="rgb(57,61,71)";
                mainCtx.strokeText("Training - Epoch " + (curr_epoch+1) + " Round " + (curr_round+1), menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
                mainCtx.fillText("Training - Epoch " + (curr_epoch+1) + " Round " + (curr_round+1), menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
                //round finished, sort traffic by score
                sorted_traffic = [];
                sorted_traffic = structuredClone(traffic_array);
                sorted_traffic.sort((a, b) => b.score - a.score);
                //call function to create the next round of traffic from the current one
                console.log("Round "+curr_round+" score: "+sorted_traffic[0].score);
                create_new_round();
            }

        } else {
            //create the new NN for the cars
            new_epoch();
            //go to the next epoch
            curr_epoch++;
            curr_round=0;
        }
        //reiterate
        requestAnimationFrame(training_loop);
    } else {
        //put the GUI as it was
        document.getElementById("layers_number").disabled = false;
        document.getElementById("neurons_number").disabled = false;
        document.getElementById("cars_number").disabled = false;
        document.getElementById("epochs_number").disabled = false;
        document.getElementById("fitness_number").disabled = false;
        document.getElementById("mutation_number").disabled = false;
        document.getElementById("neurons_number").disabled = false;
        document.getElementById("cart_number").disabled = false;
        document.getElementById("testl_button").disabled = !training_in_progress;
        document.getElementById("nn_file_input").disabled = false;
        document.getElementById("nn_file").disabled = false;
        document.getElementById("default_nn_button").disabled = false;
        document.getElementById("carr_number").disabled = false;
        
        document.getElementById("train_button").innerHTML = "Begin Training";
        
        //if the training was completed properly, save the trained NN
        if (training_in_progress) {
            //also assign it to the cars
            neural_net=neural_nets_array[0].net;
            //save the NN to 
            NeuralNetwork.export(neural_net, neural_nets_array[0].score);
            //save some stats as well? or show them in the console?

        }
        
        //training finshed, get all relevant data on screen
        total_training_time = Date.now()-total_training_time;
        mainCtx.lineWidth=menu_coords.lines.width/2;
        mainCtx.fillStyle="rgb(185,187,190)";
        mainCtx.strokeStyle="rgb(185,187,190)";
        mainCtx.clearRect(menu_coords.loading_bar.x, menu_coords.loading_bar.y, menu_coords.loading_bar.w, menu_coords.loading_bar.h);
        mainCtx.beginPath();
        mainCtx.moveTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y);
        mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y);
        mainCtx.lineTo(menu_coords.loading_bar.x+menu_coords.loading_bar.w,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
        mainCtx.lineTo(menu_coords.loading_bar.x,menu_coords.loading_bar.y+menu_coords.loading_bar.h);
        mainCtx.closePath();
        mainCtx.stroke();
        if (training_in_progress) {
            mainCtx.fill();
        }
        mainCtx.textAlign = "center";
        mainCtx.font = menu_coords.loading_bar.t+"px bold";
        mainCtx.strokeStyle="rgb(57,61,71)";
        let texty=(training_in_progress)?"Finished in " + Math.floor(total_training_time/1000) + "s. Best score:  " + (neural_nets_array[0].score):"Training aborted."
        mainCtx.strokeText(texty, menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
        mainCtx.fillText(texty, menu_coords.loading_bar.x+menu_coords.loading_bar.w/2, menu_coords.loading_bar.y+menu_coords.loading_bar.h/2);
        training_in_progress=false;
        //reset the traffic array
        traffic_array=[];
        sorted_traffic=[];
    }
}

function create_new_round(){
    //update the NN scores
    for (let i = 0; i < neural_nets_array.length; i++) {
        neural_nets_array[i].score += traffic_array[i].score;
    }
    
    //select the top % of cars according to the fitness val
    let selected_amount = Math.floor((training_cars*fitness_val)/100);
    let best_cars = [];
    for (let i = 0; i < selected_amount; i++) {
        best_cars[i] = sorted_traffic[i];
    }
    //create a new population using the past NNs
    traffic_array=[];
    for (let index = 0; index < training_cars; index++) {
        //create the car
        traffic_array.push(new Car(6300,20000-index*500,60,120,index,neural_nets_array[index].net));
        //place the car randomly on the map
        let check=true;
        let cutoff=0;
        do {
            //select random map element
            let mapid = Math.round(Math.random()*(map.length-1));
            //check if it is a road element
            if (map[mapid].type=="road") {
                //place the car somewhere random along the road
                let cheeky=true;
                let cutoff_colisions=0;
                do {
                    //get some random coords on the road
                    let random_w = Math.round(map[mapid].width*Math.random());
                    let random_h = Math.round(map[mapid].length*Math.random());
                    let x_tmp = map[mapid].startCoords.x + random_h * Math.cos(degrees_to_radians(map[mapid].angle));
                    let y_tmp = map[mapid].startCoords.y + random_h * Math.sin(degrees_to_radians(map[mapid].angle));
                    let x_pos = x_tmp + random_w * Math.cos(degrees_to_radians(map[mapid].angle-90));
                    let y_pos = y_tmp + random_w * Math.sin(degrees_to_radians(map[mapid].angle-90));
                    //place car
                    traffic_array[index].x=x_pos;
                    traffic_array[index].y=y_pos;
                    //set car at the same angel as the road
                    traffic_array[index].angle=map[mapid].angle-90;
                    //create it's collision box
                    traffic_array[index].polygon = traffic_array[index].createPolygon();
                    //check for collisions
                    if (!(traffic_array[index].assesDamage(road_borders,traffic_array,map))) {
                        //good position, set the checkers to false 
                        check=false;
                        cheeky=false;
                        cutoff=0;
                    } else {
                        //place the car at it's original coordinates
                        traffic_array[index].x=6350;
                        traffic_array[index].y=20000-index*500;
                        traffic_array[index].angle=0;
                    }                    
                    //check for cutoff
                    if (cutoff_colisions>50) {
                        cheeky=false;
                        cutoff=0;
                    } else {
                        cutoff_colisions++;
                    }
                } while (cheeky);
            }
            //can't stay here forever can we?
            if (cutoff>500) {
                check=false;
                cutoff=0;
            } else {
                cutoff++;
            }
        } while (check);
    }
    //reset start time
    start_time = Date.now();
}

//handles the creation of a new epoch, maninly the cutoff and mutation of the Neural Networks
function new_epoch(){
    //sort neural networks by total score
    neural_nets_array.sort((a, b) => b.score - a.score);
    //show the max score for this epoch
    console.log("Best score in epoch: "+neural_nets_array[0].score);
    //iterate through the neural networks
    for (let index = 0; index < neural_nets_array.length; index++) {
        //generate NN (same NN if it's on the top, mutated if not)
        if (index<Math.floor((training_cars*fitness_val)/100)) {
            //neural_nets_array[index] = sorted_traffic[index].brain;
        } else {
            //choose a random network to mutate
            let rnd = Math.floor(Math.random()*(Math.floor((training_cars*fitness_val)/100)));
            //do the mutation
            neural_nets_array[index].brain = NeuralNetwork.mutate(neural_nets_array[rnd].net, mutation_val);
        }
        //reset score
        neural_nets_array[index].score=0;
    }
}

//what to do when the right test button is clicked
function test_right() {
    //get the number of cars
    car_amount = document.getElementById("carr_number").value;
    //if NaN return error
    if (isNaN(car_amount)||car_amount<1||car_amount>100) return  window.alert("Make sure you entered a correct number (1-100) in the car amount field.");
    //set the global running var
    running=true;
    //start the test
    test_arena();
}

//what to do when the left test button is clicked
function test_left() {
    //get the number of cars
    car_amount = document.getElementById("cart_number").value;
    //if NaN return error
    if (isNaN(car_amount)||car_amount<1||car_amount>100) return  window.alert("Make sure you entered a correct number (1-100) in the car amount field.");
    //set the global running var
    running=true;
    //start the test
    test_arena();
}
