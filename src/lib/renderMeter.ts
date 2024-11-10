import * as Tone from 'tone';

const scale = 3;

function drawMeter(ctx, meterL, meterR) {
    const valueL = (meterL.getValue() * 100);
    const valueR = (meterR.getValue() * 100);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (valueL > 0) {
        ctx.fillStyle = valueL < 12 ? 'green' : valueL < 72 ? 'orange' : 'red';
        const height = ctx.canvas.height * (valueL / 100) * scale;
        ctx.fillRect(0, ctx.canvas.height - height, (ctx.canvas.width/2) - 2, height);
    }
    if (valueR > 0) {
        ctx.fillStyle = valueR < 20 ? 'green' : valueR < 70 ? 'orange' : 'red';
        const height = ctx.canvas.height * (valueR / 100) * scale;
        ctx.fillRect((ctx.canvas.width/2) + 2 , ctx.canvas.height - height, (ctx.canvas.width/2) - 2, height);
    }
}

export default function renderMeter(channel, container) {
    const meterContainer = document.createElement('div');
    meterContainer.classList.add('meter-container');
    const meterCanvas = document.createElement('canvas');
    meterCanvas.width = 20;
    meterCanvas.height = 120;
    meterCanvas.classList.add('meter');
    const ctx = meterCanvas.getContext('2d');
    meterContainer.appendChild(meterCanvas);
    container.appendChild(meterContainer);
    const splitter = new Tone.Split();
    const meterL = new Tone.Meter({ normalRange : true });
    const meterR = new Tone.Meter({ normalRange : true });
    channel.connect(splitter);
    splitter.connect(meterL, 0, 0);
    splitter.connect(meterR, 1, 0);
    setInterval(drawMeter.bind(null, ctx, meterL, meterR), 50);
}
