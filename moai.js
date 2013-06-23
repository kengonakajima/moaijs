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
            print("img onload:", url);
        }
        t.img.src = url;
    };
    return t;
}
function Prop() {
    var p = {};
    p.parent_layer = null;
    p.tex = null;
    p.loc = Vec2(0,0);
    p.scl = Vec2(16,16);
    p.onUpdate = function(p) {}
    
    p.setTexture = function(t) {
        p.tex = t;
    };
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
        p.onUpdate(dt);
    }
    // 右下が+X,+Y
    p.render = function() {
        assert( p.parent_layer != null );
        
        var center_x = p.parent_moai.canvas.width/2;
        var center_y = p.parent_moai.canvas.height/2;

        var x = p.loc.x - p.parent_layer.camera.loc.x + center_x;
        var y = p.loc.y - p.parent_layer.camera.loc.y + center_y;

        p.parent_moai.ctx.drawImage( p.tex.img,
                                     0,0,
                                     16,16,
                                     x,y,
                                     p.scl.x,p.scl.y
                                   );
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
    };
    l.render = function() {
        for(var i=0;i<l.props.length;i++) {
            var prop = l.props[i];
            prop.render();
        }
    };
    return l;
}


function MoaiJS() {
    var moai = {};

    moai.setCanvas = function( canvas ) {
        moai.canvas = canvas;
        moai.ctx = canvas.getContext("2d");         
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
        for(var i=0;i<moai.layers.length;i++) {
            var layer = moai.layers[i];
            layer.poll(dt);
        }
    };
    
    moai.render = function() {
        moai.ctx.fillStyle = moai.clear_color.toStyle();
        moai.ctx.fillRect(0,0,moai.canvas.width,moai.canvas.height);
        for(var i=0;i<moai.layers.length;i++) {
            var layer = moai.layers[i];
            layer.render();
        }
    };
    
    return moai;
}




