import WebGL from "three/addons/capabilities/WebGL.js";
// import animateCube from "./cube";
// import renderLine from "./line";
// import animateSpheres from "./spheres";
import animateGalaxy from "./galaxy";
// import animateGalaxyRefactored from "./galaxyRefactored";

if (WebGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  // animateCube();
  // renderLine();
  // animateSpheres();
  animateGalaxy();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container")?.appendChild(warning);
}
