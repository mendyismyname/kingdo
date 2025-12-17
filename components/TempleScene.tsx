import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const TempleScene = ({ isActive }: { isActive: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- Configuration ---
        const CONFIG = {
            stairCount: 80,
            stairWidth: 20,
            stairDepth: 2,
            stairHeight: 0.5,
            goldColor: 0xffd700,
            entranceColor: 0x221100,
        };

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        // Slightly darker, more mystical fog
        scene.fog = new THREE.FogExp2(0x8fa3c0, 0.006);

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.set(0, 5, 60);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        


        containerRef.current.appendChild(renderer.domElement);

        // --- Textures ---
        const createMarbleTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            if(!ctx) return new THREE.Texture();
            
            ctx.fillStyle = '#fdfdfd';
            ctx.fillRect(0,0,1024,1024);
            
            // Veins
            for(let i=0; i<15; i++) {
                ctx.beginPath();
                let x = Math.random() * 1024;
                let y = Math.random() * 1024;
                ctx.moveTo(x, y);
                for(let j=0; j<10; j++) {
                    x += (Math.random() - 0.5) * 300;
                    y += (Math.random() - 0.5) * 300;
                    ctx.bezierCurveTo(x, y, x + 50, y + 50, x, y);
                }
                ctx.strokeStyle = `rgba(200, 200, 215, ${0.05 + Math.random() * 0.05})`;
                ctx.lineWidth = 1 + Math.random() * 3;
                ctx.stroke();
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(2, 2);
            return tex;
        };

        const createStoneTexture = () => {
             const canvas = document.createElement('canvas');
             canvas.width = 512;
             canvas.height = 512;
             const ctx = canvas.getContext('2d');
             if(!ctx) return new THREE.Texture();
             
             // Base Stone
             ctx.fillStyle = '#a8a29e'; 
             ctx.fillRect(0,0,512,512);
             
             // Noise / Texture
             for(let i=0; i<8000; i++) {
                 const x = Math.random() * 512;
                 const y = Math.random() * 512;
                 const size = 1 + Math.random() * 2;
                 // Varied grey spots
                 ctx.fillStyle = Math.random() > 0.5 ? '#78716c' : '#d6d3d1';
                 ctx.globalAlpha = 0.4;
                 ctx.fillRect(x, y, size, size);
             }

             // Slight brick pattern hint
             ctx.globalAlpha = 0.1;
             ctx.strokeStyle = '#57534e';
             ctx.lineWidth = 1;
             ctx.beginPath();
             for(let y=0; y<512; y+=64) {
                 ctx.moveTo(0, y);
                 ctx.lineTo(512, y);
             }
             ctx.stroke();
             
             const tex = new THREE.CanvasTexture(canvas);
             tex.wrapS = THREE.RepeatWrapping;
             tex.wrapT = THREE.RepeatWrapping;
             return tex;
        };

        const createSmokeTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            if(!ctx) return new THREE.Texture();
            
            const grad = ctx.createRadialGradient(32,32,0, 32,32,32);
            grad.addColorStop(0, 'rgba(255,255,255,0.6)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,64,64);
            return new THREE.CanvasTexture(canvas);
        }

        const createSkyTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            if(!ctx) return new THREE.Texture();
            
            // Dreamier gradient
            const grd = ctx.createLinearGradient(0, 0, 0, 1024);
            grd.addColorStop(0, "#2b5876"); // Dark blue top
            grd.addColorStop(0.5, "#4e4376"); // Purple mid
            grd.addColorStop(1, "#f0f2f0"); // Light bottom
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, 2048, 1024);

            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            return tex;
        };

        const marbleTexture = createMarbleTexture();
        const stoneTexture = createStoneTexture();
        const smokeTexture = createSmokeTexture();
        const skyTexture = createSkyTexture();

        // --- Materials ---
        const marbleMaterial = new THREE.MeshPhysicalMaterial({ 
            map: marbleTexture,
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0.1,
            clearcoat: 0.6,
            reflectivity: 0.8,
            emissive: 0xffeebb, // Increased glow (warm white) to emit light
            emissiveIntensity: 0.25 // Higher intensity
        });

        const stoneMaterial = new THREE.MeshStandardMaterial({
            map: stoneTexture,
            color: 0xebebeb,
            roughness: 0.95,
            metalness: 0.05,
        });

        const goldMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.goldColor,
            roughness: 0.1,
            metalness: 0.8,
            emissive: 0xffaa00,
            emissiveIntensity: 0.6 // Stronger gold glow
        });

        const entranceMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.entranceColor,
            roughness: 0.8,
            emissive: 0x331100, // Slight inner glow from entrance
            emissiveIntensity: 0.2
        });

        const floorMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xa1c4fd,
            metalness: 0.2,
            roughness: 0.1,
            transmission: 0.2, // Slight glass effect
            transparent: true,
            opacity: 0.9,
        });

        const skyMaterial = new THREE.MeshBasicMaterial({
            map: skyTexture,
            side: THREE.BackSide,
            fog: false
        });

        const smokeMaterial = new THREE.PointsMaterial({
            map: smokeTexture,
            size: 8,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            color: 0xdddddd
        });

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xfffaed, 1.0);
        dirLight.position.set(80, 150, 50);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 4096;
        dirLight.shadow.mapSize.height = 4096;
        dirLight.shadow.bias = -0.0001;
        const d = 150;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        scene.add(dirLight);

        // Temple Glow Light - Intensified
        const templeLight = new THREE.PointLight(0xffaa00, 3.0, 200);
        templeLight.position.set(0, 45, -45);
        scene.add(templeLight);

        // Blue backlight for mystery
        const backLight = new THREE.DirectionalLight(0x4e4376, 0.8);
        backLight.position.set(-50, 20, -100);
        scene.add(backLight);

        // --- Objects ---
        const skyGeo = new THREE.SphereGeometry(1000, 32, 32);
        const skyBox = new THREE.Mesh(skyGeo, skyMaterial);
        scene.add(skyBox);

        // PARTICLES (Dream dust)
        const particleCount = 400;
        const particleGeo = new THREE.BufferGeometry();
        const particlePos = new Float32Array(particleCount * 3);
        const particleSpeeds = new Float32Array(particleCount);
        for(let i=0; i<particleCount; i++) {
            particlePos[i*3] = (Math.random() - 0.5) * 200; // x
            particlePos[i*3+1] = Math.random() * 100 - 20; // y
            particlePos[i*3+2] = (Math.random() - 0.5) * 150; // z
            particleSpeeds[i] = 0.02 + Math.random() * 0.05;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.3,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        const complexGroup = new THREE.Group();
        const stairGroup = new THREE.Group();
        const steps: any[] = [];

        // Heichal (Temple Structure) - Wider
        const heichalH = 35;
        const heichalW = 44; // Increased from 32
        const heichalD = 20;
        const heichal = new THREE.Mesh(new THREE.BoxGeometry(heichalW, heichalH, heichalD), marbleMaterial);
        heichal.position.set(0, heichalH/2, -50);
        heichal.castShadow = true;
        heichal.receiveShadow = true;
        complexGroup.add(heichal);

        // Roof Spikes (Kilah Orev)
        // Add a grid of spikes on the roof
        const spikeRows = 4;
        const spikesPerRow = 30; // Increased density for wider roof
        for(let row=0; row < spikeRows; row++) {
            const z = -50 - (heichalD/2) + (row * (heichalD/(spikeRows-1)));
            for(let i=0; i < spikesPerRow; i++) {
                const s = new THREE.Mesh(new THREE.ConeGeometry(0.3, 2.5, 4), goldMaterial);
                const x = -(heichalW/2) + (i * (heichalW/(spikesPerRow-1)));
                s.position.set(x, heichalH + 1.25, z);
                complexGroup.add(s);
            }
        }

        // Door
        const door = new THREE.Mesh(new THREE.PlaneGeometry(10, 22), entranceMaterial);
        door.position.set(0, 11, -50 + heichalD/2 + 0.1);
        complexGroup.add(door);

        // Frame
        const frameW = 1.5;
        const frameH = 22;
        const fLeft = new THREE.Mesh(new THREE.BoxGeometry(frameW, frameH, 1), goldMaterial);
        fLeft.position.set(-6, 11, -50 + heichalD/2 + 0.1);
        complexGroup.add(fLeft);
        const fRight = fLeft.clone();
        fRight.position.set(6, 11, -50 + heichalD/2 + 0.1);
        complexGroup.add(fRight);
        const fTop = new THREE.Mesh(new THREE.BoxGeometry(12 + frameW*2, frameW, 1), goldMaterial);
        fTop.position.set(0, 22 + frameW/2, -50 + heichalD/2 + 0.1);
        complexGroup.add(fTop);

        // Pillars - Moved inward
        const pillarGeo = new THREE.CylinderGeometry(2, 2, 22, 32);
        const p1 = new THREE.Mesh(pillarGeo, marbleMaterial);
        p1.position.set(-14, 11, -35);
        p1.castShadow = true;
        complexGroup.add(p1);
        const p2 = p1.clone();
        p2.position.set(14, 11, -35);
        complexGroup.add(p2);
        
        const capGeo = new THREE.CylinderGeometry(2.5, 2, 2, 32);
        const cap1 = new THREE.Mesh(capGeo, goldMaterial);
        cap1.position.set(-14, 22, -35);
        complexGroup.add(cap1);
        const cap2 = cap1.clone();
        cap2.position.set(14, 22, -35);
        complexGroup.add(cap2);

        // Courtyards (Azara) - Slightly Smaller
        const azaraW = 160;
        const azaraD = 140;
        const azaraFloor = new THREE.Mesh(new THREE.BoxGeometry(azaraW, 1, azaraD), marbleMaterial);
        azaraFloor.position.set(0, 0, -50);
        azaraFloor.receiveShadow = true;
        complexGroup.add(azaraFloor);

        const backWall = new THREE.Mesh(new THREE.BoxGeometry(azaraW, 12, 4), marbleMaterial);
        backWall.position.set(0, 6, -120); // Adjusted for smaller depth
        backWall.castShadow = true;
        complexGroup.add(backWall);

        // --- Mizbeach (Altar) ---
        const mizbeachSize = 22;
        const mizbeachHeight = 9;
        const mizbeachZ = -15; // Position in front of Heichal
        
        // Main Block
        const mizbeach = new THREE.Mesh(new THREE.BoxGeometry(mizbeachSize, mizbeachHeight, mizbeachSize), stoneMaterial);
        mizbeach.position.set(0, mizbeachHeight/2, mizbeachZ);
        mizbeach.castShadow = true;
        mizbeach.receiveShadow = true;
        complexGroup.add(mizbeach);

        // Base (Yesod)
        const baseSize = mizbeachSize + 2;
        const baseHeight = 1;
        const base = new THREE.Mesh(new THREE.BoxGeometry(baseSize, baseHeight, baseSize), stoneMaterial);
        base.position.set(0, baseHeight/2, mizbeachZ);
        complexGroup.add(base);

        // Horns (Keranot)
        const hornSize = 1.5;
        const hornGeo = new THREE.BoxGeometry(hornSize, hornSize, hornSize);
        const halfM = mizbeachSize/2 - hornSize/2;
        const hornY = mizbeachHeight + hornSize/2;
        
        const c1 = new THREE.Mesh(hornGeo, stoneMaterial); c1.position.set(-halfM, hornY, mizbeachZ - halfM); complexGroup.add(c1);
        const c2 = new THREE.Mesh(hornGeo, stoneMaterial); c2.position.set(halfM, hornY, mizbeachZ - halfM); complexGroup.add(c2);
        const c3 = new THREE.Mesh(hornGeo, stoneMaterial); c3.position.set(-halfM, hornY, mizbeachZ + halfM); complexGroup.add(c3);
        const c4 = new THREE.Mesh(hornGeo, stoneMaterial); c4.position.set(halfM, hornY, mizbeachZ + halfM); complexGroup.add(c4);

        // Ramp (Kevesh) - Left Side (-X) - Longer
        const rampLen = 35; // Increased length
        const rampWidth = 8;
        
        const rampShape = new THREE.Shape();
        rampShape.moveTo(0, 0);
        rampShape.lineTo(rampLen, mizbeachHeight - 1); // Top
        rampShape.lineTo(rampLen, 0); // Bottom right
        rampShape.lineTo(0, 0); // Close

        const extrudeSettings = { steps: 1, depth: rampWidth, bevelEnabled: false };
        const rampGeo = new THREE.ExtrudeGeometry(rampShape, extrudeSettings);
        const rampMesh = new THREE.Mesh(rampGeo, stoneMaterial);
        
        // Position: Start left of the mizbeach, move towards it.
        rampMesh.position.set(- (mizbeachSize/2) - rampLen, 0, mizbeachZ - (rampWidth/2));
        rampMesh.castShadow = true;
        rampMesh.receiveShadow = true;
        complexGroup.add(rampMesh);

        // SMOKE PILLAR
        const smokeCount = 100;
        const smokePGeo = new THREE.BufferGeometry();
        const smokePPos = new Float32Array(smokeCount * 3);
        const smokePData: { speed: number, offset: number }[] = [];
        
        for(let i=0; i<smokeCount; i++) {
            smokePPos[i*3] = (Math.random() - 0.5) * 5; // x spread at base
            smokePPos[i*3+1] = mizbeachHeight + 1 + Math.random() * 20; // y start height
            smokePPos[i*3+2] = mizbeachZ + (Math.random() - 0.5) * 5; // z spread at base
            
            smokePData.push({
                speed: 0.05 + Math.random() * 0.1,
                offset: Math.random() * 100
            });
        }
        smokePGeo.setAttribute('position', new THREE.BufferAttribute(smokePPos, 3));
        const smokeParticles = new THREE.Points(smokePGeo, smokeMaterial);
        complexGroup.add(smokeParticles);

        complexGroup.position.set(0, 40, -50);
        scene.add(complexGroup);

        // Stairs
        const startY = -20;
        const topY = 40;
        const topZ = -45;
        
        for(let i=0; i<CONFIG.stairCount; i++) {
            const progress = i / CONFIG.stairCount; 
            const width = CONFIG.stairWidth + (1 - progress) * 20; 
            
            const sGeo = new THREE.BoxGeometry(width, CONFIG.stairHeight, CONFIG.stairDepth);
            const mesh = new THREE.Mesh(sGeo, marbleMaterial);
            
            const stepY = topY - ((CONFIG.stairCount - 1 - i) * CONFIG.stairHeight);
            const stepZ = topZ + ((CONFIG.stairCount - 1 - i) * CONFIG.stairDepth);
            
            mesh.position.set(0, -30, stepZ);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            mesh.userData = {
                targetY: stepY,
                initialY: -30 - (i * 2),
            };

            stairGroup.add(mesh);
            steps.push(mesh);
        }
        scene.add(stairGroup);

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -5;
        scene.add(floor);

        // Animation Loop
        let scrollPercent = 0;
        let targetScrollPercent = 0;
        const clock = new THREE.Clock();



        window.addEventListener('scroll', handleScroll);
        
        const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

        let frameId: number;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            scrollPercent = lerp(scrollPercent, targetScrollPercent, 0.05);

            if (skyBox.material instanceof THREE.MeshBasicMaterial && skyBox.material.map) {
                skyBox.material.map.offset.x = time * 0.01; 
            }

            // Animate Particles
            const positions = particleGeo.attributes.position.array as Float32Array;
            for(let i=0; i<particleCount; i++) {
                positions[i*3+1] += particleSpeeds[i]; // y
                if(positions[i*3+1] > 80) positions[i*3+1] = -20;
            }
            particleGeo.attributes.position.needsUpdate = true;

            // Animate Smoke
            const sPos = smokePGeo.attributes.position.array as Float32Array;
            for(let i=0; i<smokeCount; i++) {
                const data = smokePData[i];
                sPos[i*3+1] += data.speed; // Rise
                
                // Drift logic - wind sway
                sPos[i*3] += Math.sin(time + data.offset) * 0.02;
                
                // Reset
                if(sPos[i*3+1] > 35 + mizbeachHeight) {
                    sPos[i*3+1] = mizbeachHeight + 1;
                    sPos[i*3] = (Math.random() - 0.5) * 5;
                    sPos[i*3+2] = mizbeachZ + (Math.random() - 0.5) * 5;
                }
            }
            smokePGeo.attributes.position.needsUpdate = true;

            steps.forEach((step, i) => {
                const stepThreshold = i / (steps.length + 8); 
                const activation = (scrollPercent * 1.3) - stepThreshold;
                let activeState = Math.max(0, Math.min(1, activation * 4));
                step.position.y = lerp(step.userData.initialY, step.userData.targetY, activeState);
            });

            // Camera Movement
            const startPos = new THREE.Vector3(0, -5, 120); // Lower Y start
            const endPos = new THREE.Vector3(0, 60, 20);
            
            camera.position.x = lerp(startPos.x, endPos.x, scrollPercent);
            camera.position.y = lerp(startPos.y, endPos.y, scrollPercent);
            camera.position.z = lerp(startPos.z, endPos.z, scrollPercent);

            camera.lookAt(0, 30, -50);
            renderer.render(scene, camera);
        };

        animate();

        // Resize Handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            if(containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed top-0 left-0 w-full h-full z-0 outline-none" />
    );
};
