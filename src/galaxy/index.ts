import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  calculateEllipticalOrbitPosition,
  calculateOrbitalVelocity,
  createOrbitLine,
  createSunLight,
  handleMouseClick,
  handleWindowResize,
  scaleAndPositionPlanet,
  scaleAndPositionSun,
} from "./helpers";
import { PlanetData, PLANET_DATA, SUN_DATA } from "./constants";

// Define main function for setting up scene
async function setupSolarSystem(): Promise<void> {
  console.log("Setting up solar systems...");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const canvas = document.getElementById("solarSystem") ?? undefined;
  const renderer = new THREE.WebGLRenderer({ canvas });
  const gltfLoader = new GLTFLoader();

  camera.position.set(0, 150, 0);
  camera.lookAt(0, 0, 0);

  renderer.setSize(window.innerWidth, window.innerHeight);

  console.log("Loading suns and planets...");
  const [sunGLTFs, planetGLTFs] = await Promise.all([
    Promise.all(SUN_DATA.map((sunData) => gltfLoader.loadAsync(sunData.url))),
    Promise.all(PLANET_DATA.map((planetData) => gltfLoader.loadAsync(planetData.url))),
  ]);

  console.log("Putting everything in place...");

  const sunMeshes: THREE.Group<THREE.Object3DEventMap>[] = SUN_DATA.map((sunData, i) => {
    const sunMesh = sunGLTFs[i].scene;
    return scaleAndPositionSun(sunMesh, sunData);
  });

  const sunLights: THREE.PointLight[] = SUN_DATA.map((sunData) => createSunLight(sunData));

  const planetMeshes: THREE.Group<THREE.Object3DEventMap>[] = PLANET_DATA.map((planetData, i) => {
    const planetMesh = planetGLTFs[i].scene;
    const sunPosition = sunMeshes[planetData.sunIndex].position;
    return scaleAndPositionPlanet(planetMesh, planetData, sunPosition);
  });

  const orbitLines: THREE.Line[] = PLANET_DATA.map((planetData) =>
    createOrbitLine(planetData, sunMeshes[planetData.sunIndex].position)
  );

  sunMeshes.forEach((sunMesh) => scene.add(sunMesh));
  sunLights.forEach((sunLight) => scene.add(sunLight));
  planetMeshes.forEach((planetMesh) => scene.add(planetMesh));
  orbitLines.forEach((orbitLine) => scene.add(orbitLine));

  window.addEventListener("click", (event) => handleMouseClick(event, scene, camera), false);
  window.addEventListener("resize", () => handleWindowResize(camera, renderer), false);

  function animate(): void {
    requestAnimationFrame(animate);

    planetMeshes.forEach((planetMesh) => {
      const planetData: PlanetData = PLANET_DATA[planetMeshes.indexOf(planetMesh)];
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
  console.log("Solar system setup complete.");
}

// Call the main setup function
export default setupSolarSystem;
