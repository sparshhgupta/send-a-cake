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

  // Check if mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
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

    // Mobile-optimized renderer settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, // Disable antialiasing on mobile
      alpha: true, 
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2)); // Lower pixel ratio on mobile
    renderer.shadowMap.enabled = !isMobile; // Disable shadows on mobile
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.physicallyCorrectLights = !isMobile; // Disable on mobile for performance
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

    // Simplified lighting for mobile
    const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 1.0 : 0.9);
    scene.add(ambientLight);

    if (!isMobile) {
      // Only add directional light on desktop
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(8, 12, 8);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);
    }

    // Create simplified cake for mobile
    const cakeData = CakeSceneBuilder.createCake(scene, selectedTheme, isMobile);
    topTierPositionRef.current = cakeData.topTierPosition;
    
    // Create optimized candles
    CakeSceneBuilder.createCandles(scene, candles, { candleLightsRef, flamesRef, wicksRef }, topTierPositionRef.current, isMobile);

    // Simplified ground
    const groundGeometry = new THREE.CircleGeometry(20, isMobile ? 16 : 32);
    const groundMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xfafafa
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = !isMobile;
    scene.add(ground);

    let frameCount = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.01;
      frameCount++;

      // Reduce animation frequency on mobile (every 2 frames)
      const shouldAnimate = !isMobile || frameCount % 2 === 0;

      if (shouldAnimate) {
        // Animate flames - simplified on mobile
        flamesRef.current.forEach((flame, idx) => {
          if (flame && candleStates[idx]) {
            const scale = 1 + Math.sin(timeRef.current * 8 + idx) * 0.15; // Reduced animation
            flame.scale.setScalar(scale);
          }
        });

        // Animate smoke - reduced on mobile
        smokeRef.current.forEach((smoke) => {
          smoke.position.y += 0.02;
          smoke.scale.multiplyScalar(1.02);
          smoke.material.opacity *= 0.98;
        });

        smokeRef.current = smokeRef.current.filter(smoke => smoke.material.opacity > 0.01);
      }

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
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const cakeData = CakeSceneBuilder.createCake(sceneRef.current, selectedTheme, isMobile);
    topTierPositionRef.current = cakeData.topTierPosition;
    
    CakeSceneBuilder.createCandles(
      sceneRef.current, 
      candles, 
      { candleLightsRef, flamesRef, wicksRef }, 
      topTierPositionRef.current,
      isMobile
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
        light.intensity = candleStates[idx] ? (isMobile ? 1.0 : 2.0) : 0;
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