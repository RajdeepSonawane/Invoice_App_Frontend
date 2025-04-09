import * as Yup from "yup";

export const validationSchema = Yup.object({
    vendorname: Yup.string().required("Vendor Name is required"),
    ownerName: Yup.string().required("Owner Name is required"),
    contactnumber: Yup.string().matches(/^\d{10}$/, "Contact Number must be exactly 10 digits").required("Contact Number is required"),
    currentaddress: Yup.string().required("Current Address is required"),
    GstNo: Yup.string().matches(/^[0-9A-Z]{15}$/, "GstNo Number must be exactly 15 characters").required("GstNo Number is required"),
    PanNo: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PanNo Number must be exactly 10 characters in format AAAAA9999A").required("PanNo Number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    state: Yup.string().required("State Name is required"),
    accountNo: Yup.number().required("Account Number is required"),
    branch: Yup.string().required("Branch is required"),
    bankName: Yup.string().required("Bank Name is required"),
    ifscCode: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code")
    .required("IFSC Code is required"),
});
