class SonicTransducer {
    constructor(x,y) {
        this.pos = createVector(x,y);
        this.freq = 1000;
        this.magn = 1;
        this.t = 0;
        this.d_wait = 2;
        this.d_send = 2;
        this.d_receive = 2;
        this.state = "wait";
    }
    update(dt) {
        this.t += dt;
        if(this.state == "wait") {
            if(this.t > this.d_wait * tscl) {
                this.state = "send";
                console.log("[transducer] send");
                var sonicWave = new SonicWave(this.pos.x,this.pos.y);
                sonicWave.freq = this.freq;
                sonicWave.duration = this.d_send;
                sonicWaveParticles.push(sonicWave);
                this.t = 0;
            }
        } else if(this.state == "send") {
            if(this.t > this.d_send * tscl) {
                this.state = "receive";
                console.log("[transducer] receive")
                this.t = 0;
            }
        } else if(this.state == "receive") {
            if(this.t > this.d_receive * tscl) {
                this.state = "wait";
                console.log("[transducer] wait")
                this.t = 0;
            }
        }
    }
    show() {
        stroke(0,255);
        strokeWeight(1);
        fill(0,0);
        triangle((this.pos.x-1) / scl, (this.pos.y + 1) / scl, (this.pos.x + 0) / scl, (this.pos.y + 0) / scl, (this.pos.x -1) / scl, (this.pos.y - 1) / scl);
    }
}