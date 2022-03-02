/*
** Seminario #2: Animacion e Interaccion 
** @author: rvivo@upv.es
** @date: 24-02-2021
** @dependencies: OrbitControls.js, Tween.js, dat.gui.min.js
*/

// Variables globales estandar
var renderer, scene, camera;

// Objetos
var esfera, conjunto, cubo;

// Control
var cameraControls, effectControls;

// Temporales
var angulo = 0;
var antes = Date.now();

// Acciones
init();
loadScene();
setupGUI();
render();

function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0x000033) );
	document.getElementById('container').appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100 );	// Perspectiva
	//camera = new THREE.OrthographicCamera( -10,10, 10/aspectRatio, -10/aspectRatio, 0.1, 100); //Ortografica
	camera.position.set( 0.5, 7, 5 );
	camera.lookAt( new THREE.Vector3( 0,0,0 ) );

	// Control de camara
	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.target.set( 0, 0, 0 );
	cameraControls.noZoom = false;

    //Luces
    var ambiental = new THREE.AmbientLight(0x222222);
    scene.add(ambiental);

    var direccional = new THREE.DirectionalLight(0xffffff, 0.3);
    direccional.position.set(0,1,0);
    scene.add(direccional);

    var puntal = new THREE.PointLight(0xffffff, 0.2);
    puntal.position.set(2,7,-4);
    scene.add(puntal);

    var focal = new THREE.SpotLight(0xffffff, 0.3);
    focal.position.set(-2,7,4);
    focal.target.position.set(0,0,0);
    focal.angle = Math.PI/7;
    focal.penumbra = 0.9;
    scene.add(focal);

	// Atender al eventos
	window.addEventListener( 'resize', updateAspectRatio );
}

function loadScene() {
	// Construye el grafo de escena
	// - Objetos (geometria, material)
	// - Transformaciones 
	// - Organizar el grafo

    //sitio de las imagenes
    var path = "images/";

	// Objeto contenedor de cubo y esfera
	conjunto = new THREE.Object3D();
	conjunto.position.y = 1;

	// Cubo
    var loaderCubo = new THREE.TextureLoader();
    var texCubo = loaderCubo.load(path+"wood512.jpg");
	var geoCubo = new THREE.BoxGeometry(2,2,2);
	var matCubo = new THREE.MeshLambertMaterial( {color:'green',wireframe:false, map:texCubo} );
	cubo = new THREE.Mesh( geoCubo, matCubo );
	cubo.position.x = 2;

	// Esfera
    var entorno = [ path+"posx.jpg", path+"negx.jpg", 
                    path+"posy.jpg", path+"negy.jpg",
                    path+"posz.jpg", path+"negz.jpg"];
    //var texEspera = new THREE.CubeTextureLoader.load(entorno);

	var geoEsfera = new THREE.SphereGeometry( 1, 30, 30 );
	var material = new THREE.MeshPhongMaterial( {color:'yellow',
                                                wireframe: false, 
                                                specular: 'white',
                                                shininess: 30} );
	esfera = new THREE.Mesh( geoEsfera, material );

	// Suelo
    var texSuelo = new THREE.TextureLoader().load(path+"r_256.jpg");
    texSuelo.repeat.set(2,3);
    //texSuelo.wrap
	var geoSuelo = new THREE.PlaneGeometry(10,10,12,12);
	var matSuelo = new THREE.MeshLambertMaterial( {color:'grey', wireframe: false, map:texSuelo} );
	var suelo = new THREE.Mesh( geoSuelo, matSuelo );
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -0.1;

	// Objeto importado
	var loader = new THREE.ObjectLoader();
	loader.load( 'models/soldado/soldado.json', 
		         function (objeto){
                    objeto.position.y = -1; 
		         	cubo.add(objeto);

                     //textura del soldado
                     var texSoldado = new THREE.TextureLoader().load("./models/soldado/soldado.png");
                     objeto.material.setValues({map:texSoldado});

		         	// Movimiento interpolado del objeto
		         	var salto = new TWEEN.Tween( objeto.position ).
		         	            to( {x: [0.2,0.3,0.5],
		         	            	 y: [0.1,0.5,0.3],
		         	            	 z: [0,0,0]}, 1000);
		         	salto.easing( TWEEN.Easing.Bounce.Out );
		         	salto.interpolation( TWEEN.Interpolation.Bezier );
		         	salto.start();

		         	var volver = new TWEEN.Tween( objeto.position );
		         	volver.to( {x:0,y:-1,z:0}, 2000);
		         	salto.chain( volver );
		         	volver.chain( salto );

		         });

	// Texto
	var fontLoader = new THREE.FontLoader();
	fontLoader.load( 'fonts/gentilis_bold.typeface.json',
		             function(font){
		             	var geoTexto = new THREE.TextGeometry( 
		             		'SOLDADO',
		             		{
		             			size: 0.5,
		             			height: 0.1,
		             			curveSegments: 3,
		             			style: "normal",
		             			font: font,
		             			bevelThickness: 0.05,
		             			bevelSize: 0.04,
		             			bevelEnabled: true
		             		});
		             	var matTexto = new THREE.MeshBasicMaterial( {color:'red'} );
		             	var texto = new THREE.Mesh( geoTexto, matTexto );
		             	scene.add( texto );
		             	texto.position.x = -1;
		             });

    //Habitacion
    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = texEspera;

    var matPaderes = new THREE.ShaderMaterial({
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.Backside
    });

    var habitacion = new THREE.Mesh( new THREE.CubeGeometry(30,30,30), matPaderes);
    scene.add(habitacion);


	// Grafo
	conjunto.add( cubo );
	conjunto.add( esfera );
	scene.add( conjunto );
	scene.add( new THREE.AxesHelper(3) );
	scene.add( suelo );
}

function updateAspectRatio()
{
	// Mantener la relacion de aspecto entre marco y camara

	var aspectRatio = window.innerWidth/window.innerHeight;
	// Renovar medidas de viewport
	renderer.setSize( window.innerWidth, window.innerHeight );
	// Para la perspectiva
	camera.aspect = aspectRatio;
	// Para la ortografica
	// camera.top = 10/aspectRatio;
	// camera.bottom = -10/aspectRatio;

	// Hay que actualizar la matriz de proyeccion
	camera.updateProjectionMatrix();
}

function setupGUI()
{
	// Interfaz grafica de usuario 

	// Controles
	effectControls = {
		mensaje: "Interfaz",
		posY: 1.0,
		separacion: [],
		caja: true,
		color: "rgb(255,255,0)"
	};

	// Interfaz
	var gui = new dat.GUI();
	var folder = gui.addFolder("Interfaz SOLDADO");
	folder.add( effectControls, "mensaje" ).name("App");
	folder.add( effectControls, "posY", 1.0, 3.0, 0.1 ).name("Subir/Bajar");
	folder.add( effectControls, "separacion", {Ninguna:0, Media:1, Maxima:2} ).name("Separacion");
	folder.add( effectControls, "caja" ).name("Ver al soldado");
	folder.addColor( effectControls, "color" ).name("Color esfera");
}

function update()
{
	// Cambiar propiedades entre frames

	// Tiempo transcurrido
	var ahora = Date.now();
	// Incremento de 20º por segundo
	angulo += Math.PI/9 * (ahora-antes)/1000;
	antes = ahora;

	esfera.rotation.y = angulo;
	conjunto.rotation.y = angulo/10;

	// Cambio por demanda de usuario
	conjunto.position.y = effectControls.posY;
	esfera.position.x = -effectControls.separacion;
	cubo.visible = effectControls.caja;
	esfera.material.setValues( {color:effectControls.color} );

	// Actualizar interpoladores
	TWEEN.update();
}

function render() {
	// Blucle de refresco
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}
