export class Input {
    constructor() {
        this.keys = new Set();
        this.previousKeys = new Set();

        window.addEventListener("keydown", (event) => {
            const blockedKeys = [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                " "
            ];

            if (blockedKeys.includes(event.key)) {
                event.preventDefault();
            }

            this.keys.add(event.key.toLowerCase());
        });

        window.addEventListener("keyup", (event) => {
            this.keys.delete(event.key.toLowerCase());
        });
    }

    update() {
        this.previousKeys = new Set(this.keys);
    }

    isDown(...keys) {
        return keys.some((key) => this.keys.has(key.toLowerCase()));
    }

    wasPressed(...keys) {
        return keys.some((key) => {
            const normalized = key.toLowerCase();
            return this.keys.has(normalized) && !this.previousKeys.has(normalized);
        });
    }
}
