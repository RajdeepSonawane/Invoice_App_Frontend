import * as Yup from "yup";

export const validationSchema = Yup.object({
  employeeCode: Yup.string().required("Employee Code is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  contactNumber: Yup.string()
    .matches(/^\d{10}$/, "Contact Number must be exactly 10 digits")
    .required("Contact Number is required"),
  currentAddress: Yup.string().required("Current Address is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
  designation: Yup.string().required("Designation is required"),
  role: Yup.string().required("Role is required"),
});
