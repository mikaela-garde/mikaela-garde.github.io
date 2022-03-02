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
	camera.position.set( 0.5, 2, 5 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );

    //Camera control
    cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControl.target.set(0,0,0);
    cameraControl.noZoom = true;

}

function loadScene() {
    conjunto = new THREE.Object3D();
	conjunto.position.y = 1;

    //The ground
    var geoGround = new THREE.PlaneGeometry(10,10,12,12);
	var matGround = new THREE.MeshBasicMaterial( {color:'green', wireframe: false} );
	var ground = new THREE.Mesh(geoGround, matGround);
	ground.rotation.x = -Math.PI/2;
	ground.position.y = -0.01;
    scene.add(ground);

    //The road
    var geoRoad = new THREE.PlaneGeometry(2,10,12,12);
	var matRoad = new THREE.MeshBasicMaterial( {color:'grey', wireframe: false} );
	var road = new THREE.Mesh(geoRoad, matRoad);
	road.rotation.x = -Math.PI/2;
	road.position.y = 0;
    scene.add(road);

    const geometry = new THREE.CylinderGeometry( 0.3, 0.3, 5, 30);
    const material = new THREE.MeshBasicMaterial( {color: 'brown'} );
    const cylinder = new THREE.Mesh( geometry, material );
    road.position.x = 0;
    scene.add( cylinder );

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
