/// <reference path="./libs/p5.d.ts" />

const scl = 0.1; // meters per point
const tscl = 0.05; // time scale factor
const wscl = 0.3; // wavelength scale factor

var air;
var water;
var world = [];
var sonicWaveParticles = [];
var transducer;

function setup() {
    createCanvas(500,500);
    
    air = new Medium(330, // m/s
        403, // Ns/m^3
        [
            createVector(0,0), 
            createVector(50,0), 
            createVector(50,50), 
            createVector(0,50)
        ],
        "#ffffff"
    );
    world.push(air);

    water = new Medium(1500, // m/s
        1.502e6, // Ns/m^3
        [
            createVector(20,25), 
            createVector(24,22), 
            createVector(30,24), 
            createVector(28,31),
            createVector(25,32),
            createVector(20,30)
        ],
        "#88AAFF"
    );
    world.push(water);

    transducer = new SonicTransducer(1,27);
}

function angleBetween(vectorA, vectorB) {
    var dot = vectorA.dot(vectorB);
    var lengthA = vectorA.length();
    var lengthB = vectorB.length();
    return Math.acos( dot / (lengthA * lengthB) );
}

function draw() {
    background(51);
    
    noStroke();
    for(var j = 0; j < world.length; j++) {
        var vertices = world[j].vertices;
        fill(color(world[j].color));
        beginShape();
        for (var i = 0; i < vertices.length; i++) {
            var v = vertices[i];
            vertex(v.x / scl, v.y / scl);
        }
        endShape();
    }

    transducer.update(0.01 * tscl);
    transducer.show();
    
    sonicWaveParticles.forEach((sonicWaveParticle) => {
        sonicWaveParticle.update(0.01 * tscl);
        var collisionMedium;
        var lastCollision;
        world.forEach((medium) => {
            //if(medium != sonicWaveParticle.medium) {
                var collision = medium.checkCollision(sonicWaveParticle.pos.x, sonicWaveParticle.pos.y)
                if(collision.hasCollision) {
                    collisionMedium = medium;
                    lastCollision = collision;
                }
            //}
        });

        if(collisionMedium && collisionMedium != sonicWaveParticle.medium) {
            strokeWeight(4);
            stroke(255,0,0);
            line(lastCollision.nearestSide.start.x / scl, lastCollision.nearestSide.start.y / scl, lastCollision.nearestSide.stop.x / scl, lastCollision.nearestSide.stop.y / scl);
            var transmissionsfaktor = 2*collisionMedium.Z / (sonicWaveParticle.medium.Z + collisionMedium.Z);
            var reflexionsfaktor = (sonicWaveParticle.medium.Z - collisionMedium.Z) / (sonicWaveParticle.medium.Z + collisionMedium.Z);
            
            var transmittingWave = new SonicWave(sonicWaveParticle.pos.x, sonicWaveParticle.pos.y);
            transmittingWave.magn = sonicWaveParticle.magn;
            transmittingWave.vel = sonicWaveParticle.vel.copy();
            transmittingWave.medium = collisionMedium;
            transmittingWave.vel.setMag(collisionMedium.c);
            sonicWaveParticles.push(transmittingWave);
            
            sonicWaveParticle.vel.mult(-1);
            sonicWaveParticle.magn = 0.5 * sonicWaveParticle.magn;
        }
        
        sonicWaveParticle.show();
    });
    
    noStroke();
    fill(0);

    var transmissionsfaktor = 2*water.Z / (air.Z + water.Z);
    text("transmissionsfaktor: " + transmissionsfaktor, 20, 35);
    
    var reflexionsfaktor = (air.Z - water.Z) / (air.Z + water.Z);
    text("reflexionsfaktor: " + reflexionsfaktor, 20, 70);
}