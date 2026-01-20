import { VRM } from "@pixiv/three-vrm";

export type Viseme = "aa" | "ih" | "ou" | "ee" | "oh";

export interface VisemeWeights {
  aa: number;
  ih: number;
  ou: number;
  ee: number;
  oh: number;
}

export class VisemeController {
  private vrm: VRM;
  private currentWeights: VisemeWeights = { aa: 0, ih: 0, ou: 0, ee: 0, oh: 0 };
  private targetWeights: VisemeWeights = { aa: 0, ih: 0, ou: 0, ee: 0, oh: 0 };
  private smoothing = 0.2;

  constructor(vrm: VRM) {
    this.vrm = vrm;
  }

  setVisemeWeights(weights: Partial<VisemeWeights>) {
    Object.assign(this.targetWeights, weights);
  }

  setFromVolume(volume: number) {
    const v = Math.min(1, volume * 2.5);

    if (v < 0.1) {
      this.targetWeights = { aa: 0, ih: 0, ou: 0, ee: 0, oh: 0 };
    } else if (v < 0.3) {
      this.targetWeights = { aa: v * 0.3, ih: v * 0.2, ou: 0, ee: 0, oh: v * 0.1 };
    } else if (v < 0.6) {
      this.targetWeights = { aa: v * 0.5, ih: v * 0.3, ou: v * 0.2, ee: v * 0.1, oh: v * 0.2 };
    } else {
      this.targetWeights = { aa: v, ih: v * 0.2, ou: v * 0.3, ee: 0, oh: v * 0.2 };
    }
  }

  setFromFrequency(lowFreq: number, midFreq: number, highFreq: number) {
    this.targetWeights = {
      aa: lowFreq * 0.8,
      ou: lowFreq * 0.4,
      ee: midFreq * 0.5,
      oh: midFreq * 0.3,
      ih: highFreq * 0.6,
    };
  }

  update(deltaTime: number) {
    if (!this.vrm.expressionManager) return;

    const visemes: Viseme[] = ["aa", "ih", "ou", "ee", "oh"];

    visemes.forEach((viseme) => {
      this.currentWeights[viseme] +=
        (this.targetWeights[viseme] - this.currentWeights[viseme]) * this.smoothing;

      this.targetWeights[viseme] *= 0.85;

      this.vrm.expressionManager?.setValue(viseme, this.currentWeights[viseme]);
    });
  }

  reset() {
    const visemes: Viseme[] = ["aa", "ih", "ou", "ee", "oh"];
    visemes.forEach((viseme) => {
      this.currentWeights[viseme] = 0;
      this.targetWeights[viseme] = 0;
      this.vrm.expressionManager?.setValue(viseme, 0);
    });
  }
}
