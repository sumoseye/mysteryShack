import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const canvas = document.querySelector("#experience-canvas")
const sizes ={
  width: window.innerWidth,
  height : window.innerHeight
}



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,sizes.width / sizes.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({canvas:canvas,  antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));


/*const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/

camera.position.z = 5;
//this is for movement and allowing smooth damping movement thingy
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
        controls.dampingFactor = 0.05;
controls.update();

//cam pos
camera.position.set(0, 9,17); // x, y, z
camera.lookAt(0, 0, 0);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );


const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );


loader.load(
  '/models/iwannakms.glb', 
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    
    
  },
  undefined,
  function (error) {
    console.error('Error loading model:', error);
  }
);




// Specify path to a folder containing WASM/JS decoding libraries.

//doesnt do anything
function animate() {}

//for locking sideways rotation angle
controls.minAzimuthAngle = -Math.PI / 7; 
controls.maxAzimuthAngle = Math.PI / 2;  //for vert rotation .minpolarangle sumthing


//main rendering 
const render= () => {

  

  renderer.render( scene, camera );

  window.requestAnimationFrame(render);
  controls.update();

}
render();


//event listnenrers uwu 
window.addEventListener("resize",()=>{
  sizes.width=window.innerWidth;
  sizes.height=window.innerHeight;


  //cam stuff
  camera.aspect= sizes.width/sizes.height;
  camera.updateProjectionMatrix();


  //update rendererer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
});