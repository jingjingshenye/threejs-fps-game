import * as THREE from "three";
import renderer from "./renderer";
import scene from "./scene";
import camera from "./camera";
import { stats } from "@/three/common/stats";

const clock = new THREE.Clock();
// export default function animate() {
//   const time = clock.getElapsedTime();

//   renderer.render(scene, camera);
//   stats.update();
//   requestAnimationFrame(() => {
//     animate();
//   });
// }

const STEPS_PER_FRAME = 5;

export default function animate(player) {
  const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

  // we look for collisions in substeps to mitigate the risk of
  // an object traversing another too quickly for detection.

  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    player.controls(deltaTime);

    player.updatePlayer(deltaTime);

    // updateSpheres(deltaTime);

    // teleportPlayerIfOob();
  }

  renderer.render(scene, camera);

  stats.update();

  requestAnimationFrame(() => {
    animate(player);
  });
}
