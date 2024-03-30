// Import necessary modules from Three.js
import * as THREE from "three";
// import a loader for gltf models
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const suns = [
  {
    url: "yellow_star.glb",
    name: "Yellow Sun",
    size: 5,
    scaleAdjustment: 0.075,
    position: new THREE.Vector3(-100, 0, 0),
    color: 0xffff00,
  },
  {
    url: "red_sun.glb",
    name: "Red Sun",
    size: 5,
    scaleAdjustment: 1,
    position: new THREE.Vector3(100, 0, 0),
    color: 0xff0000,
  },
];

// "lava planet" (https://skfb.ly/6SuNY) by jcises is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).

// Define your solar system objects and their specifications
const planets = [
  // "lava planet" (https://skfb.ly/6SuNY) by jcises is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).
  // { name: "Magmus", url: "lava_planet_4k.glb", position: new THREE.Vector3(0, 0, 0) },
  // "Green Planet" (https://skfb.ly/6CNPH) by Jamie Rose is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
  // { name: "Falucia", url: "green_planet_4k.glb", position: new THREE.Vector3(0, 0, 0) },
  // "Purple Planet" (https://skfb.ly/6UErL) by Yo.Ri is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
  // { name: "Mystra", url: "purple_planet_2k.glb", position: new THREE.Vector3(15, 15, 15) },
  // { name: "Magmus 2", url: "lava_planet_4k.glb", position: new THREE.Vector3(45, 45, 45) },
  // { name: "Mystra 2", url: "purple_planet_2k.glb", position: new THREE.Vector3(45, 45, 45) },
  {
    url: "lava_planet_4k.glb",
    name: "Blue",
    size: 3,
    color: 0x0000ff,
    orbitRadius: 40,
    orbitSpeed: 0.005,
    sunIndex: 0,
    semiMajorAxis: 40,
    eccentricity: 0.4,
    inclination: 0.02,
  },
  {
    url: "lava_planet_4k.glb",
    name: "Green",
    size: 5,
    color: 0x00ff00,
    orbitRadius: 80,
    orbitSpeed: 0.00252,
    sunIndex: 0,
    semiMajorAxis: 50,
    eccentricity: 0.5,
    inclination: 0.1,
  },
  {
    url: "lava_planet_4k.glb",
    name: "Orange",
    size: 4,
    color: 0xffa500,
    orbitRadius: 60,
    orbitSpeed: 0.0008,
    sunIndex: 0,
    semiMajorAxis: 60,
    eccentricity: 0.6,
    inclination: -0.2,
  },
  {
    url: "lava_planet_4k.glb",
    name: "Purple",
    size: 2,
    color: 0x800080,
    orbitRadius: 100,
    orbitSpeed: 0.0004,
    sunIndex: 0,
    semiMajorAxis: 70,
    eccentricity: 0.7,
    inclination: 0,
  },
  {
    url: "lava_planet_4k.glb",
    name: "Blue",
    size: 3,
    color: 0x0000ff,
    orbitRadius: 40,
    orbitSpeed: 0.005,
    sunIndex: 1,
    semiMajorAxis: 40,
    eccentricity: 0.4,
    inclination: 0.02,
  },
  {
    url: "lava_planet_4k.glb",
    name: "Green",
    size: 5,
    color: 0x00ff00,
    orbitRadius: 60,
    orbitSpeed: 0.00252,
    sunIndex: 1,
    semiMajorAxis: 50,
    eccentricity: 0.5,
    inclination: 0.1,
  },
  {
    url: "lava_planet_4k.glb",
    name: "Orange",
    size: 4,
    color: 0xffa500,
    orbitRadius: 50,
    orbitSpeed: 0.0008,
    sunIndex: 1,
    semiMajorAxis: 60,
    eccentricity: 0.6,
    inclination: -0.2,
  },
  {
    url: "lava_planet_4k.glb",
    name: "Purple",
    size: 2,
    color: 0x800080,
    orbitRadius: 70,
    orbitSpeed: 0.0004,
    sunIndex: 1,
    semiMajorAxis: 70,
    eccentricity: 0.7,
    inclination: 0,
  },
];

// Function to calculate position along an elliptical orbit
function calculateEllipticalOrbitPosition(
  angle: number,
  semiMajorAxis: number,
  eccentricity: number,
  inclination: number, // Inclination of the orbit, so they are not all in the same plane
  sunPosition: THREE.Vector3
) {
  const trueAnomaly = angle;
  const r =
    (semiMajorAxis * (1 - eccentricity * eccentricity)) /
    (1 + eccentricity * Math.cos(trueAnomaly));
  const x = r * Math.cos(trueAnomaly);
  const z = r * Math.sin(trueAnomaly);
  const newPosition = new THREE.Vector3(x, 0, z);
  newPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination);
  newPosition.add(sunPosition);
  return newPosition;
}

// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("solarSystem") ?? undefined,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Set camera position
camera.position.set(0, 150, 0);

// Set camera target
camera.lookAt(0, 0, 0);

const loader = new GLTFLoader();

const sunMeshes = await Promise.all(
  suns.map((sunData) => {
    // Add point light for each sun
    const sunLight = new THREE.PointLight(sunData.color, 20000, 0, 2);
    sunLight.position.copy(sunData.position);
    scene.add(sunLight);

    // return a promise that resolves when the model is loaded
    const mesh: Promise<THREE.Group<THREE.Object3DEventMap>> = new Promise((resolve, reject) => {
      loader.load(
        sunData.url,
        (gltf) => {
          const sunMesh = gltf.scene;
          sunMesh.scale.set(
            sunData.scaleAdjustment,
            sunData.scaleAdjustment,
            sunData.scaleAdjustment
          ); // Scale the model as needed
          sunMesh.position.copy(sunData.position);
          sunMesh.name = sunData.name;
          scene.add(sunMesh);
          resolve(sunMesh);
        },
        undefined,
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
    return mesh;
  })
);

const planetMeshes = await Promise.all(
  planets.map((planetData) => {
    const mesh: Promise<THREE.Group<THREE.Object3DEventMap>> = new Promise((resolve, reject) => {
      loader.load(
        planetData.url,
        (gltf) => {
          const planetMesh = gltf.scene;
          planetMesh.scale.set(planetData.size, planetData.size, planetData.size);

          // Set initial position of the planet along its orbit relative to its sun
          const initialPosition = new THREE.Vector3(planetData.orbitRadius, 0, 0);
          initialPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2); // Random starting position along the orbit
          initialPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.random() * Math.PI * 2); // Random inclination
          initialPosition.add(sunMeshes[planetData.sunIndex].position); // Add position of the corresponding sun
          planetMesh.position.copy(initialPosition);

          // Store orbit parameters for later use
          planetMesh.userData = {
            orbitRadius: planetData.orbitRadius,
            orbitSpeed: planetData.orbitSpeed,
            angle: Math.random() * Math.PI * 2, // Randomize starting angle
          };

          // planetMesh.scale.set(1, 1, 1); // Scale the model as needed
          planetMesh.name = planetData.name;
          scene.add(planetMesh);
          resolve(planetMesh);
        },
        undefined,
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
    return mesh;
  })
);

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
    console.log({ planet });
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

// Add lighting, camera setup, and render loop
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 100);
scene.add(directionalLight);

// Function to calculate orbital velocity based on distance from the sun
function calculateOrbitalVelocity(semiMajorAxis: number, distance: number) {
  // Using simplified formula assuming circular orbit
  const gravitationalConstant = 0.2; // You may need to adjust this based on your scale
  return Math.sqrt((gravitationalConstant * semiMajorAxis) / distance);
}

// Add orbit lines for each planet
const orbitLines = planets.map((planetData) => {
  const sunPosition = sunMeshes[planetData.sunIndex].position;
  const orbitPoints = [];
  for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
    const position = calculateEllipticalOrbitPosition(
      angle,
      planetData.semiMajorAxis,
      planetData.eccentricity,
      planetData.inclination,
      sunPosition
    );
    orbitPoints.push(position);
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: planetData.color });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  return orbitLine;
});

// Add orbit lines to the scene
orbitLines.forEach((orbitLine) => {
  scene.add(orbitLine);
});

function animate() {
  requestAnimationFrame(animate);

  // Update planet positions
  planetMeshes.forEach((planetMesh) => {
    const planetData = planets[planetMeshes.indexOf(planetMesh)];
    const sunPosition = sunMeshes[planetData.sunIndex].position;

    // Calculate distance from the sun
    const distance = planetMesh.position.distanceTo(sunPosition);

    // Calculate orbital velocity based on distance from the sun
    const orbitalVelocity = calculateOrbitalVelocity(planetData.semiMajorAxis, distance);

    // Calculate angular velocity based on orbital velocity
    const angularVelocity = orbitalVelocity / distance;

    // Update angle based on angular velocity
    planetMesh.userData.angle += angularVelocity;

    // Calculate new position along the orbit
    const newPosition = calculateEllipticalOrbitPosition(
      planetMesh.userData.angle,
      planetData.semiMajorAxis,
      planetData.eccentricity,
      planetData.inclination,
      sunPosition
    );

    // Update planet position
    planetMesh.position.copy(newPosition);
  });

  renderer.render(scene, camera);
}

export default animate;
