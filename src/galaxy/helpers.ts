import * as THREE from "three";
import { GRAVITATIONAL_CONSTANT, PlanetData, SunData } from "./constants";

// Define functions for creating suns and planets
export function scaleAndPositionSun(
  mesh: THREE.Group<THREE.Object3DEventMap>,
  data: SunData
): THREE.Group<THREE.Object3DEventMap> {
  const { position, scaleAdjustment, name } = data;

  mesh.scale.set(scaleAdjustment, scaleAdjustment, scaleAdjustment);
  mesh.position.copy(position);
  mesh.name = name;
  return mesh;
}

export function createSunLight(data: SunData): THREE.PointLight {
  const { position, color } = data;
  const sunLight = new THREE.PointLight(color, 20000, 0, 2);
  sunLight.position.copy(position);
  return sunLight;
}

export function scaleAndPositionPlanet(
  mesh: THREE.Group<THREE.Object3DEventMap>,
  planetData: PlanetData,
  sunPosition: THREE.Vector3
): THREE.Group<THREE.Object3DEventMap> {
  const { size, orbitRadius, orbitSpeed, name } = planetData;

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
export function calculateEllipticalOrbitPosition(
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

export function calculateOrbitalVelocity(semiMajorAxis: number, distance: number): number {
  return Math.sqrt((GRAVITATIONAL_CONSTANT * semiMajorAxis) / distance);
}

// Define function for creating orbit lines
export function createOrbitLine(planetData: PlanetData, sunPosition: THREE.Vector3): THREE.Line {
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
export function handleMouseClick(
  event: MouseEvent,
  scene: THREE.Scene,
  camera: THREE.Camera
): void {
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
export function handleWindowResize(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
