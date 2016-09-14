d3.json('data.json', (dataset) => {

  let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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

    let amScale = d3.scaleLinear().domain([0, 12]).range([-90, 270]);
    let pmScale = d3.scaleLinear().domain([12, 24]).range([-90, 270]);

    let rotate = angle => "rotate(" + angle + ")";
    let rotateG = d => rotate(-d.a);

    let amMarkersG = g.append("g")
      .attr("class", "am markers axis")
      .selectAll("g")
      .data(d3.range(0, 12, 1))
      .enter().append("g")
      .attr("transform", d => "rotate(" + amScale(d) + ")");

    let amMarker = radius - 5;
    amMarkersG.append("line")
      .attr("stroke", "#555")
      .attr("x1", radius)
      .attr("x2", amMarker);

    let x1 = amMarker - radius * 0.5;
    amMarkersG.append("text")
      .attr("x", x1)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", d => `rotate(${-1 * amScale(d)} ${x1} 0)` )
      .text(d => d);

    let pmMarkersG = g.append("g")
      .attr("class", "pm markers axis")
      .selectAll("g")
      .data(d3.range(12, 24, 1))
      .enter().append("g")
      .attr("transform", d => "rotate(" + amScale(d) + ")");

    let pmMarker = radius + 5;
    pmMarkersG.append("line")
      .attr("stroke", "#555")
      .attr("x1", radius)
      .attr("x2", pmMarker);

    let x2 = pmMarker + radius * 0.5;
    pmMarkersG.append("text")
      .attr("x", x2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", d => `rotate(${-1 * pmScale(d)} ${x2} 0)` )
      .text(d => d);

    // Append data
    let amDatapoints = dayData.datapoints.filter( d => d.time.decimal < 12 );
    let pmDatapoints = dayData.datapoints.filter( d => d.time.decimal >= 12 );

    let amAppLine = radius * 0.6;
    let pmAppLine = radius * 1.4;

    let transitionDuration = 350;
    let amAppsG = g.append("g")
      .attr("class", "am apps axis")
      .selectAll("g")
      .data(amDatapoints)
      .enter().append("g")
      .attr("transform", d => "rotate(" + amScale(d.time.decimal) + ")" )
      .attr("data-app-time", d => `${d.app} ${d.time.hrs}:${d.time.min}`)
      .append("line").classed("app-line", true)
      .attr("x1", radius)
      .attr("x2", radius)
      .on("mouseover", lineMouseOver)
      .on("mouseout", lineMouseOut)
      .transition().duration(transitionDuration).delay( (d, i) => i * 50 )
      .attr("x2", amAppLine)
      .attr("stroke-width", "2.5")
      .attr("stroke", d => colorScale(d.app));

    let pmAppsG = g.append("g")
      .attr("class", "pm apps axis")
      .selectAll("g")
      .data(pmDatapoints)
      .enter().append("g")
      .attr("transform", d => "rotate(" + pmScale(d.time.decimal) + ")" )
      .attr("data-app-time", d => `${d.app} ${d.time.hrs}:${d.time.min}`)
      .append("line").classed("app-line", true)
      .attr("x1", radius)
      .attr("x2", radius)
      .on("mouseover", lineMouseOver)
      .on("mouseout", lineMouseOut)
      .transition().duration(transitionDuration).delay( (d, i) => (i + amDatapoints.length) * 50 )
      .attr("x2", pmAppLine)
      .attr("stroke-width", "2.5")
      .attr("stroke", d => colorScale(d.app));

      var animating = false;

      function lineMouseOver(d, i) {
        d3.selectAll("line.app-line")
          .transition().duration(250)
          .attr("opacity", d2 => d.app == d2.app ? "1" : "0.3")

        d3.select(this)
          .transition(`in-${i}`).duration(300)
          .attr("x2", d.time.decimal < 12 ? amAppLine * 0.9 : pmAppLine * 1.1)
          .attr("stroke-width", "5")
      }

      function lineMouseOut(d, i) {
        d3.selectAll("line.app-line")
          .transition().duration(250)
          .attr("opacity", "1")

        d3.select(this)
          .transition(`out-${i}`).duration(300)
          .attr("x2", d.time.decimal < 12 ? amAppLine : pmAppLine)
          .attr("stroke-width", "2.5")
      }

  })

});
