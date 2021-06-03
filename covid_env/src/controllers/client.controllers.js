export const home = (req, res) => {
  res.render('index', {});
};

export const uploadFile = (req, res) => {
  res.render('upload', {});
};

export const graphs = (req, res) => {
  res.render('graphs', {});
};

export const age = (req, res) => {
  const { firstAge, lastAge } = req.query;
  res.render('graphs/age', {
    firstAge: firstAge ? firstAge : 0,
    lastAge: lastAge ? lastAge : 0,
  });
};

export const patient = (req, res) => {
  res.render('graphs/patient', {});
};

export const decease = (req, res) => {
  res.render('graphs/decease', {});
};

export const hospitalized = (req, res) => {
  res.render('graphs/hospitalized', {});
};
