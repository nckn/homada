uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec2 pixels;
float PI = 3.141592653589793238;
attribute vec3 pos;

void main() {
  vUv = uv;
  vec3 finalpos = pos + position * 0.1;

  vec4 view_pos = modelMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(finalpos, 1.0);
}