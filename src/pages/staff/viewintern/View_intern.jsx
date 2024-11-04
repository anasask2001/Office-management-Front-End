import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import userInstance from "../../../axios_interceptor/userAxios";
import { useQuery } from "@tanstack/react-query";
import Update_intern from "../../../components/admin/Update_intern";
import { getIdfromToken } from "../../../services/authService";

const View_intern = () => {
  const [Modal, setModal] = useState(false);
  const [Intern, selectedIntern] = useState(null);
  const [updateopen, Setupdateopen] = useState(false);

  const staffid = getIdfromToken();
  const {
    data: interns,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["View_intern"],
    queryFn: async () => {
      const response = await userInstance.get(`/staff/intern/${staffid}`);
      return response.data;
    },
  });

  return (
    <>
      <div className="p-4 flex justify-center ml-16 md:ml-64">
        <div className="bg-[#d8cbd7] w-full max-w-7xl rounded-3xl p-3 md:p-4 shadow-lg">
          <div className="bg-[#f3eff2] w-full text-black flex flex-col md:flex-row justify-between items-center rounded-2xl p-6 shadow-md mb-8">
            <input
              type="text"
              placeholder="Search here..."
              className="px-4 py-2 mb-4 md:mb-0 bg-gray-200 w-full md:w-[400px] rounded-full focus:outline-none shadow-inner"
            />
          </div>

          <div className="bg-[#f3eff2] p-4 rounded-xl shadow-lg">
            <div className="bg-[#f3eff2] p-4 rounded-lg">
              <div className="hidden md:grid md:grid-cols-7 gap-1 font-semibold text-gray-700 text-center bg-gray-200 p-3 rounded-lg mb-2">
                <div>Name</div>
                <div>Domain</div>
                <div>Email</div>

                <div>Contact</div>
                <div>Seat Number</div>
                <div>Joined Date</div>
                <div></div>
              </div>

              <div className="bg-[#f3eff2] min-h-[300px] overflow-auto max-h-[500px]">
                {interns && interns.length > 0 ? (
                  interns.map((intern) => (
                    <div
                      key={intern._id}
                      className="grid grid-cols-1 md:grid-cols-7 gap-4 text-center items-center p-4 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-all"
                    >
                      <div className="grid grid-cols-2 flex-col md:flex-row gap-2 items-center justify-between">
                        <img
                          src={intern?.profileImg}
                          className="w-[40px] h-[40px] rounded-full"
                          alt="Intern"
                        />
                        <span className="font-medium text-gray-800">
                          {intern?.firstname} {intern?.lastname}
                        </span>
                      </div>

                      <div className="hidden md:block text-gray-600">
                        {intern?.stack}
                      </div>

                      <div className="hidden md:block text-gray-600">
                        {intern?.email}
                      </div>

                      <div className="hidden md:block text-gray-600">
                        {intern?.phonenumber}
                      </div>

                      <div className="hidden md:block text-gray-600">
                        {intern?.seat?.row||"not assigned"} {intern?.seat?.number||"not assigned"}
                    
                    
                      </div>
                      <div className="hidden md:block text-gray-600">
                        {intern?.createdAt}
                      </div>

                      <div className="flex justify-center space-x-4">
                        <button
                          aria-label="Email"
                          className="text-gray-600 hover:text-[#e16a80] transition-all"
                        >
                          <FaEnvelope />
                        </button>

                        <button
                          aria-label="Edit"
                          className="text-gray-600 hover:text-[#e16a80] transition-all"
                          onClick={() => handleupdate(intern)}
                        >
                          <CiEdit />
                          {updateopen && (
                            <Update_intern
                              isopen={updateopen}
                              Setupdateopen={Setupdateopen}
                              intern={intern}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-600">
                    No interns found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View_intern;
