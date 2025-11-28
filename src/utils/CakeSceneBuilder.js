import * as THREE from 'three';
import { THEMES, CANDLE_COLORS } from './constants';

export class CakeSceneBuilder {
  static createCake(scene, theme) {
    const currentTheme = THEMES[theme];
    
    // === BOTTOM TIER ===
    const bottomHeight = 1.2;
    const bottomRadius = 2.5;
    
    // Main cake layer
    const bottomGeometry = new THREE.CylinderGeometry(bottomRadius, bottomRadius + 0.1, bottomHeight, 64);
    const cakeMaterial = new THREE.MeshStandardMaterial({ 
      color: currentTheme.cake,
      roughness: 0.3,
      metalness: 0.1
    });
    const bottomLayer = new THREE.Mesh(bottomGeometry, cakeMaterial);
    bottomLayer.position.y = bottomHeight / 2;
    bottomLayer.castShadow = true;
    bottomLayer.receiveShadow = true;
    bottomLayer.userData.isCake = true;
    scene.add(bottomLayer);

    // Frosting drip effect on bottom tier
    const frostingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFBF5,
      roughness: 0.2,
      metalness: 0.4
    });

    // Top frosting for bottom tier
    const bottomFrostingGeometry = new THREE.CylinderGeometry(bottomRadius + 0.05, bottomRadius + 0.05, 0.15, 64);
    const bottomFrosting = new THREE.Mesh(bottomFrostingGeometry, frostingMaterial);
    bottomFrosting.position.y = bottomHeight + 0.075;
    bottomFrosting.castShadow = true;
    bottomFrosting.userData.isCake = true;
    scene.add(bottomFrosting);

    // Decorative pearls around bottom tier
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const pearlGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const pearlMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFF8E7,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0xFFF8E7,
        emissiveIntensity: 0.1
      });
      const pearl = new THREE.Mesh(pearlGeometry, pearlMaterial);
      pearl.position.set(
        Math.cos(angle) * (bottomRadius + 0.05),
        bottomHeight + 0.075,
        Math.sin(angle) * (bottomRadius + 0.05)
      );
      pearl.castShadow = true;
      pearl.userData.isCake = true;
      scene.add(pearl);
    }

    // === MIDDLE TIER ===
    const middleHeight = 1.0;
    const middleRadius = 1.9;
    const middleY = bottomHeight + 0.15;
    
    const middleGeometry = new THREE.CylinderGeometry(middleRadius, middleRadius + 0.08, middleHeight, 64);
    const middleLayer = new THREE.Mesh(middleGeometry, cakeMaterial);
    middleLayer.position.y = middleY + middleHeight / 2;
    middleLayer.castShadow = true;
    middleLayer.receiveShadow = true;
    middleLayer.userData.isCake = true;
    scene.add(middleLayer);

    // Top frosting for middle tier
    const middleFrostingGeometry = new THREE.CylinderGeometry(middleRadius + 0.05, middleRadius + 0.05, 0.15, 64);
    const middleFrosting = new THREE.Mesh(middleFrostingGeometry, frostingMaterial);
    middleFrosting.position.y = middleY + middleHeight + 0.075;
    middleFrosting.castShadow = true;
    middleFrosting.userData.isCake = true;
    scene.add(middleFrosting);

    // Ribbon around middle tier
    const ribbonGeometry = new THREE.CylinderGeometry(middleRadius + 0.12, middleRadius + 0.12, 0.2, 64);
    const ribbonMaterial = new THREE.MeshStandardMaterial({ 
      color: currentTheme.accent,
      roughness: 0.4,
      metalness: 0.6
    });
    const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbon.position.y = middleY + middleHeight / 2;
    ribbon.castShadow = true;
    ribbon.userData.isCake = true;
    scene.add(ribbon);

    // Decorative roses around middle tier
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      
      // Rose center
      const roseCenterGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const roseMaterial = new THREE.MeshStandardMaterial({ 
        color: currentTheme.accent,
        roughness: 0.3,
        metalness: 0.4
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

      // Rose petals
      for (let p = 0; p < 5; p++) {
        const petalAngle = (p / 5) * Math.PI * 2;
        const petalGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const petal = new THREE.Mesh(petalGeometry, roseMaterial);
        petal.position.set(
          Math.cos(angle) * (middleRadius + 0.12) + Math.cos(petalAngle) * 0.08,
          middleY + middleHeight + 0.075,
          Math.sin(angle) * (middleRadius + 0.12) + Math.sin(petalAngle) * 0.08
        );
        petal.scale.set(1, 0.5, 1);
        petal.castShadow = true;
        petal.userData.isCake = true;
        scene.add(petal);
      }
    }

    // === TOP TIER ===
    const topHeight = 0.9;
    const topRadius = 1.4;
    const topY = middleY + middleHeight + 0.15;
    
    const topGeometry = new THREE.CylinderGeometry(topRadius, topRadius + 0.06, topHeight, 64);
    const topLayer = new THREE.Mesh(topGeometry, cakeMaterial);
    topLayer.position.y = topY + topHeight / 2;
    topLayer.castShadow = true;
    topLayer.receiveShadow = true;
    topLayer.userData.isCake = true;
    scene.add(topLayer);

    // Top frosting with swirl effect
    const topFrostingGeometry = new THREE.CylinderGeometry(topRadius + 0.05, topRadius + 0.05, 0.2, 64);
    const topFrosting = new THREE.Mesh(topFrostingGeometry, frostingMaterial);
    topFrosting.position.y = topY + topHeight + 0.1;
    topFrosting.castShadow = true;
    topFrosting.userData.isCake = true;
    scene.add(topFrosting);

    // Decorative swirls on top
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const swirlRadius = topRadius * 0.6;
      
      // Create a swirl using spheres
      for (let j = 0; j < 5; j++) {
        const swirlGeometry = new THREE.SphereGeometry(0.06 - j * 0.008, 12, 12);
        const swirlMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xFFFFFF,
          roughness: 0.2,
          metalness: 0.5
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

    // Glitter/sparkle effect on top tier
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * topRadius * 0.9;
      const sparkleGeometry = new THREE.OctahedronGeometry(0.03, 0);
      const sparkleMaterial = new THREE.MeshStandardMaterial({ 
        color: currentTheme.accent,
        roughness: 0.1,
        metalness: 0.9,
        emissive: currentTheme.accent,
        emissiveIntensity: 0.3
      });
      const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
      sparkle.position.set(
        Math.cos(angle) * radius,
        topY + topHeight + 0.21,
        Math.sin(angle) * radius
      );
      sparkle.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      sparkle.castShadow = true;
      sparkle.userData.isCake = true;
      scene.add(sparkle);
    }
  }

  static createCandles(scene, count, refs) {
    const { candleLightsRef, flamesRef, wicksRef } = refs;
    const maxRadius = 1.2;
    const minRadius = 0.2;
    const candlesPerLayer = 12;
    const totalLayers = Math.ceil(count / candlesPerLayer);
    const candleY = 2.6; // Adjusted for new cake height
    
    let candleIndex = 0;

    for (let layer = 0; layer < totalLayers; layer++) {
      const candlesInThisLayer = Math.min(candlesPerLayer, count - candleIndex);
      const layerRadius = maxRadius - (layer * (maxRadius - minRadius) / Math.max(totalLayers - 1, 1));
      
      for (let i = 0; i < candlesInThisLayer; i++) {
        if (candleIndex >= count) break;
        
        const angle = (i / candlesInThisLayer) * Math.PI * 2 + layer * 0.2;
        const x = Math.cos(angle) * layerRadius;
        const z = Math.sin(angle) * layerRadius;

        // Candle stick with spiral pattern
        const candleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
        const candleColor = CANDLE_COLORS[candleIndex % CANDLE_COLORS.length];
        const candleMaterial = new THREE.MeshStandardMaterial({ 
          color: candleColor,
          roughness: 0.4,
          metalness: 0.3
        });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.set(x, candleY, z);
        candle.castShadow = true;
        candle.userData.isCandle = true;
        scene.add(candle);

        // Decorative spiral on candle
        for (let s = 0; s < 8; s++) {
          const spiralGeometry = new THREE.SphereGeometry(0.02, 8, 8);
          const spiralMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.2,
            metalness: 0.8
          });
          const spiral = new THREE.Mesh(spiralGeometry, spiralMaterial);
          const spiralAngle = (s / 8) * Math.PI * 2;
          spiral.position.set(
            x + Math.cos(spiralAngle) * 0.09,
            candleY - 0.3 + s * 0.08,
            z + Math.sin(spiralAngle) * 0.09
          );
          spiral.userData.isCandle = true;
          scene.add(spiral);
        }

        // Black wick for blown candles
        const wickGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
        const wickMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const wick = new THREE.Mesh(wickGeometry, wickMaterial);
        wick.position.set(x, candleY + 0.475, z);
        wick.visible = false;
        wick.userData.isCandle = true;
        scene.add(wick);
        wicksRef.current.push(wick);

        // Flame with gradient
        const flameGeometry = new THREE.ConeGeometry(0.12, 0.4, 8);
        const flameMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xFFA500,
          transparent: true,
          opacity: 0.95
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(x, candleY + 0.6, z);
        flame.userData.isCandle = true;
        scene.add(flame);
        flamesRef.current.push(flame);

        // Inner flame glow
        const innerFlameGeometry = new THREE.ConeGeometry(0.08, 0.3, 8);
        const innerFlameMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xFFFF00,
          transparent: true,
          opacity: 0.8
        });
        const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
        innerFlame.position.set(x, candleY + 0.55, z);
        innerFlame.userData.isCandle = true;
        scene.add(innerFlame);

        // Outer glow
        const glowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xFFFF00,
          transparent: true,
          opacity: 0.4
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(x, candleY + 0.55, z);
        glow.userData.isCandle = true;
        scene.add(glow);

        // Point light for realistic lighting
        const light = new THREE.PointLight(0xFFA500, 2.0, 5);
        light.position.set(x, candleY + 0.6, z);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        scene.add(light);
        candleLightsRef.current.push(light);

        candleIndex++;
      }
    }
  }

  static createSmoke(scene, x, y, z, smokeRef) {
    const smokeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const smokeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x888888,
      transparent: true,
      opacity: 0.6
    });
    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smoke.position.set(x, y, z);
    scene.add(smoke);
    smokeRef.current.push(smoke);
    
    setTimeout(() => {
      if (scene && smoke.parent) scene.remove(smoke);
    }, 2000);
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