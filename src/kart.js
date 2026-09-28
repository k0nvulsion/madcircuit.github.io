export class Kart {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.angle = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        this.width = 8;
        this.height = 12;

        this.acceleration = 80;
        this.brakePower = 105;
        this.reverseAcceleration = 45;

        this.maxSpeed = 92;
        this.reverseSpeed = 35;

        this.grip = 7;
        this.driftGrip = 2.3;

        this.steering = 2.7;

        this.speed = 0;
        this.drifting = false;
        this.boostTimer = 0;
    }

    update(dt, input, world) {
        const throttle = input.isDown("w", "arrowup");
        const brake = input.isDown("s", "arrowdown");
        const steerLeft = input.isDown("a", "arrowleft");
        const steerRight = input.isDown("d", "arrowright");

        this.drifting = input.isDown(" ");

        const forwardX = Math.cos(this.angle);
        const forwardY = Math.sin(this.angle);

        const rightX = -forwardY;
        const rightY = forwardX;

        let forwardVelocity =
        this.velocityX * forwardX +
        this.velocityY * forwardY;

        let sidewaysVelocity =
        this.velocityX * rightX +
        this.velocityY * rightY;

        const roadInfo = world.getRoadInfo(this.x, this.y);

        if (throttle) {
            forwardVelocity += this.acceleration * dt;
        }

        if (brake) {
            if (forwardVelocity > 4) {
                forwardVelocity -= this.brakePower * dt;
            } else {
                forwardVelocity -= this.reverseAcceleration * dt;
            }
        }

        const currentMaxSpeed = forwardVelocity < 0
        ? this.reverseSpeed
        : this.maxSpeed;

        if (this.boostTimer > 0) {
            this.boostTimer -= dt;
            forwardVelocity += 110 * dt;
        }

        const speedRatio = Math.min(
            Math.abs(forwardVelocity) / currentMaxSpeed,
                                    1
        );

        let steeringAmount = this.steering * speedRatio;

        if (this.drifting) {
            steeringAmount *= 1.25;
        }

        if (steerLeft) {
            this.angle -= steeringAmount * dt;
        }

        if (steerRight) {
            this.angle += steeringAmount * dt;
        }

        const grip = this.drifting ? this.driftGrip : this.grip;

        sidewaysVelocity -= sidewaysVelocity * Math.min(grip * dt, 1);

        if (!roadInfo.onRoad) {
            forwardVelocity *= Math.max(0, 1 - 2.8 * dt);
            sidewaysVelocity *= Math.max(0, 1 - 3.5 * dt);
        }

        forwardVelocity -= forwardVelocity * Math.min(1.25 * dt, 1);

        forwardVelocity = Math.max(
            -currentMaxSpeed,
            Math.min(currentMaxSpeed, forwardVelocity)
        );

        this.velocityX =
        forwardX * forwardVelocity +
            rightX * sidewaysVelocity;

        this.velocityY =
        forwardY * forwardVelocity +
            rightY * sidewaysVelocity;

        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;

        this.speed = Math.hypot(this.velocityX, this.velocityY);

        this.resolveWorldCollision(world);
    }

    resolveWorldCollision(world) {
        const roadInfo = world.getRoadInfo(this.x, this.y);

        if (roadInfo.onRoad) {
            return;
        }

        if (roadInfo.nearOuterBoundary) {
            this.x = Math.max(world.outer.left + 7, Math.min(this.x, world.outer.right - 7));
            this.y = Math.max(world.outer.top + 7, Math.min(this.y, world.outer.bottom - 7));

            this.velocityX *= -0.25;
            this.velocityY *= -0.25;
            return;
        }

        if (roadInfo.insideInnerHole) {
            const nearestX = Math.max(
                world.inner.left,
                Math.min(this.x, world.inner.right)
            );

            const nearestY = Math.max(
                world.inner.top,
                Math.min(this.y, world.inner.bottom)
            );

            const dx = this.x - nearestX;
            const dy = this.y - nearestY;

            if (Math.abs(dx) > Math.abs(dy)) {
                this.x = dx < 0
                ? world.inner.left - 7
                : world.inner.right + 7;
            } else {
                this.y = dy < 0
                ? world.inner.top - 7
                : world.inner.bottom + 7;
            }

            this.velocityX *= -0.25;
            this.velocityY *= -0.25;
        }
    }

    activateBoost() {
        this.boostTimer = 0.45;
    }
}
