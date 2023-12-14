<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";
import scene from "@three/common/scene";
import camera from "@three/common/camera";
import renderer from "@three/common/renderer";
import "@three/common/resize";
import animate from "@three/common/animate";
// import orbitControls from "@three/common/controls";
import { axesHelper } from "@three/common/helper";
import { box } from "@three/mesh/Box";

import Terrain, { Player } from "@three/mesh/addTerrian";

const canvasContainer = ref(null);
scene.add(camera);
// scene.add(box);
scene.add(axesHelper);

const terrain = new Terrain(scene);
const player = new Player(scene, camera, renderer);

animate(player);

onMounted(() => {
  canvasContainer.value.appendChild(renderer.domElement);

  // let container = document.getElementById("canvasContainer");
  // player.addEvent(container);
});
</script>

<template>
  <div ref="canvasContainer" id="canvasContainer"></div>
</template>

<style scoped>
.canvasContainer {
  width: 100vw;
  height: 100vh;
}
</style>
