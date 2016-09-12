(function fashionTrends() {
  'use strict';

  d3.select('#read-more')
    .on('click', () => d3.select('#info').style('display', 'block'));
  d3.select('#info')
    .on('click', () => {
      if (d3.event && d3.event.srcElement === document.getElementById('info')) {
        d3.select('#info').style('display', null);
      }
    });

  function renderDiagram(dataset) {
    // TODO - if there is any day missing the visualization will fail!!!
    const histcatexplong = dataset.map(series => ({
      key: series.a,
      values: series.c.map(subseries => [subseries.d, subseries.n])
    }));

    const colors = d3.scale.category20c();
    function keyColor(d, i) { return colors(d.key); }

    let chart;
    nv.addGraph(function addGraph() {
      chart = nv.models.stackedAreaChart()
          .useInteractiveGuideline(true)
          .x(d => new Date(d[0]))
          .y(d => d[1])
          .color(keyColor)
          .transitionDuration(300);

      chart.xAxis
        .tickFormat(d => d3.time.format('%x')(new Date(d)));

      chart.yAxis
        .tickFormat(d3.format(',.2f'));

      d3.select('#chart1')
        .datum(histcatexplong)
        .transition()
        .duration(1000)
        .call(chart)
        .each('start', () => {
          setTimeout(() => {
            d3.selectAll('#chart1 *')
              .each(function setTransitionDurations() {
                if (this.__transition__) {
                  this.__transition__.duration = 1;
                }
              });
          }, 0);
        });

      nv.utils.windowResize(chart.update);

      return chart;
    });

    nv.addGraph(() => {
      const diagram = nv.models
        .stackedAreaChart()
        .x(d => d[0])
        .y(d => d[1])
        .color(keyColor);

      diagram.xAxis
        .tickFormat(d => d3.time.format('%x')(new Date(d)));

      diagram.yAxis
        .tickFormat(d3.format(',.2f'));

      nv.utils.windowResize(diagram.update);

      return chart;
    });
  }

  // Get data and render diagram
  d3.json('data.json', renderDiagram);
}());
