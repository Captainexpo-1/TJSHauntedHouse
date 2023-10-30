import * as THREE from 'three';

class Enemy{
    constructor(GEOMETRY, speed){
        this.position = new THREE.Vector3(0, 0, 0);
        this.animation = new THREE.Euler(0.01, 0.01, 0.01);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.collision_radius = 0.5;
        this.GEOMETRY = GEOMETRY;
        this.speed = speed;
        this.st = performance.now();
        this.health = 5;
    }

    move(){
        this.position = this.position.add(this.velocity.multiplyScalar(this.speed));
        this.GEOMETRY.position.copy(this.position);
    }

    update(){
        this.move();

        //animate bobbing
        const t = (performance.now()-this.st) / 2000;
        this.animation.y = Math.sin(t) / 20;
        this.position.y = this.animation.y*5;

        this.GEOMETRY.scale.set(this.health/5, this.health/5, this.health/5);

    }
    checkCollision(other_pos, other_radius){
        const distance = this.position.distanceTo(new THREE.Vector3(other_pos.x, this.position.y, other_pos.z));
        const min_distance = this.collision_radius + other_radius;
        return distance < min_distance;
    }
}


export { Enemy };