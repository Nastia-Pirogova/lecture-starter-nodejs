const responseMiddleware = (req, res) => {
  if (res.locals.error) {
    const isNotFound = res.locals.error.status === 404;
    const status = isNotFound ? 404 : 400;
    return res.status(status).json({ error: true, message: res.locals.error.message });
  }
  return res.status(200).json(res.locals.data);
};

export { responseMiddleware };
