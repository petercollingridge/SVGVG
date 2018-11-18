Vue.component('svg-vg', {
    props: ['width', 'height', 'series'],
    data: function () {
        return {
            yAxisY: this.height - 10
        };
    },
    methods: {
        pathString: function(data) {
            var d = "";
            var x = data.x;
            var y = data.y;
            
            for (var i = 0; i < y.length; i++) {
                d += i ? "L" : "M";
                d += x[i] + " "  + y[i];
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
            <line x1="10" y1="0" x2="10" :y2="yAxisY"/>
            <line class="svgvg-axis" x1="10" :y1="yAxisY" :x2="width" :y2="yAxisY"/>
        </g>
    </svg>`
})
