(function dailydealsVis(d3) {
  'use strict';

  /////////////////////////////////
  ///  CIRC GRAPH
  function circ(type, data) {
    const tagClouds = [
      'tagClouds/activelife.gif',
      'tagClouds/art.gif',
      'tagClouds/automotive.gif',
      'tagClouds/beauty_spa.gif',
      'tagClouds/education.gif',
      'tagClouds/event_planning.gif',
      'tagClouds/financial.gif',
      'tagClouds/food.gif',
      'tagClouds/health_medical.gif',
      'tagClouds/home.gif',
      'tagClouds/hotels_travel.gif',
      'tagClouds/local_flavour.gif',
      'tagClouds/local_services.gif',
      'tagClouds/nightlife.gif',
      'tagClouds/pets.gif',
      'tagClouds/professional.gif',
      'tagClouds/public_gov.gif',
      'tagClouds/restaurants.gif',
      'tagClouds/shopping.gif'
    ];

    const chart = circularHeatChart()
      .innerRadius(0)
      .numSegments(19)
      .segmentHeight(20)
      .range(['white', 'green'])
      .radialLabels([
        '', 'Q1', 'Q2', 'Q3', 'Q4 2010', 'Q1', 'Q2', 'Q3', 'Q4 2011', 'Q1', 'Q2', 'Q3 2012'
      ])
      .segmentLabels(['Active Life', 'Arts & Entert', 'Automotive', 'Beauty Spas', 'Education',
      'Event Plan.', 'Financial', 'Food', 'Health', 'Home', 'Travel', 'Local Flavor', 'Local Svc.',
      'Nightlife', 'Pets', 'Professional', 'Public Gov', 'Restaurants', 'Shopping']);

    d3.select('#circularGraph')
      .select('svg')
      .remove();

    d3.select('#circularGraph')
      .selectAll('svg')
      .data([data[type]])
      .enter()
      .append('svg')
      .attr('width', 620)
      .attr('height', 520)
      .call(chart);

    d3.selectAll('.circular-heat path')
      .on('mouseover', (d, i) => {
        const reszta = i % 19;

        d3.selectAll('.circular-heat path')
          .filter((_, j) => (j % 19 === reszta))
          .style('stroke-width', '0.5px')
          .style('stroke', '#fff');

        d3.selectAll('.labels.segment text')
          .filter((_, j) => (j === reszta))
          .style('fill', '#000');

        d3.select('#tagCloudImg')
          .attr('src', tagClouds[reszta]);
      })
      .on('mouseout', (d, i) => {
        const reszta = i % 19;
        d3.selectAll('.circular-heat path')
          .filter((_, j) => (j % 19 === reszta))
          .style('stroke-width', '0.2px')
          .style('stroke', '#888');

        d3.selectAll('.labels.segment text')
          .filter((_, j) => (j === reszta))
          .style('fill', '#aaa');
      })
      .on('mouseup', (d, i) => {
        const reszta = i % 19;
        d3.selectAll('.circular-heat path')
          .filter((_, j) => (j % 19 === reszta))
          .style('stroke-width', '0.2px')
          .style('stroke', '#888');

        d3.selectAll('.labels.segment text')
          .filter((_, j) => (j === reszta))
          .style('fill', '#aaa');
      });
  }
  d3.json('/projects/dailydeals/data/circ.json', (circData) => {
    circ('avg_price', circData);
    function c(type) {
      const color = d3.scale
        .linear()
        .domain(d3.extent(circData[type], d => d))
        .range(['white', 'green']);

      d3.selectAll('path')
        .data(circData[type])
        .transition()
        .ease('in')
        .delay(100)
        .duration(() => Math.random() * 800)
        .attr('fill', '#fff')
        .transition()
        .ease('out')
        .delay(900)
        .duration(() => Math.random() * 800)
        .attr('fill', d => color(d));
    }

    // Add radio button interactions
    d3.select('#price').on('change', () => c(d3.event.currentTarget.value));
    d3.select('#dealsCount').on('change', () => c(d3.event.currentTarget.value));
  });

  /////////////////////////////////
  ///  PARETO GRAPH
  function paretoGraph(type, data) {
    const margin = { top: 20, right: 50, bottom: 20, left: 25 };
    const width = 650 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const totalNumberOfMerchants = 14717;
    let xAxisLabel;

    switch (type) {
      case 'revenue':
        xAxisLabel = 'Cumulative revenue';
        break;
      case 'numOfDeals':
        xAxisLabel = 'Cumulative num. of deals';
        break;
      case 'numOfSoldDeals':
        xAxisLabel = 'Cumulative num. of sold deals';
        break;
      // no default
    }

    d3.select('#paretoGraph svg').remove();
    const svg = d3.select('#paretoGraph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3.scale
      .linear()
      .domain([0, 0.002])
      .nice()
      .range([height, 0])
      .clamp(true);

    const yCumul = d3.scale
      .linear()
      .domain([0, 1])
      .nice()
      .clamp(true)
      .range([height, 0]);

    const yCumulAxis = d3.svg
      .axis()
      .scale(yCumul)
      .tickFormat(d3.format('.0%'))
      .ticks(5)
      .orient('right');

    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${width},0)`)
      .call(yCumulAxis)
      .append('text')
      .attr('transform', 'rotate(-90) translate(-260,-10)')
      .text(xAxisLabel);

    const x = d3.scale
      .linear()
      .domain([0, data[type].length / totalNumberOfMerchants])
      .nice()
      .range([0, width]);

    const xAxis = d3.svg
      .axis()
      .scale(x)
      .tickFormat(d3.format('.0%'))
      .ticks(5)
      .orient('bottom');

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .append('text')
      .attr('transform', 'translate(330,-20)')
      .text('Cumulative num. of merchants');

    const barWidth = width / data[type].length;
    const area = d3.svg
      .area()
      .interpolate('basis')
      .x((_, i) => (i * 102.5 * barWidth))
      .y0(height)
      .y1(d => y(d.r));

    svg.append('path')
      .datum(data[type].filter((_, i) => (i % 100 === 0)))
      .attr('class', 'area')
      .attr('d', area)
      .style('fill', '#024959');

    // Render circles
    svg.selectAll('.dot')
      .data(data[type])
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 3)
      .attr('cx', (_, i) => (i * barWidth))
      .attr('cy', d => yCumul(d.c))
      .attr('cumul', d => d.c)
      .style('fill', '#092140')
      .on('mouseover', function addLines() {
        const point = d3.select(this);
        svg.append('line')
          .attr('x1', point.attr('cx'))
          .attr('y1', point.attr('cy'))
          .attr('x2', point.attr('cx'))
          .attr('y2', height)
          .classed('tooltip', true)
          .style('stroke-width', '1')
          .style('stroke', '#ddd');
        svg.append('line')
          .attr('x1', point.attr('cx'))
          .attr('y1', point.attr('cy'))
          .attr('x2', width)
          .attr('y2', point.attr('cy'))
          .classed('tooltip', true)
          .style('stroke-width', '1')
          .style('stroke', '#ddd');
      })
      .on('mouseout', () => d3.selectAll('.tooltip').remove());

    const point80 = d3.select('.dot[cumul="0.80012"],.dot[cumul="0.80008"],.dot[cumul="0.80000"]')
      .attr('r', 5)
      .style('opacity', 0.8);
    svg.append('line')
      .attr('x1', point80.attr('cx'))
      .attr('y1', point80.attr('cy'))
      .attr('x2', point80.attr('cx'))
      .attr('y2', height)
      .style('stroke-width', '1')
      .style('stroke', '#aaa');
    svg.append('line')
      .attr('x1', point80.attr('cx'))
      .attr('y1', point80.attr('cy'))
      .attr('x2', width)
      .attr('y2', point80.attr('cy'))
      .style('stroke-width', '1')
      .style('stroke', '#aaa');
  }
  d3.json('/projects/dailydeals/data/pareto.json', (paretoData) => {
    paretoGraph('revenue', paretoData);

    // Radio button interactions
    d3.selectAll('#revenue, #numOfDeals, #numOfSoldDeals')
      .on('change', () => paretoGraph(d3.event.currentTarget.value, paretoData));
  });

  /////////////////////////////////
  ///   STEAMGRAPH
  function steamgraph(layers) {
    // number of samples per layer
    const m = 36;
    const width = 655;
    const height = 350;
    const mx = m - 1;
    const my = 250;

    const stack = d3.layout
      .stack()
      .offset('wiggle')
      .values(d => d.values)(layers);

    const area = d3.svg
      .area()
      .x(d => (d.x * width) / mx)
      .y0(d => height - ((d.y0 * height) / my))
      .y1(d => height - (((d.y + d.y0) * height) / my))
      .interpolate('basis');

    const color = d3.scale
      .ordinal()
      .range(['#092140', '#024959', '#F2C777', '#FF502C']);

    const vis = d3.select('#steamgraph')
      .append('svg')
      .attr('width', height)
      .attr('height', width)
      .style('fill', '#eee')
      .append('g')
      .attr('transform', `rotate(90) translate(0,${-height - 30})`);

    vis.selectAll('path')
      .data(stack)
      .enter()
      .append('path')
      .classed('steampath', true)
      .attr('d', d => area(d.values))
      .style('fill', d => color(d.name))
      .append('title')
      .text(d => d.name);

    d3.select('#steamgraph svg')
      .selectAll('text')
      .data([
        { y: 30, label: 'August' },
        { y: 45, label: '2009' },
        { y: 230, label: 'April' },
        { y: 245, label: '2010' },
        { y: 430, label: 'October' },
        { y: 445, label: '2011' },
        { y: 630, label: 'July' },
        { y: 645, label: '2012' }
      ])
      .enter()
      .append('text')
      .attr('x', 10)
      .attr('y', d => d.y)
      .text(d => d.label);
  }
  d3.json('/projects/dailydeals/data/steamgraph.json', steamgraph);
}(d3));
