var canvas = $("#gamemain")[0];

console.log(canvas);



var moai = MoaiJS();

moai.setCanvas(canvas);
moai.setClearColor( Color(0.1,0.1,0.1,1) );

var main_layer = Layer();
moai.insertLayer( main_layer );

var cam = Camera();
cam.setLoc( Vec2(0,0) );

var t = Texture();
t.load( "sol.png" );

var p = Prop();
p.setTexture(t);
p.setScl(16,16);
p.setLoc(0,0);
p.onUpdate = function(dt) {
    p.loc.x += 5;
};

main_layer.setCamera(cam);
main_layer.insertProp(p);


var last_loop_at = now();
var last_print_at = 0;
var framecnt = 0;

function game_loop_callback() {
    var t = now();
    var dt = t - last_loop_at;

    if( last_print_at < t-1 ) {
        last_print_at = t;
        print("fps:", framecnt );
        framecnt = 0;
    }
    framecnt ++;
    
    moai.poll(dt);
    moai.render();

    last_loop_at = t;
}

setInterval( game_loop_callback, 16.667 * 30 );
