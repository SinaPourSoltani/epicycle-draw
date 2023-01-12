var drawer = {};
window.onload = function() {
    canv = document.getElementById("display");
    ctx = canv.getContext("2d");

    drawer = new EpicycleDrawer(ctx);
    setInterval(function(){drawer.update()}, 1000/60);
    //setInterval(drawer.update, 1000/60);
}

function readSVG() {
    var file = document.getElementById("fileInput").files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var svg = e.target.result;
        var parser = new DOMParser();
        var doc = parser.parseFromString(svg, "image/svg+xml");
        var points = [];
        var polygon = doc.getElementsByTagName("polygon");
        if (polygon.length == 0) {
            console.log("Hey:")
            console.log(doc)
            var path = doc.getElementsByTagName("path")[0];
            var d = path.getAttribute("d");
            points = d.split(" ");
        } else {
            var path = polygon[0];
            var d = path.getAttribute("points");
            points = d.split(" ");
        }
        var x = [];
        var y = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i].split(",");
            x.push(parseFloat(point[0]));
            y.push(parseFloat(point[1]));
        }
        if (points.length < 100) {
            const numLerpPoints = Math.ceil(100/points.length);
            var newX = []
            var newY = []
            for (let i = 0; i < points.length; i++) {
                for (let j = 0; j < numLerpPoints; j++) {
                    newX.push(Math.round(x[i] + ((x[(i+1) % points.length] - x[i]) * j / numLerpPoints)))
                    newY.push(Math.round(y[i] + ((y[(i+1) % points.length] - y[i]) * j / numLerpPoints)))
                }
            }
            x = newX
            y = newY
            console.log(x)
            console.log(y)
        }

        drawer.setup(x, y);
    }
    reader.readAsText(file);
}

function fileChange() {
    console.log("file change")
    readSVG();
    
}