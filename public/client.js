import * as THREE from 'three'
import * as PLAYER from './player.js'
import * as ENEMY from './enemy.js'
import * as BULLET from './bullet.js'

var scene = new THREE.Scene();

//------- ENEMY SETUP -------


let enemies = [];
let bullets = [];
function spawnEnemy() {
    let radius = 0.5;
    let geometry = new THREE.SphereGeometry(radius);
    let material = new THREE.MeshPhongMaterial({ color: new THREE.Color("rgb(255,0,0)") });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const enemy = new ENEMY.Enemy(cube, 0.01);
    enemy.position.set(Math.random()*20-10, 0, Math.random()*20-10);
    enemy.collision_radius = radius
    enemies.push(enemy);
}

function getDirToPlayer(position, ppos){
    const dir = ppos.clone().sub(position);
    return dir.normalize();
}
function updateEnemies() {
    for (const enemy of enemies) {
        enemy.velocity = getDirToPlayer(enemy.position, player.position);
        enemy.update();
        for(const bullet of bullets){
            if(enemy.checkCollision(bullet.position, bullet.collision_radius)){
                if(enemy.health <= 0){
                    destroyEnemy(enemy);
                }else{
                    enemy.health--;
                }

                bullet.GEOMETRY.geometry.dispose();
                bullet.GEOMETRY.material.dispose();
                scene.remove(bullet.GEOMETRY);
                bullets.splice(bullets.indexOf(bullet), 1);
            }
        }
    }
}
function destroyEnemy(enemy){
    enemy.GEOMETRY.geometry.dispose();
    enemy.GEOMETRY.material.dispose();
    scene.remove(enemy.GEOMETRY);
    enemies.splice(enemies.indexOf(enemy), 1);
}
spawnEnemy()

// ------- RENDERER -------

const player = new PLAYER.Player();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), new THREE.MeshBasicMaterial({ color: 0x999999 }));
floor.position.y = -5;
floor.rotation.x = -Math.PI / 2
scene.add(floor);

var al = new THREE.AmbientLight(0xffffff, 1);
scene.add(al);
var dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(0, 1, 0);
scene.add(dl);

camera.position.z = 5;



// ------- GAME LOOP ------
let TIME = 0;
let se = false
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    handleKeyEvents();

    //PLAYER STUFF
    player.Update();
    camera.position.copy(player.position);
    camera.rotation.copy(player.rotation);

    TIME = performance.now();

    if (TIME % 3000 < 50 && se == false) {
        spawnEnemy();
        se = true
    }
    else{
        se = false
    }
    if(keyStates.MOUSE){
        Shoot();
    }

    updateEnemies()
    updateBullets()
}


// ------- INPUT ------
// Set up keyboard controls


const keyStates = {
    W: false,
    S: false,
    A: false,
    D: false,
    MOUSE: false
};

document.addEventListener('mousedown', (event) => {
    keyStates.MOUSE = true;
})
document.addEventListener('mouseup', (event) => {
    keyStates.MOUSE = false;
})
const moveSpeed = 0.05;

function handleKeyEvents() {
    if (keyStates.W) {
        player.velocity.z = -moveSpeed;
    }
    if (keyStates.S) {
        player.velocity.z = moveSpeed;
    }
    if (keyStates.A) {
        player.velocity.x = -moveSpeed;
    }
    if (keyStates.D) {
        player.velocity.x = moveSpeed;
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase();
    if (key in keyStates) {
        keyStates[key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toUpperCase();
    if (key in keyStates) {
        keyStates[key] = false;
    }
});


//MOUSE CAMERA LOOK
const mouseLook = {
    enabled: true,
    sensitivity: 0.005,
    pitch: 0,
    yaw: 0
};

function lockMouse() {
    if (!mouseLook.enabled) {
        renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock || renderer.domElement.webkitRequestPointerLock;
        renderer.domElement.requestPointerLock();
    }
}

function onMouseMove(event) {
    if (mouseLook.enabled) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        // Adjust the sensitivity as needed
        const sensitivity = 0.01;

        mouseLook.yaw -= movementX * sensitivity;
        mouseLook.pitch -= movementY * sensitivity;

        // Limit the pitch to avoid flipping
        const pitchRange = Math.PI / 2;
        mouseLook.pitch = Math.max(-pitchRange, Math.min(pitchRange, mouseLook.pitch));

        // Rotate the player relative to it's current rotation
        player.rotation.set(0, mouseLook.yaw, 0);
    }
}

let lastShot = 0;
function Shoot(){
    if(performance.now() - lastShot < 200) return;
    const geometry = new THREE.SphereGeometry(0.05);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color("rgb(0,255,0)") });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphere.position.copy(player.position);
    sphere.position.y -= 0.2
    
    const bullet = new BULLET.Bullet(sphere, 0.8, player.forward);

    bullets.push(bullet);
    lastShot = performance.now();
}
function updateBullets(){
    for(const bullet of bullets){
        bullet.update();

        if(performance.now() - bullet.st > 2000 ){
            bullet.GEOMETRY.geometry.dispose();
            bullet.GEOMETRY.material.dispose();
            scene.remove(bullet.GEOMETRY);
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    }
}


document.addEventListener('mousemove', onMouseMove, false);


/*  TODO:
    

    1. Input Collection 15m DONE
    2. Movement/first person stuff 30m DONE
    3. Collision 120m MUST DOOOOO
    4. Enemies 200m DONE
    5. Shooting 120m DONE
    6. Other Stuff/Polish 

    445m / 60 = 7.4h 
*/


//------- BOILERPLATE ----------

window.addEventListener(
    'resize',
    function () {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    },
    false   
)
render();