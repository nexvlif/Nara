"use client";

import { useRef, useEffect, useCallback } from "react";
import { VRMController } from "./VRMController";

interface FaceData {
  headRotationX: number;
  headRotationY: number;
  headRotationZ: number;
  mouthOpen: number;
  eyeBlinkLeft: number;
  eyeBlinkRight: number;
}

export class FaceTracker {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private isRunning = false;
  private onFaceData: ((data: FaceData) => void) | null = null;
  private animationFrameId: number | null = null;

  async start(onFaceData: (data: FaceData) => void): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }
      });

      this.video = document.createElement("video");
      this.video.srcObject = this.stream;
      this.video.autoplay = true;
      this.video.playsInline = true;
      await this.video.play();

      this.onFaceData = onFaceData;
      this.isRunning = true;
      this.track();

      console.log("Face tracking started");
      return true;
    } catch (err) {
      console.error("Failed to start face tracking:", err);
      return false;
    }
  }

  stop() {
    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }

    console.log("Face tracking stopped");
  }

  private track() {
    if (!this.isRunning || !this.video) return;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (ctx && this.video.readyState === 4) {
      ctx.drawImage(this.video, 0, 0, 64, 64);
      const imageData = ctx.getImageData(0, 0, 64, 64);

      let leftBrightness = 0;
      let rightBrightness = 0;
      let topBrightness = 0;
      let bottomBrightness = 0;

      for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 64; x++) {
          const i = (y * 64 + x) * 4;
          const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;

          if (x < 32) leftBrightness += brightness;
          else rightBrightness += brightness;

          if (y < 32) topBrightness += brightness;
          else bottomBrightness += brightness;
        }
      }

      const total = leftBrightness + rightBrightness;
      const horizontalRatio = total > 0 ? (rightBrightness - leftBrightness) / total : 0;
      const verticalRatio = total > 0 ? (bottomBrightness - topBrightness) / total : 0;

      const faceData: FaceData = {
        headRotationX: verticalRatio * 0.3,
        headRotationY: horizontalRatio * 0.4,
        headRotationZ: 0,
        mouthOpen: 0,
        eyeBlinkLeft: 0,
        eyeBlinkRight: 0,
      };

      this.onFaceData?.(faceData);
    }

    this.animationFrameId = requestAnimationFrame(() => this.track());
  }
}

export function applyFaceDataToVRM(controller: VRMController, data: FaceData) {
  const vrm = controller.getVRM();
  const head = vrm.humanoid?.getNormalizedBoneNode("head");
  const neck = vrm.humanoid?.getNormalizedBoneNode("neck");

  if (head) {
    head.rotation.x = data.headRotationX;
    head.rotation.y = data.headRotationY;
    head.rotation.z = data.headRotationZ;
  }

  if (neck) {
    neck.rotation.x = data.headRotationX * 0.3;
    neck.rotation.y = data.headRotationY * 0.3;
  }

  if (data.mouthOpen > 0) {
    vrm.expressionManager?.setValue("aa", data.mouthOpen);
  }

  if (data.eyeBlinkLeft > 0.5) {
    vrm.expressionManager?.setValue("blinkLeft", 1);
  }
  if (data.eyeBlinkRight > 0.5) {
    vrm.expressionManager?.setValue("blinkRight", 1);
  }
}
