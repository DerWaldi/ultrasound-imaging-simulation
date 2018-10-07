class SonicWave {
    constructor(x,y) {
        this.pos = createVector(x,y);
        this.vel = createVector(1,0.1);
        this.freq = 1000;
        this.magn = 1;
        this.medium =  air;
        this.vel.setMag(this.medium.c);
        this.t = 0;
        this.duration = 2;
    }
    update(dt) {
        this.pos.add(this.vel.x * dt, this.vel.y * dt); 
        this.t += dt;
        // remove wave from simulation if to low energy
        if(this.magn < 0.01) {
            arrRemove(sonicWaveParticles, this);
        }
    }

    getDirection() {
        return this.vel.copy().normalize();
    }

    getNormal() {
        return this.vel.copy().normalize().rotate(HALF_PI);
    }

    getWaveOffsetVec(i) {
        var waveDir = this.getDirection();
        var waveNormalVec = this.getNormal();
        return p5.Vector.add(p5.Vector.mult(waveDir, i), p5.Vector.mult(waveNormalVec, 0.3*Math.sin((this.t - i / 100) * 2 * Math.PI * this.freq * wscl)));
    }
    show() {
        stroke(0, 255 * this.magn);
        strokeWeight(1);
        // draw wave form
        var lastP = p5.Vector.div(p5.Vector.add(this.pos, this.getWaveOffsetVec(0)), scl);
        for (var i = 0; i < this.duration; i += 0.1) {
            if(i > 0) {
                var newP = p5.Vector.div(p5.Vector.add(this.pos, this.getWaveOffsetVec(i)), scl);
                line(newP.x, newP.y, lastP.x, lastP.y)
                lastP = newP;
            }
        }
    }
}