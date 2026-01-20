import { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";
import * as THREE from "three";

export class ProceduralAnimations {
  private vrm: VRM;

  private breathTimer = 0;
  private swayTimer = 0;
  private headBobTimer = 0;

  private breathSpeed = 1.2;
  private swaySpeed = 0.8;
  private headBobSpeed = 0.5;

  private intensity = 1.0;
  private idlePoseApplied = false;
  public faceTrackingEnabled = false;

  constructor(vrm: VRM) {
    this.vrm = vrm;
  }

  setIntensity(value: number) {
    this.intensity = Math.max(0, Math.min(1, value));
  }


  applyIdlePose() {
    const leftUpperArm = this.vrm.humanoid?.getNormalizedBoneNode("leftUpperArm");
    const rightUpperArm = this.vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");
    const leftLowerArm = this.vrm.humanoid?.getNormalizedBoneNode("leftLowerArm");
    const rightLowerArm = this.vrm.humanoid?.getNormalizedBoneNode("rightLowerArm");
    const leftHand = this.vrm.humanoid?.getNormalizedBoneNode("leftHand");
    const rightHand = this.vrm.humanoid?.getNormalizedBoneNode("rightHand");

    if (leftUpperArm) {
      leftUpperArm.rotation.z = -1.3;
      leftUpperArm.rotation.x = 0.1;
    }
    if (rightUpperArm) {
      rightUpperArm.rotation.z = 1.3;
      rightUpperArm.rotation.x = 0.1;
    }
    if (leftLowerArm) {
      leftLowerArm.rotation.y = -0.3;
    }
    if (rightLowerArm) {
      rightLowerArm.rotation.y = 0.3;
    }

    this.idlePoseApplied = true;
  }

  update(deltaTime: number) {
    if (!this.idlePoseApplied) {
      this.applyIdlePose();
    }

    this.breathTimer += deltaTime * this.breathSpeed;
    this.swayTimer += deltaTime * this.swaySpeed;
    this.headBobTimer += deltaTime * this.headBobSpeed;

    this.applyBreathing();
    this.applyBodySway();
    this.applyHeadMovement();
    this.applyArmIdle();
  }

  private applyBreathing() {
    const spine = this.vrm.humanoid?.getNormalizedBoneNode("spine");
    const chest = this.vrm.humanoid?.getNormalizedBoneNode("chest");

    if (!spine || !chest) return;

    const breathValue = Math.sin(this.breathTimer) * 0.01 * this.intensity;

    spine.rotation.x = breathValue * 0.5;
    chest.rotation.x = breathValue;
  }

  private applyBodySway() {
    const hips = this.vrm.humanoid?.getNormalizedBoneNode("hips");
    const spine = this.vrm.humanoid?.getNormalizedBoneNode("spine");

    if (!hips || !spine) return;

    const swayX = Math.sin(this.swayTimer) * 0.005 * this.intensity;

    hips.rotation.z = swayX;
    spine.rotation.z = -swayX * 0.5;
  }

  private applyHeadMovement() {
    if (this.faceTrackingEnabled) return;

    const head = this.vrm.humanoid?.getNormalizedBoneNode("head");
    const neck = this.vrm.humanoid?.getNormalizedBoneNode("neck");

    if (!head || !neck) return;

    const headX = Math.sin(this.headBobTimer * 1.3) * 0.02 * this.intensity;
    const headY = Math.sin(this.headBobTimer * 0.9) * 0.015 * this.intensity;

    head.rotation.x = headX;
    head.rotation.y = headY;

    neck.rotation.x = headX * 0.3;
    neck.rotation.y = headY * 0.3;
  }

  private applyArmIdle() {
    const leftUpperArm = this.vrm.humanoid?.getNormalizedBoneNode("leftUpperArm");
    const rightUpperArm = this.vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");

    if (!leftUpperArm || !rightUpperArm) return;

    const armSway = Math.sin(this.swayTimer * 0.5) * 0.02 * this.intensity;

    leftUpperArm.rotation.x = 0.1 + armSway;
    rightUpperArm.rotation.x = 0.1 - armSway;
  }

  applyMoodGesture(mood: "happy" | "thinking" | "excited" | "calm") {
    switch (mood) {
      case "happy":
        this.setIntensity(1.2);
        break;
      case "thinking":
        this.setIntensity(0.7);
        this.applyThinkingPose();
        break;
      case "excited":
        this.setIntensity(1.5);
        break;
      case "calm":
        this.setIntensity(0.5);
        break;
    }
  }

  private applyThinkingPose() {
    const rightUpperArm = this.vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");
    const rightLowerArm = this.vrm.humanoid?.getNormalizedBoneNode("rightLowerArm");

    if (rightUpperArm) {
      rightUpperArm.rotation.z = -0.8;
      rightUpperArm.rotation.x = 0.3;
    }
    if (rightLowerArm) {
      rightLowerArm.rotation.y = -1.2;
      rightLowerArm.rotation.x = 0.5;
    }
  }

  reset() {
    const bones: VRMHumanBoneName[] = [
      "hips", "spine", "chest", "neck", "head",
      "leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm",
      "leftHand", "rightHand"
    ];

    bones.forEach((boneName) => {
      const bone = this.vrm.humanoid?.getNormalizedBoneNode(boneName);
      if (bone) {
        bone.rotation.set(0, 0, 0);
      }
    });

    this.idlePoseApplied = false;
  }
}

