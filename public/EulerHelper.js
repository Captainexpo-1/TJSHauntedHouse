import * as THREE from 'three';

function rotateEulerAlongVector(initialEuler, rotationAxis, angle) {
    // Convert the initial Euler angle to a Quaternion
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(initialEuler);

    // Create a Quaternion representing the desired rotation along the axis
    const rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromAxisAngle(rotationAxis, angle);

    // Combine the two rotations using multiplyQuaternions
    quaternionRotation.multiply(rotationQuaternion);

    // Convert the resulting Quaternion back to Euler angles
    const rotatedEuler = new THREE.Euler().setFromQuaternion(quaternionRotation, initialEuler.order);

    
    return rotatedEuler;
}

const initialEuler = new THREE.Euler(0, 0, 0, 'XYZ'); // Replace with your initial Euler angles
const rotationAxis = new THREE.Vector3(0, 1, 0); // Replace with your desired rotation axis
const angle = Math.PI / 4; // Replace with your desired angle in radians

const rotatedEuler = rotateEulerAlongVector(initialEuler, rotationAxis, angle);
console.log(rotatedEuler); // This will be your Euler angle after the rotation

export { rotateEulerAlongVector };