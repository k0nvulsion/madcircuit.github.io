export class AssetLoader {
    constructor() {
        this.images = new Map();
    }

    async loadImage(name, path) {
        return new Promise((resolve) => {
            const image = new Image();

            image.onload = () => {
                this.images.set(name, image);
                resolve(image);
            };

            image.onerror = () => {
                console.warn(`Missing optional asset: ${path}`);
                resolve(null);
            };

            image.src = path;
        });
    }

    get(name) {
        return this.images.get(name) || null;
    }

    has(name) {
        return this.images.has(name);
    }
}
