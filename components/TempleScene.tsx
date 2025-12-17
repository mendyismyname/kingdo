import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const TempleScene = ({ isActive }: { isActive: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
// ✅ ADD THIS LINE to kill any frozen zombie canvases              
        containerRef.current.innerHTML = ''; 
        // --- Configuration ---
        const CONFIG = {
            stairCount: 150, // Increased for longer duration feel
            stairWidth: 24,
            stairDepth: 2,
            stairHeight: 0.5,
            goldColor: 0xffd700,
            entranceColor: 0x221100,
        };

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        // Deep Blue/Black Fog (No Purple)
        scene.fog = new THREE.FogExp2(0x02040a, 0.005);

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
        // Lifted camera slightly (Y: 0 instead of -5) and moved back (Z: 140 instead of 120)
        camera.position.set(0, 0, 140);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        
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
            
            // Gold Veins
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
                ctx.strokeStyle = `rgba(184, 134, 11, ${0.1 + Math.random() * 0.1})`;
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
             
             ctx.fillStyle = '#a8a29e'; 
             ctx.fillRect(0,0,512,512);
             
             for(let i=0; i<8000; i++) {
                 const x = Math.random() * 512;
                 const y = Math.random() * 512;
                 const size = 1 + Math.random() * 2;
                 ctx.fillStyle = Math.random() > 0.5 ? '#78716c' : '#d6d3d1';
                 ctx.globalAlpha = 0.4;
                 ctx.fillRect(x, y, size, size);
             }
             
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
            grad.addColorStop(0, 'rgba(255,200,150,0.6)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,64,64);
            return new THREE.CanvasTexture(canvas);
        }

        const createCloudTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            if(!ctx) return new THREE.Texture();
            
            const grad = ctx.createRadialGradient(128,128,0, 128,128,128);
            grad.addColorStop(0, 'rgba(255,255,255,0.9)');
            grad.addColorStop(0.4, 'rgba(220,230,255,0.4)'); // Cool white
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,256,256);
            return new THREE.CanvasTexture(canvas);
        };

        const createStarrySkyTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 2048;
            const ctx = canvas.getContext('2d');
            if(!ctx) return new THREE.Texture();
            
            // Deep Night Sky (Blue/Black/Slate) - No Purple
            const grd = ctx.createLinearGradient(0, 0, 0, 2048);
            grd.addColorStop(0, "#000000"); 
            grd.addColorStop(0.5, "#0f172a"); // Slate 900
            grd.addColorStop(1, "#1e293b"); // Slate 800 - Horizon
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, 2048, 2048);

            // Stars
            for (let i = 0; i < 4000; i++) {
                const x = Math.random() * 2048;
                const y = Math.random() * 2048;
                const r = Math.random() * 1.3;
                const opacity = Math.random();
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();
            }
            
            // Subtle Nebula (Blue only)
            ctx.globalCompositeOperation = 'lighter';
            for (let i=0; i<5; i++) {
                const x = Math.random() * 2048;
                const y = Math.random() * 2048;
                const r = 200 + Math.random() * 400;
                const grad = ctx.createRadialGradient(x,y,0,x,y,r);
                grad.addColorStop(0, 'rgba(100, 150, 255, 0.05)');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0,0,2048,2048);
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            return tex;
        };

        const marbleTexture = createMarbleTexture();
        const stoneTexture = createStoneTexture();
        const smokeTexture = createSmokeTexture();
        const cloudTexture = createCloudTexture();
        const skyTexture = createStarrySkyTexture();

        // --- Materials ---
        const marbleMaterial = new THREE.MeshPhysicalMaterial({ 
            map: marbleTexture,
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0.1,
            clearcoat: 0.6,
            reflectivity: 0.7,
            emissive: 0xffeebb,
            emissiveIntensity: 0.15 
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
            metalness: 0.9,
            emissive: 0xffaa00,
            emissiveIntensity: 0.4
        });

        const entranceMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.entranceColor,
            roughness: 0.8,
            emissive: 0x331100, 
            emissiveIntensity: 0.2
        });

        const floorMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x5a5a7a,
            metalness: 0.4,
            roughness: 0.1,
            transmission: 0.1,
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
            color: 0xffaa88
        });

        const cloudMaterial = new THREE.SpriteMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            color: 0xeef5ff // Cool white
        });

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0x222244, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffeebb, 1.2);
        dirLight.position.set(50, 100, 50);
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

        const templeLight = new THREE.PointLight(0xffaa00, 2.5, 100);
        templeLight.position.set(0, 45, -45);
        scene.add(templeLight);

        const rimLight = new THREE.SpotLight(0x88ccff, 1.0); // Blueish rim
        rimLight.position.set(-100, 50, -50);
        rimLight.lookAt(0, 20, -50);
        scene.add(rimLight);

        // --- Objects ---
        const skyGeo = new THREE.SphereGeometry(1000, 32, 32);
        const skyBox = new THREE.Mesh(skyGeo, skyMaterial);
        scene.add(skyBox);

        // CLOUDS (Foreground)
        const cloudsGroup = new THREE.Group();
        for(let i=0; i<50; i++) {
            const sprite = new THREE.Sprite(cloudMaterial);
            // Wide spread, low Y, close Z
            const x = (Math.random() - 0.5) * 350;
            const y = -35 + Math.random() * 25; 
            const z = 60 + Math.random() * 80; 
            const scale = 35 + Math.random() * 35;
            sprite.position.set(x, y, z);
            sprite.scale.set(scale, scale, 1);
            cloudsGroup.add(sprite);
        }
        scene.add(cloudsGroup);

        // PARTICLES
        const particleCount = 600;
        const particleGeo = new THREE.BufferGeometry();
        const particlePos = new Float32Array(particleCount * 3);
        const particleSpeeds = new Float32Array(particleCount);
        for(let i=0; i<particleCount; i++) {
            particlePos[i*3] = (Math.random() - 0.5) * 200; 
            particlePos[i*3+1] = Math.random() * 100 - 20; 
            particlePos[i*3+2] = (Math.random() - 0.5) * 150; 
            particleSpeeds[i] = 0.02 + Math.random() * 0.05;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.3,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        const complexGroup = new THREE.Group();
        const stairGroup = new THREE.Group();
        const steps: any[] = [];

        // Heichal
        const heichalH = 35;
        const heichalW = 44; 
        const heichalD = 20;
        const heichal = new THREE.Mesh(new THREE.BoxGeometry(heichalW, heichalH, heichalD), marbleMaterial);
        heichal.position.set(0, heichalH/2, -50);
        heichal.castShadow = true;
        heichal.receiveShadow = true;
        complexGroup.add(heichal);

        // Roof Spikes
        const spikeRows = 4;
        const spikesPerRow = 30;
        for(let row=0; row < spikeRows; row++) {
            const z = -50 - (heichalD/2) + (row * (heichalD/(spikeRows-1)));
            for(let i=0; i < spikesPerRow; i++) {
                const s = new THREE.Mesh(new THREE.ConeGeometry(0.3, 2.5, 4), goldMaterial);
                const x = -(heichalW/2) + (i * (heichalW/(spikesPerRow-1)));
                s.position.set(x, heichalH + 1.25, z);
                complexGroup.add(s);
            }
        }

        // Door & Frame
        const door = new THREE.Mesh(new THREE.PlaneGeometry(10, 22), entranceMaterial);
        door.position.set(0, 11, -50 + heichalD/2 + 0.1);
        complexGroup.add(door);

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

        // Pillars
        const pillarGeo = new THREE.CylinderGeometry(2, 2, 22, 32);
        const p1 = new THREE.Mesh(pillarGeo, marbleMaterial); p1.position.set(-14, 11, -35); p1.castShadow = true; complexGroup.add(p1);
        const p2 = p1.clone(); p2.position.set(14, 11, -35); complexGroup.add(p2);
        const capGeo = new THREE.CylinderGeometry(2.5, 2, 2, 32);
        const cap1 = new THREE.Mesh(capGeo, goldMaterial); cap1.position.set(-14, 22, -35); complexGroup.add(cap1);
        const cap2 = cap1.clone(); cap2.position.set(14, 22, -35); complexGroup.add(cap2);

        // Azara
        const azaraW = 160;
        const azaraD = 140;
        const azaraFloor = new THREE.Mesh(new THREE.BoxGeometry(azaraW, 1, azaraD), marbleMaterial);
        azaraFloor.position.set(0, 0, -50);
        azaraFloor.receiveShadow = true;
        complexGroup.add(azaraFloor);

        const backWall = new THREE.Mesh(new THREE.BoxGeometry(azaraW, 12, 4), marbleMaterial);
        backWall.position.set(0, 6, -120); backWall.castShadow = true; complexGroup.add(backWall);

        // Mizbeach
        const mizbeachSize = 22;
        const mizbeachHeight = 9;
        const mizbeachZ = -15; 
        const mizbeach = new THREE.Mesh(new THREE.BoxGeometry(mizbeachSize, mizbeachHeight, mizbeachSize), stoneMaterial);
        mizbeach.position.set(0, mizbeachHeight/2, mizbeachZ); mizbeach.castShadow = true; mizbeach.receiveShadow = true; complexGroup.add(mizbeach);
        
        const base = new THREE.Mesh(new THREE.BoxGeometry(mizbeachSize + 2, 1, mizbeachSize + 2), stoneMaterial);
        base.position.set(0, 0.5, mizbeachZ); complexGroup.add(base);

        const hornGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const halfM = mizbeachSize/2 - 0.75;
        const hornY = mizbeachHeight + 0.75;
        [[-1,-1], [1,-1], [-1,1], [1,1]].forEach(([x,z]) => {
            const h = new THREE.Mesh(hornGeo, stoneMaterial);
            h.position.set(x*halfM, hornY, mizbeachZ + z*halfM);
            complexGroup.add(h);
        });

        // Ramp
        const rampLen = 35;
        const rampShape = new THREE.Shape();
        rampShape.moveTo(0,0); rampShape.lineTo(rampLen, mizbeachHeight-1); rampShape.lineTo(rampLen, 0); rampShape.lineTo(0,0);
        const rampGeo = new THREE.ExtrudeGeometry(rampShape, { depth: 8, bevelEnabled: false });
        const rampMesh = new THREE.Mesh(rampGeo, stoneMaterial);
        rampMesh.position.set(-(mizbeachSize/2)-rampLen, 0, mizbeachZ-4);
        rampMesh.castShadow = true; complexGroup.add(rampMesh);

        // Smoke
        const smokeCount = 150;
        const smokePGeo = new THREE.BufferGeometry();
        const smokePPos = new Float32Array(smokeCount * 3);
        const smokePData: { speed: number, offset: number }[] = [];
        for(let i=0; i<smokeCount; i++) {
            smokePPos[i*3] = (Math.random() - 0.5) * 5; 
            smokePPos[i*3+1] = mizbeachHeight + 1 + Math.random() * 20; 
            smokePPos[i*3+2] = mizbeachZ + (Math.random() - 0.5) * 5; 
            smokePData.push({ speed: 0.05 + Math.random() * 0.1, offset: Math.random() * 100 });
        }
        smokePGeo.setAttribute('position', new THREE.BufferAttribute(smokePPos, 3));
        const smokeParticles = new THREE.Points(smokePGeo, smokeMaterial);
        complexGroup.add(smokeParticles);

        complexGroup.position.set(0, 40, -50);
        scene.add(complexGroup);

        // Stairs
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
            mesh.castShadow = true; mesh.receiveShadow = true;
            mesh.userData = { targetY: stepY, initialY: -30 - (i * 2) };
            stairGroup.add(mesh);
            steps.push(mesh);
        }
        scene.add(stairGroup);

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -5;
        scene.add(floor);

        // Animation
        let scrollPercent = 0;
        let targetScrollPercent = 0;
        const clock = new THREE.Clock();

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight;
            const winHeight = window.innerHeight;
            targetScrollPercent = Math.max(0, Math.min(1, scrollTop / (docHeight - winHeight)));
        };

        window.addEventListener('scroll', handleScroll);
        
        const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
        const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

        let frameId: number;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            scrollPercent = lerp(scrollPercent, targetScrollPercent, 0.1);
            const easedProgress = easeOutCubic(scrollPercent);

            if (skyBox.material instanceof THREE.MeshBasicMaterial && skyBox.material.map) {
                skyBox.rotation.y = time * 0.005; 
            }

            // Clouds
            cloudsGroup.children.forEach((cloud, i) => {
                cloud.position.x += Math.sin(time * 0.1 + i) * 0.01;
            });

            // Particles
            const positions = particleGeo.attributes.position.array as Float32Array;
            for(let i=0; i<particleCount; i++) {
                positions[i*3+1] += particleSpeeds[i];
                if(positions[i*3+1] > 80) positions[i*3+1] = -20;
            }
            particleGeo.attributes.position.needsUpdate = true;

            // Smoke
            const sPos = smokePGeo.attributes.position.array as Float32Array;
            for(let i=0; i<smokeCount; i++) {
                const data = smokePData[i];
                sPos[i*3+1] += data.speed;
                sPos[i*3] += Math.sin(time + data.offset) * 0.02;
                if(sPos[i*3+1] > 35 + mizbeachHeight) {
                    sPos[i*3+1] = mizbeachHeight + 1;
                    sPos[i*3] = (Math.random() - 0.5) * 5;
                    sPos[i*3+2] = mizbeachZ + (Math.random() - 0.5) * 5;
                }
            }
            smokePGeo.attributes.position.needsUpdate = true;

            // Stairs
            steps.forEach((step, i) => {
                const stepThreshold = i / (steps.length + 8); 
                const activation = (easedProgress * 1.4) - stepThreshold;
                let activeState = Math.max(0, Math.min(1, activation * 5));
                step.position.y = lerp(step.userData.initialY, step.userData.targetY, activeState);
            });

            // Camera
            const startPos = new THREE.Vector3(0, 0, 140); 
            const endPos = new THREE.Vector3(0, 60, 20);
            
            camera.position.x = lerp(startPos.x, endPos.x, easedProgress);
            camera.position.y = lerp(startPos.y, endPos.y, easedProgress);
            camera.position.z = lerp(startPos.z, endPos.z, easedProgress);

            camera.lookAt(0, 30, -50);
            renderer.render(scene, camera);
        };

        animate();

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
            if(containerRef.current) containerRef.current.innerHTML = '';
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full z-0 outline-none" />;
};