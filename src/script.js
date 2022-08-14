import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import testTexture from '../img/texture.jpg';
import * as dat from 'dat.gui'
import gsap from 'gsap'

import './assets/scss/main.scss'

// Misc helper functions
import {
  checkIfTouch,
  map,
  createPoints,
  noise
} from '../static/js/helpers.js'

// import vertexShader from '../static/shaders/template/vertexShader.glsl'
// import fragmentShader from '../static/shaders/template/fragmentShader.glsl'
import vertex from '../static/shaders/vertex.glsl'
import fragment from '../static/shaders/fragment.glsl'

const texturePath = './textures/texture.jpg'

export default class Sketch {
  constructor(options) {
    this.container = options.domElement;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.distanceCam = 1

    this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.001, 10000);
    // this.camera.position.z = this.distanceCam;
    this.camera.position.set(0, 2, 2)

    // this.camera.fov = 2 * Math.atan((this.height / 2) / this.distanceCam) * 180 / Math.PI;
    this.imagesAdded = 0;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.setPixelRatio(2);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', _ => {
      console.log('orbit controls')
    })
    this.materials = [];

    this.time = 0;

    this.mouse = {x: 0, y: 0}
    
    this.setupSettings()

    this.setupTextureLoader()

    // this.addObjects()
    
    this.addParticles()
    
    // this.addOWavePlane()

    this.setupResize()

    this.resize()
    this.render();

    this.addEventListeners()

  }

  addParticles() {
    let self = this
    let count = 10000
    let particlegeo = new THREE.PlaneBufferGeometry(1,1)
    let geo = new THREE.InstancedBufferGeometry()
    geo.instanceCount = count
    geo.setAttribute('position', particlegeo.getAttribute('position'))
    geo.index = particlegeo.index

    let pos = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      let x = (Math.random()-0.5) * 5.5
      let y = (Math.random()-0.5) * 5.5
      let z = (Math.random()-0.5) * 5.5
      
      pos.set([
        x, y, z
      ],i*3)
    }

    console.log(geo.getAttribute('position'))

    geo.setAttribute('pos', new THREE.InstancedBufferAttribute(pos, 3, false))

    this.material = new THREE.ShaderMaterial({ 
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0},
        resolution: { value: new THREE.Vector4() }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.points = new THREE.Mesh(geo, this.material)

    this.scene.add(this.points)
    // this.mesh.position.x = 300

  }

  addEventListeners() {
    let self = this
    document.addEventListener('mousemove', self.onMouseMove.bind(this))
  }

  setupTextureLoader() {
    let self = this
    /* Textures */
    self.textureLoader = new THREE.TextureLoader()
    self.texture = self.textureLoader.load( texturePath )
    self.texture.needsUpdate = true;
  }

  setupSettings() {
    this.settings = {
      progress: 0
    }
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.001);
  }

  resize() {
    let self = this
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // resize plane
    // self.setMaterial()
    // this.material.uniforms.uResolution.value = new THREE.Vector2(this.width, this.height)
    // this.material.uniforms.uQuadSize.value = new THREE.Vector2(300, 300 * ( self.height / self.width ))
    // this.material.uniforms.aspectRatio.value = self.height / self.width

    this.camera.fov = 2 * Math.atan((this.height / 2) / 600) * 180 / Math.PI;
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  setMaterial() {
    let self = this
    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        time: { value: 1.0 },
        uMouse: { value: new THREE.Vector2(1,1) },
        uOffset: {
          value: new THREE.Vector2(0.0, 0.0)
        },
        uProgress: { value: 1.0 }, // 0 = Start further out, 
        minRadius: { value: 25.0 },
        maxRadius: { value: 100.0 },
        uTexture: { value: self.texture },
        uTextureSize: { value: new THREE.Vector2(100, 100) },
        uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300 * ( self.height / self.width )) },
        aspectRatio: { value: self.height / self.width },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })
  }

  addObjects() {
    let self = this
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
    console.log(this.geometry)

    self.setMaterial()

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(300, 300, 1)
    this.scene.add( this.mesh );
    // this.mesh.position.x = 300

  }

  // setPosition() {
  //   // console.log(this.asscroll.currentPos)
  //   if (!this.animationRunning) {
  //     this.imageStore.forEach(o => {
  //       o.mesh.position.x = -this.asscroll.currentPos + o.left - this.width / 2 + o.width / 2;
  //       o.mesh.position.y = -o.top + this.height / 2 - o.height / 2;
  //     })
  //   }

  // }

  onMouseMove() {
    let self = this
    // self.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    // self.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // self.mouse.x = (event.clientX / window.innerWidth) * 1
    // self.mouse.y = -(event.clientY / window.innerHeight) * 1
    
    const eX = (event.touches) ? event.touches[0].clientX : event.clientX;
    const eY = (event.touches) ? event.touches[0].clientY : event.clientY;
    self.mouse.x = (eX / window.innerWidth) * 1
    self.mouse.y = -(eY / window.innerHeight) * 1
    console.log('x: ', self.mouse.x, 'y: ', self.mouse.y)
  }

  render() {
    let self = this
    this.time += 0.05;
    // this.material.uniforms.time.value = this.time;

    // this.material.uniforms.uProgress.value = this.settings.progress;

    // this.setPosition()
    
    // Update mouse position
    // this.material.uniforms.uMouse.value = map(x, 0, window.innerWidth, 0, 5);
    // this.material.uniforms.uMouse.value = new THREE.Vector2(
    //   map(self.mouse.x, 0, window.innerWidth, -10, 10),
    //   map(self.mouse.y, 0, window.innerHeight, -10, 10)
    // )

    // const canvas = document.getElementsByTagName('canvas')
    // const rect = canvas.getBoundingClientRect();

    // const x = (self.clientX) * canvas.width / rect.width;
    // const y = (self.clientY - rect.top)  * canvas.height / rect.height;
    
    const x = self.mouse.x
    const y = self.mouse.y + 1
    
    // mousePos[0] = x;
    // mousePos[1] = canvas.height - y - 1;
    // this.material.uniforms.uMouse.value = new THREE.Vector2(
    //   x,
    //   y
    //   // mousePos[1]
    // )
    // this.material.uniforms.uMouse.value = map(x, 0, window.innerWidth, 0, 5);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this))
  }

  addOWavePlane() {
    let self = this

    const envmap = new THREE.CubeTextureLoader()
      .setPath( 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/' )
      .load( [
        'skybox2_px.jpg',
        'skybox2_nx.jpg',
        'skybox2_py.jpg',
        'skybox2_ny.jpg',
        'skybox2_pz.jpg',
        'skybox2_nz.jpg'
      ] );
    // self.scene.background = envmap;

    // const geometry = new THREE.PlaneBufferGeometry( 30, 30, 100, 100 );
    const geometry = new THREE.PlaneBufferGeometry( 1, 1, 100, 100 );
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x00aaff, 
      envMap: envmap,
      metalness: 0.9, 
      roughness: 0.1,
    });
    material.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0}
        shader.vertexShader = `
            uniform float time;
        ` + shader.vertexShader

        const token = '#include <begin_vertex>'
        const customTransform = `
            vec3 transformed = vec3(position);
            float freq = length(transformed.xy);
            float amp = 0.04;
            float angle = -time*2.0 + freq*3.0;
            transformed.z += sin(angle)*amp;

            objectNormal = normalize(vec3(0.0, amp * freq * cos(angle), 1.0));
            vNormal = normalMatrix * objectNormal;
        `
        shader.vertexShader = shader.vertexShader.replace(token,customTransform)
        // matShader = shader
    }
    const mesh = new THREE.Mesh( geometry, material );
    // mesh.rotateX( -Math.PI/2.5 );
    // mesh.position.y = 0.3;

    mesh.scale.set(300, 300, 1)
    // this.scene.add( this.mesh );
    // mesh.position.x = 300

    self.scene.add(mesh);
  }

}

new Sketch({
  domElement: document.getElementById('webglContainer')
});
