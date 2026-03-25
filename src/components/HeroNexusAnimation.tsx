import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Code2, Server, Database, Paintbrush, FileCode,
  Triangle, Github, Box, Cpu, Globe, Terminal, Layers,
} from "lucide-react";

// Tool definitions
const tools = [
  { icon: Code2, name: "React", ring: 0 },
  { icon: Code2, name: "Vue", ring: 0 },
  { icon: Code2, name: "Svelte", ring: 0 },
  { icon: Server, name: "Node.js", ring: 0 },
  { icon: Database, name: "Supabase", ring: 1 },
  { icon: Paintbrush, name: "Tailwind", ring: 1 },
  { icon: FileCode, name: "TypeScript", ring: 1 },
  { icon: Database, name: "Prisma", ring: 1 },
  { icon: Triangle, name: "Vercel", ring: 1 },
  { icon: Github, name: "GitHub", ring: 2 },
  { icon: Box, name: "Docker", ring: 2 },
  { icon: Cpu, name: "Deno", ring: 2 },
  { icon: Globe, name: "Next.js", ring: 2 },
  { icon: Terminal, name: "Bun", ring: 2 },
  { icon: Layers, name: "Vite", ring: 2 },
];

const RING_CONFIGS = [
  { radius: 1.8, speed: 0.15, tilt: 0.3 },
  { radius: 2.8, speed: -0.1, tilt: -0.2 },
  { radius: 3.8, speed: 0.07, tilt: 0.15 },
];

const PRIMARY_COLOR = new THREE.Color("#3b82f6");
const ACCENT_COLOR = new THREE.Color("#06b6d4");
const GLOW_COLOR = new THREE.Color("#60a5fa");

// Mouse parallax camera rig
function CameraRig({ isMobile }: { isMobile: boolean }) {
  const { camera, pointer } = useThree();
  useFrame(() => {
    if (isMobile) return;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.3, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Single tool orb
function ToolOrb({ position, tool, index }: {
  position: [number, number, number];
  tool: typeof tools[0];
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const IconComponent = tool.icon;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.05;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={[0.22, 16, 16]} />
      <meshStandardMaterial
        color={hovered ? ACCENT_COLOR : PRIMARY_COLOR}
        emissive={hovered ? ACCENT_COLOR : PRIMARY_COLOR}
        emissiveIntensity={hovered ? 0.8 : 0.3}
        transparent
        opacity={0.9}
        roughness={0.2}
        metalness={0.8}
      />
      {hovered && (
        <Html distanceFactor={6} center style={{ pointerEvents: "none" }}>
          <div className="bg-card/90 backdrop-blur border border-primary/20 rounded-md px-2 py-1 text-xs font-medium text-foreground whitespace-nowrap flex items-center gap-1.5 shadow-lg">
            <IconComponent className="w-3 h-3 text-primary" />
            {tool.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Orbital ring group that rotates
function OrbitalRing({ ringIndex, ringTools }: {
  ringIndex: number;
  ringTools: typeof tools;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const config = RING_CONFIGS[ringIndex];

  // Positions via even angle distribution
  const positions = useMemo(() => {
    return ringTools.map((_, i) => {
      const angle = (2 * Math.PI / ringTools.length) * i;
      const x = Math.cos(angle) * config.radius;
      const z = Math.sin(angle) * config.radius;
      const y = Math.sin(angle) * config.tilt * config.radius * 0.3;
      return [x, y, z] as [number, number, number];
    });
  }, [ringTools.length, config]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * config.speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Torus ring guide */}
      <mesh rotation={[Math.PI / 2 + config.tilt * 0.3, 0, 0]}>
        <torusGeometry args={[config.radius, 0.008, 8, 64]} />
        <meshStandardMaterial
          color={PRIMARY_COLOR}
          transparent
          opacity={0.15}
          emissive={PRIMARY_COLOR}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Tool orbs */}
      {ringTools.map((tool, i) => (
        <ToolOrb key={tool.name} position={positions[i]} tool={tool} index={ringIndex * 10 + i} />
      ))}
    </group>
  );
}

// Glowing central core
function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Outer glow sphere */}
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color={PRIMARY_COLOR}
            transparent
            opacity={0.08}
            emissive={GLOW_COLOR}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Core sphere with distortion */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <MeshDistortMaterial
            color="#2563eb"
            emissive={PRIMARY_COLOR}
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.9}
            distort={0.25}
            speed={3}
          />
        </mesh>

        {/* "D" label */}
        <Html center distanceFactor={5} style={{ pointerEvents: "none" }}>
          <span className="text-2xl font-bold text-primary-foreground drop-shadow-lg select-none">
            D
          </span>
        </Html>

        {/* Point light from core */}
        <pointLight color={GLOW_COLOR} intensity={2} distance={6} decay={2} />
      </group>
    </Float>
  );
}

// Full 3D scene
function NexusScene({ isMobile }: { isMobile: boolean }) {
  const ring0Tools = tools.filter((t) => t.ring === 0);
  const ring1Tools = tools.filter((t) => t.ring === 1);
  const ring2Tools = tools.filter((t) => t.ring === 2);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#93c5fd" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#06b6d4" />

      <CameraRig isMobile={isMobile} />
      <CentralCore />

      <OrbitalRing ringIndex={0} ringTools={ring0Tools} />
      <OrbitalRing ringIndex={1} ringTools={ring1Tools} />
      <OrbitalRing ringIndex={2} ringTools={ring2Tools} />

      {!isMobile && (
        <Stars radius={15} depth={30} count={200} factor={2} saturation={0.5} fade speed={0.5} />
      )}
    </>
  );
}

export function HeroNexusAnimation() {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[500px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ alpha: true, antialias: !isMobile }}
      >
        <Suspense fallback={null}>
          <NexusScene isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
