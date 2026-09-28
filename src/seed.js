export function hashString(value) {
    let hash = 2166136261;

    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

export class SeededRandom {
    constructor(seed) {
        this.state = typeof seed === "number"
        ? seed >>> 0
        : hashString(String(seed));
    }

    next() {
        this.state += 0x6D2B79F5;

        let value = this.state;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    }

    integer(min, max) {
        return Math.floor(
            min + this.next() * (max - min + 1)
        );
    }

    pick(values) {
        return values[
            this.integer(0, values.length - 1)
        ];
    }

    color() {
        const r = this.integer(40, 220);
        const g = this.integer(40, 220);
        const b = this.integer(40, 220);

        return `rgb(${r}, ${g}, ${b})`;
    }
}
