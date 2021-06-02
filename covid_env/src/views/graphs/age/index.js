const margin = { left: 100, right: 10, top: 10, bottom: 100 };
const width = 700;
const height = 500;
var flag = true;
const g = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
