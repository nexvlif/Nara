import { VRM, VRMExpressionPresetName } from "@pixiv/three-vrm";

export class VRMController {
    private vrm: VRM;
    private blinkTimer: number = 0;
    private nextBlinkTime: number = 2;
    private isBlinking: boolean = false;
    private blinkProgress: number = 0;

    private breathTimer: number = 0;
    private swayTimer: number = 0;

    private currentLipValue: number = 0;
    private targetLipValue: number = 0;

    constructor(vrm: VRM) {
        this.vrm = vrm;
        this.scheduleNextBlink();
    }

    private scheduleNextBlink() {
        this.nextBlinkTime = 2 + Math.random() * 4;
        this.blinkTimer = 0;
    }

    setLipSync(value: number) {
        this.targetLipValue = Math.min(1, value * 2.5);
    }

    setExpression(name: VRMExpressionPresetName, value: number) {
        this.vrm.expressionManager?.setValue(name, value);
    }

    update(deltaTime: number) {
        if (!this.vrm.expressionManager) return;

        this.currentLipValue += (this.targetLipValue - this.currentLipValue) * 0.3;
        this.vrm.expressionManager.setValue("aa", this.currentLipValue);

        this.targetLipValue *= 0.85;

        this.updateBlink(deltaTime);

        this.updateBreath(deltaTime);

        this.vrm.update(deltaTime);
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

    private updateBreath(deltaTime: number) {
        this.breathTimer += deltaTime;

        const breathValue = (Math.sin(this.breathTimer * 1.5) + 1) * 0.05;
        this.vrm.expressionManager?.setValue("relaxed", breathValue);
    }

    reset() {
        this.vrm.expressionManager?.setValue("aa", 0);
        this.vrm.expressionManager?.setValue("blink", 0);
        this.vrm.expressionManager?.setValue("happy", 0);
        this.vrm.expressionManager?.setValue("sad", 0);
        this.vrm.expressionManager?.setValue("angry", 0);
        this.vrm.expressionManager?.setValue("relaxed", 0);
    }
}
