import { ZodError } from "zod";

export const validate = (schema) => {

  return (req, res, next) => {

    try {

      const validatedData =
        schema.parse({
          body: req.body
        });

      req.validatedData =
        validatedData;

      next();

    } catch (error) {

      if (error instanceof ZodError) {

        return res.status(400).json({

          success: false,

          message: "Validation failed",

          errors: error.issues.map(
            (err) => ({
              field: err.path.join("."),
              message: err.message
            })
          )
        });
      }

      next(error);
    }
  };
};