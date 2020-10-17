// CHART INIT ------------------------------

let type = document.querySelector("#group-by").value;
let sort = 1 //ascending
console.log(type, sort)

// create svg with margin convention
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

// create scales without domains
let x = d3
  .scaleBand()
  .range([0, width])
  .paddingInner(0.1);

let y = d3.scaleLinear()
    .range([height, 0]);

let xAxis = d3
  .axisBottom()
  .scale(x)
  .tickFormat(function(d) {
    return returnString(d, 50);
  });
function returnString(content) {
    return content;}

let yAxis = d3.axisLeft().scale(y);

// create axes and axis title containers
let xAxisGroup = svg.append("g").attr("class", "x-axis axis");

let yAxisGroup = svg.append("g").attr("class", "y-axis axis");

// (Later) Define update parameters: measure type, sorting direction

// CHART UPDATE FUNCTION -------------------
function update(data, type){
    type = document.querySelector("#group-by").value;
    // update domains
    console.log("updating", type)
    if(sort == 1 && type == "stores"){
        data = data.sort(function(a,b){
            return b.stores-a.stores
        })
    } else if(sort == 1 && type == "revenue"){
        data = data.sort(function(a,b){
            return b.revenue-a.revenue
        })
    } else if (sort == 0 && type == "stores"){
        data = data.sort(function(a,b){
            return a.stores-b.stores})
    } else {
        data = data.sort(function(a,b){
            return a.revenue-b.revenue}
        )
        }
    console.log(data, "SORTED?")
    x.domain(
        data.map(function(d) {
          return d.company;
        })
      );
    y.domain([
        0,
        d3.max(data, d=>d[type])
      ]);
    // update bars
  /*let bar1 = svg
    .selectAll(".bar1")
    .remove()
    .exit()
    .data(data);*/

  svg.selectAll(".bar1")
    .transition() 
    .duration(2000)
    .attr("x", function(d) {
      return x(d.company);
    })
    .attr("y", function(d) {
      return y(d[type]);
    })
    .attr("height", function(d) {
      return height - y(d[type]);
    })
    .attr("width", x.bandwidth())
    

	// update axes and axis title
    xAxisGroup = svg
    .select(".x-axis")
    .transition()
    .duration(1000)
    .delay(500)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    yAxisGroup = svg
    .select(".y-axis")
    .transition()
    .duration(1000)
    .delay(1000)
    .call(yAxis);

    svg.select("text.axis-title").remove();
  svg.append("text")
    .attr("class", "axis-title")
    .attr("x", -5)
    .attr("y", -15)
    .attr("dy", ".1em")
    .style("text-anchor", "end")
    .text(function() {
        if (document.querySelector("#group-by").value == 'stores'){
            return "Stores"
        } else{
            return "Billions USD"
        }
    });

    d3.select(".sort")
    .on("click", function(d) {
        console.log("CLICK")
        if (sort == 1){
            sort = 0
        } else {
            sort = 1
        }
        console.log(sort)
    });
}

d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
    console.log(data)
    let bar1 = svg
    .selectAll(".bar1")
    .remove()
    .exit()
    .data(data);

    x.domain(
        data.map(function(d) {
          return d.company;
        })
      );
    y.domain([
        0,
        d3.max(data, d=>d[type])
      ]);

    bar1
    .enter()
    .append("rect")
    .attr("class", "bar1")
    .attr('fill', 'blue')
    .attr("x", function(d) {
        return x(d.company);
      })
      .attr("y", function(d) {
        return y(d.stores);
      })
      .attr("height", function(d) {
        return height - y(d.stores);
      })
      .attr("width", x.bandwidth())

    update(data, type);
})

function callUpdate(){
    d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
        type = document.querySelector("#group-by").value;
        console.log(data)
        update(data, type); // simply call the update function with the supplied date
});
}





// (Later) Handling the sorting direction change