"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useThree } from "@react-three/fiber";


export default function VRMModel() {
  const { scene } = useThree();
  const vrmRef = useRef<VRM | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    console.log("Loading VRM model...");

    loader.load(
      "/vrm/Nara.vrm",
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM;
        console.log("VRM model loaded:", vrm);
        scene.add(vrm.scene);
        vrmRef.current = vrm;

        VRMUtils.rotateVRM0(vrm);
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
      }
    };
  }, [scene]);

  return null;
}

