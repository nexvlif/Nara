import { VRM } from "@pixiv/three-vrm";

export function applyLipSync(vrm: VRM, value: number) {
  vrm.expressionManager?.setValue("aa", value);
}