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

var t0 = Texture();
t0.load( "sol.png" );

var t1 = Texture();
t1.load( "base.png" );

var dk = TileDeck();
dk.setTexture(t1);
dk.setSize( 16,16, 16,16,  256,256 );


var ss = SoundSystem();

var s0 = ss.newSound( "http://localhost:8888/sounds/explode.wav" ); // command line "node sv.js" to serve static files for debugging

// with deck
function addProps(x,y,n) {
    print("hoge:",n)
    for(var i=0;i<n;i++) {
        var p = Prop();
        p.id = i;
        p.v = Vec2( range(-200,200), range(-200,200) );
        p.setLoc( x,y );
        p.onUpdate = function(dt) {
            if( this.animate ) this.animate(dt);
            this.loc.x += this.v.x * dt;
            this.loc.y += this.v.y * dt;
            if( this.loc.x < - canvas.width/2 || this.loc.x > canvas.width/2 ) this.v.x *= -1;
            if( this.loc.y < - canvas.height/2 || this.loc.y > canvas.height/2 ) this.v.y *= -1;
            this.rot += dt;
            
            return true;
        }

        
        var t = irange(0,3);
        if(t == 0 ) { // sprite with tile deck 
            p.setDeck( dk );
            p.setScl(32,32);
            p.setIndex(0);
            p.animate = function(dt) {
                this.setIndex( irange(0,3) );
            }
        } else if( t == 1 )  { // sprite with grid
            var g = new Grid();
            g.setDeck(dk);
            g.setSize(8,8);
            var cnt=0;
            for(var j=0;j<8;j++) {
                for(var k=0;k<8;k++) {
                    g.set(k,j,80+(cnt%10));
                    cnt++;
                }
            }
            p.addGrid(g);
            p.setScl(16,16);
        } else if( t == 2 ) { // sprite without deck
            p.setTexture(t0);
            var s = range(16,64);
            p.setScl(s,s);
        }
         main_layer.insertProp(p);
    }
}

addProps(0,0,20);

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
    
    addProps( x,y, 100 );

    s0.play( range(0.1,1) );
    
});

// on ios6, have to play sound in touch events first.
$(canvas).bind("touchstart", function(ev) {
    var x = event.offsetX - canvas.width/2;
    var y = event.offsetY - canvas.height/2;
    
    addProps(x,y,100);
    print("touched");
    $("#touch").html("touched");

    s0.play( range(0.1,1) );    
});