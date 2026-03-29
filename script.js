// ===== SCENE =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document
  .getElementById("scene-container")
  .appendChild(renderer.domElement);

// ===== CUBE =====
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({
    wireframe: false
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// ===== LIGHT =====
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5);
scene.add(light);

// ===== ROTATION CONTROL =====
let rotating = true;
let speed = 0.02;

function startRotation() {
    rotating = true;
}

function stopRotation() {
    rotating = false;
}

function changeSpeed(value) {
    speed = parseFloat(value);
}

// rendre les fonctions accessibles aux boutons HTML
window.startRotation = startRotation;
window.stopRotation = stopRotation;
window.changeSpeed = changeSpeed;

// ===== ANIMATION =====
function animate() {
    requestAnimationFrame(animate);

    if (rotating) {
        cube.rotation.x += speed;
        cube.rotation.y += speed;
    }

    renderer.render(scene, camera);
}

animate();

// ===== RESPONSIVE =====
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
