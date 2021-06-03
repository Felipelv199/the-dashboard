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
  .text('N. of Persons Hospitalized');
const label = g
  .append('text')
  .attr('x', width - 100)
  .attr('y', height - 20)
  .attr('font-size', '25px')
  .attr('text-anchor', 'right')
  .text('000 Years');

let colorsSchema = [
  '#0c2133',
  '#0d606a',
  '#00a1ed',
  '#016a7e',
  '#09d0ad',
  '#0b8cf3',
  '#0f3420',
  '#0a557e',
  '#0eb609',
  '#0263d3',
  '#033592',
  '#000b7b',
  '#04a26e',
  '#0bfdb0',
  '#092d45',
  '#009f90',
  '#0ab8b1',
  '#08360c',
  '#0481de',
  '#0986b9',
  '#0188ad',
  '#0e8739',
  '#02ec0c',
  '#09f6af',
  '#027208',
  '#071876',
  '#0d6fc9',
  '#029ee5',
  '#034d24',
  '#0c05fa',
  '#038424',
];
const colors = d3.scaleOrdinal().range(colorsSchema);

const gAxisX = g.append('g').attr('class', 'bottom axis');
const gAxisY = g.append('g').attr('class', 'left axis');
const t = d3.transition().duration(1000);
var x;
var y;
const area = d3.scaleLinear().range([25 * Math.PI, 1500 * Math.PI]);
area.domain([0, 10]);

const getData = async () => {
  const response = await fetch('http://localhost:8080/api/data/hospitalized');
  return response.status === 200 ? response.json() : [];
};

getData().then((data) => loadD3(data));

const loadD3 = (data) => {
  let persons = [];
  let states = [];
  data.forEach((element) => {
    let person = persons.find((person) => person.age === element.edad);
    if (person === undefined) {
      person = {
        age: element.edad,
        hospitalized: 0,
        maxHospitalizedState: 0,
        intOrNeu: 0,
        states: [],
      };
    }
    person.hospitalized += 1;
    let state = person.states.find(
      (state) => state.name === element.entidadRes
    );
    if (state === undefined) {
      state = {
        name: element.entidadRes,
        hospitalized: 0,
        intOrNeu: 0,
      };
    }
    state.hospitalized += 1;
    if (element.intubado.trim() === 'SI' || element.neumonia.trim() === 'SI') {
      state.intOrNeu += 1;
      person.intOrNeu += 1;
    }
    const stateIndex = person.states.indexOf(state);
    if (stateIndex != -1) {
      person.states[stateIndex] = state;
    } else {
      person.states.push(state);
    }

    let maxHospitalizedState = person.maxHospitalizedState;
    person.states.forEach((state) => {
      if (maxHospitalizedState < state.hospitalized) {
        maxHospitalizedState = state.hospitalized;
      }
    });
    person.maxHospitalizedState = maxHospitalizedState;
    const index = persons.indexOf(person);
    if (index != -1) {
      persons[index] = person;
    } else {
      persons.push(person);
    }

    const i = states.findIndex((state) => state === element.entidadRes);
    if (i === -1) {
      states.push(element.entidadRes);
    }
  });
  colors.domain(states);
  x = d3.scaleLinear().domain([0, 100]).range([0, width]);

  const rectSize = 10;
  const legendGroup = g
    .append('g')
    .style('transform', `translate(${width - rectSize}px, ${height - 70}px)`);
  states.forEach((state, index) => {
    const countryGroup = legendGroup
      .append('g')
      .style('transform', `translate(0px, ${-(rectSize + 1) * index}px)`);
    countryGroup
      .append('text')
      .attr('font-size', rectSize + 'px')
      .attr('text-anchor', 'end')
      .attr('x', -5)
      .attr('y', 12)
      .style('text-transform', 'capitalize')
      .text(state);
    countryGroup
      .append('rect')
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', colors(state));
  });

  const bottomAxis = d3.axisBottom(x);
  gAxisX.exit().remove();
  gAxisX.attr('transform', 'translate(0, ' + height + ')').call(bottomAxis);
  gAxisX
    .enter()
    .append('g')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(bottomAxis);
  const step = 1;
  let index = 0;

  let mHospitalized = 0;
  let maxIntOrNeu = 0;
  persons.forEach((person) => {
    if (mHospitalized < person.maxHospitalizedState) {
      mHospitalized = person.maxHospitalizedState;
    }
    if (maxIntOrNeu < person.intOrNeu) {
      maxIntOrNeu = person.intOrNeu;
    }
  });
  area.domain([0, maxIntOrNeu]);
  y = d3.scaleLinear().domain([mHospitalized, 0]).range([0, height]);
  const leftAxis = d3.axisLeft(y);
  gAxisY.append('g').call(leftAxis);

  d3.interval(() => {
    update(persons[index]);
    if (index + step >= persons.length) {
      index = 0;
    } else {
      index += step;
    }
  }, 1000);
  update(persons[index]);
  if (index + step >= persons.length) {
    index = 0;
  } else {
    index += step;
  }
  console.log();
};

const update = (persons) => {
  label.text(persons.age + '  years');
  const circles = g.selectAll('circle').data(persons.states, (d) => d.name);
  circles
    .exit()
    .transition(t)
    .attr('cx', () => x(persons.age))
    .attr('cy', (d) => y(d.hospitalized))
    .attr('r', (d) => Math.sqrt(area(d.intOrNeu) / Math.PI))
    .remove();
  circles
    .transition(t)
    .attr('cx', () => x(persons.age))
    .attr('cy', (d) => y(d.hospitalized))
    .attr('r', (d) => Math.sqrt(area(d.intOrNeu) / Math.PI));
  circles
    .enter()
    .append('circle')
    .attr('cx', () => x(persons.age))
    .attr('cy', (d) => y(d.hospitalized))
    .attr('r', (d) => Math.sqrt(area(d.intOrNeu) / Math.PI))
    .style('fill', (d) => colors(d.name))
    .attr('font-size', '15px')
    .text('H')
    .merge(circles)
    .transition(t)
    .attr('cx', () => x(persons.age))
    .attr('cy', (d) => y(d.hospitalized))
    .attr('r', (d) => Math.sqrt(area(d.intOrNeu) / Math.PI));
};
