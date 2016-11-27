'use strict';
/* global d3, topojson, world, nasa, window*/
(function meteoriteLandings(d3, topojson, world, nasa) {
  const width = 900;
  const height = 800;
  const rotationFactor = 0.1;

  // Precompute scaled mass; qubic transform to visualy accomodate all mass range
  nasa.forEach(met => {
    met.m = met.mass ? Math.pow(met.mass, 1 / 3) / 100 : 0.1;
  });

  const projection = d3.geo.orthographic().scale(450).rotate([0, 0]).translate([width / 2.35, height / 2]).clipAngle(90);
  const path = d3.geo.path().projection(projection).pointRadius(d => d.radius);
  const circle = d3.geo.circle();
  const svg = d3.select('svg#globe').attr('viewBox', `0 0 ${height} ${width}`);
  const timelineSvg = d3.select('svg#timeline').attr('width', 50).attr('height', height / 2);
  const countries = topojson.feature(world, world.objects.countries).features;
  const minYear = d3.min(nasa, d => d.year);
  const maxYear = d3.max(nasa, d => d.year);
  const nameEl = d3.select('span.name');
  const classEl = d3.select('span.class');
  const massEl = d3.select('span.mass');
  const yearEl = d3.select('span.year');
  const playSvg = d3.select('svg#play');

  // Animation flags
  let animateRotation = true;
  let animateTime = true;

  function stopAnimation() {
    animateTime = false;
    animateRotation = false;
    playSvg.classed('play', false);
  }

  function resumeAnimation() {
    animateRotation = true;
    playSvg.classed('play', true);
  }

  playSvg.on('click', () => {
    if (animateRotation) {
      stopAnimation();
    } else {
      resumeAnimation();
    }
  });

  // Globe circle; used for glow purpose only
  svg.append('path').datum({ type: 'Sphere' }).classed('water', true).attr('d', path).attr('filter', 'url(#glow)');

  // Countries shapes
  const lands = svg.selectAll('path.land').data(countries).enter().append('path').classed('land', true).attr('d', path);

  // Meteorites
  const mets = svg.selectAll('path.met').data(nasa).enter().append('path')
    .datum(d => {
      // For performance draw really small meteorites as plain circles
      if (d.m > 0.2) {
        const c = circle.origin([d.lng, d.lat]).angle(d.m)();
        c.centre = [d.lng, d.lat];
        c.data = d;
        return c;
      }

      return {
        type: 'Point',
        coordinates: [d.lng, d.lat],
        centre: [d.lng, d.lat],
        data: d,
        radius: d.m * 10
      };
    })
    .classed('met', true).classed('hidden', true).attr('d', path);

  // Rotate globe on mouse wheel events
  const zoomBehaviour = d3.behavior.zoom().on('zoom', () => {
    const ev = d3.event.sourceEvent;
    if (!(ev.wheelDeltaX || ev.deltaX) || !(ev.wheelDeltaY || ev.deltaY)) return;
    stopAnimation();
    const rotate = projection.rotate();
    const x = rotate[0] - ((ev.wheelDeltaX || ev.deltaX) * rotationFactor);
    const y = rotate[1] + ((ev.wheelDeltaY || ev.deltaY) * rotationFactor);
    projection.rotate([x, y]);
    lands.attr('d', path);
    mets.attr('d', path);
  });
  svg.call(zoomBehaviour);

  // Pan to meteorite on click
  mets.on('click', (d) => {
    const destination = d.centre;
    d3.transition().duration(1500).tween('rotate', () => {
      stopAnimation();
      const r = d3.interpolate(projection.rotate(), [-destination[0], -destination[1]]);
      return (t) => {
        projection.rotate(r(t));
        lands.attr('d', path);
        mets.attr('d', path);
      };
    });
  })

  // Update infobox with meteorite info on hover
  .on('mouseover', d => {
    nameEl.text(d.data.name);
    classEl.text(d.data.class);
    massEl.text(d.data.mass);
    yearEl.text(d.data.year);
  });

  // Timeline
  const timeScale = d3.scale.linear().domain([minYear, maxYear]).range([(height / 2) - 21, 0]);
  const timeAxis = d3.svg.axis().scale(timeScale).ticks(10).orient('left').tickFormat(d => d);
  const brush = d3.svg.brush().y(timeScale).extent([minYear, 1400]);

  function brushed() {
    if (brush.empty()) {
      mets.classed('hidden', false);
    } else {
      const extent = brush.extent();
      mets.each(function hideOrShow(m) {
        d3.select(this).classed('hidden', m.data.year < extent[0] || m.data.year > extent[1]);
      });
    }
  }

  brush.on('brush', () => { animateTime = false; brushed(); });
  const brushEl = timelineSvg.append('g').attr('transform', 'translate(0, 20)').attr('class', 'brush').call(brush);
  brushEl.selectAll('rect').attr('x', 10).attr('width', 40);
  timelineSvg.append('g').attr('class', 'axis').attr('transform', 'translate(49, 20)').call(timeAxis);
  timelineSvg.append('text').attr('transform', 'translate(16, 10)').text('Year');

  // Animation
  function animate() {
    if (animateRotation) {
      const rotate = projection.rotate();
      const x = rotate[0] - rotationFactor;
      const y = rotate[1] - (rotationFactor / 4);
      projection.rotate([x, y]);
      lands.attr('d', path);
      mets.attr('d', path);
    }

    const ex = brush.extent();
    if (animateTime && ex[1] < maxYear) {
      brush.extent([ex[0], Math.min(ex[1] + 4, maxYear)]);
      brushEl.call(brush);
      brushed();
    }

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(animate);
    }
  }
  animate();
}(d3, topojson, world, nasa));
