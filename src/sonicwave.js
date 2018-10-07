class SonicWave {
    constructor(x,y) {
        this.pos = createVector(x,y);
        this.vel = createVector(1,0);
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
    show() {
        stroke(0, 255 * this.magn);
        strokeWeight(1);
        // draw wave form
        var lastP = createVector(this.pos.x / scl, (this.pos.y + 0.3*Math.sin((this.t) * 2 * Math.PI * this.freq * wscl)) / scl);
        for (var i = 0; i < this.duration; i += 0.1) {
            if(i > 0) {
                var newP = createVector((this.pos.x - i) / scl, (this.pos.y + 0.3*Math.sin((this.t - Math.sign(this.vel.x) * i / 100) * 2 * Math.PI * this.freq * wscl)) / scl);
                line(newP.x, newP.y, lastP.x, lastP.y)
                lastP = newP;
            }
        }
    }
}