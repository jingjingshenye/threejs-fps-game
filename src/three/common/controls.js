import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import renderer from "./renderer";
import camera from "./camera";
const orbitControls = new OrbitControls(camera, renderer.domElement);

export default orbitControls;
