const Schemes = require("./scheme-model");

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
  const { scheme_id } = req.params;
  // console.log("scheme id --->", scheme_id);
  Schemes.findUnformattedSchemeById(scheme_id)
    .then((scheme) => {
      // console.log("SCHEME --> ", scheme);
      if (!scheme) {
        res
          .status(404)
          .json({ message: `scheme with scheme_id ${scheme_id} not found` });
      } else {
        next();
      }
    })
    .catch(next);
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = async (req, res, next) => {
  const { scheme_name } = req.body;
  const allSchemes = await Schemes.find();
  const duplicateScheme = allSchemes.filter(
    (scheme) => scheme.scheme_name === scheme_name
  );
  if (!scheme_name) {
    res.status(400).json({ message: "invalid scheme_name" });
  } else if (typeof scheme_name !== "string") {
    res.status(400).json({ message: "invalid scheme_name" });
  } else if (duplicateScheme[0]) {
    res.status(400).json({ message: "invalid scheme_name" });
  } else next();
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const { step_number, instructions } = req.body;
  const err = { status: 400, message: "invalid step" };
  if (!instructions || !step_number) {
    next(err);
  } else if (typeof instructions !== "string") {
    next(err);
  } else if (typeof step_number !== "number") {
    next(err);
  } else if (step_number < 1) {
    next(err);
  } else next();
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
