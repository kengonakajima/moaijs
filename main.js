var canvas = $("#gamemain")[0];

console.log(canvas);



var moai = MoaiJS();

moai.setCanvas(canvas);
moai.setClearColor( Color(0.1,0.1,0.1,1) );

var main_layer = Layer();
moai.insertLayer( main_layer );

var cam = Camera();
cam.setLoc( Vec2(0,0) );
main_layer.setCamera(cam);

var t = Texture();
t.load( "sol.png" );

var tt = Texture();
tt.load( "base.png" );

var dk = TileDeck();
dk.setTexture(tt);
dk.setSize( 16,16, 16,16,  256,256 );



function addProps(x,y,n) {
    for(var i=0;i<n;i++) {
        var dp = Prop();
        dp.id = i;
        dp.v = Vec2( range(-200,200), range(-200,200) );
        dp.setDeck( dk );
        dp.setScl(32,32);
        dp.setLoc( x,y );
        dp.setIndex(0);
        dp.onUpdate = function(dt) {
            this.setIndex( irange(0,3) );
            this.loc.x += this.v.x * dt;
            this.loc.y += this.v.y * dt;
            if( this.loc.x < - canvas.width/2 || this.loc.x > canvas.width/2 ) this.v.x *= -1;
            if( this.loc.y < - canvas.height/2 || this.loc.y > canvas.height/2 ) this.v.y *= -1;
            
            return true;
        }
        main_layer.insertProp(dp);
    }
}


addProps(0,0,10);

//////////

var last_loop_at = now();
var last_print_at = 0;
var framecnt = 0;

function game_loop_callback() {
    var t = now();
    var dt = t - last_loop_at;

    if( last_print_at < t-1 ) {
        last_print_at = t;
        $("#fps").html( "FPS:" + framecnt );
        print("fps:", framecnt );
        framecnt = 0;
    }
    framecnt ++;
    
    moai.poll(dt);
    var cnt = moai.render();

    $("#count").html("Count:" + cnt );

    last_loop_at = t;
}

setInterval( game_loop_callback, 16.667  );

$(canvas).click( function(event) {
    var x = event.offsetX - canvas.width/2;
    var y = event.offsetY - canvas.height/2;
    
    print("clk:", x,y);
    
    addProps( x,y, 100 );
});