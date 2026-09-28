import { Input } from "./input.js";
import { Renderer } from "./renderer.js";
import { Kart } from "./kart.js";
import { Camera } from "./camera.js";
import { createPlaceholderRoad } from "./physics.js";
import { AssetLoader } from "./assets.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;

        this.seed = "849271";

        this.input = new Input();
        this.assets = new AssetLoader();

        this.track = createPlaceholderRoad();

        this.player = new Kart(95, 42);
        this.player.kartId = 0;
        this.player.angle = Math.PI / 2;

        this.camera = new Camera(canvas.width, canvas.height);

        this.renderer = new Renderer(canvas);
        this.renderer.game = this;

        this.paused = false;
        this.lastTime = 0;
        this.elapsed = 0;
    }

    async start() {
        await Promise.all([
            this.assets.loadImage(
                "playerKart",
                "./assets/karts/player.png"
            ),

            this.assets.loadImage(
                "garageBackground",
                "./assets/garage/background.png"
            ),

            this.assets.loadImage(
                "straightRoad",
                "./assets/tracks/straight.png"
            )
        ]);

        requestAnimationFrame((time) => this.loop(time));
    }

    loop(time) {
        if (!this.lastTime) {
            this.lastTime = time;
        }

        let dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        dt = Math.min(dt, 0.05);

        this.update(dt);
        this.renderer.render(this);

        requestAnimationFrame((nextTime) => {
            this.loop(nextTime);
        });
    }

    update(dt) {
        if (this.input.wasPressed("escape")) {
            this.paused = !this.paused;
        }

        if (!this.paused) {
            this.elapsed += dt;

            this.player.update(
                dt,
                this.input,
                this.track
            );

            this.camera.follow(
                this.player,
                dt
            );
        }

        this.input.update();
    }
}
