import * as THREE from 'three';

class Player {
    constructor() {
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = 3;
        this.drag = 0.9;
        this.left = new THREE.Vector3(1, 0, 0);
        this.collision_radius = 0.5;
        this.forward = new THREE.Vector3(0, 0, 1);
    }

    Move() {
        // Move forward/backward in relation to rotation
        const x = Math.sin(this.rotation.y) * this.velocity.z;
        const z = Math.cos(this.rotation.y) * this.velocity.z;

        //relative forward vector
        this.forward = new THREE.Vector3(-Math.sin(this.rotation.y), 0, -Math.cos(this.rotation.y));

        //get relative left of player
        const xLeft = Math.sin(this.rotation.y - Math.PI / 2) * this.velocity.x;
        const zLeft = Math.cos(this.rotation.y - Math.PI / 2) * this.velocity.x;

        //relative left vector
        this.left = new THREE.Vector3(xLeft, 0, zLeft);

        this.position.x += (x - xLeft) * this.speed
        this.position.z += (z - zLeft) * this.speed
    }

    Update() {
        this.Move();
        this.velocity.multiplyScalar(this.drag);
    }

    // Functions to handle key input
    MoveForward() {
        this.velocity.z = -this.speed;
    }

    MoveBackward() {
        this.velocity.z = this.speed;
    }

    StrafeLeft() {
        this.velocity.x = -this.speed;
    }

    StrafeRight() {
        this.velocity.x = this.speed;
    }

    Stop() {
        this.velocity.set(0, 0, 0);
    }
}



export { Player };