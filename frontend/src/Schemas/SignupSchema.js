import * as yup from "yup";

const signUpSchema = yup.object().shape({
  name: yup.string().max(30).min(5).required("name is required"),
  username: yup.string().min(5).max(30).required("username is required"),
  email: yup.string().email("enter a valid email").required(),
  password: yup.string().min(8).max(30).required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "password must match")
    .required("comfirm password must be password"),
});

export default signUpSchema;
