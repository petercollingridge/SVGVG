Vue.component('svg-vg', {
    props: ['width', 'height'],
    data: function () {
        return {
            yAxisY: this.height - 10
        };
    },
    template: `<svg class="svgvg" xmlns="http://www.w3.org/2000/svg" :viewBox="0 + ' ' + 0 + ' ' + width + ' ' + height">
        <rect class="svgvg-background" :width="width" :height="height"/>
        <line class="svgvg-axis" x1="10" y1="0" x2="10" :y2="yAxisY"/>
        <line class="svgvg-axis" x1="10" :y1="yAxisY" :x2="width" :y2="yAxisY"/>
    </svg>`
})
