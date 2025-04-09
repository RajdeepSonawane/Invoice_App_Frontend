import * as Yup from "yup";
export const  validationSchema=Yup.object( {
    ledgername: Yup.string().required("Ledger Name is required"),
})