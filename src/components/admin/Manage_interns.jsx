import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Loading from "../Modal/Loading";
import userInstance from "../../axios_interceptor/userAxios";
import { getIdfromToken } from "../../services/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Input_Component from "../reuseble/Input_Component";
import ButtonComponent from "../reuseble/ButtonComponent";

const validationSchema = Yup.object({
  firstname: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastname: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phonenumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  stack: Yup.string().required("Stack (Domain) is required"),
  batch: Yup.string().required("Batch is required"),
});

const Manage_interns = ({ setOpen }) => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState();
  const [load, setLoad] = useState(false);
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      stack: "",
      batch: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoad(true);

      const formDataToSend = new FormData();
      Object.keys(values).forEach((key) => {
        formDataToSend.append(key, values[key]);
      });

      if (photo) {
        formDataToSend.append("profileImg", photo);
      }

      try {
        const response = await userInstance.post(
          "/admin/intern",
          formDataToSend
        );
        toast.success(response.data.message);
        queryClient.invalidateQueries(["List_intern"]);
      } catch (error) {
        toast.error(
          "Error: " + (error.response?.data?.message || "Something went wrong")
        );
      } finally {
        setLoad(false);
        setOpen(false);
      }
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["find_admin"],
    queryFn: async () => {
      const adminId = getIdfromToken();
      const response = await userInstance.get(`/admin/profile/${adminId}`);
      return response.data;
    },
  });

  const { data: batch = [] } = useQuery({
    queryKey: ["find_batch"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/batch`);
      return response.data;
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6 ml-16 h-full md:ml-64">
      {load && <Loading />}

      <div className="bg-[#d8cbd7] w-full p-3 h-full md:p-4 rounded-lg">
        <div className="bg-[#f3eff2] rounded-xl h-full">
          <div className="p-5">
            <h1 className="text-xs md:text-2xl text-black font-bold">
              Add New Intern
            </h1>
          </div>
          <hr className="border-1 border-black" />
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col md:flex-row p-5 md:p-10 gap-5 md:gap-10">
              {/* Photo Upload Section */}
              <div className="flex flex-col gap-2">
                <h1 className="text-black text-lg md:text-xl">Photo</h1>
                <img
                  className="rounded-xl h-20 w-20 md:h-28 md:w-28 border-black"
                  src={
                    photoPreview ||
                    "https://pinnacle.works/wp-content/uploads/2022/06/dummy-image.jpg"
                  }
                  alt="Profile Preview"
                />
                <div className="flex gap-2">
                  <label>
                    <input type="file" hidden onChange={handlePhotoChange} />
                    <div className="flex w-32 bg-[#12415d] text-white h-9 md:h-10 px-3 md:px-4 rounded-md leading-4 items-center justify-center cursor-pointer focus:outline-none">
                      Choose File
                    </div>
                  </label>
                  <button
                    type="button"
                    className=" bg-[#d8cbd7] text-red-400 h-9 md:h-10 px-3 md:px-4 rounded-md"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex flex-col md:flex-row text-black w-full gap-5">
                {/* First Column */}
                <div className="flex flex-col p-5 w-full md:w-1/2 gap-3">
                  <label htmlFor="firstname">First Name:</label>
                  <Input_Component
                    name="firstname"
                    value={formik.values.firstname}
                    placeholder="First name"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.firstname}
                    touched={formik.touched.firstname}
                  />

                  <label htmlFor="lastname">Last Name:</label>
                  <Input_Component
                    name="lastname"
                    value={formik.values.lastname}
                    placeholder="Last name"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.lastname}
                    touched={formik.touched.lastname}
                  />

                  <label htmlFor="email">Email:</label>
                  <Input_Component
                    name="email"
                    value={formik.values.email}
                    placeholder="Email"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.email}
                    touched={formik.touched.email}
                  />
                </div>

                {/* Second Column */}
                <div className="flex flex-col p-5 w-full md:w-1/2 gap-3">
                  <label htmlFor="phonenumber">Phone Number:</label>
                  <Input_Component
                    name="phonenumber"
                    value={formik.values.phonenumber}
                    placeholder="Phone number"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.phonenumber}
                    touched={formik.touched.phonenumber}
                  />

                  <label htmlFor="stack">Domain:</label>
                  <select
                    name="stack"
                    id="stack"
                    className="h-10 border border-gray-300 rounded-md px-2"
                    value={formik.values.stack}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select Domain</option>
                    {data?.stack?.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                  {formik.errors.stack && formik.touched.stack && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.stack}
                    </div>
                  )}

                  <label htmlFor="batch">Batch:</label>
                  <select
                    name="batch"
                    id="batch"
                    className="h-10 border border-gray-300 rounded-md px-2"
                    value={formik.values.batch}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select batch</option>
                    {batch?.map((x) => (
                      <option key={x._id} value={x._id}>
                        {x.batch_number}
                      </option>
                    ))}
                  </select>
                  {formik.errors.batch && formik.touched.batch && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.batch}
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <ButtonComponent
                      children="Submit"
                      variant="primary"
                      type="submit"
                    ></ButtonComponent>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Manage_interns;
