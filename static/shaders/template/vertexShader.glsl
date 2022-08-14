uniform float time;
uniform float uProgress;
uniform float aspectRatio;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
uniform vec4 uCorners;
uniform vec2 uMouse;

uniform float distortion;
uniform float distortionX;
uniform float distortionY;

varying vec2 vSize;
varying vec2 vUv;

void main() {
  float PI = 3.1415926;
  vUv = uv;

  vec3 newPosition = position;
  // vUv.x *= aspectRatio * 1.0;
  float dist = distance(vUv, uMouse) * 8.0;

  float distanceX = length(position.x) / 50.0;
  float distanceY = length(position.y) / 50.0;

  float distanceXPow = pow(distortionX, distanceX);
  float distanceYPow = pow(distortionY, distanceY);

  float sine = sin(PI * uProgress);
  float waves = sine * 0.1 * sin(5. * length(uv) + 15. * uProgress);
  vec4 defaultState = modelMatrix * vec4(position, 1.0);
  vec4 fullScreenState = vec4(position, 1.0);
  fullScreenState.x *= uResolution.x;
  fullScreenState.y *= uResolution.y;
  
  fullScreenState.z += clamp(pow(dist, 20.0) * 0.1, 0.0, 150.0);

  float cornersProgress = mix(mix(uCorners.z, uCorners.w, uv.x), mix(uCorners.x, uCorners.y, uv.x), uv.y);

  vSize = mix(uQuadSize, uResolution, cornersProgress);

  gl_Position = projectionMatrix * viewMatrix * fullScreenState;
}