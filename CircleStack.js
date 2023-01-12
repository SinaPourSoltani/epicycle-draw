class CircleStack {
    constructor (seriesLambda, graphicsContext) {
        this.seriesLambda = seriesLambda;
        this.graphicsContext = graphicsContext;
        this.wave_offset = 700;
        this.wave = [];
        this.point = {};
        this.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    }

    draw_circles(num) {
        let offset_x = 350;
        let offset_y = 400;
        let x = 0;
        let y = 0;
        this.graphicsContext.strokeStyle=this.color;
        for (let i = 0; i < num; i++) {
            let n = this.seriesLambda(i);
            let prev_x = x;
            let prev_y = y;
            let r = 100 * (4 / (n * Math.PI));
    
            this.graphicsContext.lineWidth = 0.2;
            this.graphicsContext.beginPath();
            x += r * Math.cos(n*t);
            y += r * Math.sin(n*t);
            this.graphicsContext.arc(offset_x + prev_x ,offset_y + prev_y, r, 0, 2*Math.PI);
            this.graphicsContext.stroke()
    
            this.graphicsContext.lineWidth = 2;
            this.graphicsContext.moveTo(offset_x + prev_x, offset_y + prev_y);
            this.graphicsContext.lineTo(offset_x + x, offset_y + y);
            this.graphicsContext.stroke();
    
            this.point = {x: offset_x + x, y: offset_y + y}
        }
        this.wave.unshift(this.point);
    }
    
    draw_wave() {
        this.graphicsContext.beginPath();
        for (let i = 0; i < this.wave.length; i++) {
            this.graphicsContext.arc(this.wave_offset + i, this.wave[i].y, 0, 0, 0);
        }
        this.graphicsContext.stroke()
    
        for (let i = this.wave.length; i > 700; i--) {
            this.wave.pop();
        }
    }
    
    draw_connecting_line() {
        this.graphicsContext.moveTo(this.point.x, this.point.y);
        this.graphicsContext.lineTo(this.wave_offset, this.wave[0].y);
        this.graphicsContext.stroke()
    }
    
    update() {
        let num_circles = document.getElementById('frequencies').value

        this.draw_circles(num_circles);
        this.draw_wave();
        this.draw_connecting_line();
    }
}