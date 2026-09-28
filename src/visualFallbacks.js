import { SeededRandom } from "./seed.js";

export function createFallbackPalette(seed, sectionId) {
    const rng = new SeededRandom(
        `${seed}:section:${sectionId}`
    );

    return {
        road: rng.pick([
            "#5b5960",
            "#665850",
            "#4f6060",
            "#665c45",
            "#554b63",
            "#596452"
        ]),

        roadDark: rng.pick([
            "#393942",
            "#40372f",
            "#354848",
            "#453e2d",
            "#392e47"
        ]),

        edge: rng.pick([
            "#d8c36d",
            "#e08b59",
            "#91c27d",
            "#b987cf",
            "#77b7c9"
        ]),

        markings: rng.pick([
            "#f3e6aa",
            "#f2b56e",
            "#cce59b",
            "#e8afd2",
            "#a8dce5"
        ])
    };
}

export function createFallbackKartColor(seed, kartId) {
    const rng = new SeededRandom(
        `${seed}:kart:${kartId}`
    );

    return rng.pick([
        "#e64b42",
        "#3d8cdb",
        "#e6bd42",
        "#8d55c7",
        "#45b276",
        "#df7044",
        "#d85391"
    ]);
}

export function createGarageGradient(ctx, width, height, seed) {
    const rng = new SeededRandom(`${seed}:garage`);

    const topColors = [
        "#241d2e",
        "#182d38",
        "#33251f",
        "#202f25",
        "#30243a"
    ];

    const bottomColors = [
        "#6e4435",
        "#3b5c62",
        "#604735",
        "#456342",
        "#59436e"
    ];

    const top = rng.pick(topColors);
    const bottom = rng.pick(bottomColors);

    const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        height
    );

    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawGarageDetails(ctx, width, height, rng);
}

function drawGarageDetails(ctx, width, height, rng) {
    ctx.fillStyle = "#15151b";

    // Floor
    ctx.fillRect(0, height * 0.72, width, height * 0.28);

    // Floor tiles
    ctx.strokeStyle = "#4e3c39";
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, height * 0.72);
        ctx.lineTo(x - 20, height);
        ctx.stroke();
    }

    for (let y = height * 0.76; y < height; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Tool cabinet
    ctx.fillStyle = "#7a3437";
    ctx.fillRect(12, 42, 45, 64);

    ctx.fillStyle = "#ba754b";

    for (let y = 50; y < 98; y += 13) {
        ctx.fillRect(18, y, 32, 4);
    }

    // Shelves
    ctx.fillStyle = "#15151b";
    ctx.fillRect(width - 57, 40, 45, 5);
    ctx.fillRect(width - 57, 68, 45, 5);
    ctx.fillRect(width - 57, 96, 45, 5);

    // Tires
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = "#101014";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(
            width - 40 + i * 12,
            55 + i * 21,
            6,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    // Wall poster
    ctx.fillStyle = rng.pick([
        "#d6b85d",
        "#cf6c55",
        "#70a2a5",
        "#aa72af"
    ]);

    ctx.fillRect(width / 2 - 26, 22, 52, 34);

    ctx.fillStyle = "#1a1a20";
    ctx.font = "6px monospace";
    ctx.fillText("MAD", width / 2 - 14, 36);
    ctx.fillText("CIRCUIT", width / 2 - 19, 45);
}
