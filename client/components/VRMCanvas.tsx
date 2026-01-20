"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import VRMModel from "@/components/VRMModel"
import { VRMController } from "@/lib/VRMController"

interface VRMCanvasProps {
  onControllerReady?: (controller: VRMController) => void;
}

export default function VRMCanvas({ onControllerReady }: VRMCanvasProps) {
  return (
    <Canvas camera={{ position: [0, 1.5, 1.2], fov: 25 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[1, 1, 1]} />
      <VRMModel onControllerReady={onControllerReady} />
      <OrbitControls
        target={[0, 1.4, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}