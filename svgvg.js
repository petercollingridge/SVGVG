function getRange(data, label) {
    var minValue = 0;
    var maxValue = 1;

    for (var i = 0; i < data.length; i++) {
        var values = data[i][label];
        if (!values) { continue; }

        var n = values.length;
        for (var j = 0; j < n; j++) {
            if (values[j] < minValue) {
                minValue = values[j];
            } else if (values[j] > maxValue) {
                maxValue = values[j];
            }
        }
    }

    return [minValue, maxValue];
}

function getTickSize(data1, data2, position1, position2) {
    var maxDivisions = Math.max(2, Math.floor(Math.abs(position2 - position1) / 25));
    var unitValue = Math.pow(10, Math.floor(Math.log10(data2 - data1) - 1));

    // Increase unit value only using nice numbers
    if (unitValue < data2 / 20) { unitValue *= 2; }
    if (unitValue < data2 / 16) { unitValue *= 1.25; }

    while (unitValue < data2 / maxDivisions) { unitValue *= 2; }

    return unitValue;
}

function getTicks(data1, data2, tickSize) {
    var minTick = Math.floor(data1 / tickSize) * tickSize;
    var maxTick = Math.ceil(data2 / tickSize) * tickSize;

    var ticks = [minTick];
    var tick = minTick;
    while (tick < maxTick) {
        tick += tickSize;
        ticks.push(tick);
    }

    return ticks;
}

Vue.component('svg-vg', {
    props: ['width', 'height', 'series'],
    data: function () {
        return {
            x1: 12,
            x2: this.width - 5,
            y1: 5,
            y2: this.height - 12,
        };
    },
    computed: {
        processedSeries: function() {
            // Fill in gaps if y values not given
            var allSeries = [];

            for (var i = 0; i < this.series.length; i++) {
                var series = this.series[i];
                var newSeries = {};

                // If there's no x data then there's nothing to plot
                if (series.y) {
                    newSeries.y = series.y.slice();
                } else {
                    continue;
                }
                
                // If there's no y data then add an array of 0 - n
                if (series.x) {
                    newSeries.x = series.x.slice();
                } else {
                    newSeries.x = [];
                    for (var j = 0; j < newSeries.y.length; j++) {
                        newSeries.x.push(j);
                    }
                }
                
                newSeries.name = series.name || ("Series " + (i + 1));
                allSeries.push(newSeries);
            }

            return allSeries;
        },
        rangeX: function() {
            return getRange(this.processedSeries, 'x');
        },
        rangeY: function() {
            return getRange(this.processedSeries, 'y');
        },
        scaleX: function() {
            return (this.x2 - this.x1) / (this.rangeX[1] - this.rangeX[0]);
        },
        scaleY: function() {
            return (this.y2 - this.y1) / (this.rangeY[1] - this.rangeY[0]);
        },
        xTicks: function() {
            var xTickSize = getTickSize(this.rangeX[0], this.rangeX[1], this.x1, this.x2);
            return getTicks(this.rangeX[0], this.rangeX[1], xTickSize);
        },
        yTicks: function() {
            var yTickSize = getTickSize(this.rangeY[0], this.rangeY[1], this.y2, this.y1);
            return getTicks(this.rangeY[0], this.rangeY[1], yTickSize);
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
            <path :class="['svgvg-series-' + (index + 1)]" v-for="(seriesData, index) in processedSeries" :d="pathString(seriesData)"/>
        </g>

        <g class="svgvg-axis">
            <line :x1="x1" :y1="y1" :x2="x1" :y2="y2"/>
            <line :x1="x1" :y1="y2" :x2="x2" :y2="y2"/>
        </g>

        <g class="svgvg-axis-ticks">
            <g v-for="x in xTicks">
                <line :x1="getX(x)" :y1="y2" :x2="getX(x)" :y2="y2 + 3" />
                <text class="x-tick-text" :x="getX(x)" :y="y2 + 4">{{x}}</text>
            </g>
            <g v-for="y in yTicks">
                <line :x1="x1" :y1="getY(y)" :x2="x1 - 3" :y2="getY(y)" />
                <text class="y-tick-text" :x="x1 - 4" :y="getY(y)">{{y}}</text>
            </g>
        </g>

    </svg>`
})
