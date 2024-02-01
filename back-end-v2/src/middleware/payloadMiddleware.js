exports.isValidPayload = (...params) => {
  return async (req, res, next) => {
    try {
      //by default, check if username and password is in payload
      if (!req.body.username || !req.body.password) throw new Error("V2");

      //check if each params is in payload
      params.forEach(param => {
        if (!req.body[param]) throw new Error("V2");
      });
      console.log(req.body);

      for (const prop in req.body) {
        if (typeof req.body[prop] !== "string") throw new Error("V2");
      }

      next();
    } catch (error) {
      return res.status(400).json({
        code: error.message
      });
    }
  };
};
