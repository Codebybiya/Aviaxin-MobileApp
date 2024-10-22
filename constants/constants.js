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
    name: "Order Detail",
    icon: "Order",
    route: "orderdetailnotif",
  },
  {
    name: "Terms & Conditions",
    icon: "list-alt",
    route: "termsandconditions",
  },
  {
    name: "About App",
    icon: "question-circle",
    route: "faqs",
  },
  {
    name: "Privacy Policy",
    icon: "lock",
    route: "privacy-policy",
  },
  {
    name: "Return Policy",
    icon: "undo",
    route: "return-policy",
  },
  {
    label: "Add Member",
    icon: "Add Member",
    route: "addmember",
  },
  {
    label: "Aviaxin Members",
    icon: "Aviaxin Members",
    route: "viewmembers",
  },
  {
    label: "Request",
    icon: "Request",
    route: "registerrequest",
  },
  {
    label: "Verify Your Email",
    icon: "otp",
    route: "../app/auth/OtpPage",
  },
];

export const menuItems = [
  {
    label: "Terms & Conditions",
    icon: "list-alt",
    route: "termsandconditions",
  },
  {
    label: "About App",
    icon: "question-circle",
    route: "faqs",
  },
  {
    label: "Privacy Policy",
    icon: "lock",
    route: "privacy-policy",
  },

  {
    label: "Logout",
    icon: "sign-out",
    route: "logout",
  },
];

export const termsOfUse = [
  {
    title: "Acceptance of Terms",
    content:
      "By downloading and using the Aviaxin mobile application ('App'), you agree to be bound by these Terms of Use ('Terms'). If you do not agree with all of these Terms, do not use the App.",
  },
  {
    title: "Use License",
    content:
      "Aviaxin grants you a limited, non-exclusive, non-transferable license to use the App for your internal business use, specifically for veterinary services related to poultry health.",
    restrictions: [
      "Modify, copy, or create derivative works based on the App;",
      "Use the App for any purpose that is illegal or prohibited by these Terms;",
      "Use the App to send unauthorized advertising or spam;",
      "Engage in any activity that interferes with or disrupts the App’s services.",
    ],
  },
  {
    title: "Intellectual Property",
    content:
      "The App and its original content, features, and functionality are owned by Aviaxin and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.",
  },
  {
    title: "Your Account",
    content:
      "You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.",
  },
  {
    title: "Termination",
    content:
      "We may terminate or suspend your account and bar access to the App immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
  },
  {
    title: "Links to Other Web Sites",
    content:
      "Our App may contain links to third-party web sites or services that are not owned or controlled by Aviaxin. Aviaxin has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services.",
  },
  {
    title: "Changes to Terms",
    content:
      "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about these Terms, please contact us at: info@aviaxin.com.",
  },
];

export const privacyPolicy = [
  {
    title: "Introduction",
    content:
      "Welcome to the Aviaxin mobile application ('App')! Aviaxin is committed to protecting your privacy and ensuring a transparent approach to data collection and usage. This Privacy Policy outlines our practices related to the collection, use, disclosure, and protection of your personal information.",
  },
  {
    title: "1. Information We Collect",
    content: "",
    subPoints: [
      "Personal Information: We collect personal information such as your name, email address, and phone number when you register an account on our App.",
      "Usage Data: Information about your interactions within the App and any details of your orders are logged to improve service delivery.",
      "Device Information: Technical details about the device including IP address, operating system, and device type are collected to troubleshoot and optimize our App performance.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: "",
    subPoints: [
      "Service Delivery: To manage your account, process your orders, and provide customer support.",
      "App Improvements: We analyze usage to enhance app functionality and user experience.",
      "Communication: To inform you about updates to the App or respond to your inquiries.",
    ],
  },
  {
    title: "3. Sharing Your Information",
    content: "",
    subPoints: [
      "Service Providers: Information may be shared with third-party service providers who assist us in operating our App, such as payment processors and cloud hosting services.",
      "Compliance and Safety: We may disclose information when required by law or to protect the safety and security of our users.",
    ],
  },
  {
    title: "4. Data Security",
    content:
      "We implement a variety of security measures to maintain the safety of your personal information but acknowledge that no system is completely secure. We strive to use commercially acceptable means to protect your personal information.",
  },
  {
    title: "5. Your Rights",
    content: "",
    subPoints: [
      "Access and Control: You can review, amend, or request deletion of your personal information through your account settings.",
      "Opt-Out Options: You may opt out of receiving promotional communications by using the unsubscribe options within those communications.",
    ],
  },
  {
    title: "6. International Users",
    content:
      "The information we collect may be stored and processed in any country where we operate or where our service providers are located. By using the App, you consent to the transfer of information to countries outside of your country of residence, which may have different data protection rules than in your country.",
  },
  {
    title: "7. Children’s Privacy",
    content:
      "Our App is not intended for children under the age of 13, and we do not knowingly collect personal information from children under this age.",
  },
  {
    title: "8. Changes to This Privacy Policy",
    content:
      "We reserve the right to modify this policy at any time. Please review it periodically. If we make material changes, we will provide notice through the App or by other means to provide you the opportunity to review the changes before they become effective.",
  },
  {
    title: "9. Contact Us",
    content:
      "If you have questions about this Privacy Policy, please contact us at info@aviaxin.com.",
  },
];

export const aboutApp = [
  {
    title: "Who We Are",
    content:
      "Welcome to Aviaxin, your premier partner in poultry health innovation. Through our mobile application, we extend our commitment to the poultry industry by providing veterinarians with the latest in diagnostic and microbial identification services directly at their fingertips.",
  },
  {
    title: "Our Mission",
    content:
      "At Aviaxin, we are driven by a single goal: to enhance the health and productivity of poultry globally. We achieve this by leveraging cutting-edge research, technological innovation, and comprehensive expertise in the field of poultry sciences.",
  },
  {
    title: "Our Expertise",
    content:
      "Founded by a team of leading poultry scientists and researchers, Aviaxin stands at the forefront of veterinary science. Our specialists bring decades of combined experience, having contributed to significant advancements in vaccine development, disease management, and poultry welfare.",
  },
  {
    title: "Our Services",
    content:
      "The Aviaxin app offers a streamlined, intuitive platform where poultry veterinarians can:",
    bulletPoints: [
      "Order Diagnostic Tests: Quickly request and receive results for a wide range of poultry diseases.",
      "Culture and Isolation: Access services for the identification of microbes and disease-causing agents, critical for effective treatment planning.",
      "Expert Consultation: Connect with our experts for guidance and advice on complex cases, ensuring the best outcomes for poultry care.",
    ],
  },
  {
    title: "Our Commitment",
    content:
      "We are committed to continuous improvement and innovation. The Aviaxin app is regularly updated to incorporate the latest scientific findings and user feedback, ensuring that our tools and services remain at the cutting edge of veterinary medicine.",
  },
  {
    title: "Join Us",
    content:
      "Embrace the future of poultry health with Aviaxin. Together, we can achieve healthier poultry populations and a more sustainable agricultural environment. For more information on how to get started with our app, visit www.aviaxin.com",
  },
];

export const loginInputs = [
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    icon: "envelope",
    validation: {
      required: true,
      email: true,
    },
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: "lock",
    validation: {
      required: true,
      minLength: 6,
    },
  },
];

export const registerInputs = [
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
    name: "email",
    type: "email",
    placeholder: "Email",
    icon: "envelope",
    validation: {
      required: true,
      email: true,
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
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: "lock",
    validation: {
      required: true,
      minLength: 6,
    },
  },
  {
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm Password",
    icon: "lock",
    validation: {
      required: true,
      minLength: 6,
    },
  },

  {
    name: "role",
    type: "select",
    placeholder: "Register As",
    icon: "user",
    pickerItems: [
      { label: "Veterinarian", value: "veterinarian" },
      { label: "Microbiologist", value: "microbiologist" },
    ],
    validation: {
      required: "true",
    },
  },
];

export const users = [
  // {label:"Admin",value:"admin"},
  // {label:"SuperAdmin",value:"superadmin"},
  { label: "Veterinarian", value: "veterinarian", role: "veterinarian" },
  { label: "Microbiologist", value: "microbiologist", role: "microbiologist" },
];

export const ortIsolationInputs = [
  {
    name: "veterinarianName",
    type: "text",
    validation: {
      required: "true",
    },
    placeholder: "Anna Katrina Marchesi",
    label: "Veterinarian Name",
  },
  {
    name: "colonyName",
    type: "text",
    validation: {
      required: "true",
    },
    placeholder: "XYZ",
    label: "Colony Name",
  },
  {
    name: "ortConfirmed",
    type: "select",
    placeholder: "ORT Confirmed",
    validation: {
      required: "true",
    },
    pickerItems: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    label: "If ORT has been confirmed previously by {Aviaxin} Lab (Yes) (No)",
  },
];
export const ortVaccinationInputs = [
  {
    name: "veterinarianName",
    type: "text",
    validation: {
      required: "true",
    },
    placeholder: "Anna Katrina Marchesi",
    label: "Veterinarian Name",
  },
  {
    name: "colonyName",
    type: "text",
    validation: {
      required: "true",
    },
    placeholder: "XYZ",
    label: "Colony Name",
  },
  {
    name: "ortConfirmed",
    type: "select",
    placeholder: "ORT Confirmed",
    validation: {
      required: "true",
    },
    pickerItems: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    label: "If ORT has been confirmed previously by {Aviaxin} Lab (Yes) (No)",
  },
  {
    name: "bottles",
    type: "number",
    validation: {
      required: "true",
    },
    placeholder: "XYZ",
    label: "No of 1000ml bottles required",
  },
  {
    name: "doses",
    type: "number",
    validation: {
      required: "true",
    },
    placeholder: "XYZ",
    label: "No of doses required",
  },
  {
    name: "bodyParts",
    type: "checkbox",
    validation: {
      required: "true",
    },
    placeholder: "XYZ",
    label: "Select from the following: ",
    options: [
      { label: "Lungs", value: "lungs" },
      { label: "Liver", value: "liver" },
      { label: "Tissues", value: "tissues" },
    ],
  },
];

export const ortIsolationConfirmationInputs = [
  {
    name: "isolateNumber",
    type: "number",
    validation: {
      required: true,
    },
    label: "Isolation No",
    placeholder: "Enter Isolation No",
  },
  {
    name: "batchNumber",
    type: "number",
    validation: {
      required: true,
    },
    label: "Batch No",
    placeholder: "Enter Batch No",
  },
];

export const ortVaccinationPrepareInputs = [
  // {
  //   name: "details",
  //   type: "text",
  //   validation: {
  //     required: true,
  //   },
  //   label: "Isolate transfer to BAP agar (48hr):",
  //   placeholder: "Enter Completed Process",
  // },
  // {
  //   name: "details",
  //   type: "text",
  //   validation: {
  //     required: true,
  //   },
  //   label:
  //     "Inoculate 15mL conical tube containing 10mL BHI and 1.5mL Horse Serum:",
  //   placeholder: "Enter Completed Process",
  // },
  // {
  //   name: "details",
  //   type: "text",
  //   validation: {
  //     required: true,
  //   },
  //   label: "15mL conical being inoculated (72hr):",
  //   placeholder: "Enter Completed Process",
  // },
  // {
  //   name: "details",
  //   type: "text",
  //   validation: {
  //     required: true,
  //   },
  //   label: "Purity Results:",
  //   options: [
  //     { label: "Yes", value: "yes" },
  //     { label: "No", value: "no" },
  //   ],
  //   placeholder: "Enter Completed Process",
  // },
  {
    name: "details",
    type: "text",
    validation: {
      required: true,
    },
    label: " Inoculate 1-liter of BHI broth with ORT (72hr):",
    placeholder: "Enter Completed Process",
  },
  {
    name: "details",
    type: "text",
    validation: {
      required: true,
    },
    label: "Purity Results 2:",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    placeholder: "Enter Completed Process",
  },
  {
    name: "details",
    type: "text",
    validation: {
      required: true,
    },
    label: " Live ORT Media Completed:",
    placeholder: "Enter Completed Process",
  },
];

export const datePickupInputs = [
  {
    name: "pickUpDate",
    type: "date",
    validation: {
      required: true,
    },
    label: "Select Pickup Date:",
    placeholder: "Enter Pickup Date",
  },
];
