import * as THREE from 'three';

class Bullet{
    constructor(GEOMETRY, speed, velocity){
        this.velocity = velocity;
        this.position = GEOMETRY.position;
        this.speed = speed;
        this.GEOMETRY = GEOMETRY;
        this.st = performance.now();
        this.collision_radius = 0.1
    }
    Move(){
        const v = new THREE.Vector3(
            this.velocity.x * this.speed, 
            this.velocity.y * this.speed, 
            this.velocity.z * this.speed
        );

        this.position.add(v);
        this.GEOMETRY.position.clone(this.position)
    }
    update(){
        this.Move();
    }
}

export { Bullet };