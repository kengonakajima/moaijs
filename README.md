moaijs
======

JavaScript based moai-like 2D game engine for minimalists.

Moai SDK
======
<a href="http://getmoai.com/moai-sdk.html">Moai SDK</a>


Demo
======
<a href="http://kengonakajima.github.io/moaijs/index.html">demo on github.io</a>

Performance
======
 - about 3500~4000 sprites / 60fps  on my macbook pro 2012Mid (2.6GHz Core i7)
 - about 100-200 sprites/60fps on my iphone4
 
 
 
How to use
======

Get and initialize moaijs context with your canvas:
<Pre>
var canvas = $("#gamecanvas")[0];
var moai = new MoaiJS();
moai.setCanvas(canvas);
moai.setClearColor( new Color(0.1,0.1,0.1,1) );
</pre>

Create layer and set camera:
<pre>
var main_layer = new Layer();
moai.insertLayer( main_layer );

var cam = new Camera();
cam.setLoc( new Vec2(0,0) );
main_layer.setCamera(cam);
</pre>

Load some texture and make tiled sprite atlas:
<pre>
var t0 = new Texture();
t0.load( "sol.png" );

var t1 = new Texture();
t1.load( "base.png" );

var deck = new TileDeck();
deck.setTexture(t1);
deck.setSize( 16,16, 16,16,  256,256 );
</pre>

Load and play audio:
<pre>
var ss = new SoundSystem();
var s0 = ss.newSound( "http://localhost:8888/sounds/explode.wav" );
s0.play();
</pre>

Initialize sprite(Prop) and move it:
<pre>
var p = new Prop();
p.setDeck( deck );
p.setScl(32,32);
p.setLoc( 10,20 );
p.setIndex(0);
p.setRot(3.1415);
p.onUpdate = function(dt) {
  this.loc.x += 10 * dt;
  return true;   // when false, this prop will be discarded
}
main_layer.insertProp(p);
</pre>

To remove sprite(Prop):
<pre>
main_layer.removeProp(prop);
</pre>

Buffered grid for tiled terrain:
<Pre>
var g = new Grid();
g.setDeck(dk);
g.setSize(8,8);
g.set(0,1,123);
prop.addGrid(g);
</pre>

Animation:

<Pre>
var a = new Animation();
a.setKeys( 0.1, [16,17,18,19] );
a.loop = true;
prop.setAnim(a);
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


Todo
======
 - Grid
 - rotation
 - Animation
 