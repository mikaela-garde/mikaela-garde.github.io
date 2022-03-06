// Variables globales estandar
var renderer, scene, camera;

// Otras variables
var angulo =0 ;
var antes = Date.now();
var esfera;
var conjunto;

//Controlers
var cameraControl;

init();
loadScene();
setupGUI();
render();

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0xffffff) );
	document.getElementById('container').appendChild(renderer.domElement);

    //Scen
    scene = new THREE.Scene();

    //Camera
	var aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );
	camera.position.set( 3, 15, 15 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );

    //Camera control
    cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControl.target.set(0,0,0);
    cameraControl.noZoom = true;

	//Luces
    var ambiental = new THREE.AmbientLight(0x222222);
    scene.add(ambiental);

    var direccional = new THREE.DirectionalLight(0xffffff, 0.7);
    direccional.position.set(0,1,0);
    scene.add(direccional);

}

function loadScene() {
    conjunto = new THREE.Object3D();

    //The ground
    var geoGround = new THREE.PlaneGeometry(30,30,12,12);
	var matGround = new THREE.MeshLambertMaterial( {color:0x30ff67, wireframe: false} );
	var ground = new THREE.Mesh(geoGround, matGround);
	ground.rotation.x = -Math.PI/2;
	ground.position.y = -0.01;
    conjunto.add(ground);

    //The road
    var geoRoad = new THREE.PlaneGeometry(2,10,12,12);
	var matRoad = new THREE.MeshLambertMaterial( {color:0xcccccc, wireframe: false} );
	var road = new THREE.Mesh(geoRoad, matRoad);
	road.rotation.x = -Math.PI/2;
	road.position.x = 3;
    scene.add(road);

    const geometry = new THREE.CylinderGeometry( 0.2, 0.2, 1, 15);
    const material = new THREE.MeshLambertMaterial( {color: 'brown'} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position. y= 3;
	cylinder.position.x = -5;
	cylinder.position.z = 0;
    scene.add( cylinder );

	// Esfera
	var geoEsfera = new THREE.SphereGeometry( 5, 30, 30 );
	var materialSphere = new THREE.MeshLambertMaterial( {color:0x30ff67, wireframe: false} );
	esfera = new THREE.Mesh( geoEsfera, materialSphere );
	esfera.position.x = -5;
	esfera.position.z = -2;
	ground.add(esfera);

	scene.add(conjunto);
	scene.add( new THREE.AxesHelper(3) );

	//Icecream
	var test = new THREE.Object3D();
	var loader = new THREE.GLTFLoader();
	loader.load("models/icecream1/scene.gltf", 
				function (objeto){
					test.add(objeto);
				 });
	scene.add(test);

}

function setupGUI() {

}

function update() {

}

function render() {
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}
