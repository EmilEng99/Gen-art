import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { MeshLine, MeshLineGeometry, MeshLineMaterial } from "./MeshLine/index.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const texLoader = new THREE.TextureLoader();
const points = [];
const numPoints = 300;
for (let j = 0; j < numPoints; j += 1) {
    let x = -7.5 + j * 0.05;
    let y = Math.sin(j * 0.075);
    points.push(x, y, 0);
}
const geometry = new MeshLineGeometry();
geometry.setPoints(points);

const material = new MeshLineMaterial({
    color: 0x4499ff, 
    map: texLoader.load("./assets/strokes/stroke-02.png"),
    useMap: true,
    alphaTest: 0.5,
    transparent: true,
    resolution: new THREE.Vector2(w, h),
    lineWidth: 0.5,
});

const meshLine = new MeshLine(geometry, material);
scene.add(meshLine);

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

animate();