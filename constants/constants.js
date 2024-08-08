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
];

export const productInputs = [
  {
    name: "productName",
    type: "text",
    placeholder: "Product Name",
    icon: "user",
    validation: {
      required: "true",
    },
    
  },
  {
    name: "productPrice",
    type: "number",
    placeholder: "Product Price",
    icon: "user",
    validation: {
      required: "true",
    },
    
  },
  {
    name: "productDescription",
    type: "text",
    placeholder: "First Description",
    icon: "user",
    validation: {
      required: "true",
    },
    
  },
  {
    name: "imagePath",
    type: "text",
    placeholder: "Upload Your Image",
    icon: "user",
    validation: {
      required: "true",
    },
    
  },
];
