function getRange(data, label) {
    var minX = 0;
    var maxX = 1;
    for (var i = 0; i < data.length; i++) {
        var values = data[i][label];
        if (values) {
            for (var j = 0; j < values.length; j++) {
                if (values[j] < minX) {
                    minX = values[j];
                } else if (values[j] > maxX) {
                    maxX = values[j];
                }
            }
        }
    }
    return maxX - minX;
}

Vue.component('svg-vg', {
    props: ['width', 'height', 'series'],
    data: function () {
        return {
            x1: 10,
            x2: this.width - 1,
            y1: 1,
            y2: this.height - 10
        };
    },
    computed: {
        rangeX: function() {
            return getRange(this.series, 'x');
        },
        rangeY: function() {
            return getRange(this.series, 'y');
        },
        scaleX: function() {
            return (this.x2 - this.x1) / this.rangeX;
        },
        scaleY: function() {
            return (this.y2 - this.y1) / this.rangeY;
        }
    },
    methods: {
        getX: function(x) {
            return this.x1 + this.scaleX * x;
        },
        getY: function(y) {
            return this.y2 - this.scaleY * y;
        },
        pathString: function(data) {
            var d = "";
            var x = data.x;
            var y = data.y;

            for (var i = 0; i < y.length; i++) {
                d += i ? "L" : "M";
                d += this.getX(x[i]) + " "  + this.getY(y[i]);
            }

            return d;
        }
    },
    template: `<svg class="svgvg" xmlns="http://www.w3.org/2000/svg" :viewBox="0 + ' ' + 0 + ' ' + width + ' ' + height">
        <rect class="svgvg-background" :width="width" :height="height"/>

        <g class="svgvg-series-group">
            <path :class="['svgvg-series-' + (index + 1)]" v-for="(seriesData, index) in series" :d="pathString(seriesData)"/>
        </g>

        <g class="svgvg-axis">
            <line :x1="x1" :y1="y1" :x2="x1" :y2="y2"/>
            <line :x1="x1" :y1="y2" :x2="x2" :y2="y2"/>
        </g>
    </svg>`
})
