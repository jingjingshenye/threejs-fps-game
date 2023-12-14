import * as THREE from "three";
import scene from "./scene";
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(-50, 20, 20);

camera.position.z = 5;

export default camera;
