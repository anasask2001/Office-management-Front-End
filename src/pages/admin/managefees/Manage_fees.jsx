import React, { useState } from "react";
import userInstance from "../../../axios_interceptor/userAxios";

const Manage_fees = () => {
  const [dueDate, setDueDate] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [message, setMessage] = useState(""); 

  const handleSendReminder = async () => {
    if (!dueDate || !rentAmount) {
      setMessage("Please fill in all fields before sending the reminder.");
      return;
    }

    try {
      
      const response = await userInstance.post("/payment", {
        selectdate: dueDate,
        amount: rentAmount,
      });

      if (response.status === 200) {
        setMessage("Reminder email sent successfully!");
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      setMessage("Error sending reminder email. Please try again.");
    }
  };

  return (
    <div className="p-4 flex justify-center ml-16 md:ml-64">
      <div className="bg-[#d8cbd7] w-full max-w-7xl rounded-3xl p-3 md:p-4 shadow-lg">
        <div className="bg-[#f3eff2] w-full text-black flex flex-col rounded-2xl p-6 shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Manage Fees Structure
          </h2>
          <hr className="mb-6 border-1 border-black" />

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="rent-amount">
              Rent Amount:
            </label>
            <input
              type="text"
              id="rent-amount"
              value={rentAmount}
              placeholder="Enter rent amount"
              onChange={(e) => setRentAmount(e.target.value)}
              className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="block text-gray-700 mb-2 mt-4" htmlFor="due-date">
              Select Due Date:
            </label>
            <div className="relative">
              <input
                type="date"
                id="due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            className="bg-[#13425c] text-white p-3 rounded-md hover:bg-[#e16a80] transition duration-300"
            onClick={handleSendReminder}
          >
            Send Reminder Email
          </button>

          {message && <div className="mt-4 text-green-500">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default Manage_fees;
