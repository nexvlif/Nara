import { VRM, VRMExpressionPresetName } from "@pixiv/three-vrm";
import { ProceduralAnimations } from "./ProceduralAnimations";
import { VisemeController } from "./VisemeController";

export type Mood = "happy" | "sad" | "angry" | "surprised" | "thinking" | "calm" | "neutral";

const MOOD_KEYWORDS: Record<Mood, string[]> = {
  happy: ["haha", "wkwk", "senang", "suka", "love", "happy", "yay", "hehe", "hihi", "lucu", "bagus", "mantap", "asik", "asyik", "yeay", "❤", "😊", "😄", "🥰", "good", "great", "awesome", "nice"],
  sad: ["sedih", "sad", "maaf", "sorry", "huhu", "hiks", "kasihan", "sayang sekali", "unfortunately"],
  angry: ["kesal", "marah", "angry", "grrr", "huh", "menyebalkan", "annoying"],
  surprised: ["wow", "wah", "whoa", "amazing", "keren", "gila", "hebat", "incredible", "!!", "???"],
  thinking: ["hmm", "mungkin", "sepertinya", "kayaknya", "let me think", "i think", "maybe", "perhaps"],
  calm: ["oke", "ok", "baik", "tenang", "santai", "relaxed", "sure", "alright"],
  neutral: [],
};

export class VRMController {
  private vrm: VRM;

  public procedural: ProceduralAnimations;
  public viseme: VisemeController;

  private blinkTimer: number = 0;
  private nextBlinkTime: number = 2;
  private isBlinking: boolean = false;
  private blinkProgress: number = 0;

  private currentMood: Mood = "neutral";
  private moodTransitionProgress: number = 0;
  private targetExpressions: Map<string, number> = new Map();

  constructor(vrm: VRM) {
    this.vrm = vrm;
    this.procedural = new ProceduralAnimations(vrm);
    this.viseme = new VisemeController(vrm);
    this.scheduleNextBlink();
  }

  private scheduleNextBlink() {
    this.nextBlinkTime = 2 + Math.random() * 4;
    this.blinkTimer = 0;
  }

  setLipSync(value: number) {
    this.viseme.setFromVolume(value);
  }

  setExpression(name: VRMExpressionPresetName, value: number) {
    this.vrm.expressionManager?.setValue(name, value);
  }

  detectMoodFromText(text: string): Mood {
    const lowerText = text.toLowerCase();

    for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return mood as Mood;
        }
      }
    }

    return "neutral";
  }

  setMoodFromText(text: string) {
    const detectedMood = this.detectMoodFromText(text);
    this.setMood(detectedMood);
  }

  setMood(mood: Mood) {
    this.currentMood = mood;
    this.moodTransitionProgress = 0;

    const expressionMap: Record<Mood, Record<string, number>> = {
      happy: { happy: 0.3, relaxed: 0.2 },
      sad: { sad: 0.5 },
      angry: { angry: 0.4 },
      surprised: { surprised: 0.5 },
      thinking: { relaxed: 0.3 },
      calm: { relaxed: 0.2 },
      neutral: { relaxed: 0.1 },
    };

    this.targetExpressions.clear();
    const expressions = expressionMap[mood];
    Object.entries(expressions).forEach(([name, value]) => {
      this.targetExpressions.set(name, value);
    });

    this.procedural.applyMoodGesture(
      mood === "happy" || mood === "surprised" ? "happy" :
        mood === "thinking" ? "thinking" :
          mood === "angry" || mood === "sad" ? "calm" :
            "calm"
    );

    console.log(`Mood set to: ${mood}`);
  }

  update(deltaTime: number) {
    if (!this.vrm.expressionManager) return;

    this.viseme.update(deltaTime);
    this.procedural.update(deltaTime);
    this.updateBlink(deltaTime);
    this.updateMoodExpression(deltaTime);

    this.vrm.update(deltaTime);
  }

  private updateMoodExpression(deltaTime: number) {
    this.moodTransitionProgress = Math.min(1, this.moodTransitionProgress + deltaTime * 2);

    const allExpressions = ["happy", "sad", "angry", "surprised", "relaxed"];

    allExpressions.forEach((name) => {
      const target = this.targetExpressions.get(name) || 0;
      const current = this.vrm.expressionManager?.getValue(name as VRMExpressionPresetName) || 0;
      const newValue = current + (target - current) * 0.1;
      this.vrm.expressionManager?.setValue(name as VRMExpressionPresetName, newValue);
    });
  }

  private updateBlink(deltaTime: number) {
    this.blinkTimer += deltaTime;

    if (!this.isBlinking && this.blinkTimer >= this.nextBlinkTime) {
      this.isBlinking = true;
      this.blinkProgress = 0;
    }

    if (this.isBlinking) {
      this.blinkProgress += deltaTime * 10;

      const blinkValue = this.blinkProgress < 0.5
        ? this.blinkProgress * 2
        : 2 - this.blinkProgress * 2;

      this.vrm.expressionManager?.setValue("blink", Math.max(0, Math.min(1, blinkValue)));

      if (this.blinkProgress >= 1) {
        this.isBlinking = false;
        this.vrm.expressionManager?.setValue("blink", 0);
        this.scheduleNextBlink();
      }
    }
  }

  reset() {
    this.viseme.reset();
    this.procedural.reset();
    this.targetExpressions.clear();
    this.currentMood = "neutral";

    const allExpressions = ["blink", "happy", "sad", "angry", "surprised", "relaxed"];
    allExpressions.forEach((name) => {
      this.vrm.expressionManager?.setValue(name as VRMExpressionPresetName, 0);
    });
  }

  getCurrentMood(): Mood {
    return this.currentMood;
  }

  getVRM(): VRM {
    return this.vrm;
  }
}
