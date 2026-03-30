<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Cubique Centré (BCC)</title>

<style>
body{margin:0;text-align:center;background:#f2f2f2;}
#scene-container{width:100vw;height:90vh;}
</style>
</head>

<body>

<h2>Structure Cubique Centrée (BCC)</h2>

<div id="scene-container"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128/examples/js/controls/OrbitControls.js"></script>

<script>

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xffffff);

const camera=new THREE.PerspectiveCamera(
75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(4,4,6);

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.getElementById("scene-container")
.appendChild(renderer.domElement);

const controls=new THREE.OrbitControls(camera,renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff,0.7));

const light=new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,5,5);
scene.add(light);

const cornerMat=new THREE.MeshPhongMaterial({color:0x2196f3});
const centerMat=new THREE.MeshPhongMaterial({color:0xff0000});

function atom(x,y,z,center=false){
const geo=new THREE.SphereGeometry(0.2,32,32);
const mesh=new THREE.Mesh(geo,center?centerMat:cornerMat);
mesh.position.set(x,y,z);
scene.add(mesh);
return mesh;
}

const corners=[
[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];

corners.forEach(p=>atom(...p));

atom(0,0,0,true);

function animate(){
requestAnimationFrame(animate);
controls.update();
renderer.render(scene,camera);
}
animate();

</script>

</body>
</html>
