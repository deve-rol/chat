const input  = document.getElementById('input');
const canvas = document.createElement('canvas');
const ctx    = canvas.getContext('2d');
const pos    = new Mouse(canvas);
let balls    = [];
const mouseR = 20;
const mouse  = new Ball(0, 0, mouseR, "#f00");
let text     = 'Hello!';

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

function setBalls() {
    const textPos = getTextPos()

    textPos.forEach(item => {
        balls.push(
            new Ball(
                item.x,
                item.y
            )
        )
    })
}

function getTextPos() {
    let curRow = 0;
    let maxRow = canvas.height;
    const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    const pixels = imageData.data;
    const size = 2;
    const res = [];

    while (curRow < maxRow) {
        const thisRowBytes= (curRow) * canvas.width * 4;

        for (let j = 0; j < canvas.width * 4; j += 4 * size) {
            if (
                pixels[thisRowBytes + j] <= 255 && pixels[thisRowBytes + j] >= 250 &&
                pixels[thisRowBytes + j + 1] <= 255 && pixels[thisRowBytes + j + 1] >= 250 &&
                pixels[thisRowBytes + j + 2] <= 255 && pixels[thisRowBytes + j + 2] >= 250
            ) {
                res.push(
                    {
                        x: j / 4,
                        y :curRow
                    }
                )
            }
        }
        curRow += size
    }
    return res
}

function drawText() {
    ctx.save()
    ctx.fillRect(0, 0, canvas.width , canvas.height);
    ctx.fillStyle = "#fff"
    ctx.font = "100px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width/2, canvas.height/2)

    ctx.restore()
}

function draw() {
    ctx.fillRect(0, 0, canvas.width , canvas.height);

    if (time <= 1) {
        drawText()
    }

    // mouse.setPos(pos.x, pos.y);
    // mouse.draw(ctx);

    balls.forEach(ball => {
        ball.think(pos,mouseR);
        ball.draw(ctx)
    })
}

let time = 0;
function render() {
    draw();

    if (time === 1) {
        setBalls()
    }
    time++;

    requestAnimationFrame(render)
}

render()

input.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        text = input.value;

        drawText();
        const newTextPos = getTextPos();

        const diff = balls.length - newTextPos.length;
        if (diff < 0) {
            for (let i = 0; i < Math.abs(diff); i++) {
                balls.push(
                    new Ball(
                        canvas.width/2,
                        canvas.height/2
                    )
                )
            }
        } else {
            balls = balls.slice(0, newTextPos.length);
        }

        balls.forEach((ball, i) => {
            let x = newTextPos[i]?.x || newTextPos[newTextPos.length-1].x;
            let y = newTextPos[i]?.y || newTextPos[newTextPos.length-1].y;
            ball.setPos(x, y)
        })

        input.value = '';
    }
})