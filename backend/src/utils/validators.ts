import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

//customize validator function
export const validate =  (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //loop to verify all conditions
        for(let validation of validations){
            const result = await validation.run(req);
            if(!result.isEmpty()){
                break;
            }
        }
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next(); //proceed to next middleware
        }
       return res.status(422).json({errors: errors.array()}); //return errors
    };
};

//define validators, chains
export const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password").trim().isLength({min: 6}).withMessage("Password should contain atleast 6 characters")
];

//define validators, chains
export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator, //spread loginValidator
  
];

export const chatCompletetionValidator = [
    body("message").notEmpty().withMessage("Message is required"),

];