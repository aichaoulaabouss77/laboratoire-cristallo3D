// ===== INITIALISATION THREE JS =====

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(3,3,5);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

document
.getElementById("scene-container")
.appendChild(renderer.domElement);


// ===== CONTROLES SOURIS =====
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// ===== LUMIERES =====
const light1 = new THREE.DirectionalLight(0xffffff,1);
light1.position.set(5,5,5);
scene.add(light1);

scene.add(new THREE.AmbientLight(0xffffff,0.6));


// ===== MATERIAUX =====
const atomMaterial = new THREE.MeshPhongMaterial({
    color:0x2196f3
});

const centerMaterial = new THREE.MeshPhongMaterial({
    color:0xff4444
});

const bondMaterial = new THREE.MeshPhongMaterial({
    color:0x888888
});


// ===== FONCTIONS =====

function createAtom(x,y,z,center=false){
    const geo = new THREE.SphereGeometry(0.15,32,32);
    const mat = center ? centerMaterial : atomMaterial;

    const atom = new THREE.Mesh(geo,mat);
    atom.position.set(x,y,z);
    scene.add(atom);

    return atom;
}

function createBond(a,b){

    const direction = new THREE.Vector3().subVectors(b,a);
    const length = direction.length();

    const geo = new THREE.CylinderGeometry(0.05,0.05,length,16);
    const bond = new THREE.Mesh(geo,bondMaterial);

    const midpoint = new THREE.Vector3().addVectors(a,b).multiplyScalar(0.5);
    bond.position.copy(midpoint);

    bond.lookAt(b);
    bond.rotateX(Math.PI/2);

    scene.add(bond);
}


// ===== TYPE DE STRUCTURE =====
const type = document.body.dataset.structure;


// ===== POSITIONS SOMMETS =====
const corners = [
[-1,-1,-1],
[1,-1,-1],
[1,1,-1],
[-1,1,-1],
[-1,-1,1],
[1,-1,1],
[1,1,1],
[-1,1,1]
];

let atoms=[];

corners.forEach(p=>{
    atoms.push(createAtom(p[0],p[1],p[2]));
});


// ===== BCC =====
if(type==="bcc"){
    const center=createAtom(0,0,0,true);

    atoms.forEach(a=>{
        createBond(a.position,center.position);
    });
}


// ===== FCC =====
if(type==="fcc"){

    const faces=[
        [0,0,1],[0,0,-1],
        [0,1,0],[0,-1,0],
        [1,0,0],[-1,0,0]
    ];

    faces.forEach(p=>{
        createAtom(p[0],p[1],p[2],true);
    });
}


// ===== ARÊTES DU CUBE =====
const edges=[
[0,1],[1,2],[2,3],[3,0],
[4,5],[5,6],[6,7],[7,4],
[0,4],[1,5],[2,6],[3,7]
];

edges.forEach(e=>{
    createBond(
        new THREE.Vector3(...corners[e[0]]),
        new THREE.Vector3(...corners[e[1]])
    );
});


// ===== ANIMATION =====
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
}
animate();


// ===== RESIZE =====
window.addEventListener("resize",()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});
