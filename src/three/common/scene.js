import * as THREE from "three";

import jpgpx from "@assets/texture/sky/px.jpg?url";
import jpgnx from "@assets/texture/sky/nx.jpg?url";
import jpgpy from "@assets/texture/sky/py.jpg?url";
import jpgny from "@assets/texture/sky/ny.jpg?url";
import jpgpz from "@assets/texture/sky/pz.jpg?url";
import jpgnz from "@assets/texture/sky/nz.jpg?url";
const scene = new THREE.Scene();
// 添加雾霾
// const fog = new THREE.Fog(0x000000, 0, 10);
// scene.fog = fog;

// const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
//   "../assets/texture/sky",
// );
const cubeTextureLoader = new THREE.CubeTextureLoader();
const texture = cubeTextureLoader.load([
  jpgpx,
  jpgnx,
  jpgpy,
  jpgny,
  jpgpz,
  jpgnz,
]);

scene.background = texture;

// 添加圆柱形天空
// const rgbeloader = new RGBELoader();

// rgbeloader.loadAsync("./textures/2k.hdr").then((texture) => {
//   // 设置纹理为圆柱形纹理
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   // 添加天空环境
//   scene.background = texture;
//   scene.environment = texture;
// });

// 场景亮度物理灯光效果
// 1设置色调映射
// 2设置曝光
// 3设置场景灯光

// 给场景添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 1000, 10);

const ambitent = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambitent);
scene.add(light);

export default scene;
