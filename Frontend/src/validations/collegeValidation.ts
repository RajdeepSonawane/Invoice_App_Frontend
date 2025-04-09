import * as Yup from "yup";
export const  validationSchema=Yup.object( {
    InstitutionType: Yup.string().required("Institution Type is required"),
    collegename:  Yup.string().required("College Name is required"),
    collegeshortname: Yup.string().required("College Short Name is required"),
    contactnumber: Yup.string() .matches(/^[\d-]+$/,"Contact Number is always in Number").required("Contact Number is required"),
    collegeaddress:Yup.string().required("College Address is required"),
    state: Yup.string().required("State is required"),
    statecode: Yup.number().required("State Code is required"),
    email:Yup.string().email("Invalid email format").required("Email is required"),
   
});

