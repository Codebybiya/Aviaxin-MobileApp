export const adminInputs = [
  {
    name: "firstname",
    type: "text",
    placeholder: "First Name",
    icon: "user",
    validation: {
      required: "true",
    },
  },
  {
    name: "lastname",
    type: "text",
    placeholder: "Last Name",
    icon: "user",
    validation: {
      required: "true",
    },
  },
  {
    name: "phno",
    type: "number",
    placeholder: "Phone No",
    icon: "phone",
    validation: {
      required: true,
      minLength: 10,
      maxLength: 15,
    },
  },

//   {
//     name: "password",
//     type: "password",
//     placeholder: "Password",
//     icon: "lock",
//     validation: {
//       required: true,
//       minLength: 5,
//     },
//   },
//   {
//     name: "confirmPassword",
//     type: "password",
//     placeholder: "Confirm Password",
//     icon: "lock",
//     validation: {
//       required: true,
//       match:"password"
//     },
//   },
];
