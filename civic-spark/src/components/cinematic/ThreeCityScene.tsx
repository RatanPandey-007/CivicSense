import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CityGridCanvas } from "./CityGridCanvas";

export interface CityBeacon {
  id: string;
  type: "critical" | "resolved" | "in_progress" | "active";
  title: string;
  category: string;
  sector: string;
  distance: string;
  confidence?: number;
  position: [number, number, number]; // 3D world pos
  screenX: number; // Normalized 0-1 or pixel
  screenY: number;
}

interface ThreeCitySceneProps {
  onBeaconSelect?: (beaconId: string) => void;
  selectedBeaconId?: string | null;
  onBeaconsUpdate?: (beacons: CityBeacon[]) => void;
}

export const ThreeCityScene: React.FC<ThreeCitySceneProps> = ({
  onBeaconSelect,
  selectedBeaconId,
  onBeaconsUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050506, 0.015);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    // Elevated diagonal camera vantage
    const initialCamPos = new THREE.Vector3(18, 22, 28);
    const targetCamPos = new THREE.Vector3(14, 16, 22);
    camera.position.copy(initialCamPos);

    const lookTarget = new THREE.Vector3(4, 1.5, -2); // Centered slightly towards right half
    camera.lookAt(lookTarget);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // City Group
    const cityGroup = new THREE.Group();
    cityGroup.position.set(4, 0, -2); // Bias towards right side of viewport
    scene.add(cityGroup);

    // ─── 1. Floating Plateau / Island Base ─────────────────────────────
    // Multi-tiered geometric basalt rock island
    const plateauTiers = 4;
    for (let t = 0; t < plateauTiers; t++) {
      const radius = 11 - t * 1.8;
      const depth = 2.2 + t * 0.8;
      const geom = new THREE.CylinderGeometry(radius, radius * 0.85, depth, 7);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x09090c,
        roughness: 0.9,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.y = -depth / 2 - t * 2.1;
      mesh.rotation.y = t * 0.4;
      cityGroup.add(mesh);

      // Plateau edge glowing wireframe hairlines
      const edges = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({
        color: t === 0 ? 0x6366f1 : 0x38bdf8,
        transparent: true,
        opacity: t === 0 ? 0.35 : 0.15,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.copy(mesh.position);
      wireframe.rotation.copy(mesh.rotation);
      cityGroup.add(wireframe);
    }

    // ─── 2. Procedural City Buildings ────────────────────────────────
    const buildingCount = 220;
    const boxGeom = new THREE.BoxGeometry(1, 1, 1);

    // Building materials
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0b0b0e,
      roughness: 0.7,
      metalness: 0.6,
    });

    const instancedBuildings = new THREE.InstancedMesh(boxGeom, buildingMat, buildingCount);
    cityGroup.add(instancedBuildings);

    // Edges for core skyscrapers
    const skyscraperEdgesGroup = new THREE.Group();
    cityGroup.add(skyscraperEdgesGroup);

    const dummy = new THREE.Object3D();
    const buildingPositions: { x: number; z: number; height: number }[] = [];

    let instanceIdx = 0;
    const gridExtent = 9;

    for (let i = 0; i < buildingCount; i++) {
      // Polar distribution: dense center, sparser edge
      const angle = Math.random() * Math.PI * 2;
      const distFromCenter = Math.pow(Math.random(), 0.8) * gridExtent;
      const x = Math.cos(angle) * distFromCenter;
      const z = Math.sin(angle) * distFromCenter;

      // Hexagonal bounding check
      if (Math.abs(x) + Math.abs(z) * 0.6 > gridExtent) continue;

      // Heights: soaring downtown towers in core (distFromCenter < 3.5), lower outside
      let h = 0.5 + Math.random() * 1.5;
      if (distFromCenter < 2.5) {
        h = 5.5 + Math.random() * 8.5; // Majestic skyscraper towers
      } else if (distFromCenter < 5) {
        h = 2.5 + Math.random() * 4.5;
      }

      const w = 0.6 + Math.random() * 0.7;
      const d = 0.6 + Math.random() * 0.7;

      dummy.position.set(x, h / 2, z);
      dummy.scale.set(w, h, d);
      dummy.rotation.y = (Math.floor(Math.random() * 4) * Math.PI) / 2;
      dummy.updateMatrix();

      instancedBuildings.setMatrixAt(instanceIdx++, dummy.matrix);
      buildingPositions.push({ x, z, height: h });

      // Add glowing neon crown edges for tall skyscrapers
      if (h > 4) {
        const topEdgeGeom = new THREE.EdgesGeometry(boxGeom);
        const edgeColor = h > 8 ? 0x38bdf8 : 0x6366f1;
        const edgeMat = new THREE.LineBasicMaterial({
          color: edgeColor,
          transparent: true,
          opacity: 0.65,
        });
        const edgeMesh = new THREE.LineSegments(topEdgeGeom, edgeMat);
        edgeMesh.position.set(x, h / 2, z);
        edgeMesh.scale.set(w, h, d);
        skyscraperEdgesGroup.add(edgeMesh);
      }
    }
    instancedBuildings.instanceMatrix.needsUpdate = true;

    // ─── 3. Electric Data Highway Conduits & Traveling Packets ─────────
    const highwayCurves: THREE.CatmullRomCurve3[] = [];
    const highwayGroup = new THREE.Group();
    cityGroup.add(highwayGroup);

    // Create 4 radiant data routes crisscrossing through city
    const routeCoords = [
      [
        new THREE.Vector3(-6, 0.05, -4),
        new THREE.Vector3(-2, 0.05, -2),
        new THREE.Vector3(0, 0.05, 0),
        new THREE.Vector3(3, 0.05, 3),
        new THREE.Vector3(7, 0.05, 5),
      ],
      [
        new THREE.Vector3(-5, 0.05, 5),
        new THREE.Vector3(-2, 0.05, 2),
        new THREE.Vector3(1, 0.05, 0),
        new THREE.Vector3(5, 0.05, -3),
        new THREE.Vector3(8, 0.05, -5),
      ],
      [
        new THREE.Vector3(0, 0.05, -7),
        new THREE.Vector3(1, 0.05, -3),
        new THREE.Vector3(1.5, 0.05, 1.5),
        new THREE.Vector3(2, 0.05, 6),
      ],
    ];

    routeCoords.forEach((coords) => {
      const curve = new THREE.CatmullRomCurve3(coords);
      highwayCurves.push(curve);

      const points = curve.getPoints(50);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
      });
      const line = new THREE.Line(geom, lineMat);
      highwayGroup.add(line);
    });

    // Traveling Data Packets (Points)
    const packetCount = 24;
    const packetPositions = new Float32Array(packetCount * 3);
    const packetProgress = new Float32Array(packetCount);
    const packetCurvesIdx = new Uint8Array(packetCount);

    for (let i = 0; i < packetCount; i++) {
      packetProgress[i] = Math.random();
      packetCurvesIdx[i] = i % highwayCurves.length;
    }

    const packetGeom = new THREE.BufferGeometry();
    packetGeom.setAttribute("position", new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      color: 0x00f5d4,
      size: 0.35,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const packetPoints = new THREE.Points(packetGeom, packetMat);
    cityGroup.add(packetPoints);

    // ─── 4. Active Signal Beacons (Matching Reference Callouts) ───────
    const beaconDefs: CityBeacon[] = [
      {
        id: "beacon-critical",
        type: "critical",
        title: "Water Leakage",
        category: "Critical Issue",
        sector: "Sector 14",
        distance: "2.4 km",
        confidence: 94.7,
        position: [-2.8, 0.3, -3.2], // Left upper plaza
        screenX: 0,
        screenY: 0,
      },
      {
        id: "beacon-resolved",
        type: "resolved",
        title: "Road Repair",
        category: "Resolved",
        sector: "Sector 7",
        distance: "1.2 km",
        confidence: 98.2,
        position: [5.2, 0.3, -4.5], // Top right plaza
        screenX: 0,
        screenY: 0,
      },
      {
        id: "beacon-in-progress",
        type: "in_progress",
        title: "Street Light",
        category: "In Progress",
        sector: "Sector 22",
        distance: "3.1 km",
        confidence: 89.4,
        position: [4.2, 0.3, 3.8], // Lower right plaza
        screenX: 0,
        screenY: 0,
      },
      {
        id: "beacon-active",
        type: "active",
        title: "High Voltage Cable",
        category: "Urgent Warning",
        sector: "Sector 3",
        distance: "0.8 km",
        confidence: 97.1,
        position: [-4.2, 0.3, 2.5], // Left lower plaza
        screenX: 0,
        screenY: 0,
      },
    ];

    const beaconMeshes: {
      beacon: CityBeacon;
      ring: THREE.Mesh;
      core: THREE.Mesh;
      light: THREE.PointLight;
    }[] = [];

    beaconDefs.forEach((b) => {
      const colorHex =
        b.type === "critical"
          ? 0xef4444
          : b.type === "resolved"
          ? 0x22c55e
          : b.type === "in_progress"
          ? 0x38bdf8
          : 0xf59e0b;

      // Ground Pulsing Ring
      const ringGeom = new THREE.RingGeometry(0.3, 0.55, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(...b.position);
      cityGroup.add(ringMesh);

      // Central glowing core sphere
      const coreGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const coreMesh = new THREE.Mesh(coreGeom, coreMat);
      coreMesh.position.set(...b.position);
      coreMesh.position.y += 0.2;
      cityGroup.add(coreMesh);

      // Point light
      const pLight = new THREE.PointLight(colorHex, 2.5, 6);
      pLight.position.set(...b.position);
      pLight.position.y += 0.5;
      cityGroup.add(pLight);

      beaconMeshes.push({ beacon: b, ring: ringMesh, core: coreMesh, light: pLight });
    });

    // ─── 5. Skyward Volumetric Light Beam ──────────────────────────────
    // A vertical beam shooting upward from core downtown
    const beamHeight = 35;
    const beamGeom = new THREE.CylinderGeometry(0.25, 1.2, beamHeight, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const skywardBeam = new THREE.Mesh(beamGeom, beamMat);
    skywardBeam.position.set(0.5, beamHeight / 2, 0);
    cityGroup.add(skywardBeam);

    // Beam core intense white cylinder
    const coreBeamGeom = new THREE.CylinderGeometry(0.08, 0.2, beamHeight, 16, 1, true);
    const coreBeamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const coreBeam = new THREE.Mesh(coreBeamGeom, coreBeamMat);
    coreBeam.position.copy(skywardBeam.position);
    cityGroup.add(coreBeam);

    // ─── 6. Large Orbital Signal Rings (Curved 3D Wireframe Arcs) ─────
    const orbitalGroup = new THREE.Group();
    cityGroup.add(orbitalGroup);

    const orbitConfigs = [
      { radius: 14.5, rotX: 1.1, rotY: 0.4, rotZ: 0.2, color: 0x6366f1, opacity: 0.45 },
      { radius: 17.0, rotX: 0.9, rotY: -0.6, rotZ: 0.5, color: 0x38bdf8, opacity: 0.35 },
      { radius: 19.5, rotX: 1.3, rotY: 0.8, rotZ: -0.3, color: 0x818cf8, opacity: 0.25 },
    ];

    const orbitRings: THREE.Line[] = [];

    orbitConfigs.forEach((cfg) => {
      const segments = 120;
      const points: THREE.Vector3[] = [];
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * cfg.radius, 0, Math.sin(theta) * cfg.radius));
      }
      const ringGeom = new THREE.BufferGeometry().setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
      });
      const orbitLine = new THREE.Line(ringGeom, ringMat);
      orbitLine.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ);
      orbitalGroup.add(orbitLine);
      orbitRings.push(orbitLine);
    });

    // ─── 7. Celestial Planet Atmosphere Curve (Top Right Background) ──
    const planetGeom = new THREE.SphereGeometry(60, 64, 64);
    const planetMat = new THREE.MeshBasicMaterial({
      color: 0x050508,
    });
    const planetMesh = new THREE.Mesh(planetGeom, planetMat);
    planetMesh.position.set(48, 25, -60);
    scene.add(planetMesh);

    // Planetary atmospheric glowing rim (Inverted Fresnel / Ring)
    const rimGeom = new THREE.RingGeometry(59.5, 62.5, 64);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    rimMesh.position.copy(planetMesh.position);
    rimMesh.position.z += 2;
    rimMesh.lookAt(camera.position);
    scene.add(rimMesh);

    // ─── 8. Atmospheric Floating Particles & Clouds ───────────────────
    const dustCount = 350;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.3) * 35;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 16 - 2;
      dustPositions[i * 3 + 2] = (Math.random() - 0.4) * 35;
    }
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.14,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeom, dustMat);
    cityGroup.add(dustPoints);

    // ─── 9. Lighting Setup ────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0a0a14, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x818cf8, 1.8);
    dirLight.position.set(15, 30, 20);
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    blueRimLight.position.set(-20, 10, -20);
    scene.add(blueRimLight);

    // ─── 10. Interactivity: Mouse Parallax & Screen Projection ────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ─── 11. Render Animation Loop ────────────────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let entranceProgress = 0;

    const projectToScreen = (worldPos: THREE.Vector3) => {
      const p = worldPos.clone();
      p.project(camera);
      const halfW = (container.clientWidth || window.innerWidth) / 2;
      const halfH = (container.clientHeight || window.innerHeight) / 2;
      return {
        x: p.x * halfW + halfW,
        y: -(p.y * halfH) + halfH,
      };
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Entrance camera animation
      if (entranceProgress < 1) {
        entranceProgress = Math.min(1, entranceProgress + delta * 0.45);
        const ease = 1 - Math.pow(1 - entranceProgress, 3);
        camera.position.lerpVectors(initialCamPos, targetCamPos, ease);
      }

      // Mouse parallax damping
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      if (!prefersReducedMotion) {
        camera.position.x = targetCamPos.x + mouseX * 2.2;
        camera.position.y = targetCamPos.y - mouseY * 1.5;
        camera.lookAt(lookTarget);

        // Orbital ring slow rotation
        orbitRings.forEach((r, idx) => {
          r.rotation.z += 0.0008 * (idx % 2 === 0 ? 1 : -1);
        });

        // City subtle float
        cityGroup.position.y = Math.sin(elapsed * 0.6) * 0.18;

        // Animate highway traveling packets
        const posAttr = packetPoints.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < packetCount; i++) {
          packetProgress[i] = (packetProgress[i] + delta * 0.22) % 1;
          const curve = highwayCurves[packetCurvesIdx[i]];
          if (curve) {
            const pt = curve.getPoint(packetProgress[i]);
            posAttr.setXYZ(i, pt.x, pt.y + 0.12, pt.z);
          }
        }
        posAttr.needsUpdate = true;

        // Animate beacon pulsing ground rings
        beaconMeshes.forEach(({ ring, light }, i) => {
          const pulse = (Math.sin(elapsed * 2.8 + i * 1.4) + 1) / 2;
          const scale = 1 + pulse * 0.75;
          ring.scale.set(scale, scale, 1);
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.9 - pulse * 0.55;
          light.intensity = 2.0 + pulse * 2.5;
        });

        // Skyward beam subtle modulation
        skywardBeam.rotation.y += 0.003;
        (skywardBeam.material as THREE.MeshBasicMaterial).opacity =
          0.3 + Math.sin(elapsed * 1.8) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webglSupported) {
    return <CityGridCanvas />;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto select-none"
      style={{ zIndex: 0 }}
    />
  );
};
