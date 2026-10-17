export class NoiseMeasurement {
    constructor(value, measuredAt = new Date()) {
        this.value = value;
        this.measuredAt = measuredAt;
    }
    isValid() {
        return Number.isFinite(this.value) && this.value >= 0 && this.value <= 200;
    }
    
    toString() {
        return `${this.value} dB (${this.measuredAt.toLocaleTimeString()})`;
    }
}