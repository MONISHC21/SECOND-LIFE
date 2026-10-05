import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeElectronicsHero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all floating electronic components
    const componentGroup = new THREE.Group();
    scene.add(componentGroup);

    // 1. ESP32 / Microcontroller PCB Board
    const pcbGroup = new THREE.Group();
    const pcbGeo = new THREE.BoxGeometry(4.2, 2.6, 0.2);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0f3b2e, // Dark green solder mask
      roughness: 0.4,
      metalness: 0.2,
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbGroup.add(pcbMesh);

    // ESP32 Metal RF Shield
    const shieldGeo = new THREE.BoxGeometry(1.8, 1.6, 0.25);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.9,
      roughness: 0.2,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.set(-0.9, 0, 0.12);
    pcbGroup.add(shieldMesh);

    // USB Port
    const usbGeo = new THREE.BoxGeometry(0.8, 0.6, 0.4);
    const usbMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.8, roughness: 0.3 });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(2.2, 0, 0.15);
    pcbGroup.add(usbMesh);

    // Header Pins along the edges
    const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
    for (let i = -1.8; i <= 1.8; i += 0.35) {
      const pinTop = new THREE.Mesh(pinGeo, pinMat);
      pinTop.position.set(i, 1.15, 0.2);
      pcbGroup.add(pinTop);

      const pinBottom = new THREE.Mesh(pinGeo, pinMat);
      pinBottom.position.set(i, -1.15, 0.2);
      pcbGroup.add(pinBottom);
    }

    pcbGroup.position.set(-5, 2, 0);
    componentGroup.add(pcbGroup);

    // 2. DIP-16 Integrated Circuit (IC Chip)
    const icGroup = new THREE.Group();
    const icBodyGeo = new THREE.BoxGeometry(3.2, 1.2, 0.5);
    const icBodyMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6, metalness: 0.1 });
    const icBodyMesh = new THREE.Mesh(icBodyGeo, icBodyMat);
    icGroup.add(icBodyMesh);

    // IC Pins
    const icPinGeo = new THREE.BoxGeometry(0.12, 0.4, 0.05);
    const icPinMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.1 });
    for (let i = -1.2; i <= 1.2; i += 0.35) {
      const pinLeft = new THREE.Mesh(icPinGeo, icPinMat);
      pinLeft.position.set(i, 0.7, 0);
      icGroup.add(pinLeft);

      const pinRight = new THREE.Mesh(icPinGeo, icPinMat);
      pinRight.position.set(i, -0.7, 0);
      icGroup.add(pinRight);
    }
    icGroup.position.set(5.5, 3, -1);
    componentGroup.add(icGroup);

    // 3. HC-SR04 Ultrasonic Distance Sensor Module
    const usGroup = new THREE.Group();
    const usPcbGeo = new THREE.BoxGeometry(3.6, 1.8, 0.15);
    const usPcbMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.2 }); // Blue PCB
    const usPcb = new THREE.Mesh(usPcbGeo, usPcbMat);
    usGroup.add(usPcb);

    // Dual ultrasonic barrels
    const barrelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.9, 24);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const meshFilterMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

    const barrel1 = new THREE.Mesh(barrelGeo, barrelMat);
    barrel1.rotation.x = Math.PI / 2;
    barrel1.position.set(-1.0, 0, 0.5);
    usGroup.add(barrel1);

    const barrel2 = new THREE.Mesh(barrelGeo, barrelMat);
    barrel2.rotation.x = Math.PI / 2;
    barrel2.position.set(1.0, 0, 0.5);
    usGroup.add(barrel2);

    usGroup.position.set(4, -3, 2);
    componentGroup.add(usGroup);

    // 4. Electrolytic Cylindrical Capacitor
    const capGroup = new THREE.Group();
    const capGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.0, 24);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.4, metalness: 0.3 }); // Teal jacket
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capGroup.add(capMesh);

    // Capacitor Top Vent
    const capTopGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.05, 24);
    const capTopMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const capTop = new THREE.Mesh(capTopGeo, capTopMat);
    capTop.position.set(0, 1.02, 0);
    capGroup.add(capTop);

    capGroup.position.set(-4.5, -3.2, 1);
    componentGroup.add(capGroup);

    // 5. Through-Hole Axial Resistor
    const resGroup = new THREE.Group();
    const resBodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.6, 16);
    const resBodyMat = new THREE.MeshStandardMaterial({ color: 0xedd6b1, roughness: 0.5 }); // Ceramic beige
    const resBody = new THREE.Mesh(resBodyGeo, resBodyMat);
    resBody.rotation.z = Math.PI / 2;
    resGroup.add(resBody);

    // Color bands
    const bandGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.15, 16);
    const bandColors = [0xb91c1c, 0x15803d, 0xd97706, 0xeab308]; // Red, Green, Orange, Gold
    bandColors.forEach((color, idx) => {
      const bandMat = new THREE.MeshBasicMaterial({ color });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.rotation.z = Math.PI / 2;
      band.position.set(-0.5 + idx * 0.32, 0, 0);
      resGroup.add(band);
    });

    // Axial leads
    const leadGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
    const leadMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9 });
    const lead1 = new THREE.Mesh(leadGeo, leadMat);
    lead1.rotation.z = Math.PI / 2;
    lead1.position.set(-1.3, 0, 0);
    resGroup.add(lead1);

    const lead2 = new THREE.Mesh(leadGeo, leadMat);
    lead2.rotation.z = Math.PI / 2;
    lead2.position.set(1.3, 0, 0);
    resGroup.add(lead2);

    resGroup.position.set(0, 4.2, -2);
    componentGroup.add(resGroup);

    // Background Particle Grid (Simulating circuit traces / soldering constellations)
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 25;
      positions[i + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x14b8a6,
      size: 0.18,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const tealKeyLight = new THREE.DirectionalLight(0x14b8a6, 3.5);
    tealKeyLight.position.set(10, 15, 12);
    scene.add(tealKeyLight);

    const emeraldRimLight = new THREE.DirectionalLight(0x22c55e, 2.5);
    emeraldRimLight.position.set(-12, -10, -5);
    scene.add(emeraldRimLight);

    const warmAccentLight = new THREE.PointLight(0xf97316, 2.0, 30);
    warmAccentLight.position.set(0, -6, 5);
    scene.add(warmAccentLight);

    // Mouse parallax tracking
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating zero-g oscillations
      pcbGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2 + 0.3;
      pcbGroup.rotation.y = Math.cos(elapsedTime * 0.4) * 0.3 + 0.4;
      pcbGroup.position.y = 2 + Math.sin(elapsedTime * 0.8) * 0.3;

      icGroup.rotation.x = Math.cos(elapsedTime * 0.6) * 0.25 - 0.2;
      icGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.4 - 0.5;
      icGroup.position.y = 3 + Math.cos(elapsedTime * 0.7) * 0.25;

      usGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.3 - 0.2;
      usGroup.rotation.y = Math.cos(elapsedTime * 0.5) * 0.5 + 0.2;
      usGroup.position.y = -3 + Math.sin(elapsedTime * 0.9) * 0.25;

      capGroup.rotation.x = Math.cos(elapsedTime * 0.7) * 0.4;
      capGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.3 + 0.3;
      capGroup.position.y = -3.2 + Math.cos(elapsedTime * 0.6) * 0.3;

      resGroup.rotation.y = elapsedTime * 0.6;
      resGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.3;
      resGroup.position.y = 4.2 + Math.sin(elapsedTime * 0.7) * 0.2;

      // Mouse Parallax smooth lerp
      componentGroup.rotation.y += (targetX - componentGroup.rotation.y) * 0.05;
      componentGroup.rotation.x += (targetY - componentGroup.rotation.x) * 0.05;

      // Gentle drift for background stars
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-auto z-0 overflow-hidden opacity-90"
      aria-hidden="true"
    />
  );
};
