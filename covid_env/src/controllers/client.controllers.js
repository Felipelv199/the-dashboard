export const home = (req, res) => {
  res.render('index', {});
};

export const uploadFile = (req, res) => {
  res.render('upload', {});
};

export const age = (req, res) => {
  res.render('graphs/age', {});
};

export const patient = (req, res) => {
  res.render('graphs/patient', {});
};

export const decease = (req, res) => {
  res.render('graphs/decease', {});
};
