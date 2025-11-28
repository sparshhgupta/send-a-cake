import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CakeSceneBuilder } from '../utils/CakeSceneBuilder';

export const useThreeScene = (mountRef, candles, selectedTheme, autoRotate, candleStates, darkMode = true) => {
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
    // Dynamic background based on theme
    if (darkMode) {
      scene.background = new THREE.Color(0x0a0a0a); // Rich black for dark mode
      scene.fog = new THREE.Fog(0x0a0a0a, 15, 35);
    } else {
      scene.background = new THREE.Color(0xf8fafc); // Light gray for light mode
      scene.fog = new THREE.Fog(0xf8fafc, 20, 60);
    }
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    
    // Adjusted camera position to see entire cake with candles
    camera.position.set(0, 6, 14);
    camera.lookAt(0, 3, 0);
    cameraRef.current = camera;

    // Mobile-optimized renderer settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile,
      alpha: true, 
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = darkMode ? 1.3 : 1.2;
    renderer.physicallyCorrectLights = !isMobile;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // Enhanced lighting with theme adaptation
    const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.6 : (darkMode ? 0.8 : 0.9));
    scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, isMobile ? 0.8 : (darkMode ? 1.2 : 1.5));
    directionalLight.position.set(5, 12, 8);
    directionalLight.castShadow = !isMobile;
    if (!isMobile) {
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.bottom = -20;
    }
    scene.add(directionalLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(darkMode ? 0xfff5e6 : 0xffd5aa, darkMode ? 0.4 : 0.6);
    fillLight.position.set(0, 8, 10);
    scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0xffffff, darkMode ? 0.3 : 0.4);
    rimLight.position.set(-8, 6, -8);
    scene.add(rimLight);

    // Create cake and store top tier position
    const cakeData = CakeSceneBuilder.createCake(scene, selectedTheme, isMobile);
    topTierPositionRef.current = cakeData.topTierPosition;
    
    // Create optimized candles
    CakeSceneBuilder.createCandles(scene, candles, { candleLightsRef, flamesRef, wicksRef }, topTierPositionRef.current, isMobile);

    // Dynamic ground based on theme
    const groundGeometry = new THREE.CircleGeometry(25, isMobile ? 16 : 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: darkMode ? 0x1a1a1a : 0xf0f9ff,
      roughness: 0.8,
      metalness: darkMode ? 0.1 : 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = !isMobile;
    scene.add(ground);

    // Subtle reflective surface
    const reflectorGeometry = new THREE.CircleGeometry(3, 16);
    const reflectorMaterial = new THREE.MeshStandardMaterial({
      color: darkMode ? 0x333333 : 0x666666,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: darkMode ? 0.1 : 0.05
    });
    const reflector = new THREE.Mesh(reflectorGeometry, reflectorMaterial);
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.y = -0.49;
    scene.add(reflector);

    let frameCount = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.01;
      frameCount++;

      const shouldAnimate = !isMobile || frameCount % 2 === 0;

      if (shouldAnimate) {
        flamesRef.current.forEach((flame, idx) => {
          if (flame && candleStates[idx]) {
            const scale = 1 + Math.sin(timeRef.current * 8 + idx) * 0.15;
            flame.scale.setScalar(scale);
          }
        });

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
  }, [darkMode]); // Re-initialize when darkMode changes

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
        light.intensity = candleStates[idx] ? (isMobile ? 1.2 : 2.0) : 0;
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