import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from "gsap"


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
camera.position.set(0, 12,17); // x, y, z
camera.lookAt(0, 0, 0);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );


const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );


loader.load(
  '/models/chimneynotworkinghadtoexportaginimgoinginsane.glb', 
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    const WHAT = model.getObjectByName('WHAT');
    const chimney = model.getObjectByName('a');

    if (chimney) {
      addSmokeEffect(chimney);
  }
 

 
    function WINDTHINGY() {
      requestAnimationFrame(WINDTHINGY);
      
     
      if (WHAT) {
          WHAT.rotation.y += 0.01; 
      }
      
      renderer.render(scene, camera);
  }
  WINDTHINGY();
    
    
  },
  undefined,
  function (error) {
    console.error('Error loading model:', error);
  }
);






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


const loading = document.getElementById("loading-screen")
gsap.to(loading, {
  x: "-100vw",      
  duration: 1.5,
  ease: "power2.inOut",
  delay:2
});

const dialouge=document.getElementById("dialouge-box")
gsap.from(dialouge, {
  y: "100vw",   
  duration: 1.5, 
  ease: "power2.out",
  delay:2.5,
 

  onComplete: function() { 
  
    gsap.to(dialouge, {
      y: "100vh",    
      duration: 1,   
      ease: "power2.in",
      delay: 2.5,   
      
    });
  }
});


function addSmokeEffect(chimneyObject) {
 //cylinder one was trash never use it again 
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 67;

  const posArray = new Float32Array(particleCount * 3); // x, y, z for each particle
  const colorArray = new Float32Array(particleCount * 3); // r, g, b for each particle
  

  for(let i = 0; i < particleCount * 3; i += 3) {
      
      posArray[i] = (Math.random() - 0.5) * 2; // x
      posArray[i + 1] = Math.random() * 0.5;   // y (start at chimney level)
      posArray[i + 2] = (Math.random() - 0.5) * 2; // z
    
      const grayValue = 0.5 + Math.random() * 0.3;
      colorArray[i] = grayValue;    
      colorArray[i + 1] = grayValue;  
      colorArray[i + 2] = grayValue; 
  }
  
 
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  
  // Smoke material
  const particlesMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true, 
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending, 
      depthWrite: false
  });
  
  //merging the geometry and mat uwu 
  const smoke = new THREE.Points(particlesGeometry, particlesMaterial);
  
  // Position  of chimey
  smoke.position.copy(chimneyObject.position);
  smoke.position.y -= 1; //height
  smoke.position.z += -2.5;
  

  scene.add(smoke);
  
  // Get references to position and color arrays for animation
  const positions = smoke.geometry.attributes.position.array;
  const colors = smoke.geometry.attributes.color.array;
  
  // Animate smoke
  function animateSmoke() {
      for(let i = 0; i < particleCount * 3; i += 3) {
          // Move particles upward
          positions[i + 1] += 0.01 + Math.random() * 0.02;
          
          // Fade out as they rise
          if (positions[i + 1] > 3) {
              // Reset particle to chimney base
              positions[i] = (Math.random() - 0.5) * 1.5;
              positions[i + 1] = Math.random() * 0.5;
              positions[i + 2] = (Math.random() - 0.5) * 2;
              
              // Reset color
              const grayValue = 0.5 + Math.random() * 0.3;
              colors[i] = grayValue;
              colors[i + 1] = grayValue;
              colors[i + 2] = grayValue;
          } else {
              // Fade with height
              colors[i] *= 0.995;
              colors[i + 1] *= 0.995;
              colors[i + 2] *= 0.995;
          }
      }
      
      // Mark attributes as needing update
      smoke.geometry.attributes.position.needsUpdate = true;
      smoke.geometry.attributes.color.needsUpdate = true;
      
      requestAnimationFrame(animateSmoke);
  }
  animateSmoke();
}
//lightsss removed the ambient thing coz it made NOOOOO DIFFERENCE BRO WTH 
const directionalLight = new THREE.DirectionalLight(0xff9900, 1); 
directionalLight.position.set(-15, 10, 15); 
directionalLight.castShadow = true; //no shadows bro wth my ass its true
scene.add(directionalLight);





//gallery 
// ✅ CORRECT: Move these outside and fix the structure

// Gallery functions (put this at the bottom, outside all other functions)
// ==================== GALLERY FUNCTIONS ====================
// These must be OUTSIDE all other functions

function openGallery() {
  console.log("Opening gallery...");
  const modal = document.getElementById("gallery-modal");
  if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
  } else {
      console.error("Gallery modal not found!");
  }
}

function closeGallery() {
  console.log("Closing gallery...");
  const modal = document.getElementById("gallery-modal");
  if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
  }
}

// ==================== EVENT LISTENERS ====================
// Add this at the VERY BOTTOM of your file (after all functions)

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Gallery button
  const galleryButton = document.getElementById("gallery-button");
  if (galleryButton) {
      console.log("Gallery button found, adding listener...");
      galleryButton.addEventListener("click", openGallery);
  } else {
      console.error("Gallery button not found! Check HTML ID.");
  }

  // Close modal on outside click
  window.addEventListener('click', function(event) {
      const modal = document.getElementById("gallery-modal");
      if (event.target === modal) {
          closeGallery();
      }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
          closeGallery();
      }
  });
});