// 引入stats.js
import Stats from "three/examples/jsm/libs/stats.module";
export const stats = new Stats();
// 设置stats样式
stats.dom.style.position = "absolute";
stats.dom.style.top = "0px";
document.body.appendChild(stats.dom);
