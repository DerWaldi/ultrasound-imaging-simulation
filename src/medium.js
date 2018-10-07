
function sqr(x) { 
    return x * x 
}

function dist2(v, w) { 
    return sqr(v.x - w.x) + sqr(v.y - w.y) 
}

function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    
    if (l2 == 0) return dist2(p, v);
    
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    
    if (t < 0) return dist2(p, v);
    if (t > 1) return dist2(p, w);
    
    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}

class Medium {
    constructor(c, Z, vertices, color) {
        this.c = c;
        this.Z = Z;
        this.vertices = vertices;
        this.color = color;
    }
    checkCollision(px, py) {
        var hasCollision = false;
    
        // go through each of the vertices, plus
        // the next vertex in the list
        var next = 0;
        var nearestSide;
        var nearestDist = 10000;
        for (var current=0; current<this.vertices.length; current++) {
    
            // get next vertex in list
            // if we've hit the end, wrap around to 0
            next = current+1;
            if (next == this.vertices.length) next = 0;
        
            // get the PVectors at our current position
            // this makes our if statement a little cleaner
            var vc = this.vertices[current];    // c for "current"
            var vn = this.vertices[next];       // n for "next"
        
            // compare position, flip 'collision' variable
            // back and forth
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
                hasCollision = !hasCollision;
            
                var curDist = distToSegmentSquared(createVector(px,py), vc, vn);
                if(curDist < nearestDist) {
                    nearestDist = curDist;
                    nearestSide = {
                        start: vn.copy(),
                        stop: vc.copy(),
                        tangente: p5.Vector.sub(vn, vc)
                    };
                }
            }
        }
        return {hasCollision: hasCollision, nearestSide:nearestSide};
    }
}