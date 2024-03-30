import * as THREE from "three";

// Define constants
export const GRAVITATIONAL_CONSTANT: number = 0.2;

// Define interfaces for suns and planets
export interface SunData {
  url: string;
  name: string;
  size: number;
  scaleAdjustment: number;
  position: THREE.Vector3;
  color: number;
}

export interface PlanetData {
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

export const SUN_DATA: SunData[] = [
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

export const PLANET_DATA: PlanetData[] = [
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
