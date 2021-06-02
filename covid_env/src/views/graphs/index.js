document.getElementById('age-range').addEventListener('submit', (event) => {
  event.preventDefault();
  const firstAge = document.getElementById('firstAge').value;
  const lastAge = document.getElementById('lastAge').value;
  event.target.reset();
  location.href = `http://localhost:8080/graphs/age?firstAge=${
    firstAge === '' ? 0 : firstAge
  }&lastAge=${lastAge === '' ? 0 : lastAge}`;
});
