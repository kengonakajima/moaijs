// subset of moai

function to02x(i) {
    if(i<16) {
        return "0" + i.toString(16);
    } else {
        return i.toString(16);
    }
}

function Vec2(x,y) {
    var v = { x:x, y:y };
    return v;
}

// 0 ~ 1
function Color(r,g,b,a) {
    var c = { r:r, g:g, b:b, a:a};
    c.toStyle = function() {
        var ri = parseInt(c.r * 255);
        var gi = parseInt(c.g * 255);
        var bi = parseInt(c.b * 255);
        var s = "#" + to02x(ri) + to02x(gi) + to02x(bi);
        return s;
    }
    return c;
}

function Camera () {
    var c = Prop();     // need loc
    return c;
}
function Texture() {
    var t = {};
    t.img = null;
    t.load = function(url) {
        t.img = new Image();
        t.img.onload = function() {
            t.ready = true;
            $(t.img).attr("image-rendering","-webkit-optimize-contrast");                    
            print("img onload:", url);
        }
        t.img.src = url;

    };
    return t;
}
function TileDeck() {
    var td = {};
    td.tex = null;
    td.numgrid_x = td.numgrid_y = null;
    td.spritesize_x = td.spritesize_y = null;
    td.imagesize_x = td.imagesize_y = null;
    
    td.setTexture = function(t) {
        td.tex = t;
    }
    td.setSize = function( numgrid_x, numgrid_y, spritesize_x, spritesize_y, imagesize_x, imagesize_y ) {
        td.numgrid_x = numgrid_x;
        td.numgrid_y = numgrid_y;
        td.spritesize_x = spritesize_x;
        td.spritesize_y = spritesize_y;
        td.imagesize_x = imagesize_x;
        td.imagesize_y = imagesize_y;
    }
    td.getCoords = function( ind ) {
        var col = ind % td.numgrid_x;
        var row = Math.floor( ind / td.numgrid_y );
        return {
            x0 : col * td.spritesize_x,
            y0 : row * td.spritesize_y,
            w : td.spritesize_x,
            h : td.spritesize_y
        };
        
    }
    return td;
}

function Prop() {
    var p = {};
    p.parent_layer = null;
    p.tex = null;
    p.loc = Vec2(0,0);
    p.scl = Vec2(16,16);
    p.index = null;
    p.onUpdate = function(p) { return true; }
    
    p.setTexture = function(t) {
        p.tex = t;
    };
    p.setIndex = function(ind) {
        p.index = ind;
    }
    p.setDeck = function(dk) {
        p.deck = dk;
        p.index = 0;
    }
    p.setLoc = function(a,b) {
        if( b != null ) {
            p.loc.x = a;
            p.loc.y = b;
        } else {
            p.loc = a;
        }
    };
    p.setScl = function(a,b) {
        if( b != null ) {
            p.scl.x = a;
            p.scl.y = b;
        } else {
            p.scl = a;
        }
    };
    p.poll = function(dt) {
        var keep = p.onUpdate.apply(p, [dt]);
        if(keep == false ) {
            print("to clean..");
        }
    }
    // 右下が+X,+Y
    p.render = function() {
        assert( p.parent_layer != null );
        
        var center_x = p.parent_moai.canvas.width/2;
        var center_y = p.parent_moai.canvas.height/2;

        var x = p.loc.x - p.parent_layer.camera.loc.x + center_x;
        var y = p.loc.y - p.parent_layer.camera.loc.y + center_y;

        if( p.deck ) {
            assert( p.deck.tex );
            var coords = p.deck.getCoords( p.index );
            p.parent_moai.ctx.drawImage( p.deck.tex.img,
                                         coords.x0, coords.y0,
                                         coords.w, coords.h,
                                         Math.floor(x - p.scl.x/2), Math.floor(y - p.scl.y/2),
                                         p.scl.x,p.scl.y
                                       );            
        } else {
            p.parent_moai.ctx.drawImage( p.tex.img,
                                         0,0,
                                         16,16,
                                         x - p.scl.x/2, y - p.scl.y/2,
                                         p.scl.x,p.scl.y
                                       );
        }
//        print("render:", p.loc.x, p.loc.y, p.scl.x, p.scl.y, center_x, center_y );
    };
    
    return p;
}

function Layer() {
    var l = {};
    l.props = [];
    l.camera = null;
    l.parent_moai = null;
    l.insertProp = function(p) {
        assert( l.parent_moai != null );
        p.parent_layer = l;
        p.parent_moai = l.parent_moai;

        l.props.push(p);
        
    };
    l.setCamera = function(cam) {
        l.camera = cam;
    }
    l.poll = function(dt) {
        for(var i=0;i<l.props.length;i++) {
            var prop = l.props[i];
            prop.poll(dt);
        }
        return l.props.length;
    };
    l.render = function() {
        for(var i=0;i<l.props.length;i++) {
            var prop = l.props[i];
            prop.render();
        }
        return l.props.length;        
    };
    return l;
}


function SoundSystem() {
    var ss = {};

    try {
        ss.ctx = new webkitAudioContext();
    } catch(e) {
        alert( "web audio api is not supported" );
    }
    //    print(ss.ctx);

    ss.newSound = function(url) {
        var snd = {};
        var req = new XMLHttpRequest();
        snd.req = req;
        
        req.open( "GET", url, true );
        req.responseType = "arraybuffer";

        req.onload = function() {
            ss.ctx.decodeAudioData( req.response, function(buffer) {
                snd.buffer = buffer;
                print("newSound onload", url );
            }, function(e){ print(e); } );
        }
        req.send();
        snd.parent = ss;

        snd.play = function(vol) {
            if( vol == null ) vol = 1;

            var source = snd.parent.ctx.createBufferSource() ;
            source.buffer = snd.buffer;
            
            var gain_node = snd.parent.ctx.createGainNode();
            source.connect(gain_node);
            gain_node.connect( snd.parent.ctx.destination);
            gain_node.gain.value = vol;

            source.noteOn(0);

            snd.source = source;
            snd.gain_node = gain_node;
            
        };
        return snd;
    };
    

    return ss;
}

//////////////

function MoaiJS() {
    var moai = {};

    moai.setCanvas = function( canvas ) {
        moai.canvas = canvas;
        moai.ctx = canvas.getContext("2d");
        moai.ctx.imageSmoothingEnabled = false;        
        moai.ctx.webkitImageSmoothingEnabled = false;
        moai.ctx.mozImageSmoothingEnabled = false;        
        
    }
    moai.setClearColor = function( c ) {
        moai.clear_color = c;
    };
    
    moai.layers = [];
    
    moai.insertLayer = function( l ) {
        l.parent_moai = moai;
        moai.layers.push(l);
    }

    moai.accum_time = 0;
    moai.poll = function( dt ) {
        moai.accum_time += dt;
        var tot=0;
        for(var i=0;i<moai.layers.length;i++) {
            var layer = moai.layers[i];
            tot+=layer.poll(dt);
        }
        return tot;
    };
    
    moai.render = function() {
        moai.ctx.fillStyle = moai.clear_color.toStyle();
        moai.ctx.fillRect(0,0,moai.canvas.width,moai.canvas.height);
        var tot=0;
        for(var i=0;i<moai.layers.length;i++) {
            var layer = moai.layers[i];
            tot+=layer.render();
        }
        return tot;
    };
    
    return moai;
}




