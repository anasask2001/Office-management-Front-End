import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Loading from "../Modal/Loading";
import userInstance from "../../axios_interceptor/userAxios";
import { getIdfromToken } from "../../services/authService";
import { useQuery } from "@tanstack/react-query";
import Input_Component from "../reuseble/Input_Component";
import ButtonComponent from "../reuseble/ButtonComponent";

const validationSchema = Yup.object({
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  dateofbirth: Yup.date().required("Date of birth is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  education: Yup.string().required("Education is required"),
  phonenumber: Yup.string().required("Phone number is required"),
  role: Yup.string().required("Role is required"),
});

const Manage_staff = ({ setOpen }) => {
  const [badgeColor, setBadgeColor] = useState("#000000");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState();
  const [load, Setload] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      dateofbirth: "",
      email: "",
      address: "",
      education: "",
      phonenumber: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
    

      Setload(true);

      const formDataToSend = new FormData();
      Object.keys(values).forEach((key) => {
        formDataToSend.append(key, values[key]);
      });
      formDataToSend.append("badgecolor", badgeColor);

      if (photo) {
        formDataToSend.append("profileImg", photo);
      }

      try {
        const response = await userInstance.post(
          "/admin/staff",
          formDataToSend
        );
        toast.success(response.data.message);
      } catch (error) {
        toast.error(
          "Error: " + (error.response?.data?.message || "Something went wrong")
        );
      } finally {
        Setload(false);
        setOpen(false);
      }
    },
  });

  const colorChange = (e) => {
    
    if (!badgeColor || badgeColor === "#000000") {
      setBadgeColor(e.target.value);
    }
  };

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

  if (isLoading) return <Loading />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-950y-50 p-6 ml-16 md:ml-64">
      {load && <Loading />}

      <div className="bg-[#d8cbd7] w-full p-3 md:p-4 rounded-lg">
        <div className="bg-[#f3eff2] rounded-xl h-full">
          <div className="p-5">
            <h1 className="text-xs md:text-2xl text-black font-bold">
              Add New Staff
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
                <div className="flex gap-2 ">
                  <label>
                    <input type="file" hidden onChange={handlePhotoChange} />
                    <div className="flex w-32 bg-[#12415d] text-white h-9 md:h-10 px-3 md:px-4 rounded-md leading-4 items-center justify-center cursor-pointer focus:outline-none">
                      Choose File
                    </div>
                  </label>
                  <button
                    type="button"
                    className="bg-[#d8cbd7] text-red-400 h-9 md:h-10 px-3 md:px-4 rounded-md"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>

             
              <div className="flex flex-col md:flex-row text-black w-full gap-5">
                <div className="flex flex-col p-5 w-full md:w-1/2 gap-3">
                  <label htmlFor="firstname">First Name:</label>
                  <Input_Component
                    type="text"
                    name="firstname"
                    value={formik.values.firstname}
                    placeholder="firstname"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.firstname}
                    touched={formik.touched.firstname}
                    
                  />
                
                  <label htmlFor="lastname">Last Name:</label>
                  <Input_Component
                    type="text"
                    name="lastname"
                    value={formik.values.lastname}
                    placeholder="lastname"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.lastname}
                    touched={formik.touched.lastname}
                  />
            
                  <label htmlFor="email">Email:</label>
                  <Input_Component
                    type="email"
                    name="email"
                    value={formik.values.email}
                    placeholder="email"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.email}
                    touched={formik.touched.email}
                  />
                
                  <label htmlFor="address">Address:</label>
                  <textarea
                    name="address"
                    id="address"
                    className="border border-gray-300 rounded-md p-2 h-24"
                    onChange={formik.handleChange}
                    value={formik.values.address}
                  />
                  {formik.errors.address && formik.touched.address && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.address}
                    </div>
                  )}
                </div>

                <div className="flex flex-col p-5 w-full md:w-1/2 gap-3">
                  <label htmlFor="dateofbirth">Date of Birth:</label>

                  <Input_Component
                    type="date"
                    name="dateofbirth"
                    value={formik.values.dateofbirth}
                    placeholder="dateofbirth"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.dateofbirth}
                    touched={formik.touched.dateofbirth}
                    
                  />

                  <label htmlFor="education">Education:</label>
                  <Input_Component
                    type="text"
                    name="education"
                    value={formik.values.education}
                    placeholder="education"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.education}
                    touched={formik.touched.education}
                  />

                  <label htmlFor="phonenumber">Phone Number:</label>
                  <Input_Component
                    type="number"
                    name="phonenumber"
                    value={formik.values.phonenumber}
                    placeholder="phonenumber"
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.phonenumber}
                    touched={formik.touched.phonenumber}
                  />

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex md:flex-row flex-col gap-2 md:items-center justify-between">
                      <label htmlFor="badgecolor">Badge Color:</label>
                      <input
                        onChange={colorChange}
                        type="color"
                        value={badgeColor}
                        className="h-8 w-12 border border-gray-300 rounded-md"
                        disabled={badgeColor !== "#000000"} 
                      />
                      <input
                        type="text"
                        value={badgeColor}
                        readOnly
                        className="h-8 border border-gray-300 rounded-md px-2"
                        placeholder="Badge Color"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-between md:flex-row gap-5">
                    <div className="flex w-full">
                      <div className="flex flex-col ml-2">
                        <label htmlFor="role">Role:</label>
                        <select
                          name="role"
                          id="role"
                          className="h-8 border border-gray-300 rounded-md px-2"
                          onChange={formik.handleChange}
                          value={formik.values.role}
                        >
                          <option value="">Select Role</option>
                          {data?.roles?.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </select>
                        {formik.errors.role && formik.touched.role && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.role}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">

                   <ButtonComponent children="Submit" variant="primary" type="submit">

                   </ButtonComponent>
                    </div>
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
export default Manage_staff;
