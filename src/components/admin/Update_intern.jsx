import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import ButtonComponent from "../reuseble/ButtonComponent";

export default function Update_intern({ isopen, Setupdateopen }) {
  return (
    <>
      <Dialog
        open={isopen}
        onClose={() => Setupdateopen(false)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-10 transition-opacity" />
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-[#f3eff2] text-left transition-all sm:max-w-lg w-full">
            <div className="px-6 py-8">
              <DialogTitle
                as="h3"
                className="text-lg font-semibold leading-6 text-gray-900 mb-6"
              >
                Update Staff Information
              </DialogTitle>
              <form className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>

                  <img
                    alt="Profile Preview"
                    className="mt-1 h-24 w-24 rounded-full"
                  />

                  <label>
                    <input type="file" name="profileImg" hidden />
                    <div className="flex w-32 bg-[#12415d] text-white h-8 px-3 rounded-md leading-4 items-center justify-center cursor-pointer focus:outline-none">
                      Choose File
                    </div>
                  </label>
                </div>

            
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

            
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>


                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

            
                <div className="col-span-2">
                  <label
                    htmlFor="stack"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Domain
                  </label>
                  <select
                    name="stack"
                    id="stack"
                    className="h-8 border border-gray-300 rounded-md px-2"
                  >
                    <option value="">Change Bath</option>
                    <option value="domain1">Domain 1</option>
                    <option value="domain2">Domain 2</option>
                  </select>
                </div>

              
                <div className="col-span-2 flex justify-end gap-4 mt-4">
                  <ButtonComponent
                    type="submit"
                    children="Submit"
                    variant="primary"
                    className="inline-flex justify-center rounded-md  px-4 py-2 text-sm font-medium   focus:outline-none focus:ring-2 focus:ring-gray-400"
                  ></ButtonComponent>

                  <ButtonComponent
                    onClick={() => Setupdateopen(false)}
                    variant="secondary"
                    children="Cancel"
                    className="inline-flex justify-center rounded-md  px-4 py-2 text-sm font-medium   focus:outline-none focus:ring-2 focus:ring-gray-400"
                  ></ButtonComponent>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
