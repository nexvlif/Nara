"use client";

import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useThree, useFrame } from "@react-three/fiber";
import { VRMController } from "@/lib/VRMController";

interface VRMModelProps {
  onControllerReady?: (controller: VRMController) => void;
}

export default function VRMModel({ onControllerReady }: VRMModelProps) {
  const { scene } = useThree();
  const vrmRef = useRef<VRM | null>(null);
  const controllerRef = useRef<VRMController | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    console.log("Loading VRM model...");

    loader.load(
      "/vrm/Nara.vrm",
      async (gltf) => {
        if (vrmRef.current) {
          scene.remove(vrmRef.current.scene);
          VRMUtils.deepDispose(vrmRef.current.scene);
        }

        const vrm = gltf.userData.vrm as VRM;
        console.log("VRM model loaded:", vrm);
        scene.add(vrm.scene);
        vrmRef.current = vrm;

        VRMUtils.rotateVRM0(vrm);

        const controller = new VRMController(vrm);
        controllerRef.current = controller;

        onControllerReady?.(controller);
      },
      (progress) => {
        console.log(
          "Loading VRM details...",
          100.0 * (progress.loaded / progress.total) + "%"
        );
      },
      (error) => {
        console.error("Failed to load VRM model:", error);
      }
    );

    return () => {
      if (vrmRef.current) {
        scene.remove(vrmRef.current.scene);
        VRMUtils.deepDispose(vrmRef.current.scene);
        vrmRef.current = null;
        controllerRef.current = null;
      }
    };
  }, [scene]);

  useFrame((_, delta) => {
    controllerRef.current?.update(delta);
  });

  return null;
}
