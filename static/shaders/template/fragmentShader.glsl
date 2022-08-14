uniform float time;
uniform float uProgress;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
varying vec2 vUv;

uniform vec2 uMouse;

varying vec2 vSize;

vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize) {
  vec2 tempUV = uv - vec2(0.5);

  float quadAspect = quadSize.x / quadSize.y;
  float textureAspect = textureSize.x / textureSize.y;
  if(quadAspect < textureAspect) {
    tempUV = tempUV * vec2(quadAspect / textureAspect, 1.);
  } else {
    tempUV = tempUV * vec2(1., textureAspect / quadAspect);
  }

  tempUV += vec2(0.5);
  return tempUV;
}
void main() {

  // float dist = distance(mousePos, gl_FragCoord.xy);
  // float range = maxRadius - minRadius;
  // float mixAmount = clamp((dist - minRadius) / range, 0., 1.);
  vec2 diff = vUv - uMouse;
  float distance = length(diff);

  vec2 correctUV = getUV(vUv, uTextureSize, vSize);
  vec4 image = texture2D(uTexture, correctUV);
  gl_FragColor = vec4(vUv, 0., 1.);
  
  // image.a = smoothstep(distance, 0.4, 0.1);
  // image.r = smoothstep(0.1, 1.0, distance * 10.0);
  // image.g = smoothstep(0.1, 1.0, distance * 10.0);
  // image.b = smoothstep(0.1, 1.0, distance * 10.0);
  // image.g = smoothstep(0.1, 1.0, distance * (vUv.y * 0.1));

  gl_FragColor = image;
}