uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec2 pixels;
float PI = 3.141592653589793238;
attribute vec3 pos;

void main() {
  vUv = uv;
  vec3 finalpos = pos + position * 0.1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalpos, 1.0);
}