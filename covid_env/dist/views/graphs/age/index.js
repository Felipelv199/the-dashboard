const margin = { left: 100, right: 10, top: 10, bottom: 100 };
const width = 700;
const height = 500;
const g = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
g.append('text')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('font-weight', 'bold')
  .text('Persons Age');
g.append('text')
  .attr('class', 'y axis-label')
  .attr('x', -(height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .attr('font-weight', 'bold')
  .text('N. of Persons');

const gAxisX = g.append('g').attr('class', 'bottom axis');
const gAxisY = g.append('g').attr('class', 'left axis');

var persons = [];

const getData = async (fa, la) => {
  const response = await fetch(
    `http://localhost:8080/api/data/age?firstAge=${fa}&lastAge=${la}`
  );
  return response.status === 200 ? response.json() : [];
};

getData(firstAge, lastAge).then((data) => loadD3(data.data, data.diseases));

const loadD3 = (data, diseases) => {
  data.forEach((element) => {
    let person = persons.find((person) => person.age === element.edad);
    if (person === undefined) {
      person = {
        age: element.edad,
        diabetesCount: 0,
        hypertensionCount: 0,
        obesityCount: 0,
      };
    }
    if (element.diabetes.trim() === 'SI') {
      person.diabetesCount += 1;
    }
    if (element.hipertension.trim() === 'SI') {
      person.hypertensionCount += 1;
    }
    if (element.obesidad.trim() === 'SI') {
      person.obesityCount += 1;
    }
    const index = persons.indexOf(person);
    if (index != -1) {
      persons[index] = person;
    } else {
      persons.push(person);
    }
  });
  persons = persons.filter((person) => person.diabetesCount > 0);

  const label = d3
    .select('form')
    .selectAll('label')
    .data(diseases)
    .enter()
    .append('label');
  label
    .append('input')
    .attr('type', 'radio')
    .attr('name', 'disease')
    .attr('value', (d) => d)
    .on('change', update)
    .filter((_, i) => !i)
    .each(update)
    .property('checked', true);
  label
    .append('span')
    .attr('fill', 'red')
    .text((d) => d);
};

const update = (region) => {
  const sick_persons = persons.filter((person) => person[region + 'Count'] > 0);

  const x = d3
    .scaleBand()
    .domain(sick_persons.map((person) => person.age))
    .range([0, width])
    .padding(0.2);
  const bottomAxis = d3.axisBottom(x);

  gAxisX.exit().remove();
  gAxisX.attr('transform', 'translate(0, ' + height + ')').call(bottomAxis);
  gAxisX
    .enter()
    .append('g')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(bottomAxis);

  let maxNumPersons = -1;
  sick_persons.forEach((persons) => {
    if (maxNumPersons < persons.diabetesCount) {
      maxNumPersons = persons.diabetesCount;
    }
  });
  const y = d3.scaleLinear().domain([maxNumPersons, 0]).range([0, height]);
  const leftAxis = d3.axisLeft(y);

  gAxisY.exit().remove();
  gAxisY.call(leftAxis);
  gAxisY.enter().append('g').call(leftAxis);

  const bars = g.selectAll('rect').data(sick_persons);

  bars.exit().remove();
  bars
    .attr('width', () => x.bandwidth())
    .attr('height', (d) => height - y(d.diabetesCount))
    .attr('x', (d) => x(d.age))
    .attr('y', (d) => y(d.diabetesCount));
  bars
    .enter()
    .append('rect')
    .attr('width', () => x.bandwidth())
    .attr('height', (d) => height - y(d.diabetesCount))
    .attr('x', (d) => x(d.age))
    .attr('y', (d) => y(d.diabetesCount))
    .style('fill', '#ff8303');
};
