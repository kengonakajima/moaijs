moaijs
======

js based moai-like game engine 


How to use
======

Get and initialize moaijs context with your canvas:
<Pre>
var canvas = $("#gamecanvas")[0];
var moai = MoaiJS();
moai.setCanvas(canvas);
moai.setClearColor( Color(0.1,0.1,0.1,1) );
</pre>

Create layer and set camera:
<pre>
var main_layer = Layer();
moai.insertLayer( main_layer );

var cam = Camera();
cam.setLoc( Vec2(0,0) );
main_layer.setCamera(cam);
</pre>

Load some texture and make tiled sprite atlas:
<pre>
var t0 = Texture();
t0.load( "sol.png" );

var t1 = Texture();
t1.load( "base.png" );

var deck = TileDeck();
deck.setTexture(t1);
deck.setSize( 16,16, 16,16,  256,256 );
</pre>

Load and play audio:
<pre>
var ss = SoundSystem();
var s0 = ss.newSound( "http://localhost:8888/sounds/explode.wav" );
s0.play();
</pre>

Initialize sprite(Prop) and move it:
<pre>
var p = Prop();
p.setDeck( deck );
p.setScl(32,32);
p.setLoc( 10,20 );
p.setIndex(0);
p.onUpdate = function(dt) {
  this.loc.x += 10 * dt;
  return true;   // when false, this prop will be discarded
}
main_layer.insertProp(p);
</pre>  

Then start your game loop:
<pre>
function game_loop_callback() {
    var t = now();
    var dt = t - last_loop_at;
    moai.poll(dt);
    moai.render();
    last_loop_at = t;
}
setInterval( game_loop_callback, 16.667  );
</pre>