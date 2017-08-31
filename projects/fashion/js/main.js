(function fashionTrends(d3, nv) {
  'use strict';

  // Read more link interactions
  d3.select('#read-more')
    .on('click', () => d3.select('#info').style('display', 'block'));
  d3.select('#info')
    .on('click', () => {
      if (d3.event && d3.event.srcElement === document.getElementById('info')) {
        d3.select('#info').style('display', null);
      }
    });

  function renderDiagram(dataset) {
    const colors = d3.scale.category20c();
    const dateFormat = d3.time.format('%x');
    const histcatexplong = dataset.map(series => ({
      key: series.a,
      values: series.c.map(subseries => [subseries.d, subseries.n])
    }));

    nv.addGraph(function addGraph() {
      const chart = nv.models
        .stackedAreaChart()
        .useInteractiveGuideline(true)
        .x(d => new Date(d[0]))
        .y(d => d[1])
        .color(d => colors(d.key))
        .transitionDuration(200);

      chart.xAxis.tickFormat(d => dateFormat(new Date(d)));
      chart.yAxis.tickFormat(d3.format(',.0f'));

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
  }

  // Get data and render diagram
  // This used to be a call to pythonanywhere hosted backend but no need for that anymore
  d3.json('data/data.json', renderDiagram);
}(d3, nv));
