import React, { useRef, useEffect, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, useTexture, Float, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import useStore, { CATALOG_ITEMS } from '../store/useStore';

// ─── ANCHOR POSITIONS: Cinematic High Volume Layour (V8) ───────────
// Bouquet is taller, more open, and prominent to match the 8K reference
const buildAnchorPositions = () => {
  const positions = [];
  const rings = [
    { count: 1,  r: 0.0,  baseY: 4.5, spread: 0   },  // Hero center flower (highest)
    { count: 4,  r: 0.85, baseY: 3.8, spread: 0.5 },  // Inner upper ring
    { count: 5,  r: 1.5,  baseY: 2.8, spread: 0.6 },  // Mid wide ring
    { count: 5,  r: 2.1,  baseY: 1.6, spread: 0.3 },  // Outer lowest rim
  ];

  rings.forEach(({ count, r, baseY, spread }) => {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (r > 1 ? Math.PI / count : 0);
      const yJitter = (i % 2 === 0 ? 1 : -1) * spread * 0.5;
      positions.push(new THREE.Vector3(
        Math.cos(angle) * r,
        baseY + yJitter,
        Math.sin(angle) * r
      ));
    }
  });
  return positions;
};

const ANCHOR_POSITIONS = buildAnchorPositions();

// ─── PROCEDURAL TEXTURES ─────────────────────────────────────────────────────

// Paper fiber normal map (directional grain for Kraft/Silk/Velvet/Gold)
const buildPaperNormalMap = (type = 'kraft') => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (type === 'kraft' || type === 'silk') {
    // Horizontal fiber lines with noise
    const imageData = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const fiber = Math.sin(y * 0.8 + Math.sin(x * 0.05) * 8) * 0.5 + 0.5;
        const grain = Math.random() * 0.18;
        const nx = 128 + (fiber * 40 + grain * 30);
        const ny = 128 + (grain * 20 - 10);
        imageData.data[idx]     = nx;
        imageData.data[idx + 1] = ny;
        imageData.data[idx + 2] = 255;
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  } else if (type === 'velvet') {
    // Diagonal microfibers
    const imageData = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const fiber = Math.sin((x + y) * 0.6 + Math.random() * 0.5) * 0.5 + 0.5;
        imageData.data[idx]     = 128 + fiber * 60;
        imageData.data[idx + 1] = 128 - fiber * 30;
        imageData.data[idx + 2] = 255;
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  } else {
    // Gold: subtle micro-scratches
    const imageData = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const scratch = Math.sin(x * 2.5 + Math.random() * 0.4) * 0.15;
        imageData.data[idx]     = 128 + scratch * 60;
        imageData.data[idx + 1] = 128;
        imageData.data[idx + 2] = 255;
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
};

// Stem bark texture (green fiber lines)
const buildStemTexture = () => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const line = Math.sin(x * 0.5 + y * 0.1 + Math.random() * 0.3) * 30;
      imageData.data[idx]     = 30  + line * 0.3;
      imageData.data[idx + 1] = 90  + line * 0.8;
      imageData.data[idx + 2] = 35;
      imageData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return new THREE.CanvasTexture(canvas);
};

// ─── PRE-BUILT GEOMETRIES ────────────────────────────────────────────────────

// Organic wrapper cone with wrinkle displacement
const buildWrapperGeo = () => {
  const geo = new THREE.CylinderGeometry(2.6, 0.18, 5.5, 160, 80, true);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const angle = Math.atan2(z, x);
    const yRatio = (y + 2.75) / 5.5;
    // Multi-frequency wrinkles: coarse folds + fine micro-crinkles
    let fold = Math.sin(angle * 6)  * 0.10 * yRatio
             + Math.cos(angle * 14 + y * 1.8) * 0.05 * yRatio
             + Math.sin(angle * 30 - y * 3.5) * 0.018
             + (Math.random() - 0.5) * 0.008;
    const len = Math.sqrt(x * x + z * z);
    if (len > 0) {
      pos.setX(i, x + (x / len) * fold);
      pos.setZ(i, z + (z / len) * fold);
    }
  }
  geo.computeVertexNormals();
  return geo;
};

const wrapperGeo = buildWrapperGeo();

// Pre-build normal maps (once)
const normalMaps = {
  matte:    buildPaperNormalMap('kraft'),
  silk:     buildPaperNormalMap('silk'),
  velvet:   buildPaperNormalMap('velvet'),
  metallic: buildPaperNormalMap('gold'),
};
const stemTexture = buildStemTexture();

// ─── BACKGROUND ENVIRONMENT (V8 Room) ─────────────────────────────────────────

// Wood floor texture mimicking natural oak
const buildWoodFloorTexture = () => {
  const s = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = s; canvas.height = s;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(s, s);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const idx = (y * s + x) * 4;
      const board = Math.floor(x / 120); // Planks
      const grain = Math.sin(y * 0.05 + Math.sin(x * 0.02) * 20) * 15;
      const noise = Math.random() * 10 - 5;
      const baseL = 165 + (board % 2 === 0 ? 10 : -8) + grain + noise; // Light oak
      img.data[idx] = baseL;
      img.data[idx+1] = baseL * 0.85;
      img.data[idx+2] = baseL * 0.65;
      img.data[idx+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
};
const woodFloorTexture = buildWoodFloorTexture();

const RoomEnvironment = () => {
  return (
    <group>
      {/* Wooden Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial 
          map={woodFloorTexture}
          roughness={0.25}
          metalness={0.0}
          clearcoat={0.65}
          clearcoatRoughness={0.2}
          color="#d5bfa7"
        />
      </mesh>

      {/* Warm beige paneled wall background */}
      <mesh position={[0, 10, -18]} receiveShadow>
        <planeGeometry args={[100, 40]} />
        <meshStandardMaterial color="#f0e9df" roughness={0.9} />
      </mesh>
    </group>
  );
};

// ─── PETAL STACK FLOWER ───────────────────────────────────────────────────────
// Each flower = N layered petal planes at golden-angle rotations → volumetric dome
const PETAL_LAYERS = 6;
const GOLDEN_ANGLE_DEG = 137.5;

const PetalStack = ({ texture, isMenu }) => {
  return (
    <>
      {Array.from({ length: PETAL_LAYERS }).map((_, layer) => {
        const normalizedLayer = layer / (PETAL_LAYERS - 1); // 0..1
        const rotZ = (layer * GOLDEN_ANGLE_DEG * Math.PI) / 180;
        const scale = 1.0 - normalizedLayer * 0.35; // inner petals smaller
        const zOffset = normalizedLayer * 0.18;     // inner petals rise up
        const opacity = 1.0 - normalizedLayer * 0.2;

        return (
          <mesh
            key={layer}
            rotation={[0, 0, rotZ]}
            position={[0, zOffset, zOffset * 0.5]}
            scale={[scale, scale, 1]}
            castShadow
          >
            <planeGeometry args={[1.7, 1.7, 80, 80]} />
            <meshPhysicalMaterial
              map={texture}
              displacementMap={texture}
              displacementScale={0.22 - normalizedLayer * 0.08}
              roughness={0.65}
              metalness={0.0}
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
              onBeforeCompile={(shader) => {
                shader.fragmentShader = shader.fragmentShader.replace(
                  '#include <map_fragment>',
                  `
                  #include <map_fragment>
                  if (sampledDiffuseColor.r < 0.07 && sampledDiffuseColor.g < 0.07 && sampledDiffuseColor.b < 0.07) {
                    discard;
                  }
                  `
                );
              }}
            />
          </mesh>
        );
      })}
    </>
  );
};

// ─── LEAF GEOMETRY ────────────────────────────────────────────────────────────
const buildLeafGeo = () => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.18, 0.3, 0, 0.55);
  shape.quadraticCurveTo(-0.18, 0.3, 0, 0);
  return new THREE.ShapeGeometry(shape, 12);
};
const leafGeo = buildLeafGeo();

// ─── REALISTIC FLOWER ─────────────────────────────────────────────────────────
const RealisticFlower = ({
  item, isMenu = false, index = 0,
  targetPos, startPos, normal, onPointerDown
}) => {
  const groupRef = useRef();
  const texture = useTexture(item.image);

  // V6: biased normal so flowers face camera-ward, not sideways
  const targetRotation = useMemo(() => {
    if (isMenu) return new THREE.Euler(-Math.PI / 6, 0, 0);
    if (normal && targetPos) {
      const biased = normal.clone().lerp(new THREE.Vector3(0, 1, 0), 0.5).normalize();
      const dummy = new THREE.Object3D();
      dummy.position.copy(targetPos);
      dummy.lookAt(targetPos.clone().add(biased));
      return dummy.rotation;
    }
    return new THREE.Euler(0, 0, 0);
  }, [isMenu, targetPos, normal]);

  useEffect(() => {
    if (!isMenu && groupRef.current && targetPos && startPos) {
      groupRef.current.position.copy(startPos);
      const delay = index * 0.12;
      gsap.to(groupRef.current.position, {
        x: targetPos.x, y: targetPos.y, z: targetPos.z,
        duration: 1.3, delay, ease: 'power3.out'
      });
      groupRef.current.scale.set(0, 0, 0);
      gsap.to(groupRef.current.scale, {
        x: 1.8, y: 1.8, z: 1.8,
        duration: 0.9, delay, ease: 'back.out(1.9)'
      });
    } else if (isMenu && groupRef.current) {
      groupRef.current.scale.set(1.5, 1.5, 1.5);
    }
  }, [isMenu, targetPos, startPos, index]);

  return (
    <group
      ref={groupRef}
      position={startPos || [0, 0, 0]}
      rotation={targetRotation}
      onPointerDown={onPointerDown}
    >
      {/* Stem — visible both in menu and in bouquet */}
      <mesh position={[0, -0.85, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.028, 1.6, 8]} />
        <meshStandardMaterial map={stemTexture} color="#2d6a2d" roughness={0.88} />
      </mesh>

      <PetalStack texture={texture} isMenu={isMenu} />
    </group>
  );
};

// ─── ORGANIC STEM WITH LEAF ───────────────────────────────────────────────────
const FlowerStem = ({ targetPos }) => {
  const { stemGeo, leafPos, leafRot } = useMemo(() => {
    const knot = new THREE.Vector3(targetPos.x * 0.08, -1.8, targetPos.z * 0.08);
    const mid  = new THREE.Vector3(targetPos.x * 0.5, -0.2, targetPos.z * 0.5);
    const curve = new THREE.CatmullRomCurve3([
      targetPos.clone().add(new THREE.Vector3(0, -0.3, 0)),
      mid,
      knot
    ]);
    const geo = new THREE.TubeGeometry(curve, 24, 0.045, 8, false);

    // Leaf at mid-point of stem
    const lp = curve.getPoint(0.45);
    const tangent = curve.getTangent(0.45);
    const lr = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent)
    );
    return { stemGeo: geo, leafPos: lp, leafRot: lr };
  }, [targetPos]);

  return (
    <group>
      {/* Main stem */}
      <mesh geometry={stemGeo} castShadow receiveShadow>
        <meshStandardMaterial map={stemTexture} color="#2d6a2d" roughness={0.88} />
      </mesh>

      {/* Leaf */}
      <mesh geometry={leafGeo} position={leafPos} rotation={leafRot} castShadow>
        <meshStandardMaterial
          color="#3a7a35"
          roughness={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={leafGeo} position={leafPos} rotation={[leafRot.x, leafRot.y + 2.8, leafRot.z]} castShadow>
        <meshStandardMaterial
          color="#4a8a40"
          roughness={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// ─── CATALOG RING ─────────────────────────────────────────────────────────────
const MenuRing = () => {
  const addFlower = useStore(s => s.addFlower);
  const groupRef = useRef();
  const catalogKeys = Object.keys(CATALOG_ITEMS);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, 3.5, 0]}>
      {catalogKeys.map((key, i) => {
        const item = CATALOG_ITEMS[key];
        const angle = (i / catalogKeys.length) * Math.PI * 2;
        const r = 9;
        const pos = new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r);

        return (
          <Float key={key} position={pos} speed={1.8} rotationIntensity={0.3} floatIntensity={0.8}>
            <RealisticFlower
              item={item}
              isMenu
              onPointerDown={(e) => { e.stopPropagation(); addFlower(key); }}
            />
            <Text
              position={[0, -2.0, 0]}
              fontSize={0.32}
              color="#1a1a1a"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#fff"
            >
              {item.name}{`\n$${item.price}`}
            </Text>
          </Float>
        );
      })}
    </group>
  );
};

// ─── WRAPPER MATERIAL (per type) ─────────────────────────────────────────────
const WrapperMaterial = ({ wrapTexture, wrapping }) => {
  const normalMap = normalMaps[wrapping.material] || normalMaps['matte'];

  const props = useMemo(() => {
    switch (wrapping.material) {
      case 'metallic': return {
        roughness: 0.12, metalness: 0.95, clearcoat: 1.0,
        clearcoatRoughness: 0.08, envMapIntensity: 2.5
      };
      case 'silk': return {
        roughness: 0.35, metalness: 0.08, clearcoat: 0.9,
        clearcoatRoughness: 0.2, sheen: 0.4, envMapIntensity: 1.5
      };
      case 'velvet': return {
        roughness: 0.85, metalness: 0.0, sheen: 1.0,
        sheenRoughness: 0.3, sheenColor: wrapping.color, envMapIntensity: 0.3
      };
      default: return { roughness: 0.88, metalness: 0.0, envMapIntensity: 0.5 };
    }
  }, [wrapping.material]);

  return (
    <meshPhysicalMaterial
      map={wrapTexture}
      normalMap={normalMap}
      normalScale={new THREE.Vector2(0.6, 0.6)}
      color={wrapping.color}
      side={THREE.DoubleSide}
      {...props}
    />
  );
};

// ─── BOUQUET ─────────────────────────────────────────────────────────────────
const Bouquet = () => {
  const flowers     = useStore(s => s.flowers);
  const wrapping    = useStore(s => s.wrapping);
  const removeFlower = useStore(s => s.removeFlower);
  const groupRef    = useRef();
  const wrapTexture = useTexture(wrapping.image);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime;
      groupRef.current.position.y  = Math.sin(t * 0.7) * 0.07;
      // V8: Tilt bouquet forward to show the open volume hero-shot style
      groupRef.current.rotation.x  = 0.15;
      groupRef.current.rotation.y  = -0.25 + Math.sin(t * 0.35) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Paper cone ── */}
      <mesh geometry={wrapperGeo} position={[0, 0.5, 0]} receiveShadow castShadow>
        <WrapperMaterial wrapTexture={wrapTexture} wrapping={wrapping} />
      </mesh>

      {/* ── Rim edge ring (defined paper edge) ── */}
      <mesh position={[0, 3.3, 0]} castShadow>
        <torusGeometry args={[2.62, 0.055, 12, 100]} />
        <meshPhysicalMaterial
          color={wrapping.color}
          roughness={wrapping.material === 'metallic' ? 0.1 : 0.75}
          metalness={wrapping.material === 'metallic' ? 0.95 : 0.05}
        />
      </mesh>

      {/* ── Bottom knot ribbon ── */}
      <mesh position={[0, -1.7, 0]} castShadow>
        <torusGeometry args={[0.25, 0.07, 10, 60]} />
        <meshPhysicalMaterial color={wrapping.color} roughness={0.6} />
      </mesh>

      {/* ── Flowers + stems ── */}
      {flowers.map((f, i) => {
        const targetPos = ANCHOR_POSITIONS[f.anchorIndex];
        const startPos  = new THREE.Vector3(targetPos.x * 4, 12, targetPos.z * 4);
        const center    = new THREE.Vector3(0, 0.5, 0);
        const normal    = targetPos.clone().sub(center).normalize();

        return (
          <group key={f.id}>
            <FlowerStem targetPos={targetPos} />
            <RealisticFlower
              item={f.item}
              index={i}
              targetPos={targetPos}
              startPos={startPos}
              normal={normal}
              onPointerDown={(e) => { e.stopPropagation(); removeFlower(f.id); }}
            />
          </group>
        );
      })}
    </group>
  );
};

// ─── SCENE ROOT ──────────────────────────────────────────────────────────────
const Scene = () => (
  <div style={{ width: '100%', height: '100%' }}>
    <Canvas
      camera={{ position: [0, 7, 17], fov: 42 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      id="fl-canvas"
      shadows="soft"
    >
      <Suspense fallback={null}>
        <Environment preset="warehouse" />

        {/* ── 3-Point Studio + Window Lighting (V8) ── */}
        {/* Main "Window" Key light: strong directional from top-left */}
        <spotLight
          position={[-18, 22, 12]}
          intensity={4.8}
          angle={0.45}
          penumbra={0.7}
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-bias={-0.0001}
          color="#fffaef"
        />
        
        {/* Warm fill light from right to soften shadows */}
        <pointLight position={[10, 8, 5]} intensity={1.5} color="#fff1e0" />
        
        {/* Rim light from back to create halo separation */}
        <spotLight
          position={[5, 12, -15]}
          intensity={2.5}
          angle={0.5}
          penumbra={1.0}
          color="#fff6cc"
        />
        
        {/* Under-bounce to lighten the dark bottom of the cone */}
        <pointLight position={[0, -2, 4]} intensity={0.6} color="#ffe8cc" />

        {/* ── Scenery ── */}
        <RoomEnvironment />

        {/* ── Scene objects ── */}
        <MenuRing />
        <Bouquet />

        {/* ── Ground shadow ── */}
        <ContactShadows
          position={[0, -2.59, 0]}
          opacity={0.85}
          scale={30}
          blur={3}
          far={8}
          color="#332211"
        />

        {/* ── Camera controls ── */}
        <OrbitControls
          makeDefault
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.05}  /* Prevent going below floor */
          minDistance={8}
          maxDistance={35}
          dampingFactor={0.08}
          enableDamping
        />

        {/* ── Cinematic post-processing ── */}
        <EffectComposer>
          <Bloom
            intensity={0.35}
            luminanceThreshold={0.75}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.65} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  </div>
);

export default Scene;
