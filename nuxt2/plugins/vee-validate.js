import { extend } from "vee-validate";
import { required, email, alpha } from "vee-validate/dist/rules";

extend('email', email);
extend('required', required);
extend("alpha", {
    ...alpha,
    message: "This field must only contain alphabetic characters"
});
