class EpicycleDrawer {
    constructor(ctx, x, y) {
        this.ctx = ctx;

        this.t = 0.0;
        this.epicycleStackX;
        this.epicycleStackY;

        this.curve = [];
        this.curve_limit = 1000;

        this.setup();
    }

    square(n) {
        return n * 2 + 1;
    }
    
    squareArray(size) {
        let arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(i > (size / 2) ? 1 : -1)
        }
        return arr;
    }

    setup(dataX=undefined, dataY=undefined) {
        let _dataX = dataX ? dataX : this.squareArray(100);
        let _dataY = dataY ? dataY : Array(100).fill(1);

        let phasorsX = dft(_dataX);
        let phasorsY = dft(_dataY);

        phasorsX.sort((a, b) => b.amp - a.amp);
        phasorsY.sort((a, b) => b.amp - a.amp);
    
        this.epicycleStackX = new PhasorStackView(phasorsX, ctx, new Point(700, 200), false);
        this.epicycleStackY = new PhasorStackView(phasorsY, ctx, new Point(300, 600), true);
    }

    draw_curve() {
        this.ctx.beginPath();
        for (let i = 0; i < this.curve.length; i++) {
            this.ctx.arc(this.curve[i].x, this.curve[i].y, 0, 0, 0);
        }
        this.ctx.stroke();
    
        for (let i = this.curve.length; i > this.curve_limit; i--) {
            this.curve.pop();
        }
    }
    
    draw_line(a, b) {
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.stroke();
    }
    
    update() {
        this.ctx.fillStyle="black";
        this.ctx.fillRect(0, 0, canv.width, canv.height);
        
        let num_circles = document.getElementById('frequencies').value;
        document.getElementById('num_circles_label').innerHTML = num_circles;

        this.epicycleStackX.update(this.t);
        this.epicycleStackY.update(this.t);

        let x = this.epicycleStackX.point.x;
        let y = this.epicycleStackY.point.y;
        this.point = new Point(x, y);
        this.curve.unshift(this.point);

        this.draw_line(this.epicycleStackX.point, this.point);
        this.draw_line(this.epicycleStackY.point, this.point);
        this.draw_curve();
    
        this.t += 0.01;
    }
    
}