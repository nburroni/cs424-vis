d3.json('data.json', (dataset) => {

  let colorScale = d3.scaleOrdinal(d3.schemeCategory20);

  let data = d3.range(0, 2 * Math.PI, .01).map((t) => {
    return [t, Math.sin(2 * t) * Math.cos(2 * t)];
  });

  let width = 1800,
    height = 2000,
    radius = 100;

  let r = d3.scaleLinear()
    .domain([0, .5])
    .range([0, radius]);

  let line = d3.radialLine()
    .radius(d => r(d[1]))
    .angle(d => (-d[0] + Math.PI / 2));

  let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

  svg.selectAll("g").data(dataset).enter().each((dayData, i) => {
    console.log(dayData);

    let xPos = i * 375 + 200;
    let g = svg.append("g").attr("transform", `translate(${i < 4 ? xPos : (i-3) * 375}, ${i < 4 ? 200 : 575})`);

    g.append("text").text(dayData.day.substring(0, 3))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-family", "sans-serif");

    let gr = g.append("g")
      .attr("class", "circle axis")
      .append("circle")
      .attr("r", radius);

    let angleRange = {
      a0: -270,
      a1: 90
    }
    let offsetAngleRange = {
      a0: angleRange.a0 + 30,
      a1: angleRange.a1 + 30
    }
    let zippedAngleHour = (h0, h1) => {
      return d3.zip(d3.range(offsetAngleRange.a0, offsetAngleRange.a1, 30), d3.range(h0, h1, 1).reverse())
        .map(d => {
          return {
            a: d[0],
            h: d[1]
          }
        });
    }

    let rotate = angle => "rotate(" + angle + ")";
    let rotateG = d => rotate(-d.a);

    let amMarkersG = g.append("g")
      .attr("class", "am markers axis")
      .selectAll("g")
      .data(zippedAngleHour(0, 12))
      .enter().append("g")
      .attr("transform", rotateG);

    let pmMarkersG = g.append("g")
      .attr("class", "pm markers axis")
      .selectAll("g")
      .data(zippedAngleHour(12, 24))
      .enter().append("g")
      .attr("transform", rotateG);

    let amMarker = radius - 5;
    amMarkersG.append("line")
      .attr("stroke", "#555")
      .attr("x1", radius)
      .attr("x2", amMarker);

    let pmMarker = radius + 5;
    pmMarkersG.append("line")
      .attr("stroke", "#555")
      .attr("x1", radius)
      .attr("x2", pmMarker);

    let x1 = amMarker - radius * 0.5;
    amMarkersG.append("text")
      .attr("x", x1)
      .attr("dy", ".35em")
      .style("text-anchor", d => (d.a < 270 && d.a > 90 ? "end" : null))
      .attr("transform", d => d.a < 270 && d.a > 90 ? "rotate(180 " + x1 + ", 0)" : null)
      .text(d => d.h);

    let x2 = pmMarker + radius * 0.5;
    pmMarkersG.append("text")
      .attr("x", x2)
      .attr("dy", ".35em")
      .style("text-anchor", d => (d.a < 270 && d.a > 90 ? "end" : null))
      .attr("transform", d => d.a < 270 && d.a > 90 ? "rotate(180 " + x2 + ", 0)" : null)
      .text(d => d.h);

    // Append data
    let amDatapoints = dayData.datapoints.filter( d => d.time.decimal < 12 );
    let pmDatapoints = dayData.datapoints.filter( d => d.time.decimal > 12 );

    let amScale = d3.scaleLinear().domain([0, 12]).range([-90, 270])
    let pmScale = d3.scaleLinear().domain([12, 24]).range([-90, 270])

    let amAppLine = radius * 0.65;
    let pmAppLine = radius * 1.35;

    let transitionDuration = 350;
    let amAppsG = g.append("g")
      .attr("class", "am apps axis")
      .selectAll("g")
      .data(amDatapoints)
      .enter().append("g")
      .attr("transform", d => "rotate(" + amScale(d.time.decimal) + ")" )
      .attr("data-app-time", d => `${d.app} ${d.time.hrs}:${d.time.min}`)
      .append("line")
      .attr("x1", radius)
      .attr("x2", radius)
      .transition().duration(transitionDuration).delay( (d, i) => i * 50 )
      .attr("x2", amAppLine)
      .attr("stroke-width", "1.5")
      .attr("stroke", d => colorScale(d.app));

    let pmAppsG = g.append("g")
      .attr("class", "pm apps axis")
      .selectAll("g")
      .data(pmDatapoints)
      .enter().append("g")
      .attr("transform", d => "rotate(" + pmScale(d.time.decimal) + ")" )
      .attr("data-app-time", d => `${d.app} ${d.time.hrs}:${d.time.min}`)
      .append("line")
      .attr("x1", radius)
      .attr("x2", radius)
      .transition().duration(transitionDuration).delay( (d, i) => (i + amDatapoints.length) * 50 )
      .attr("x2", pmAppLine)
      .attr("stroke-width", "1.5")
      .attr("stroke", d => colorScale(d.app));
  })

});
