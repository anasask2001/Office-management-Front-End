import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import userInstance from "../../axios_interceptor/userAxios";
import { TiDeleteOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Batch_modal from "./Batch_modal";

const Profile = ({ modal, Setmodal, admin }) => {
  const [activeSection, setActiveSection] = useState("profile");
  const [newBatch, setNewBatch] = useState("");
  const [newStack, setNewStack] = useState("");
  const [newRole, setNewRole] = useState("");
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [modal1, Setmodal1] = useState(false);
  const [ishower, SetIshower] = useState(null);
  const queryClient = useQueryClient();
  const Id = admin._id;

  const { data: advisors = [] } = useQuery({
    queryKey: ["get_advisors"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/advisor`);
      return response.data;
    },
  });

  const { data: Stacks = [] } = useQuery({
    queryKey: ["get_stack"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/stack`);
      return response.data;
    },
  });

  const { mutate: mutate_stack } = useMutation({
    mutationFn: async () => {
      const response = await userInstance.patch(`/admin/stack/${Id}`, {
        stack: newStack,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_stack"]);
      setNewStack("");
    },
  });

  const deleteStackMutation = useMutation({
    mutationFn: async (stackToDelete) => {
      const response = await userInstance.delete(`/admin/stack/${Id}`, {
        data: { stack: stackToDelete },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_stack"]);
    },
  });

  const handleDeleteStack = (stackToDelete) => {
    deleteStackMutation.mutate(stackToDelete);
  };

  const { data: roles = [] } = useQuery({
    queryKey: ["get_role"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/role`);
      return response.data;
    },
  });

  const { mutate: mutate_role } = useMutation({
    mutationFn: async () => {
      const response = await userInstance.patch(`/admin/role/${Id}`, {
        roles: newRole,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_role"]);
      setNewRole("");
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleToDelete) => {
      const response = await userInstance.delete(`/admin/role/${Id}`, {
        data: { roles: roleToDelete },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_role"]);
    },
  });

  const handleDeleteRole = (roleToDelete) => {
    deleteRoleMutation.mutate(roleToDelete);
  };

  const { data: batch = [] } = useQuery({
    queryKey: ["get_batch"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/batch`);
      return response.data;
    },
  });

  const { mutate: mutate_batch } = useMutation({
    mutationFn: async () => {
      const response = await userInstance.post(`/admin/batch/${Id}`, {
        batch_number: newBatch,
        advisor: selectedAdvisor,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_batch"]);
      setNewBatch("");
      setSelectedAdvisor("");
    },
  });

  const [collectId, setCollectId] = useState(null);

  return (
    <>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#f3eff2] rounded-lg shadow-lg w-[90%] max-w-4xl p-6 relative">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-semibold">Profile Management</h2>
              <MdClose
                onClick={() => Setmodal(false)}
                className="text-2xl cursor-pointer hover:bg-gray-200 rounded-full p-1"
              />
            </div>

            <div className="flex mt-6 space-x-6">
              <div className="w-1/3 bg-gray-100 p-4 rounded-lg">
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={admin.profileImg}
                    alt="Profile"
                    className="rounded-full w-32 h-32 mb-4 border"
                  />
                  <h4 className="text-lg font-semibold">{admin.name}</h4>
                </div>

                <div className="border-t pt-4">
                  {["profile", "addBatch", "addStack", "addRole"].map(
                    (section) => (
                      <button
                        key={section}
                        className={`w-full flex justify-center items-center mt-4 ${
                          activeSection === section
                            ? "bg-[#e64c67]"
                            : "bg-[#13425c]"
                        } text-white px-4 py-2 rounded-lg hover:bg-[#e16a80] transition duration-200`}
                        onClick={() => setActiveSection(section)}
                      >
                        {section === "addBatch"
                          ? "Add Batch"
                          : section === "addStack"
                          ? "Add Stack"
                          : section === "addRole"
                          ? "Add Role"
                          : "Profile"}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="w-2/3 bg-white p-4 rounded-lg border">
                {activeSection === "profile" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-semibold text-gray-600">
                      Email:
                    </div>
                    <div className="flex items-center text-sm">
                      {admin.email}
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                      Name:
                    </div>
                    <div className="flex items-center text-sm">
                      {admin.name}
                    </div>
                  </div>
                ) : activeSection === "addBatch" ? (
                  <div>
                    <input
                      value={newBatch}
                      onChange={(e) => setNewBatch(e.target.value)}
                      placeholder="Enter new batch"
                      className="border rounded p-2 w-full mb-4"
                    />

                    <div className="flex items-center mb-4">
                      <select
                        className="border rounded p-2 w-full"
                        value={selectedAdvisor}
                        onChange={(e) => setSelectedAdvisor(e.target.value)}
                      >
                        <option value="">Select Advisor</option>
                        {advisors?.map((advisor, index) => (
                          <option key={index} value={advisor?._id}>
                            {advisor?.firstname}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => mutate_batch()}
                      className="bg-[#13425c] text-white px-4 py-2 rounded-lg hover:bg-[#e16a80]"
                    >
                      Add Batch
                    </button>

                    <h4 className="text-lg font-semibold my-4">
                      Current Batches
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {batch?.map((batch, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 text-sm p-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex justify-between items-center"
                          onMouseEnter={() => SetIshower(batch._id)}
                          onMouseLeave={() => SetIshower(null)}
                        >
                          {batch.batch_number}{" "}
                          {ishower === batch._id && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-3 bg-[#13425c] text-white text-sm rounded-lg shadow-lg transition-opacity duration-300 ease-in-out opacity-90 hover:opacity-100 w-64 z-10">
                              <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-[#e16a80] mb-1">
                                  Batch: {batch.batch_number}
                                </span>

                                <div className="flex items-center">
                                  <img
                                    src={
                                      batch.advisor.profileImg ||
                                      "/placeholder-image.jpg"
                                    }
                                    alt="Advisor"
                                    className="w-8 h-8 rounded-full mr-2 border"
                                  />
                                  <span className="font-semibold">
                                    Advisor:{batch.advisor.firstname}{" "}
                                    {batch.advisor.lastname}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          <CiEdit
                            onClick={() => {
                              Setmodal1(true);
                              setCollectId(batch._id);
                            }}
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                          />
                          {modal && (
                            <Batch_modal
                              modal1={modal1}
                              Setmodal1={Setmodal1}
                              advisors={advisors}
                              collectid={collectId}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : activeSection === "addStack" ? (
                  <div>
                    <input
                      type="text"
                      value={newStack}
                      onChange={(e) => setNewStack(e.target.value)}
                      placeholder="Enter new stack"
                      className="border rounded p-2 w-full mb-4"
                    />
                    <button
                      className="bg-[#13425c] text-white px-4 py-2 rounded-lg hover:bg-[#e16a80]"
                      onClick={() => mutate_stack()}
                    >
                      Add Stack
                    </button>
                    <h4 className="text-lg font-semibold my-4">
                      Current Stacks
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {Stacks.map((stack, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 text-sm p-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex justify-between items-center"
                        >
                          {stack}{" "}
                          <TiDeleteOutline
                            onClick={() => handleDeleteStack(stack)}
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : activeSection === "addRole" ? (
                  <div>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Enter new role"
                      className="border rounded p-2 w-full mb-4"
                    />
                    <button
                      onClick={() => mutate_role()}
                      className="bg-[#13425c] text-white px-4 py-2 rounded-lg hover:bg-[#e16a80]"
                    >
                      Add Role
                    </button>
                    <h4 className="text-lg font-semibold my-4">
                      Current Roles
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {roles.map((role, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 text-sm p-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex justify-between items-center"
                        >
                          {role}{" "}
                          <TiDeleteOutline
                            onClick={() => handleDeleteRole(role)}
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
