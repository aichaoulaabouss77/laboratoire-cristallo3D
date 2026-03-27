let scene, camera, renderer, group, controls;

// INITIALISATION
function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4,4,4);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    document.getElementById("container").appendChild(renderer.domElement);

    // CONTROLES SOURIS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.enableZoom = true;
    controls.minDistance = 2;
    controls.maxDistance = 15;

    controls.target.set(0,0,0);

    // LUMIÈRE
    scene.add(new THREE.AmbientLight(0xaaaaaa));

    let light = new THREE.PointLight(0xffffff,1);
    light.position.set(10,10,10);
    scene.add(light);

    // AXES
    scene.add(new THREE.AxesHelper(3));

    group = new THREE.Group();
    scene.add(group);

    animate();
}

// ANIMATION
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// ATOME
function atom(x,y,z,color=0xff0000,size=0.2){
    let m = new THREE.Mesh(
        new THREE.SphereGeometry(size,32,32),
        new THREE.MeshPhongMaterial({color})
    );
    m.position.set(x,y,z);
    group.add(m);
}

// LIAISON
function bond(a,b){
    let geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...a),
        new THREE.Vector3(...b)
    ]);
    let line = new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x000000}));
    group.add(line);
}

// CUBE
function cube(){
    let e=[
        [[-1,-1,-1],[1,-1,-1]], [[-1,1,-1],[1,1,-1]],
        [[-1,-1,1],[1,-1,1]], [[-1,1,1],[1,1,1]],
        [[-1,-1,-1],[-1,1,-1]], [[1,-1,-1],[1,1,-1]],
        [[-1,-1,1],[-1,1,1]], [[1,-1,1],[1,1,1]],
        [[-1,-1,-1],[-1,-1,1]], [[1,-1,-1],[1,-1,1]],
        [[-1,1,-1],[-1,1,1]], [[1,1,-1],[1,1,1]]
    ];
    e.forEach(x=>bond(x[0],x[1]));
}

// CHARGEMENT STRUCTURE
function loadStructure(type){

    group.clear();
    cube();

    let corners=[
        [-1,-1,-1],[1,-1,-1],[-1,1,-1],[1,1,-1],
        [-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]
    ];

    corners.forEach(p=>atom(...p));

    if(type==="SC"){
        document.getElementById("info").innerHTML =
        "Cubique simple<br>Z=1 | Coordination=6 | Compacité≈0.52";
    }

    if(type==="BCC"){
        atom(0,0,0);
        corners.forEach(p=>bond([0,0,0],p));

        document.getElementById("info").innerHTML =
        "Cubique centré<br>Z=2 | Coordination=8 | Compacité≈0.68";
    }

    if(type==="FCC"){
        let faces=[
            [0,0,-1],[0,0,1],[0,-1,0],[0,1,0],[-1,0,0],[1,0,0]
        ];
        faces.forEach(p=>atom(...p));

        // SITES
        atom(0,0,0,0x0000ff,0.15); // octa
        [[0.5,0.5,0.5],[-0.5,-0.5,0.5],[0.5,-0.5,-0.5],[-0.5,0.5,-0.5]]
        .forEach(p=>atom(...p,0x00ff00,0.15));

        document.getElementById("info").innerHTML =
        `Faces centrées<br>
        Z=4 | Coordination=12 | Compacité≈0.74<br><br>
        🔴 Atomes<br>
        🔵 Sites octaédriques<br>
        🟢 Sites tétraédriques`;
    }

    // recentrage
    controls.target.set(0,0,0);
    camera.position.set(4,4,4);
}

// LANCER AU DÉMARRAGE
init();