
// d3.json('data.json', (dataset) => {
//   let svgWidth = 1000, svgHeight = 750;
//   let svg = d3.select("body").append("svg")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);
//
//   svg.selectAll("g").data(dataset).enter()
//     .append("g")
//     .append("text")
//     .text((d) => { return d.day; })
//
// });

var data = d3.range(0, 2 * Math.PI, .01).map(function(t) {
  return [t, Math.sin(2 * t) * Math.cos(2 * t)];
});

var width = 960,
    height = 500,
    radius = 150;

var r = d3.scaleLinear()
    .domain([0, .5])
    .range([0, radius]);

var line = d3.radialLine()
    .radius(function(d) { return r(d[1]); })
    .angle(function(d) { return -d[0] + Math.PI / 2; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var gr = svg.append("g")
    .attr("class", "r axis")
    .append("circle")
      .attr("r", radius);

var ga = svg.append("g")
    .attr("class", "a axis")
  .selectAll("g")
    .data(d3.range(0, 360, 30))
  .enter().append("g")
    .attr("transform", function(d) { return "rotate(" + -d + ")"; });

let lineAm = radius - 50;
ga.append("line")
    .attr("x1", lineAm)
    .attr("x2", radius);

let linePm = radius + 50;
ga.append("line")
    .attr("x1", radius)
    .attr("x2", linePm);

let x1 = lineAm - 25;
ga.append("text")
    .attr("x", x1)
    .attr("dy", ".35em")
    .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
    .attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + x1 + ",0)" : null; })
    .text(function(d) { return d + "°"; });

let x2 = linePm;
ga.append("text")
    .attr("x", x2)
    .attr("dy", ".35em")
    .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
    .attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + x2 + ",0)" : null; })
    .text(function(d) { return d + "°"; });
