import { NoiseMeasurement } from './NoiseMeasurement.js';

export const NOISE_LIMITS = Object.freeze({
    normalMax: 55,
    warningMax: 70,
});

export class NoiseSensor {
    constructor(id, district, location, noiseLevel) {
        this.id = id;
        this.district = district;
        this.location = location;
        this.noiseLevel = noiseLevel;
        this.measurements = [];
        
        this.addMeasurement(new NoiseMeasurement(noiseLevel));
    }
    static isValidNoiseLevel(value) {
        return Number.isFinite(value) && value >= 0 && value <= 200;
    }

    getStatus() {
        if (this.noiseLevel <= NOISE_LIMITS.normalMax) return "normal";
        if (this.noiseLevel <= NOISE_LIMITS.warningMax) return "warning";
        return "critical";
    }

    addMeasurement(measurement) {
        if (!(measurement instanceof NoiseMeasurement)) {
            throw new Error("Очікується об'єкт NoiseMeasurement");
        }
        if (measurement.isValid()) {
            this.measurements.push(measurement);
            this.noiseLevel = measurement.value;
        }
    }

    updateNoiseLevel(value) {
        if (NoiseSensor.isValidNoiseLevel(value)) {
            this.noiseLevel = value;
            this.measurements.push(new NoiseMeasurement(value));
        } else {
            console.error(`Некоректне значення шуму: ${value}`);
        }
    }
}