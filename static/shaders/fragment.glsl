uniform float time;
uniform float progress;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main() {
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  // gl_FragColor = vec4(vUv, 0.0, 1.0);

  vec4 ttt = texture2D(uTexture, vUv);
  gl_FragColor = vec4(vec3(1.), ttt.r);
}