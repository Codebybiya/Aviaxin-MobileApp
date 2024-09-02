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

export const tabs = [
  {
    name: "Home",
    icon: "home",
    route: "index",
  },
  {
    name: "Login",
    icon: "login",
    route: "Login",
  },
  {
    name: "Register Account",
    icon: "register",
    route: "Register",
  },
  {
    name: "Add New Admin",
    icon: "addadmin",
    route: "addadmin",
  },
  {
    name: "Add New Product",
    icon: "addproduct",
    route: "addproduct",
  },
  {
    name: "Product Detail",
    icon: "productdetail",
    route: "productdetail",
  },
  {
    name: "Product Form",
    icon: "productform",
    route: "productform",
  },
  {
    name: "Order Status",
    icon: "orderstatus",
    route: "orderstatus",
  },
  {
    name: "All Placed Order",
    icon: "placedorders",
    route: "placedorders",
  },
  {
    name: "Order Details",
    icon: "orderdetail",
    route: "orderdetail",
  },
  {
    name: "All Products",
    icon: "viewproducts",
    route: "viewproducts",
  },
  {
    name: "All Admins",
    icon: "viewadmins",
    route: "viewadmins",
  },
  {
    name: "All New Placed Order",
    icon: "Pendingplaceorder",
    route: "Pendingplaceorder",
  },
  {
    name: "Order Detail",
    icon: "Confrimorder",
    route: "confrimorder",
  },
  {
    name: "Confrimed Orders",
    icon: "Confrimorder",
    route: "newconfrimedorder",
  },
  {
    name: "Cart",
    icon: "Cart",
    route: "cart",
  },
  {
    name: "Order Deatil",
    icon: "Order",
    route: "orderdetailnotif",
  },
];
