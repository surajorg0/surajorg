/**
 * SurajOrg 3D Interactive Mascot Engine
 * ─────────────────────────────────────
 * Features:
 * - Fixed Hero staging: right side on desktop, centered & balanced on mobile
 * - Head + Neck gaze tracking following cursor with accurate up/down and left/right axes
 * - Per-eye iris convergence: inward focus on nose tip when cursor is at nose
 * - Interactive arm reaching: hand reaches out to touch cursor when cursor is near either hand
 * - Fixed viewport placement with smooth scroll fade-out past hero
 * - Breathing idle micro-animation
 * - 60 FPS Damped Lerp Physics + High-Contrast Studio Lighting
 */

(function initLucaWorld() {
  'use strict';

  function waitForDependencies(callback) {
    if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
      callback();
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
          clearInterval(interval);
          callback();
        } else if (attempts > 50) {
          clearInterval(interval);
          console.error('Three.js or GLTFLoader failed to load in time.');
        }
      }, 100);
    }
  }

  waitForDependencies(startScene);

  function startScene() {
    const canvas = document.getElementById('luca-world-canvas');
    if (!canvas) {
      console.warn('Canvas #luca-world-canvas not found.');
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Scene & Camera ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10.5);

    // ── WebGL Renderer ──
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (renderer.outputEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // ── Studio Lighting ──
    const ambient = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 8, 8);
    scene.add(keyLight);

    const cyanFill = new THREE.DirectionalLight(0x38bdf8, 2.0);
    cyanFill.position.set(-6, 4, 5);
    scene.add(cyanFill);

    const rimLight = new THREE.PointLight(0x06b6d4, 4.0, 30);
    rimLight.position.set(0, 7, -6);
    scene.add(rimLight);

    const groundBounce = new THREE.DirectionalLight(0x34d399, 1.2);
    groundBounce.position.set(0, -6, 3);
    scene.add(groundBounce);

    // ── Character Root Pivot ──
    const mascotPivot = new THREE.Group();
    mascotPivot.name = 'Luca_World_Pivot';
    scene.add(mascotPivot);

    let isModelLoaded = false;
    let characterModel = null;
    let rootNodeRef = null;
    let rigNodeRef = null;

    // Skeleton bones
    let headBone = null;
    let neckBone = null;
    const initialHeadEuler = new THREE.Euler();
    const initialNeckEuler = new THREE.Euler();

    // Eye groups and iris meshes
    let leftEyeGroup = null;   // EyeR.002 (character's left = screen right)
    let rightEyeGroup = null;  // EyeR.003 (character's right = screen left)
    let leftIris = null;       // EyeR.002_iris_0
    let rightIris = null;      // EyeR.003_iris_0

    // Right arm bones (character's right = screen left, facing text)
    let rightUpperArm = null;  // DEF-upper_arm.R_072
    let rightForearm = null;   // DEF-forearm.R_074
    let rightHand = null;      // DEF-hand.R_076
    const initialRUpperArm = new THREE.Euler();
    const initialRForearm = new THREE.Euler();
    const initialRHand = new THREE.Euler();
    const rightArmReach = { yaw: 0, pitch: 0, extend: 0 };

    // Left arm bones (character's left = screen right)
    let leftUpperArm = null;   // DEF-upper_arm.L_042
    let leftForearm = null;    // DEF-forearm.L_044
    let leftHand = null;       // DEF-hand.L_046
    const initialLUpperArm = new THREE.Euler();
    const initialLForearm = new THREE.Euler();
    const initialLHand = new THREE.Euler();
    const leftArmReach = { yaw: 0, pitch: 0, extend: 0 };

    // ── Model Candidates ──
    const modelCandidates = [
      '/assets/models/luca_1k.glb',
      '/assets/models/luca_paguro.glb',
      '/luca_paguro_from_luca__disney_original 1k texture.glb',
      'assets/models/luca_1k.glb',
      'assets/models/luca_paguro.glb'
    ];

    const loader = new THREE.GLTFLoader();

    function tryLoad(index) {
      if (index === undefined) index = 0;
      if (index >= modelCandidates.length) {
        console.error('All Luca model candidates failed to load.');
        return;
      }
      loader.load(
        modelCandidates[index],
        function(gltf) { setupCharacter(gltf); },
        undefined,
        function(err) {
          console.warn('Candidate ' + index + ' failed:', modelCandidates[index]);
          tryLoad(index + 1);
        }
      );
    }

    tryLoad(0);

    function setupCharacter(gltf) {
      characterModel = gltf.scene;

      // Enhance materials
      characterModel.traverse(function(child) {
        if (child.isMesh) {
          child.frustumCulled = false;
          if (child.material) {
            child.material.depthWrite = true;
            child.material.side = THREE.FrontSide;
            if (child.material.map) {
              child.material.map.encoding = THREE.sRGBEncoding;
            }
            if (typeof child.material.roughness === 'number') {
              child.material.roughness = Math.max(0.2, Math.min(0.8, child.material.roughness));
            }
          }
        }
      });

      // Locate all bones, eye groups, and arm bones
      characterModel.traverse(function(obj) {
        if (obj.name === 'RootNode') rootNodeRef = obj;
        if (obj.name && obj.name.toLowerCase().includes('rig')) rigNodeRef = obj;

        var lowerName = (obj.name || '').toLowerCase();

        // Head bone (DEF-spine.006)
        if (lowerName.includes('spine.006') || lowerName.includes('spine006') || lowerName.includes('spine_006')) {
          headBone = obj;
          initialHeadEuler.copy(obj.rotation);
        }
        // Neck bone (DEF-spine.005)
        else if (lowerName.includes('spine.005') || lowerName.includes('spine005') || lowerName.includes('spine_005')) {
          neckBone = obj;
          initialNeckEuler.copy(obj.rotation);
        }

        // Eye groups
        if (obj.name === 'EyeR.002') leftEyeGroup = obj;
        else if (obj.name === 'EyeR.003') rightEyeGroup = obj;

        // Iris meshes
        if (obj.name && obj.name.includes('iris')) {
          if (obj.parent && obj.parent.name === 'EyeR.002') leftIris = obj;
          else if (obj.parent && obj.parent.name === 'EyeR.003') rightIris = obj;
        }

        // Right arm bones (Viewer's left)
        if (obj.name === 'DEF-upper_arm.R_072') {
          rightUpperArm = obj;
          initialRUpperArm.copy(obj.rotation);
        }
        if (obj.name === 'DEF-forearm.R_074') {
          rightForearm = obj;
          initialRForearm.copy(obj.rotation);
        }
        if (obj.name === 'DEF-hand.R_076') {
          rightHand = obj;
          initialRHand.copy(obj.rotation);
        }

        // Left arm bones (Viewer's right)
        if (obj.name === 'DEF-upper_arm.L_042') {
          leftUpperArm = obj;
          initialLUpperArm.copy(obj.rotation);
        }
        if (obj.name === 'DEF-forearm.L_044') {
          leftForearm = obj;
          initialLForearm.copy(obj.rotation);
        }
        if (obj.name === 'DEF-hand.L_046') {
          leftHand = obj;
          initialLHand.copy(obj.rotation);
        }
      });

      if (!rootNodeRef) rootNodeRef = characterModel;

      // Keep only active character rig and eyes
      if (rootNodeRef && rootNodeRef.children) {
        rootNodeRef.children.forEach(function(child) {
          if (child !== rigNodeRef && !child.name.toLowerCase().includes('rig')) {
            if (child.name === 'EyeR.002' || child.name === 'EyeR.003') {
              child.visible = true;
            } else {
              child.visible = false;
            }
          }
        });
      }

      // Center model in world coordinates
      rootNodeRef.position.set(0, -3.05, 0);

      // Base scaling
      var targetHeight = 4.5;
      var nativeHeight = 6.14;
      mascotPivot.scale.setScalar(targetHeight / nativeHeight);

      mascotPivot.add(characterModel);
      isModelLoaded = true;

      // Debug exposure
      window.__lucaWorld = {
        isLoaded: true, scene: scene, camera: camera, pivot: mascotPivot,
        headBone: headBone, neckBone: neckBone,
        leftEyeGroup: leftEyeGroup, rightEyeGroup: rightEyeGroup,
        leftIris: leftIris, rightIris: rightIris,
        rightUpperArm: rightUpperArm, rightForearm: rightForearm, rightHand: rightHand,
        leftUpperArm: leftUpperArm, leftForearm: leftForearm, leftHand: leftHand,
        renderer: renderer
      };

      console.log('Luca mounted successfully. Tracking ready.');
    }

    // ── Mouse / Cursor Tracking ──
    var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    var mousePixel = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    window.addEventListener('mousemove', function(e) {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePixel.x = e.clientX;
      mousePixel.y = e.clientY;
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
      if (!e.touches[0]) return;
      mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      mousePixel.x = e.touches[0].clientX;
      mousePixel.y = e.touches[0].clientY;
    }, { passive: true });

    // ── Responsive Viewport ──
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // ── 60 FPS Render Loop ──
    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      var elapsedTime = clock.getElapsedTime();
      if (!isModelLoaded) return;

      // ─── Scroll-based smooth fade ───
      var currentScrollY = window.scrollY || window.pageYOffset || 0;
      var heroHeight = window.innerHeight;
      var fadeStart = heroHeight * 0.15;
      var fadeEnd = heroHeight * 0.75;
      var opacity;
      if (currentScrollY <= fadeStart) {
        opacity = 1.0;
      } else if (currentScrollY >= fadeEnd) {
        opacity = 0.0;
      } else {
        opacity = 1.0 - (currentScrollY - fadeStart) / (fadeEnd - fadeStart);
      }
      canvas.style.opacity = opacity.toFixed(3);
      if (opacity < 0.01) return;

      // ─── Smooth fast mouse lerp (responsive tracking) ───
      mouse.x += (mouse.targetX - mouse.x) * 0.22;
      mouse.y += (mouse.targetY - mouse.y) * 0.22;

      var isWide = window.innerWidth > 1024;

      // ─── Positioning (Preserving original natural sizing) ───
      if (isWide) {
        // Desktop: fixed right side of hero at original full size
        mascotPivot.position.set(3.25, -1.15, 0);
        mascotPivot.scale.setScalar(4.5 / 6.14); // Original size (~0.733)
      } else {
        // Mobile: dynamically anchored strictly below "Choudhari" inside the mobile slot
        var mobileSlot = document.getElementById('hero-mobile-slot');
        if (mobileSlot) {
          var rect = mobileSlot.getBoundingClientRect();

          var vHalfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
          var vHalfW = vHalfH * camera.aspect;

          // Scale Luca so his full body fits within the slot height (~210px tall on screen)
          var slotHeight = rect.height > 100 ? rect.height : 300;
          var targetScreenH = Math.max(160, Math.min(220, slotHeight - 60));
          var target3DH = (targetScreenH / window.innerHeight) * (2 * vHalfH);
          var mobileScale = target3DH / 6.14;

          mascotPivot.scale.setScalar(mobileScale);

          // Horizontally center in slot
          var slotCenterX = rect.left + rect.width / 2;
          var ndcX = (slotCenterX / window.innerWidth) * 2 - 1;
          mascotPivot.position.x = ndcX * vHalfW;
          mascotPivot.position.z = 0;

          // Initial placement around the center of the slot
          var slotCenterY = rect.top + rect.height * 0.55;
          var slotCenterNDC = -(slotCenterY / window.innerHeight) * 2 + 1;
          mascotPivot.position.y = slotCenterNDC * vHalfH;

          // REAL-TIME CLOSED-LOOP HEAD CLEARANCE:
          // Directly measure where Luca's head bone projects onto the user's screen in pixels!
          mascotPivot.updateMatrixWorld(true);
          if (headBone) {
            var headWorld = new THREE.Vector3();
            headBone.getWorldPosition(headWorld);
            headWorld.project(camera);
            var actualHeadScreenY = (-headWorld.y * 0.5 + 0.5) * window.innerHeight;

            // Luca's hair extends ~45px above headBone.
            // We guarantee the top of hair is AT LEAST 25px below rect.top ("Choudhari").
            // Therefore, headBone (eyes/face) must be at least rect.top + 70px!
            var minAllowedHeadY = rect.top + 70;
            if (actualHeadScreenY < minAllowedHeadY) {
              var errorPx = minAllowedHeadY - actualHeadScreenY;
              var error3D = (errorPx / window.innerHeight) * (2 * vHalfH);
              mascotPivot.position.y -= error3D;
            }
          }
        } else {
          mascotPivot.position.set(0, -1.2, 0);
          mascotPivot.scale.setScalar(0.35);
        }
      }
      mascotPivot.rotation.set(0, 0, 0); // Locked in place

      // ─── HEAD + EYE + ARM INTERACTIONS ───
      if (!prefersReducedMotion) {
        // Character's face center in screen NDC coordinates (dynamic world projection)
        var headScreenNDC = new THREE.Vector3();
        if (headBone) {
          headBone.getWorldPosition(headScreenNDC);
          headScreenNDC.project(camera);
        } else {
          headScreenNDC.set(isWide ? 0.42 : 0, isWide ? 0.05 : 0, 0);
        }
        var centerRefX = headScreenNDC.x;
        var centerRefY = headScreenNDC.y;

        var deltaX = Math.max(-1.4, Math.min(1.4, mouse.x - centerRefX));
        var deltaY = Math.max(-1.2, Math.min(1.2, mouse.y - centerRefY));

        // Subtle breathing idle nod
        var idleNod = Math.sin(elapsedTime * 1.8) * 0.022;

        // ═══ HEAD & NECK BONES ═══
        // Left/Right: cursor right (deltaX > 0) -> head turns right (positive yaw)
        // Up/Down: cursor UP (deltaY > 0) -> head tilts UP (negative pitch in bone coords)
        var headYaw = deltaX * 0.85;
        var headPitch = -deltaY * 0.55 + idleNod;

        var neckYaw = deltaX * 0.25;
        var neckPitch = -deltaY * 0.18 + idleNod * 0.5;

        if (headBone) {
          headBone.rotation.y = initialHeadEuler.y + headYaw;
          headBone.rotation.x = initialHeadEuler.x + headPitch;
        }
        if (neckBone) {
          neckBone.rotation.y = initialNeckEuler.y + neckYaw;
          neckBone.rotation.x = initialNeckEuler.x + neckPitch;
        }

        // ═══ NOSE DETECTION & EYELID/IRIS FOCUS ═══
        // Project 3D nose position to screen pixels to detect when cursor is at the nose
        var noseWorld = new THREE.Vector3();
        if (headBone) {
          headBone.getWorldPosition(noseWorld);
          noseWorld.z += 0.35; // Forward from head center
          noseWorld.y += 0.08;
        } else {
          mascotPivot.getWorldPosition(noseWorld);
          noseWorld.y += 2.2;
        }
        var noseProj = noseWorld.clone().project(camera);
        var nosePixelX = (noseProj.x * 0.5 + 0.5) * window.innerWidth;
        var nosePixelY = (-noseProj.y * 0.5 + 0.5) * window.innerHeight;

        var distToNose = Math.hypot(mousePixel.x - nosePixelX, mousePixel.y - nosePixelY);
        // Inward convergence activates strongly when cursor points on/near the nose (within 160px)
        var noseProximity = Math.max(0, 1.0 - distToNose / 160);
        var noseConvergence = noseProximity * noseProximity * 0.26;

        // Per-eye calculation:
        // Left eye (viewer's right) shifts left (-x) to focus inward on nose
        // Right eye (viewer's left) shifts right (+x) to focus inward on nose
        var leftEyeDeltaX = deltaX - 0.10 - noseConvergence;
        var rightEyeDeltaX = deltaX + 0.10 + noseConvergence;

        var irisScale = 0.016;
        var irisYScale = 0.012;

        if (leftIris) {
          leftIris.position.x = leftEyeDeltaX * irisScale;
          leftIris.position.y = deltaY * irisYScale;
        }
        if (rightIris) {
          rightIris.position.x = rightEyeDeltaX * irisScale;
          rightIris.position.y = deltaY * irisYScale;
        }

        // Eye group rotation: X rotation matches head pitch direction (UP tilts up)
        if (leftEyeGroup) {
          leftEyeGroup.rotation.y = leftEyeDeltaX * 0.20;
          leftEyeGroup.rotation.x = -deltaY * 0.15;
        }
        if (rightEyeGroup) {
          rightEyeGroup.rotation.y = rightEyeDeltaX * 0.20;
          rightEyeGroup.rotation.x = -deltaY * 0.15;
        }

        // ═══ HAND REACHING TO TOUCH CURSOR ═══
        // Project right and left hands to screen pixels
        var rHandWorld = new THREE.Vector3();
        if (rightHand) {
          rightHand.getWorldPosition(rHandWorld);
        } else {
          mascotPivot.getWorldPosition(rHandWorld);
          rHandWorld.x -= 0.6;
          rHandWorld.y += 0.8;
        }
        var rHandProj = rHandWorld.clone().project(camera);
        var rHandPixelX = (rHandProj.x * 0.5 + 0.5) * window.innerWidth;
        var rHandPixelY = (-rHandProj.y * 0.5 + 0.5) * window.innerHeight;
        var rDist = Math.hypot(mousePixel.x - rHandPixelX, mousePixel.y - rHandPixelY);

        var lHandWorld = new THREE.Vector3();
        if (leftHand) {
          leftHand.getWorldPosition(lHandWorld);
        } else {
          mascotPivot.getWorldPosition(lHandWorld);
          lHandWorld.x += 0.6;
          lHandWorld.y += 0.8;
        }
        var lHandProj = lHandWorld.clone().project(camera);
        var lHandPixelX = (lHandProj.x * 0.5 + 0.5) * window.innerWidth;
        var lHandPixelY = (-lHandProj.y * 0.5 + 0.5) * window.innerHeight;
        var lDist = Math.hypot(mousePixel.x - lHandPixelX, mousePixel.y - lHandPixelY);

        var reachZone = 320; // Active proximity zone in pixels

        // Right Arm Reaching (facing left side / text area)
        var reachRStrength = Math.max(0, 1.0 - rDist / reachZone);
        reachRStrength = reachRStrength * reachRStrength;

        var rDirX = rDist > 10 ? (mousePixel.x - rHandPixelX) / rDist : 0;
        var rDirY = rDist > 10 ? (mousePixel.y - rHandPixelY) / rDist : 0;

        var targetRYaw = reachRStrength * rDirX * 0.6;
        var targetRPitch = reachRStrength * rDirY * 0.5;
        var targetRExtend = reachRStrength * 0.45;

        rightArmReach.yaw += (targetRYaw - rightArmReach.yaw) * 0.12;
        rightArmReach.pitch += (targetRPitch - rightArmReach.pitch) * 0.12;
        rightArmReach.extend += (targetRExtend - rightArmReach.extend) * 0.12;

        if (rightUpperArm) {
          if (rightArmReach.extend > 0.01) {
            rightUpperArm.rotation.x = initialRUpperArm.x + rightArmReach.pitch * 1.1;
            rightUpperArm.rotation.z = initialRUpperArm.z - rightArmReach.extend * 0.85;
          } else {
            rightUpperArm.rotation.x = initialRUpperArm.x;
            rightUpperArm.rotation.z = initialRUpperArm.z;
          }
        }
        if (rightForearm) {
          if (rightArmReach.extend > 0.01) {
            rightForearm.rotation.x = initialRForearm.x - rightArmReach.extend * 0.65;
          } else {
            rightForearm.rotation.x = initialRForearm.x;
          }
        }
        if (rightHand) {
          if (rightArmReach.extend > 0.01) {
            rightHand.rotation.x = initialRHand.x + rightArmReach.pitch * 0.35;
            rightHand.rotation.y = initialRHand.y + rightArmReach.yaw * 0.35;
          } else {
            rightHand.rotation.x = initialRHand.x;
            rightHand.rotation.y = initialRHand.y;
          }
        }

        // Left Arm Reaching (facing right side)
        var reachLStrength = Math.max(0, 1.0 - lDist / reachZone);
        reachLStrength = reachLStrength * reachLStrength;

        var lDirX = lDist > 10 ? (mousePixel.x - lHandPixelX) / lDist : 0;
        var lDirY = lDist > 10 ? (mousePixel.y - lHandPixelY) / lDist : 0;

        var targetLYaw = reachLStrength * lDirX * 0.6;
        var targetLPitch = reachLStrength * lDirY * 0.5;
        var targetLExtend = reachLStrength * 0.45;

        leftArmReach.yaw += (targetLYaw - leftArmReach.yaw) * 0.12;
        leftArmReach.pitch += (targetLPitch - leftArmReach.pitch) * 0.12;
        leftArmReach.extend += (targetLExtend - leftArmReach.extend) * 0.12;

        if (leftUpperArm) {
          if (leftArmReach.extend > 0.01) {
            leftUpperArm.rotation.x = initialLUpperArm.x + leftArmReach.pitch * 1.1;
            leftUpperArm.rotation.z = initialLUpperArm.z + leftArmReach.extend * 0.85;
          } else {
            leftUpperArm.rotation.x = initialLUpperArm.x;
            leftUpperArm.rotation.z = initialLUpperArm.z;
          }
        }
        if (leftForearm) {
          if (leftArmReach.extend > 0.01) {
            leftForearm.rotation.x = initialLForearm.x - leftArmReach.extend * 0.65;
          } else {
            leftForearm.rotation.x = initialLForearm.x;
          }
        }
        if (leftHand) {
          if (leftArmReach.extend > 0.01) {
            leftHand.rotation.x = initialLHand.x + leftArmReach.pitch * 0.35;
            leftHand.rotation.y = initialLHand.y + leftArmReach.yaw * 0.35;
          } else {
            leftHand.rotation.x = initialLHand.x;
            leftHand.rotation.y = initialLHand.y;
          }
        }
      }

      renderer.render(scene, camera);
    }

    animate();
  }
})();
