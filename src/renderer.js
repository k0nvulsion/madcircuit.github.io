// src/renderer.js

import {
    createFallbackPalette,
    createFallbackKartColor,
    createGarageGradient
} from "./visualFallbacks.js";

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Required for pixel-art rendering.
        this.ctx.imageSmoothingEnabled = false;

        this.game = null;
    }

    render(game) {
        this.game = game;

        const ctx = this.ctx;
        const camera = game.camera;
        const track = game.track;
        const kart = game.player;

        this.clear();

        ctx.save();

        ctx.translate(
            Math.round(-camera.x),
                      Math.round(-camera.y)
        );

        this.drawGrass(ctx, track);
        this.drawCircuit(ctx, track);
        this.drawStartLine(ctx, track);
        this.drawKart(ctx, kart);

        ctx.restore();

        this.drawHud(ctx, game);
    }

    clear() {
        this.ctx.fillStyle = "#263c25";
        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    drawGrass(ctx, track) {
        const { outer } = track;

        ctx.fillStyle = "#263c25";

        ctx.fillRect(
            outer.left - 48,
            outer.top - 48,
            outer.right - outer.left + 96,
            outer.bottom - outer.top + 96
        );

        // Chunky pixel-art grass details.
        ctx.fillStyle = "#304b2d";

        for (
            let y = outer.top - 40;
        y < outer.bottom + 40;
        y += 16
        ) {
            for (
                let x = outer.left - 40;
            x < outer.right + 40;
            x += 16
            ) {
                const tileX = Math.floor(x / 16);
                const tileY = Math.floor(y / 16);

                if ((tileX + tileY) % 2 === 0) {
                    ctx.fillRect(x + 2, y + 2, 2, 2);
                    ctx.fillRect(x + 9, y + 10, 2, 2);
                }
            }
        }

        // Occasional grass marks.
        ctx.fillStyle = "#3b5b35";

        for (
            let y = outer.top - 32;
        y < outer.bottom + 32;
        y += 32
        ) {
            for (
                let x = outer.left - 32;
            x < outer.right + 32;
            x += 32
            ) {
                if ((x + y) % 64 === 0) {
                    ctx.fillRect(x + 4, y + 5, 1, 5);
                    ctx.fillRect(x + 6, y + 3, 1, 7);
                    ctx.fillRect(x + 8, y + 6, 1, 4);
                }
            }
        }
    }

    drawCircuit(ctx, track) {
        const seed = this.game?.seed || "default";

        const palette = createFallbackPalette(
            seed,
            "placeholder-main-road"
        );

        const { outer, inner } = track;

        // Main placeholder road.
        ctx.fillStyle = palette.road;

        ctx.fillRect(
            outer.left,
            outer.top,
            outer.right - outer.left,
            outer.bottom - outer.top
        );

        // Inner grass island.
        ctx.fillStyle = "#263c25";

        ctx.fillRect(
            inner.left,
            inner.top,
            inner.right - inner.left,
            inner.bottom - inner.top
        );

        // Outer road edge.
        ctx.strokeStyle = palette.edge;
        ctx.lineWidth = 3;

        ctx.strokeRect(
            outer.left + 2,
            outer.top + 2,
            outer.right - outer.left - 4,
            outer.bottom - outer.top - 4
        );

        // Inner road edge.
        ctx.strokeRect(
            inner.left - 2,
            inner.top - 2,
            inner.right - inner.left + 4,
            inner.bottom - inner.top + 4
        );

        // Dashed road markings.
        ctx.strokeStyle = palette.roadDark;
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 8]);

        ctx.strokeRect(
            outer.left + 12,
            outer.top + 12,
            outer.right - outer.left - 24,
            outer.bottom - outer.top - 24
        );

        ctx.strokeRect(
            inner.left + 12,
            inner.top + 12,
            inner.right - inner.left - 24,
            inner.bottom - inner.top - 24
        );

        ctx.setLineDash([]);

        // Different placeholder colors for temporary road sections.
        this.drawPlaceholderRoadSections(
            ctx,
            track,
            palette
        );
    }

    drawPlaceholderRoadSections(ctx, track, palette) {
        const { outer, inner } = track;

        const roadWidth = outer.right - outer.left;
        const roadHeight = outer.bottom - outer.top;

        const sectionWidth = Math.floor(roadWidth / 8);
        const sectionHeight = Math.floor(roadHeight / 6);

        const sectionColors = [
            "#5c5961",
            "#66554d",
            "#4e6260",
            "#665d43",
            "#554b63",
            "#596450",
            "#62535b",
            "#506069"
        ];

        ctx.save();

        // Top and bottom road sections.
        for (let i = 0; i < 8; i++) {
            const x = outer.left + i * sectionWidth;

            ctx.fillStyle = sectionColors[i];

            ctx.globalAlpha = 0.28;

            ctx.fillRect(
                x,
                outer.top + 5,
                sectionWidth - 2,
                10
            );

            ctx.fillRect(
                x,
                outer.bottom - 15,
                sectionWidth - 2,
                10
            );
        }

        // Left and right road sections.
        for (let i = 0; i < 6; i++) {
            const y = outer.top + i * sectionHeight;

            ctx.fillStyle = sectionColors[(i + 3) % sectionColors.length];

            ctx.fillRect(
                outer.left + 5,
                y,
                10,
                sectionHeight - 2
            );

            ctx.fillRect(
                outer.right - 15,
                y,
                10,
                sectionHeight - 2
            );
        }

        ctx.globalAlpha = 1;

        // Temporary visual indicators for the inner island.
        ctx.fillStyle = palette.roadDark;
        ctx.globalAlpha = 0.24;

        ctx.fillRect(
            inner.left - 7,
            inner.top - 7,
            inner.right - inner.left + 14,
            4
        );

        ctx.fillRect(
            inner.left - 7,
            inner.bottom + 3,
            inner.right - inner.left + 14,
            4
        );

        ctx.fillRect(
            inner.left - 7,
            inner.top - 7,
            4,
            inner.bottom - inner.top + 14
        );

        ctx.fillRect(
            inner.right + 3,
            inner.top - 7,
            4,
            inner.bottom - inner.top + 14
        );

        ctx.globalAlpha = 1;

        ctx.restore();
    }

    drawStartLine(ctx, track) {
        const startLine = track.startLine || {
            x: track.outer.left + 64,
            y: track.outer.top,
            width: 40,
            height: 12
        };

        const tileSize = 8;

        const columns = Math.ceil(
            startLine.width / tileSize
        );

        const rows = Math.ceil(
            startLine.height / tileSize
        );

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                ctx.fillStyle =
                (row + column) % 2 === 0
                ? "#f4e8b0"
                : "#252525";

                ctx.fillRect(
                    startLine.x + column * tileSize,
                    startLine.y + row * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }

    drawKart(ctx, kart) {
        const image = this.game?.assets?.get("playerKart");

        ctx.save();

        ctx.translate(
            Math.round(kart.x),
                      Math.round(kart.y)
        );

        ctx.rotate(kart.angle);

        // Tire sparks while drifting.
        if (kart.drifting && kart.speed > 15) {
            ctx.fillStyle = "#f3d35b";

            ctx.fillRect(-5, 8, 3, 3);
            ctx.fillRect(2, 8, 3, 3);

            ctx.fillStyle = "#fff1a8";
            ctx.fillRect(-6, 10, 2, 2);
            ctx.fillRect(4, 10, 2, 2);
        }

        if (image) {
            ctx.drawImage(
                image,
                -8,
                -8,
                16,
                16
            );
        } else {
            this.drawFallbackKart(ctx, kart);
        }

        ctx.restore();
    }

    drawFallbackKart(ctx, kart) {
        const seed = this.game?.seed || "default";

        const color = createFallbackKartColor(
            seed,
            kart.kartId || 0
        );

        // Shadow.
        ctx.fillStyle = "#171717";
        ctx.fillRect(-6, -6, 12, 14);

        // Random deterministic kart color.
        ctx.fillStyle = color;
        ctx.fillRect(-5, -6, 10, 12);

        // Front windshield.
        ctx.fillStyle = "#f1df9e";
        ctx.fillRect(-3, -4, 6, 3);

        // Rear panel.
        ctx.fillStyle = "#5b2221";
        ctx.fillRect(-3, 2, 6, 3);

        // Wheels.
        ctx.fillStyle = "#111";

        ctx.fillRect(-7, -5, 2, 4);
        ctx.fillRect(5, -5, 2, 4);
        ctx.fillRect(-7, 2, 2, 4);
        ctx.fillRect(5, 2, 2, 4);

        // Small front highlight.
        ctx.fillStyle = "#fff0b1";
        ctx.fillRect(-2, -6, 4, 1);
    }

    drawHud(ctx, game) {
        ctx.fillStyle = "#101010";
        ctx.fillRect(4, 4, 125, 42);

        ctx.fillStyle = "#f5e7ac";
        ctx.font = "8px monospace";

        ctx.fillText("MAD CIRCUIT", 8, 12);
        ctx.fillText(
            `SPEED ${Math.round(game.player.speed)}`,
                     8,
                     21
        );

        ctx.fillText(
            "GEN 9 // FALLBACK ASSETS",
            8,
            30
        );

        ctx.fillText(
            `SEED ${game.seed}`,
            8,
            39
        );

        if (game.paused) {
            ctx.fillStyle = "#111";
            ctx.fillRect(56, 103, 144, 34);

            ctx.strokeStyle = "#f5e7ac";
            ctx.lineWidth = 1;
            ctx.strokeRect(56, 103, 144, 34);

            ctx.fillStyle = "#f5e7ac";
            ctx.font = "12px monospace";
            ctx.fillText("PAUSED", 101, 124);
        }
    }

    renderGarage() {
        const ctx = this.ctx;
        const image = this.game?.assets?.get("garageBackground");

        ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        if (image) {
            ctx.drawImage(
                image,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        } else {
            createGarageGradient(
                ctx,
                this.canvas.width,
                this.canvas.height,
                this.game?.seed || "default"
            );
        }

        this.drawGarageKart();
        this.drawGarageUi();
    }

    drawGarageKart() {
        const ctx = this.ctx;
        const image = this.game?.assets?.get("playerKart");

        const centerX = 128;
        const centerY = 143;

        ctx.save();

        ctx.translate(centerX, centerY);

        if (image) {
            ctx.drawImage(
                image,
                -24,
                -24,
                48,
                48
            );
        } else {
            const color = createFallbackKartColor(
                this.game?.seed || "default",
                0
            );

            // Kart shadow.
            ctx.fillStyle = "#111";
            ctx.fillRect(-22, -18, 44, 42);

            // Colored square fallback kart.
            ctx.fillStyle = color;
            ctx.fillRect(-18, -22, 36, 44);

            // Cabin/front area.
            ctx.fillStyle = "#f1df9e";
            ctx.fillRect(-11, -14, 22, 9);

            // Rear area.
            ctx.fillStyle = "#5b2221";
            ctx.fillRect(-11, 5, 22, 9);

            // Wheels.
            ctx.fillStyle = "#111";
            ctx.fillRect(-23, -13, 5, 10);
            ctx.fillRect(18, -13, 5, 10);
            ctx.fillRect(-23, 5, 5, 10);
            ctx.fillRect(18, 5, 5, 10);
        }

        ctx.restore();
    }

    drawGarageUi() {
        const ctx = this.ctx;

        ctx.fillStyle = "#11151a";
        ctx.fillRect(6, 6, 244, 22);

        ctx.strokeStyle = "#d6bd70";
        ctx.lineWidth = 1;
        ctx.strokeRect(6, 6, 244, 22);

        ctx.fillStyle = "#f4e5a7";
        ctx.font = "10px monospace";
        ctx.fillText("MAD CIRCUIT GARAGE", 74, 20);

        ctx.fillStyle = "#11151a";
        ctx.fillRect(38, 202, 180, 26);

        ctx.strokeStyle = "#d6bd70";
        ctx.strokeRect(38, 202, 180, 26);

        ctx.fillStyle = "#f4e5a7";
        ctx.font = "8px monospace";
        ctx.fillText("ARROW KEYS SELECT", 76, 213);
        ctx.fillText("ENTER CONFIRM", 85, 222);
    }
}
