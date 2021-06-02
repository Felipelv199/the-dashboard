const getData = async ( ) => {
    fetch("/api/data/patient")
    .then( response => response.json( )  )
    .then( ( data ) => other ( data )  )
}

getData( );

const other = ( data ) => {
    var width = 900
    height = 600
    margin = 40


// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin;

var color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#chart-area")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    var labels = data.map( ( d ) => { return d.state } );

    var legend = svg.append("g")
    .attr("transform", "translate(" + -300+ "," + 200 + ")");

    labels.forEach((label, i) => {

      var legendRow = legend.append("g")
          .attr("transform", "translate(0, " + (i * 20) + ")");
      legendRow.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", color(i));
      legendRow.append("text")
          .attr("x", -10)
          .attr("y", 10)
          .attr("text-anchor", "end")
          .style("text-transform", "capitalize")
          .text(label);
  });



var pie = d3.pie()
.value(function(d) { return d.mujer; })
.sort(null);

var arc = d3.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);




    var path = svg.datum(data).selectAll("path")
    .data(pie)
  .enter().append("path")
    .attr("fill", function(d, i) { return color(i); })
    .attr("d", arc)
    .each(function(d) { this._current = d; }); 


    d3.selectAll("input")
      .on("change", change);

      var timeout = setTimeout(function() {
        d3.select("input[value=\"mujer\"]").property("checked", true).each(change);
      }, 2000);

      function change(  ) {
        console.log(this.id)
        var value = this.id;
        clearTimeout(timeout);
        pie.value( ( d ) => {
            return d[value];
        }); // change the value function
        path = path.data(pie); // compute the new angles
        path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
      }

     


      function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };

}


function getValues( values, flag ){
    for (var i = 0; i < values.length; i++){
        if ( values[i].key === flag.toUpperCase() ){
            return values[i].values;
        }
    }
}

}

