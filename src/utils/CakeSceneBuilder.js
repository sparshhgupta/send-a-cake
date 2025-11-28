import * as THREE from 'three';
import { THEMES, CANDLE_COLORS } from './constants';

export class CakeSceneBuilder {
  static createCake(scene, theme, isMobile = false) {
    const currentTheme = THEMES[theme];
    
    // Convert hex numbers to proper Three.js Color objects
    const cakeColor = new THREE.Color(currentTheme.cake);
    const accentColor = new THREE.Color(currentTheme.accent);
    
    // Reduced geometry segments for mobile
    const segments = isMobile ? 24 : 64;
    
    // === BOTTOM TIER ===
    const bottomHeight = 1.2;
    const bottomRadius = 2.5;
    
    // Main cake layer - use proper Color object
    const bottomGeometry = new THREE.CylinderGeometry(bottomRadius, bottomRadius + 0.1, bottomHeight, segments);
    const cakeMaterial = new THREE.MeshStandardMaterial({ 
      color: cakeColor, // Use Color object instead of hex number
      roughness: 0.4,
      metalness: 0.1
    });
    const bottomLayer = new THREE.Mesh(bottomGeometry, cakeMaterial);
    bottomLayer.position.y = bottomHeight / 2;
    bottomLayer.castShadow = !isMobile;
    bottomLayer.receiveShadow = !isMobile;
    bottomLayer.userData.isCake = true;
    scene.add(bottomLayer);

    // Frosting - simplified for mobile
    const frostingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFBF5,
      roughness: 0.3,
      metalness: 0.3
    });

    // Top frosting for bottom tier
    const bottomFrostingGeometry = new THREE.CylinderGeometry(bottomRadius + 0.05, bottomRadius + 0.05, 0.15, segments);
    const bottomFrosting = new THREE.Mesh(bottomFrostingGeometry, frostingMaterial);
    bottomFrosting.position.y = bottomHeight + 0.075;
    bottomFrosting.castShadow = !isMobile;
    bottomFrosting.userData.isCake = true;
    scene.add(bottomFrosting);

    // Reduced decorative pearls for mobile
    const pearlCount = isMobile ? 12 : 24;
    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2;
      const pearlGeometry = new THREE.SphereGeometry(0.08, isMobile ? 8 : 16, isMobile ? 6 : 16);
      const pearlMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFF8E7,
        roughness: 0.2,
        metalness: 0.6
      });
      const pearl = new THREE.Mesh(pearlGeometry, pearlMaterial);
      pearl.position.set(
        Math.cos(angle) * (bottomRadius + 0.05),
        bottomHeight + 0.075,
        Math.sin(angle) * (bottomRadius + 0.05)
      );
      pearl.castShadow = !isMobile;
      pearl.userData.isCake = true;
      scene.add(pearl);
    }

    // === MIDDLE TIER ===
    const middleHeight = 1.0;
    const middleRadius = 1.9;
    const middleY = bottomHeight + 0.15;
    
    const middleGeometry = new THREE.CylinderGeometry(middleRadius, middleRadius + 0.08, middleHeight, segments);
    const middleLayer = new THREE.Mesh(middleGeometry, cakeMaterial); // Reuse same material
    middleLayer.position.y = middleY + middleHeight / 2;
    middleLayer.castShadow = !isMobile;
    middleLayer.receiveShadow = !isMobile;
    middleLayer.userData.isCake = true;
    scene.add(middleLayer);

    // Top frosting for middle tier
    const middleFrostingGeometry = new THREE.CylinderGeometry(middleRadius + 0.05, middleRadius + 0.05, 0.15, segments);
    const middleFrosting = new THREE.Mesh(middleFrostingGeometry, frostingMaterial);
    middleFrosting.position.y = middleY + middleHeight + 0.075;
    middleFrosting.castShadow = !isMobile;
    middleFrosting.userData.isCake = true;
    scene.add(middleFrosting);

    // Ribbon around middle tier - use accent color
    const ribbonGeometry = new THREE.CylinderGeometry(middleRadius + 0.12, middleRadius + 0.12, 0.2, segments);
    const ribbonMaterial = new THREE.MeshStandardMaterial({ 
      color: accentColor, // Use accent Color object
      roughness: 0.5,
      metalness: 0.4
    });
    const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbon.position.y = middleY + middleHeight / 2;
    ribbon.castShadow = !isMobile;
    ribbon.userData.isCake = true;
    scene.add(ribbon);

    // Reduced decorative elements for mobile
    if (!isMobile) {
      // Only add roses on desktop - use accent color
      const roseCount = 8;
      for (let i = 0; i < roseCount; i++) {
        const angle = (i / roseCount) * Math.PI * 2;
        const roseCenterGeometry = new THREE.SphereGeometry(0.1, 12, 12);
        const roseMaterial = new THREE.MeshStandardMaterial({ 
          color: accentColor, // Use accent Color object
          roughness: 0.4,
          metalness: 0.3
        });
        const roseCenter = new THREE.Mesh(roseCenterGeometry, roseMaterial);
        roseCenter.position.set(
          Math.cos(angle) * (middleRadius + 0.12),
          middleY + middleHeight + 0.075,
          Math.sin(angle) * (middleRadius + 0.12)
        );
        roseCenter.castShadow = true;
        roseCenter.userData.isCake = true;
        scene.add(roseCenter);
      }
    }

    // === TOP TIER ===
    const topHeight = 0.9;
    const topRadius = 1.4;
    const topY = middleY + middleHeight + 0.15;
    
    const topGeometry = new THREE.CylinderGeometry(topRadius, topRadius + 0.06, topHeight, segments);
    const topLayer = new THREE.Mesh(topGeometry, cakeMaterial); // Reuse same material
    topLayer.position.y = topY + topHeight / 2;
    topLayer.castShadow = !isMobile;
    topLayer.receiveShadow = !isMobile;
    topLayer.userData.isCake = true;
    scene.add(topLayer);

    // Top frosting with swirl effect - simplified for mobile
    const topFrostingGeometry = new THREE.CylinderGeometry(topRadius + 0.05, topRadius + 0.05, 0.2, segments);
    const topFrosting = new THREE.Mesh(topFrostingGeometry, frostingMaterial);
    topFrosting.position.y = topY + topHeight + 0.1;
    topFrosting.castShadow = !isMobile;
    topFrosting.userData.isCake = true;
    scene.add(topFrosting);

    // Reduced decorative swirls for mobile
    if (!isMobile) {
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const swirlRadius = topRadius * 0.6;
        
        for (let j = 0; j < 3; j++) {
          const swirlGeometry = new THREE.SphereGeometry(0.06 - j * 0.008, 8, 8);
          const swirlMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            roughness: 0.3,
            metalness: 0.4
          });
          const swirl = new THREE.Mesh(swirlGeometry, swirlMaterial);
          const swirlAngle = angle + j * 0.3;
          const currentRadius = swirlRadius - j * 0.1;
          swirl.position.set(
            Math.cos(swirlAngle) * currentRadius,
            topY + topHeight + 0.2 + j * 0.05,
            Math.sin(swirlAngle) * currentRadius
          );
          swirl.castShadow = true;
          swirl.userData.isCake = true;
          scene.add(swirl);
        }
      }
    }

    // Reduced glitter/sparkle effect for mobile - use accent color
    const sparkleCount = isMobile ? 8 : 16;
    for (let i = 0; i < sparkleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * topRadius * 0.9;
      const sparkleGeometry = new THREE.OctahedronGeometry(0.03, 0);
      const sparkleMaterial = new THREE.MeshStandardMaterial({ 
        color: accentColor, // Use accent Color object
        roughness: 0.2,
        metalness: 0.8,
        emissive: accentColor,
        emissiveIntensity: 0.2
      });
      const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
      sparkle.position.set(
        Math.cos(angle) * radius,
        topY + topHeight + 0.21,
        Math.sin(angle) * radius
      );
      sparkle.castShadow = !isMobile;
      sparkle.userData.isCake = true;
      scene.add(sparkle);
    }

    return {
      topTierPosition: {
        y: topY + topHeight + 0.2,
        radius: topRadius
      }
    };
  }

  static createCandles(scene, count, refs, topTierPosition = null, isMobile = false) {
    const { candleLightsRef, flamesRef, wicksRef } = refs;
    
    let topY, topRadius;
    if (topTierPosition) {
      topY = topTierPosition.y;
      topRadius = topTierPosition.radius;
    } else {
      const bottomHeight = 1.2;
      const middleHeight = 1.0;
      const topHeight = 0.9;
      topY = bottomHeight + 0.15 + middleHeight + 0.15 + topHeight + 0.2;
      topRadius = 1.4;
    }
    
    // Calculate positions
    const positions = [];
    const effectiveRadius = Math.min(topRadius * 0.9, 1.5); // Limit spread for performance
    
    // Simple spiral distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y) * effectiveRadius;
      const theta = goldenAngle * i;
      
      positions.push({
        x: Math.cos(theta) * radius,
        z: Math.sin(theta) * radius
      });
    }

    // Create optimized candles
    positions.slice(0, count).forEach((pos, candleIndex) => {
      const { x, z } = pos;

      // Convert candle color to proper Three.js Color
      const candleHexColor = CANDLE_COLORS[candleIndex % CANDLE_COLORS.length];
      const candleColor = new THREE.Color(candleHexColor);

      // Simplified candle geometry for mobile
      const candleSegments = isMobile ? 8 : 12;
      const candleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.9, candleSegments);
      const candleMaterial = new THREE.MeshStandardMaterial({ 
        color: candleColor, // Use Color object
        roughness: 0.4,
        metalness: 0.3
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.set(x, topY + 0.45, z);
      candle.castShadow = !isMobile;
      candle.userData.isCandle = true;
      scene.add(candle);

      // Simplified band
      const bandGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.1, candleSegments);
      const bandMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFD700,
        roughness: 0.3,
        metalness: 0.7
      });
      const band = new THREE.Mesh(bandGeometry, bandMaterial);
      band.position.set(x, topY + 0.25, z);
      band.userData.isCandle = true;
      scene.add(band);

      // Wick
      const wickGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 4);
      const wickMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
      const wick = new THREE.Mesh(wickGeometry, wickMaterial);
      wick.position.set(x, topY + 1.0, z);
      wick.visible = false;
      wick.userData.isCandle = true;
      scene.add(wick);
      wicksRef.current.push(wick);

      // Simplified flame for mobile
      const flameSegments = isMobile ? 4 : 6;
      const flameGeometry = new THREE.ConeGeometry(0.12, 0.4, flameSegments);
      const flameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFF6B00,
        transparent: true,
        opacity: 0.9
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.set(x, topY + 1.15, z);
      flame.userData.isCandle = true;
      scene.add(flame);
      flamesRef.current.push(flame);

      // Only add inner flame and glow on desktop
      if (!isMobile) {
        const innerFlameGeometry = new THREE.ConeGeometry(0.08, 0.3, flameSegments);
        const innerFlameMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xFFFF00,
          transparent: true,
          opacity: 0.8
        });
        const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
        innerFlame.position.set(x, topY + 1.1, z);
        innerFlame.userData.isCandle = true;
        scene.add(innerFlame);

        const glowGeometry = new THREE.SphereGeometry(0.15, 6, 6);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xFFAA00,
          transparent: true,
          opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(x, topY + 1.1, z);
        glow.userData.isCandle = true;
        scene.add(glow);
      }

      // Point light - reduced intensity on mobile
      const light = new THREE.PointLight(0xFF6B00, isMobile ? 0.8 : 1.5, 4);
      light.position.set(x, topY + 1.15, z);
      light.castShadow = false; // Always disable point light shadows
      scene.add(light);
      candleLightsRef.current.push(light);
    });
  }

  static createSmoke(scene, x, y, z, smokeRef) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const smokeGeometry = new THREE.SphereGeometry(0.1, 4, 4); // Simplified smoke
    const smokeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x888888,
      transparent: true,
      opacity: 0.5
    });
    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smoke.position.set(x, y, z);
    scene.add(smoke);
    smokeRef.current.push(smoke);
    
    setTimeout(() => {
      if (scene && smoke.parent) scene.remove(smoke);
    }, 1500); // Shorter duration
  }

  static removeCakeAndCandles(scene, refs) {
    const { candleLightsRef, flamesRef, wicksRef } = refs;
    
    const oldCake = scene.children.filter(obj => obj.userData.isCake);
    oldCake.forEach(obj => scene.remove(obj));
    
    candleLightsRef.current.forEach(light => scene.remove(light));
    flamesRef.current.forEach(flame => scene.remove(flame));
    wicksRef.current.forEach(wick => scene.remove(wick));
    
    const candleObjects = scene.children.filter(obj => obj.userData.isCandle);
    candleObjects.forEach(obj => scene.remove(obj));

    candleLightsRef.current = [];
    flamesRef.current = [];
    wicksRef.current = [];
  }
}