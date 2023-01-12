class PhasorStackView {
    constructor (phasors, graphicsContext, offset_point, switchAxis) {
        this.phasors = phasors;
        this.graphicsContext = graphicsContext;
        this.scale = 1;
        this.offset = offset_point;
        this.switchAxis = switchAxis;
        this.wave = [];
        this.point = new Point(0, 0);
        this.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    }

    draw_circles(num, t) {
        let x = 0;
        let y = 0;
        this.graphicsContext.strokeStyle="white";
        const cappedNum = Math.min(num, this.phasors.length);
        for (let i = 0; i < cappedNum; i++) {
            let prev = new Point(x, y);
            let phasor = this.phasors[i];

            let r = this.scale * phasor.amp;
            let angle = phasor.freq * t + phasor.phase + (this.switchAxis ? Math.PI / 2 : 0);
            x += r * Math.cos(angle);
            y += r * Math.sin(angle);
            
            this.graphicsContext.beginPath();
            this.graphicsContext.arc(this.offset.x + prev.x, this.offset.y + prev.y, r, 0, 2 * Math.PI);
            this.graphicsContext.stroke();

            this.graphicsContext.lineWidth = 2;
            this.graphicsContext.moveTo(this.offset.x + prev.x, this.offset.y + prev.y);
            this.graphicsContext.lineTo(this.offset.x + x, this.offset.y + y);
            this.graphicsContext.stroke();
    
            this.point = new Point(this.offset.x + x, this.offset.y + y)
        }
        this.wave.unshift(this.point);
    }
    
    update(t) {
        let num_circles = document.getElementById('frequencies').value
        this.draw_circles(num_circles, t);
        /*
        this.draw_wave();
        this.draw_connecting_line();
        */
    }
}