
d3.json('data.json', (dataset) => {
  console.log(dataset);

  let data = d3.range(0, 2 * Math.PI, .01).map((t) => {
    return [t, Math.sin(2 * t) * Math.cos(2 * t)];
  });

  let width = 1800, height = 2000, radius = 100;

  let r = d3.scaleLinear()
      .domain([0, .5])
      .range([0, radius]);

  let line = d3.radialLine()
      .radius( d => r(d[1]) )
      .angle( d => (-d[0] + Math.PI / 2) );

  let svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)

  svg.selectAll("g").data(dataset).enter().each( (dayData, i) => {

    let xPos = i * 375 + 200;
    let g = svg.append("g").attr("transform", `translate(${i < 4 ? xPos : (i-3) * 375}, ${i < 4 ? 225 : 600})`);

    g.append("text").text(dayData.day.substring(0, 3))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-family", "sans-serif");

    let gr = g.append("g")
        .attr("class", "r axis")
        .append("circle")
          .attr("r", radius);

    let gLinesAm = g.append("g")
        .attr("class", "a axis")
      .selectAll("g")
        .data(d3.zip(d3.range(-240, 120, 30), d3.range(0, 12, 1).reverse()).map( d => { return { a: d[0], h: d[1] } } ))
      .enter().append("g")
        .attr("transform", d => "rotate(" + -d.a + ")" );

    let gLinesPm = g.append("g")
        .attr("class", "a axis")
      .selectAll("g")
        .data(d3.zip(d3.range(-240, 120, 30), d3.range(12, 24, 1).reverse()).map( d => { return { a: d[0], h: d[1] } } ))
      .enter().append("g")
        .attr("transform", d => "rotate(" + -d.a + ")" );

    let lineAm = radius - 5;
    gLinesAm.append("line")
        .attr("x1", radius)
        .attr("x2", lineAm);

    let linePm = radius + 5;
    gLinesPm.append("line")
        .attr("x1", radius)
        .attr("x2", linePm);

    let x1 = lineAm - radius * 0.5;
    gLinesAm.append("text")
        .attr("x", x1)
        .attr("dy", ".35em")
        .style("text-anchor", d => (d.a < 270 && d.a > 90 ? "end" : null) )
        .attr("transform", d => (d.a < 270 && d.a > 90 ? "rotate(180 " + x1 + ", 0)" : null) )
        .text( d => d.h );

    let x2 = linePm + radius * 0.5;
    gLinesPm.append("text")
        .attr("x", x2)
        .attr("dy", ".35em")
        .style("text-anchor", d => (d.a < 270 && d.a > 90 ? "end" : null) )
        .attr("transform", d => (d.a < 270 && d.a > 90 ? "rotate(180 " + x2 + ", 0)" : null) )
        .text( d => d.h );


  })

});
