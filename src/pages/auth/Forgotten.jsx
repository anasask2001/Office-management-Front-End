import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IMG from "../../asset/background.jpg";
import Logo from "../../asset/Logo.png";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import userInstance from "../../axios_interceptor/userAxios";
import { toast } from "react-toastify";

const validationSchemaEmail = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
});

const validationSchemaOTP = Yup.object({
  otp: Yup.string().required("OTP is required"),
});

const validationSchemaPassword = Yup.object({
  newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Forgotten = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await userInstance.post('/forgotten', { email: values.email });
      toast.success(res.data.message);
      setEmail(values.email); 
      setStep(2);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOTPSubmit = async (values, { setSubmitting }) => {
    try {
      await userInstance.post('/verify', { email, otp: values.otp });
      setStep(3);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An unexpected error occurred";
      toast.error(errorMessage); 
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values, { resetForm, setSubmitting }) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match");
      setSubmitting(false);
      return;
    }

    try {
      const res = await userInstance.put('/updatepassword', { newPassword: values.newPassword });
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "An unexpected error occurred";
      toast.error(errorMessage); 
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <div className="relative">
      <img src={IMG} alt="Background" className="h-[100vh] w-full object-cover" />
      <div className="bg-opacity-70 absolute top-0 left-0 h-full w-full bg-black flex items-center justify-center">
        <div className="flex flex-col md:flex-row bg-white rounded-xl items-center justify-around shadow-xl p-4 bg-opacity-70 h-auto w-[90%] md:w-[900px]">
          <div className="mb-6 md:mb-0 order-1 md:order-2 w-full md:w-1/2 flex justify-center">
            <img src={Logo} alt="Logo" className="w-[200px] md:w-[400px] max-w-full" />
          </div>
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="rounded-xl p-6 md:p-10 shadow-xl bg-white bg-opacity-50">
              {step === 1 && (
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={validationSchemaEmail}
                  onSubmit={handleEmailSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2 text-[#E64D67]">Email</label>
                        <Field
                          type="email"
                          name="email"
                          autoComplete="email"
                          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black-300 transition duration-300"
                          placeholder="Enter your email"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#0E2145] text-white py-3 px-4 rounded-lg hover:bg-[#0C1937] focus:outline-none focus:ring-2 focus:ring-black transition duration-300 font-semibold"
                        disabled={isSubmitting}
                      >
                        Send OTP
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
              {step === 2 && (
                <Formik
                  initialValues={{ otp: "" }}
                  validationSchema={validationSchemaOTP}
                  onSubmit={handleOTPSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2 text-[#E64D67]">OTP</label>
                        <Field
                          type="text"
                          name="otp"
                          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black-300 transition duration-300"
                          placeholder="Enter OTP"
                        />
                        <ErrorMessage name="otp" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#0E2145] text-white py-3 px-4 rounded-lg hover:bg-[#0C1937] focus:outline-none focus:ring-2 focus:ring-black transition duration-300 font-semibold"
                        disabled={isSubmitting}
                      >
                        Verify OTP
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
              {step === 3 && (
                <Formik
                  initialValues={{
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={validationSchemaPassword}
                  onSubmit={handlePasswordSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2 text-[#E64D67]">New Password</label>
                        <Field
                          type="password"
                          name="newPassword"
                          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black-300 transition duration-300"
                          placeholder="Enter new password"
                        />
                        <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                      <div className="mb-5">
                        <label className="block text-sm font-semibold mb-2 text-[#E64D67]">Confirm Password</label>
                        <Field
                          type="password"
                          name="confirmPassword"
                          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black-300 transition duration-300"
                          placeholder="Confirm password"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#0E2145] text-white py-3 px-4 rounded-lg hover:bg-[#0C1937] focus:outline-none focus:ring-2 focus:ring-black transition duration-300 font-semibold"
                        disabled={isSubmitting}
                      >
                        Update Password
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgotten;
