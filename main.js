import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 200);
pointLight.position.set(5, 5, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
ambientLight.position.set(10, 0, 10);
scene.add(ambientLight);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.setZ(30);

// Clock Model Variables
let clockModel, hour_hand, minute_hand, second_hand;

// GLTF Loader
const loader = new GLTFLoader();

const clockGroup = new THREE.Group();
loader.load('/resources/clock.glb', function (gltf) {
    clockModel = gltf.scene;
    hour_hand = clockModel.getObjectByName('hour_hand');
    minute_hand = clockModel.getObjectByName('minute_hand');
    second_hand = clockModel.getObjectByName('second_hand');

    // Calculate the center and add the model to the group
    const box = new THREE.Box3().setFromObject(clockModel);
    const center = box.getCenter(new THREE.Vector3());
    clockModel.position.sub(center);
    clockGroup.add(clockModel);


    scene.add(clockGroup);
}, undefined, function (error) {
    console.error(error);
});

// Window Resize Event Listener
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Control Elements
let rotationSliderX, rotationSliderY, rotationSliderZ, backgroundColorSlider, clockRotationSlider;
document.addEventListener('DOMContentLoaded', function() {
    rotationSliderX = document.getElementById('rotationSpeedX');
    rotationSliderY = document.getElementById('rotationSpeedY');
    rotationSliderZ = document.getElementById('rotationSpeedZ');
    backgroundColorSlider = document.getElementById('backgroundColor');
    clockRotationSlider = document.getElementById('clockRotationSpeed');

    // Display Elements
    const rotationSliderXValue = document.getElementById('rotationSpeedXValue');
    const rotationSliderYValue = document.getElementById('rotationSpeedYValue');
    const rotationSliderZValue = document.getElementById('rotationSpeedZValue');
    const backgroundColorSliderValue = document.getElementById('backgroundColorValue');
    const clockRotationSliderValue = document.getElementById('clockRotationSpeedValue');

    // Event Listeners for Sliders
    rotationSliderX.oninput = () => rotationSliderYValue.textContent = rotationSliderX.value;
    rotationSliderY.oninput = () => rotationSliderYValue.textContent = rotationSliderY.value;
    rotationSliderZ.oninput = () => rotationSliderYValue.textContent = rotationSliderZ.value;
    backgroundColorSlider.oninput = () => {
        backgroundColorSliderValue.textContent = backgroundColorSlider.value.toUpperCase();
        renderer.setClearColor(backgroundColorSlider.value, 1);
    };
    clockRotationSlider.oninput = () => clockRotationSliderValue.textContent = clockRotationSlider.value;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (clockModel) {
        const rotationSpeedX = rotationSliderX.value / 100;
        const rotationSpeedY = rotationSliderY.value / 100;
        const rotationSpeedZ = rotationSliderZ.value / 100;
        const clockRotationSpeed = clockRotationSlider.value / 100;
        clockModel.rotation.x += 0.01 * rotationSpeedX;
        clockModel.rotation.y += 0.01 * rotationSpeedY;
        clockModel.rotation.z += 0.01 * rotationSpeedZ;
        hour_hand.rotation.y += 0.000002777777778 * clockRotationSpeed;
        minute_hand.rotation.y += 0.000166666666667 * clockRotationSpeed;
        second_hand.rotation.y += 0.01 * clockRotationSpeed;
    }

    renderer.render(scene, camera);
}

animate();
