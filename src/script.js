import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import testTexture from '../img/texture.jpg';
import * as dat from 'dat.gui'
import gsap from 'gsap'

// import texturePath from '../static/textures/icon-particle-texture.png'
import texturePath from '../static/textures/particle-2.jpg'

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

// const texturePath = './textures/texture.jpg'

export default class Sketch {
  constructor(options) {
    this.container = options.domElement;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.count = 10000
    this.distanceCam = 1

    this.today = ''
    this.todayDate = ''
    this.birthdayDate = ''
    this.differenceInDays = ''

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.001, 10000);
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

    this.mouse = { x: 0, y: 0 }

    this.setupSettings()

    this.setupTextureLoader()

    // this.addObjects()

    this.addParticles()

    // this.addOWavePlane()

    this.setupResize()

    this.resize()
    this.render();

    this.addEventListeners()

    this.getTodaysDate()

    setTimeout(_ => {
      this.shakeThingsUp()
    }, 5000)

  }

  onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()

    let valueDay = document.getElementById('dd').value
    let valueMonth = document.getElementById('mm').value
    let valueYear = document.getElementById('yy').value
    this.birthday = valueMonth + '-' + valueDay + '-' + valueYear
    this.birthdayDate = new Date(this.birthday)
    console.log('submit')

    console.log('birthdayDate: ', this.birthdayDate)

    this.getDifferenceInDays()

    // console.log('valueDay: ', valueDay)
    // console.log('valueMonth: ', valueMonth)
    // console.log('valueYear: ', valueYear)
  }

  getTodaysDate() {
    this.today = new Date()
    let dd = this.today.getDate()
    // let mm = this.today.getMonth() + 1
    let mm = this.today.getMonth()
    let yy = this.today.getFullYear()
    this.todayDate = dd + '-' + mm + '-' + yy
    console.log('todayDate: ', this.todayDate)
  }

  getDifferenceInDays() {
    // To calculate the time difference of two dates
    // var Difference_In_Time = this.todayDate.getTime() - this.birthdayDate.getTime(); // not working
    var Difference_In_Time = this.today.getTime() - this.birthdayDate.getTime();
    // To calculate the no. of days between two dates
    this.differenceInDays = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
    console.log('getDifferenceInDays: ', this.differenceInDays)
    
    console.log('this.today: ', this.today)
    console.log('this.birthday: ', this.birthday)

    document.getElementById('result-days').innerHTML = this.differenceInDays
  }

  lerp(a, b, t) {
    return a * (1 - t) + b * t
  }

  shakeThingsUp() {
    let self = this
    for (let i = 0; i < self.count; i++) {

      // Random
      let x = (Math.random() - 0.5) * 5.5
      let y = (Math.random() - 0.5) * 5.5
      let z = (Math.random() - 0.5) * 5.5

      self.pos.set([
        x, y, z
      ], i * 3)
    }

    // self.geo.setAttribute('pos', new THREE.InstancedBufferAttribute(self.pos, 3, false))

    // gsap.to(self.geo, { attr: { ["pos"]: new THREE.InstancedBufferAttribute(self.pos, 3, false) }});
    // gsap.to(self.geo.pos, {
    //   x: self.pos.x
    // })

    console.log('self.geo')
    console.log(self.geo.attributes.pos.array)
  }

  addParticles() {
    let self = this
    let min_radius = 0.5
    let max_radius = 1
    let particlegeo = new THREE.PlaneBufferGeometry(1, 1)
    self.geo = new THREE.InstancedBufferGeometry()
    self.geo.instanceCount = self.count
    self.geo.setAttribute('position', particlegeo.getAttribute('position'))
    self.geo.index = particlegeo.index

    self.pos = new Float32Array(self.count * 3)

    for (let i = 0; i < self.count; i++) {
      let theta = Math.random() * 2 * Math.PI

      // Cube
      // let r = self.lerp(min_radius, max_radius, Math.random())
      // let x = r * Math.sin(theta)
      // let y = (Math.random()-0.5) * 0.05
      // let z = r * Math.cos(theta)

      // Disc
      let r = self.lerp(min_radius, max_radius, Math.random())
      let x = r * Math.sin(theta)
      let y = (Math.random() - 0.5) * 0.05
      let z = r * Math.cos(theta)

      // // Random
      // let x = (Math.random()-0.5) * 5.5
      // let y = (Math.random()-0.5) * 5.5
      // let z = (Math.random()-0.5) * 5.5

      self.pos.set([
        x, y, z
      ], i * 3)
    }

    // console.log(self.geo.getAttribute('position'))

    self.geo.setAttribute('pos', new THREE.InstancedBufferAttribute(self.pos, 3, false))

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: { value: self.textureLoader.load(texturePath) },
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() }
      },
      transparent: true,
      depthTest: false,
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.points = new THREE.Mesh(self.geo, this.material)

    this.scene.add(this.points)
    // this.mesh.position.x = 300

  }

  addEventListeners() {
    let self = this
    document.addEventListener('mousemove', self.onMouseMove.bind(this))

    document.getElementById('tell-me').addEventListener('submit', this.onSubmit.bind(this))
    // document.getElementById('submit-btn').addEventListener('click', this.onSubmit.bind(this))
  }

  setupTextureLoader() {
    let self = this
    /* Textures */
    self.textureLoader = new THREE.TextureLoader()
    self.texture = self.textureLoader.load(texturePath)
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
        uMouse: { value: new THREE.Vector2(1, 1) },
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
        uQuadSize: { value: new THREE.Vector2(300, 300 * (self.height / self.width)) },
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
    this.scene.add(this.mesh);
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
    // console.log('x: ', self.mouse.x, 'y: ', self.mouse.y)
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

}

new Sketch({
  domElement: document.getElementById('webglContainer')
});
