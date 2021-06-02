export const home = (req, res) => {
  res.render('index', {});
};

export const uploadFile = (req, res) => {
  res.render('upload/index', {});
};
