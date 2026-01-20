import { VRM, VRMExpressionPresetName } from "@pixiv/three-vrm";

export { VRMController } from "./VRMController";

export const EXPRESSIONS = {
  neutral: { happy: 0, sad: 0, angry: 0, relaxed: 0 },
  happy: { happy: 0.8, sad: 0, angry: 0, relaxed: 0.2 },
  sad: { happy: 0, sad: 0.7, angry: 0, relaxed: 0 },
  angry: { happy: 0, sad: 0, angry: 0.8, relaxed: 0 },
  surprised: { happy: 0.3, sad: 0, angry: 0, relaxed: 0 },
} as const;

export function applyLipSync(vrm: VRM, value: number) {
  vrm.expressionManager?.setValue("aa", value);
}

export function applyExpression(
  vrm: VRM,
  preset: keyof typeof EXPRESSIONS
) {
  const values = EXPRESSIONS[preset];
  Object.entries(values).forEach(([name, value]) => {
    vrm.expressionManager?.setValue(name as VRMExpressionPresetName, value);
  });
}