import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import userInstance from "../../axios_interceptor/userAxios";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../reuseble/ButtonComponent";

export default function InternBlock({ isOpen, setModal, intern }) {
  const queryClient = useQueryClient();

  const dropIntern = async (id) => {
    const response = await userInstance.delete(`/admin/intern/${id}`);
    setModal(false);

    queryClient.invalidateQueries(["List_intern"]);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setModal(false)}
      className="relative z-10"
    >
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-white rounded-lg shadow-xl sm:max-w-lg w-full text-left">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Drop Intern
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to drop intern{" "}
                    <strong>
                      {intern.firstname} {intern.lastname}
                    </strong>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="submit"
              children="Drop"
              variant="warning"
              onClick={() => dropIntern(intern._id)}
              className="inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold  shadow-sm  sm:ml-3 sm:w-auto"
            ></Button>

            <Button
              type="submit"
              children="Cancel"
              variant="secondry"
              onClick={() => setModal(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
            ></Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
