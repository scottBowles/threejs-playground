// Import necessary modules from Three.js
import * as THREE from "three";

// Define your solar system objects and their specifications
const solarSystem = [
  { name: "Planet1", size: 5, position: new THREE.Vector3(-50, 0, 0), color: 0xffff00 },
  { name: "Planet2", size: 3, position: new THREE.Vector3(50, 0, 0), color: 0xff00ff },
  { name: "Planet3", size: 4, position: new THREE.Vector3(0, 0, -50), color: 0x00ffff },
];

// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("solarSystem") ?? undefined,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Set camera position
camera.position.set(0, 0, 50);

// Set camera target
camera.lookAt(0, 0, 0);

// Create planets and add them to the scene
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);

solarSystem.forEach((planetData) => {
  const planetMaterial = new THREE.MeshBasicMaterial({ color: planetData.color });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
  planetMesh.scale.set(planetData.size, planetData.size, planetData.size);
  planetMesh.position.copy(planetData.position);
  planetMesh.name = planetData.name;
  scene.add(planetMesh);
});

// Add event listener for mouse clicks
window.addEventListener("click", onDocumentMouseDown, false);

// Function to handle mouse clicks
function onDocumentMouseDown(event: MouseEvent) {
  event.preventDefault();

  const mouseVector = new THREE.Vector2();
  mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouseVector, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    // Handle click on planet
    const planet = intersects[0].object;
    // Open modal or display information about the planet
    console.log("Clicked on planet:", planet.name);
  }
}

// Function to handle window resizing
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

// Render loop
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

export default animate;
