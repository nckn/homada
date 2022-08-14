uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec2 pixels;
float PI = 3.141592653589793238;
attribute vec3 pos;

void main() {
  // vUv = uv;
  vUv = position.xy + vec2(0.5);
  vec3 finalpos = pos + position * 0.1;

  // vec4 view_pos = modelMatrix * vec4(pos, 1.0);
  
  vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;

  // calc global position

  // Add position
  vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
  view_pos.xyz += position * 0.003;

  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(finalpos, 1.0);
  gl_Position = projectionMatrix * view_pos;
}