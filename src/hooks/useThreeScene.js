import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CakeSceneBuilder } from '../utils/CakeSceneBuilder';

export const useThreeScene = (mountRef, candles, selectedTheme, autoRotate, candleStates) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const candleLightsRef = useRef([]);
  const flamesRef = useRef([]);
  const wicksRef = useRef([]);
  const smokeRef = useRef([]);
  const controlsRef = useRef(null);
  const animationIdRef = useRef(null);
  const timeRef = useRef(0);
  const topTierPositionRef = useRef(null);

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 15, 50);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      preserveDrawingBuffer: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.physicallyCorrectLights = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(8, 12, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    directionalLight.shadow.bias = -0.0001;
    scene.add(directionalLight);

    const fillLight1 = new THREE.DirectionalLight(0xffd5aa, 0.6);
    fillLight1.position.set(-8, 8, -8);
    scene.add(fillLight1);

    const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight2.position.set(0, 8, -10);
    scene.add(fillLight2);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 3, -8);
    scene.add(rimLight);

    // Create cake and store top tier position
    const cakeData = CakeSceneBuilder.createCake(scene, selectedTheme);
    topTierPositionRef.current = cakeData.topTierPosition;
    
    // Create candles using the top tier position
    CakeSceneBuilder.createCandles(scene, candles, { candleLightsRef, flamesRef, wicksRef }, topTierPositionRef.current);

    // Enhanced ground
    const groundGeometry = new THREE.CircleGeometry(20, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfafafa,
      roughness: 0.7,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.01;

      // Animate flames
      flamesRef.current.forEach((flame, idx) => {
        if (candleStates[idx]) {
          flame.scale.y = 1 + Math.sin(timeRef.current * 12 + idx) * 0.25;
          flame.scale.x = 1 + Math.cos(timeRef.current * 10 + idx) * 0.15;
          flame.rotation.y = Math.sin(timeRef.current * 5 + idx) * 0.1;
        }
      });

      // Animate smoke
      smokeRef.current.forEach((smoke) => {
        smoke.position.y += 0.025;
        smoke.scale.multiplyScalar(1.03);
        smoke.material.opacity *= 0.97;
      });

      smokeRef.current = smokeRef.current.filter(smoke => smoke.material.opacity > 0.01);

      controlsRef.current?.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (controlsRef.current) controlsRef.current.dispose();
      if (renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Update auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Rebuild scene when candles or theme changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    CakeSceneBuilder.removeCakeAndCandles(sceneRef.current, { candleLightsRef, flamesRef, wicksRef });
    
    // Create cake and store top tier position
    const cakeData = CakeSceneBuilder.createCake(sceneRef.current, selectedTheme);
    topTierPositionRef.current = cakeData.topTierPosition;
    
    // Create candles using the top tier position
    CakeSceneBuilder.createCandles(
      sceneRef.current, 
      candles, 
      { candleLightsRef, flamesRef, wicksRef }, 
      topTierPositionRef.current
    );
  }, [candles, selectedTheme]);

  // Update candle states
  useEffect(() => {
    flamesRef.current.forEach((flame, idx) => {
      if (flame && idx < candleStates.length) {
        flame.visible = candleStates[idx];
      }
    });
    
    wicksRef.current.forEach((wick, idx) => {
      if (wick && idx < candleStates.length) {
        const wasHidden = wick.visible === false;
        const shouldShow = !candleStates[idx];
        
        if (shouldShow && !wasHidden) {
          CakeSceneBuilder.createSmoke(sceneRef.current, wick.position.x, wick.position.y, wick.position.z, smokeRef);
        }
        wick.visible = shouldShow;
      }
    });
    
    candleLightsRef.current.forEach((light, idx) => {
      if (light && idx < candleStates.length) {
        light.intensity = candleStates[idx] ? 2.5 : 0;
      }
    });
  }, [candleStates]);

  return {
    sceneRef,
    rendererRef,
    timeRef,
    flamesRef,
    wicksRef,
    candleLightsRef,
    smokeRef
  };
};