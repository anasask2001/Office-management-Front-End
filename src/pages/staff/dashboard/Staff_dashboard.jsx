import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import userInstance from "../../../axios_interceptor/userAxios";
import { useQuery } from "@tanstack/react-query";
import { getIdfromToken } from "../../../services/authService";
const Staff_dashboard = () => {
  const staffid = getIdfromToken();
  const { data } = useQuery({
    queryKey: ["View_intern", staffid],
    queryFn: async () => {
      const response = await userInstance.get(`/staff/intern/${staffid}`);
      return response.data;
    },
  });

  const staffData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "october",
      "november",
      "december",
    ],
    datasets: [
      {
        label: "Staff Joined",
        data: [10, 12, 8, 5, 7, 15, 10, 8, 6, 19, 22, 33],
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const internsData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "october",
      "november",
      "december",
    ],
    datasets: [
      {
        label: "Interns Joined",
        data: [20, 18, 25, 22, 30, 28, 35, 40, 38, 34, 44, 55],
        backgroundColor: "#2196F3",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };



  return (
    <div className=" bg-gray-950y-50 p-6 ml-16 md:ml-64">
    
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 bg-[#d8cbd7] p-2 rounded-lg shadow-sm md:p-4 ">
        <div className="p-4 bg-[#f3eff2] rounded-lg shadow">
          <h3 className="text-lg font-semibold text-black">Total Interns</h3>
          <p className="text-3xl font-bold text-black">{data?.length}</p>
          <p className="text-sm text-green-500">10% Up from this month</p>
        </div>
        <div className="p-4 bg-[#f3eff2] rounded-lg shadow">
          <h3 className="text-lg font-semibold text-black">Total Booking</h3>
          <p className="text-3xl font-bold text-black">192</p>
          <p className="text-sm text-pink-500">3% Up from week</p>
        </div>
        <div className="p-4  rounded-lg bg-[#f3eff2]  shadow">
          <h3 className="text-lg font-semibold text-black">Total Seat</h3>
          <p className="text-3xl font-bold text-black">2</p>
          <p className="text-sm text-blue-500">1+ added from today</p>
        </div>
        <div className="p-4  bg-[#f3eff2] rounded-lg shadow">
          <h3 className="text-lg font-semibold text-black">Interns Dropped</h3>
          <p className="text-3xl font-bold text-black">0</p>
          <p className="text-sm text-red-500">1+ dropped from today</p>
        </div>
      </div>

      <div className="p-2  flex justify-center items-center bg-[#d8cbd7] rounded-lg">
        <div className="p-4 bg-[#f3eff2]  w-full  h-full rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-black">
            Monthly Interns Joined Report
          </h3>
        
          <div className=" h-48 md:h-[40vh] bg-gray-100 md:w-auto w-[500px] rounded-md ">
            <Bar data={internsData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff_dashboard;
