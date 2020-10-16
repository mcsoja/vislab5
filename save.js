d3.csv('coffee-house-chains.csv', d3.autoType)
.then(data=>{
    Data = data
    console.log(Data)
//create svg with margin convention
let margin = { top: 40, right: 20, bottom: 40, left: 90 },
  width =
    document.querySelector(".chart").clientWidth -
    margin.left -
    margin.right,
  height = 400 - margin.top - margin.bottom; 

width = width > 600 ? 600 : width;

let svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// create scales
let x = d3
  .scaleBand()
  .range([0, width])
  .paddingInner(0.1);

let y = d3.scaleLinear().range([height, 0]);

let xAxis = d3
  .axisBottom()
  .scale(x)
  .tickFormat(function(d) {
    return returnString(d, 50);
  });

let yAxis = d3.axisLeft().scale(y);

let xAxisGroup = svg.append("g").attr("class", "x-axis axis");

let yAxisGroup = svg.append("g").attr("class", "y-axis axis");

  x.domain(
    data.map(function(d) {
      return d.company;
    })
  );
  y.domain([
    0,
    d3.max(data, function(d) {
      return d.revenue;
    })
  ]);

  // create bars
  let bar1 = svg
    .selectAll(".bar1")
    .remove()
    .exit()
    .data(data);

  bar1
    .enter()
    .append("rect")
    .attr("class", "bar1")
    .attr('fill', 'blue')
    .attr("x", function(d) {
      return x(d.company);
    })
    .attr("y", function(d) {
      return y(d.revenue);
    })
    .attr("height", function(d) {
      return height - y(d.revenue);
    })
    .attr("width", x.bandwidth())
 


  // create axes and axis title
  xAxisGroup = svg
    .select(".x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  yAxisGroup = svg.select(".y-axis").call(yAxis);

  svg.select("text.axis-title").remove();
  svg
    .append("text")
    .attr("class", "axis-title")
    .attr("x", -5)
    .attr("y", -15)
    .attr("dy", ".1em")
    .style("text-anchor", "end")
    .text("Stores");


function returnString(content) {
  return content;
}
})