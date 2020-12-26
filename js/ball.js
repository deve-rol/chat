class Ball {
    constructor(x, y, r, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 2;
        this.color = color || '#fff';

        this.vx = 0;
        this.vy = 0;
        this.friction = 0.9;

        this.originalX = x || 0;
        this.originalY = y || 0;

        this.springFactor = 0.007;
    }

    setPos (x, y) {
        // this.x = x;
        // this.y = y;

        this.originalX = x;
        this.originalY = y;
    }

    think (mouse, r) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx**2 + dy**2);

        /* interaction */
        if (dist < r) {
            const angle = Math.atan2(dy, dx);
            const tx = mouse.x + Math.cos(angle) * r;
            const ty = mouse.y + Math.sin(angle) * r;

            this.vx += tx - this.x;
            this.vy += ty - this.y;
        }

        /* spring back*/
        const dx2 = -(this.x - this.originalX);
        const dy2 = -(this.y - this.originalY);

        this.vx += dx2 * this.springFactor;
        this.vy += dy2 * this.springFactor;

        /* friction */
        this.vx *= this.friction;
        this.vy *= this.friction;

        /* actual move */
        this.x += this.vx;
        this.y += this.vy;
    }

    draw (ctx) {
        ctx.save()

        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath()

        ctx.restore()
    }
}