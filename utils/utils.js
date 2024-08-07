import * as Yup from 'yup';

// Function to create Yup validation schema
export const createValidationSchema = (fields) => {
  const shape = {};

  fields.forEach((field) => {
    let validation = Yup.string();

    if (field.validation.required) {
      validation = validation.required(`${field.placeholder} is required`);
    }

    if (field.validation.minLength) {
      validation = validation.min(field.validation.minLength, `${field.placeholder} must be at least ${field.validation.minLength} characters`);
    }

    if (field.validation.maxLength) {
      validation = validation.max(field.validation.maxLength, `${field.placeholder} must be at most ${field.validation.maxLength} characters`);
    }

    if (field.validation.email) {
      validation = validation.email(`${field.placeholder} must be a valid email`);
    }

    if (field.validation.match) {
      validation = validation.oneOf([Yup.ref(field.validation.match)], 'Passwords must match');
    }

    shape[field.name] = validation;
  });
  return Yup.object().shape(shape);
};


