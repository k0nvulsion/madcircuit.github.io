export class Camera {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.x = 0;
        this.y = 0;

        this.smoothing = 8;
    }

    follow(target, dt) {
        const targetX = target.x - this.width / 2;
        const targetY = target.y - this.height / 2;

        const amount = Math.min(this.smoothing * dt, 1);

        this.x += (targetX - this.x) * amount;
        this.y += (targetY - this.y) * amount;
    }
}
