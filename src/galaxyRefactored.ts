import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Define constants
const GRAVITATIONAL_CONSTANT: number = 0.2;

// Define interfaces for suns and planets
interface SunData {
  url: string;
  name: string;
  size: number;
  scaleAdjustment: number;
  position: THREE.Vector3;
  color: number;
}

interface PlanetData {
  url: string;
  name: string;
  size: number;
  color: number;
  orbitRadius: number;
  orbitSpeed: number;
  sunIndex: number;
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
}

// Define functions for creating suns and planets
async function scaleAndPositionSun(
  mesh: THREE.Group<THREE.Object3DEventMap>,
  data: SunData
): Promise<THREE.Group<THREE.Object3DEventMap>> {
  const { position, scaleAdjustment, name } = data;

  mesh.scale.set(scaleAdjustment, scaleAdjustment, scaleAdjustment);
  mesh.position.copy(position);
  mesh.name = name;
  return mesh;
}

function createSunLight(data: SunData): THREE.PointLight {
  const { position, color } = data;
  const sunLight = new THREE.PointLight(color, 20000, 0, 2);
  sunLight.position.copy(position);
  return sunLight;
}

async function scaleAndPositionPlanet(
  mesh: THREE.Group<THREE.Object3DEventMap>,
  data: PlanetData,
  sunPosition: THREE.Vector3
): Promise<THREE.Group> {
  const { size, orbitRadius, orbitSpeed, name } = data;

  mesh.scale.set(size, size, size);

  const initialPosition = new THREE.Vector3(orbitRadius, 0, 0);
  initialPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
  initialPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.random() * Math.PI * 2);
  initialPosition.add(sunPosition);

  mesh.position.copy(initialPosition);
  mesh.userData = {
    orbitRadius,
    orbitSpeed,
    angle: Math.random() * Math.PI * 2,
  };
  mesh.name = name;
  return mesh;
}

// Define functions for orbital calculations
function calculateEllipticalOrbitPosition(
  angle: number,
  semiMajorAxis: number,
  eccentricity: number,
  inclination: number,
  sunPosition: THREE.Vector3
): THREE.Vector3 {
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

function calculateOrbitalVelocity(semiMajorAxis: number, distance: number): number {
  return Math.sqrt((GRAVITATIONAL_CONSTANT * semiMajorAxis) / distance);
}

// Define function for creating orbit lines
function createOrbitLine(planetData: PlanetData, sunPosition: THREE.Vector3): THREE.Line {
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
  return new THREE.Line(orbitGeometry, orbitMaterial);
}

// Define function for handling mouse clicks
function handleMouseClick(event: MouseEvent, scene: THREE.Scene, camera: THREE.Camera): void {
  event.preventDefault();

  const mouseVector = new THREE.Vector2();
  mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouseVector, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const planet = intersects[0].object;
    console.log("Clicked on planet:", planet.name);
  }
}

// Define function for handling window resize
function handleWindowResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Define main function for setting up scene
async function setupSolarSystem(): Promise<void> {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 150, 0);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("solarSystem") ?? undefined,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const suns: SunData[] = [
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

  const planets: PlanetData[] = [
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

  const gltfLoader = new GLTFLoader();

  const sunMeshes: THREE.Group[] = await Promise.all(
    suns.map((sunData) =>
      gltfLoader.loadAsync(sunData.url).then((gltf) => scaleAndPositionSun(gltf.scene, sunData))
    )
  );
  const sunLights: THREE.PointLight[] = suns.map((sunData) => createSunLight(sunData));
  const planetMeshes: THREE.Group[] = await Promise.all(
    planets.map((planetData) =>
      gltfLoader
        .loadAsync(planetData.url)
        .then((gltf) =>
          scaleAndPositionPlanet(gltf.scene, planetData, sunMeshes[planetData.sunIndex].position)
        )
    )
  );
  const orbitLines: THREE.Line[] = planets.map((planetData) =>
    createOrbitLine(planetData, sunMeshes[planetData.sunIndex].position)
  );

  sunMeshes.forEach((sunMesh) => scene.add(sunMesh));
  sunLights.forEach((sunLight) => scene.add(sunLight));
  planetMeshes.forEach((planetMesh) => scene.add(planetMesh));
  orbitLines.forEach((orbitLine) => scene.add(orbitLine));

  window.addEventListener("click", (event) => handleMouseClick(event, scene, camera), false);
  window.addEventListener("resize", () => handleWindowResize(camera, renderer), false);

  const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 0, 100);
  scene.add(directionalLight);

  function animate(): void {
    requestAnimationFrame(animate);
    planetMeshes.forEach((planetMesh) => {
      const planetData: PlanetData = planets[planetMeshes.indexOf(planetMesh)];
      const sunPosition: THREE.Vector3 = sunMeshes[planetData.sunIndex].position;
      const distance: number = planetMesh.position.distanceTo(sunPosition);
      const orbitalVelocity: number = calculateOrbitalVelocity(planetData.semiMajorAxis, distance);
      const angularVelocity: number = orbitalVelocity / distance;
      planetMesh.userData.angle += angularVelocity;
      const newPosition: THREE.Vector3 = calculateEllipticalOrbitPosition(
        planetMesh.userData.angle,
        planetData.semiMajorAxis,
        planetData.eccentricity,
        planetData.inclination,
        sunPosition
      );
      planetMesh.position.copy(newPosition);
    });

    renderer.render(scene, camera);
  }

  animate();
}

// Call the main setup function
// setupSolarSystem().then(() => console.log("Solar system setup complete."));
export default () => setupSolarSystem().then(() => console.log("Solar system setup complete."));
