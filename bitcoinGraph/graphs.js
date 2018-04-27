//API to fetch historical data of Bitcoin Price Index

/*Gets 1 month of historical data
https://www.coindesk.com/api/ api reference
const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01';
*/
const api ="https://api.coindesk.com/v1/bpi/historical/close.json?currency=CAD";


/*
*Once the DOM Content has been loaded, the data from the API is loaded
*/
document.addEventListener("DOMContentLoaded", function(event) {
  fetch(api)
  .then(function(response) {
    return response.json();
  })
  .then(function(data){
    var parsedData = parseData(data);
    drawChart(parsedData);
  })
  .catch(function(err) {console.log(err);})

})
/*Purpose: Parses the data into key-value pairs
Parameters: data: a data Object containing historical data of the
Bitcoin Pricing Index*/
function parseData(data){
var arr = [];
for (var i in data.bpi){
  arr.push({
    date: new Date(i),//date
    value: +data.bpi[i]//convert string to number
  })
}
return arr;
}

function transition(path){
  path.transition()
  .duration(2000)
  //attrTween ,pves am E;e,emt isomg a function
  .attrTween("stroke-dasharray", tweenDash);
}

function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) { return i(t); };
}
/*Purpose: Draws a chart using D3
@param {object} data Object containing historical data of BPI
*/

function drawChart(data){
  var svgWidth = 1000, svgHeight = 400;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select('svg')
  .attr("width",svgWidth)
  .attr("height", svgHeight);
//Used to allign all elements within the margins
  var g = svg.append("g")//group
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
.rangeRound([0, width]);

  var y = d3.scaleLinear()
  .rangeRound([height,0]);

  var line = d3.line()//Creates the line based on the parsed bitcoin data
  .x(function(d) { return x(d.date)})
  .y(function(d) { return y(d.value)})
  x.domain(d3.extent(data, function(d) {
    return d.date;
  }));
  y.domain(d3.extent(data, function(d){
    return d.value
  }));

g.append("g")
.attr("transform", "translate(0,"+ height +")")
.call(d3.axisBottom(x))
/*
.select(".domain")
.remove();*/

g.append("g")
.call(d3.axisLeft(y))//the y axis
.append("text")
.attr("fill","#000")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", "0.71em")
.attr("text-anchor", "end")
.text("Price ($)");

g.append("path")
.datum(data)
.attr("fill", "none")
.attr("stroke", "steelblue")
.attr("stroke-linejoin", "round")
.attr("stroke-linecap", "round")
.attr("stroke-width", 1.5)
.attr("d", line)
.call(transition);

g.append("text")
.text("Bitcoin Index over the past month")
.attr("fill","black")
.attr("y",5)
.attr("x",svgWidth/2-150)
.attr("text-align","middle");

g.append("text")
.text("Date")
.attr("fill","black")
.attr("y",svgHeight-30)
.attr("x",svgWidth/2-60)
.attr("text-align","middle");


var area = d3.svg.area()
.x(function(d){ return x(d.date);})
.y0(svgHeight)
.y1(function(d) { return y(d.value); });

g.append("path")
.datum(data)
.attr("class", "area")
.attr("d", area);
}
