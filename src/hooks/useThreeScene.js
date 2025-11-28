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

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 10, 50);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.5, 9);
    camera.lookAt(0, 1.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.physicallyCorrectLights = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffd5aa, 0.5);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(0, 5, -8);
    scene.add(backLight);

    CakeSceneBuilder.createCake(scene, selectedTheme);
    CakeSceneBuilder.createCandles(scene, candles, { candleLightsRef, flamesRef, wicksRef });

    const groundGeometry = new THREE.CircleGeometry(15, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.8,
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

      flamesRef.current.forEach((flame, idx) => {
        if (candleStates[idx]) {
          flame.scale.y = 1 + Math.sin(timeRef.current * 10 + idx) * 0.2;
          flame.scale.x = 1 + Math.cos(timeRef.current * 8 + idx) * 0.1;
        }
      });

      smokeRef.current.forEach((smoke) => {
        smoke.position.y += 0.02;
        smoke.scale.multiplyScalar(1.02);
        smoke.material.opacity *= 0.98;
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
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (controlsRef.current) controlsRef.current.dispose();
      if (renderer.domElement && mountRef.current) mountRef.current.removeChild(renderer.domElement);
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
    CakeSceneBuilder.createCake(sceneRef.current, selectedTheme);
    CakeSceneBuilder.createCandles(sceneRef.current, candles, { candleLightsRef, flamesRef, wicksRef });
  }, [candles, selectedTheme]);

  // Update candle states
  useEffect(() => {
    flamesRef.current.forEach((flame, idx) => {
      if (flame) flame.visible = candleStates[idx];
    });
    
    wicksRef.current.forEach((wick, idx) => {
      if (wick) {
        const wasHidden = wick.visible === false;
        const shouldShow = !candleStates[idx];
        
        if (shouldShow && !wasHidden) {
          CakeSceneBuilder.createSmoke(sceneRef.current, wick.position.x, wick.position.y, wick.position.z, smokeRef);
        }
        wick.visible = shouldShow;
      }
    });
    
    candleLightsRef.current.forEach((light, idx) => {
      if (light) light.intensity = candleStates[idx] ? 2.0 : 0;
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