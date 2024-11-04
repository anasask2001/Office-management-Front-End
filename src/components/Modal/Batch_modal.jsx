"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import userInstance from "../../axios_interceptor/userAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Batch_modal({ modal1, Setmodal1, collectid }) {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  const queryClient = useQueryClient();

  const { data: advisors = [] } = useQuery({
    queryKey: ["get_advisors"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/advisor`);
      return response.data;
    },
  });

  const handleRadioChange = (advisorId) => {
    setSelectedAdvisor(advisorId);
  };

  const { mutate: mutate_role } = useMutation({
    mutationFn: async (newAdvisorId) => {
      const response = await userInstance.patch(`/admin/batch/${collectid}`, {
        newAdvisor: newAdvisorId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_role"]);
      setSelectedAdvisor(null);
      Setmodal1(false);
    },
    onError: (error) => {
      console.error("Error updating advisor:", error);
    },
  });

  const handleSubmit = () => {
    if (selectedAdvisor) {
      mutate_role(selectedAdvisor);
    } else {
      console.error("No advisor selected");
    }
  };

  return (
    <Dialog
      open={modal1}
      onClose={() => Setmodal1(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-[#f3eff2]  text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-[#f3eff2]  px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Active Advisor
                  </DialogTitle>
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-[#f3eff2]">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Select
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            First Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Last Name
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {advisors.length > 0 ? (
                          advisors.map((advisor) => (
                            <tr key={advisor._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <input
                                  type="radio"
                                  className="mr-2 appearance-none w-3 h-3 border-2 border-gray-300 rounded-full bg-white checked:bg-[#13425c] focus:outline-none"
                                  name="advisor"
                                  value={advisor._id}
                                  checked={selectedAdvisor === advisor._id}
                                  onChange={() =>
                                    handleRadioChange(advisor._id)
                                  }
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {advisor.firstname}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {advisor.lastname}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No advisors available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex w-full justify-center rounded-md bg-[#13425c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e16a80] sm:ml-3 sm:w-auto"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => Setmodal1(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
