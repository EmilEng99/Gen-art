const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubes = [];
const numbCubes = 1000;
const cubeSize = 0.5;
const cubeEdgesMaterial = new THREE.LineBasicMaterial( {
    color: 0x000000 } );
for (let i = 0; i < numbCubes; i++) {
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff, 
        transparent: true,
        opacity: 0.7
    });

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = (Math.random() - 0.5) * 50;
    cube.position.y = (Math.random() - 0.5) * 50;
    cube.position.z = (Math.random() - 0.5) * 50;
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;
    cube.rotation.z = Math.random() * Math.PI;

    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const line = new THREE.LineSegments(edges, cubeEdgesMaterial);

    cube.add(line);
    cubes.push(cube);
    scene.add(cube);
    
}

const radiusSlider = document.getElementById("radiusSlider");
const radiusValue = document.getElementById("radiusValue");

function animate(){

    requestAnimationFrame( animate );

    cubes.forEach(cube => {
        cube.rotation.x += Math.random() * 0.005;
        cube.rotation.y += Math.random() * 0.005;
        cube.rotation.z += Math.random() * 0.005;
    });

     const time = Date.now() * 0.0001; // Minska värdet för att göra rotationen långsammare
     const radius = parseFloat(radiusSlider.value); // Avstånd från centrum
     radiusValue.innerText = radius;

     camera.position.x = Math.sin(time) * radius;
     camera.position.z = Math.cos(time) * radius;
     camera.position.y = 5; // Justera höjden om du vill
 
     camera.lookAt(new THREE.Vector3(0, 0, 0)); // Fokusera på scenens mitt
    
    renderer.render(scene, camera);
}   

animate();