import React, { useState } from "react";
import userInstance from "../../../axios_interceptor/userAxios";
import { useQuery } from "@tanstack/react-query";
import { RiSofaFill } from "react-icons/ri";
import Seatmodal from "../../../components/Modal/Seatmodal";
import { getIdfromToken } from "../../../services/authService";

const Seatbooking = () => {
  const [modal, Setmodal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [collectseat, setcollectseat] = useState(null);

  const closemodal = () => {
    Setmodal(!modal);
    setSelectedSeat(null);
  };

  const staffid = getIdfromToken();

  const { data: staff } = useQuery({
    queryKey: ["find_staff"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/profile/${staffid}`);
      return response.data;
    },
  });

  const { data: interns } = useQuery({
    queryKey: ["View_intern"],
    queryFn: async () => {
      const response = await userInstance.get(`/staff/intern/${staffid}`);
      return response.data;
    },
  });

  let seatcount = interns?.map((item) => item?.seat);

  const {
    data: seatLayout,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get_seat"],
    queryFn: async () => {
      const response = await userInstance.get("/admin/seat");
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div className="text-center text-lg font-semibold text-gray-500">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        Error loading seats
      </div>
    );

  const totalSeats = seatLayout.length;

  const placementSeats = seatLayout.filter(
    (seat) => seat.status === "placement"
  ).length;
  const wfhSeats = seatLayout.filter((seat) => seat.status === "wfh").length;
  const availableSeats = seatLayout.filter(
    (seat) => seat.status === "available"
  ).length;

  const groupSeats = (seats, seatsPerRow = 10) => {
    const groupedSeats = [];
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      groupedSeats.push(seats.slice(i, i + seatsPerRow));
    }
    return groupedSeats;
  };

  const groupedRows = groupSeats(seatLayout, 12);

  const groupColumns = (rows, rowsPerColumn = 5) => {
    const groupedColumns = [];
    for (let i = 0; i < rows.length; i += rowsPerColumn) {
      groupedColumns.push(rows.slice(i, i + rowsPerColumn));
    }
    return groupedColumns;
  };

  const groupedColumns = groupColumns(groupedRows, 5);

  const reservedSeats = seatLayout.filter((seat) => seat.isReserved).length;

  const balanceseat = totalSeats - reservedSeats;

  return (
    <div className="p-4 flex justify-center ml-16 md:ml-64">
      <div className="bg-[#d8cbd7]  w-full max-w-7xl rounded-3xl p-3 md:p-4 shadow-lg">
        <div className="bg-[#f3eff2] w-full text-black  flex-col md:flex-row justify-between items-center rounded-2xl p-6 shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col items-center  p-6  rounded-xl shadow-md">
              <span className="text-black text-xl">Total Seats</span>
              <span className="text-black text-4xl">{totalSeats}</span>
              <RiSofaFill className=" text-gray-300 text-5xl mt-2" />
            </div>

            <div className="flex flex-col items-center  p-6 rounded-xl shadow-md">
              <span className="text-black text-xl">Total Booked Seats</span>
              <span className="text-black text-4xl">{reservedSeats}</span>
              <RiSofaFill className="text-[#e64c67] text-5xl mt-2" />
            </div>

            <div className="flex flex-col items-center   p-6 rounded-xl shadow-md">
              <span className="text-black text-xl">Your Booked Seats</span>

              <span className="text-black text-4xl">{seatcount?.length}</span>

              <RiSofaFill
                className="text-5xl mt-2"
                style={{ color: `${staff.badgecolor}` }}
              />
            </div>

            <div className="flex flex-col items-center  p-6 rounded-xl shadow-md">
              <span className="text-black"></span>
              <span className="text-black text-xl">Available Seat</span>
              <span className="text-black text-4xl">{balanceseat}</span>
              <RiSofaFill className="text-[#e64c67] text-5xl mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {groupedColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-10">
                {column.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-6 gap-4 border border-gray-200 bg-gray-100 p-4 rounded-lg"
                  >
                    {row.map((seat, seatIndex) => {
                      let seatColor = "text-gray-300";
                      if (seat.status === "assigned")
                        seatColor = "text-red-500";
                      if (seat.status === "placement")
                        seatColor = "text-green-500";
                      if (seat.status === "wfh") seatColor = "text-yellow-500";
                      if (seat.status === "advisor")
                        seatColor = "text-blue-500";

                      return (
                        <div
                          key={seatIndex}
                          className={`flex justify-center items-center w-8 h-8 rounded-full ${seatColor} hover:scale-110 transition-transform duration-200`}
                        >
                          <div
                            className="absolute z group"
                            onClick={() =>
                              setcollectseat({ seatdata: seat?.isReserved })
                            }
                          >
                            <RiSofaFill
                              onClick={() => {
                                Setmodal(true);
                                setSelectedSeat(seat);
                              }}
                              className={`size-6 ${
                                seat?.isReserved &&
                                `text-[${seat?.staffId?.badgecolor}]`
                              }`}
                              style={{ color: `${seat?.staffId?.badgecolor}` }}
                            />

                            <span className="absolute -top-8 left-0 bg-black text-white text-xs rounded-lg px-1 py-0.5 hidden group-hover:block">
                              {seat.number} {seat.row}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {modal && (
        <Seatmodal
          selectedSeat={selectedSeat}
          isOpen={modal}
          onClose={closemodal}
        />
      )}
    </div>
  );
};

export default Seatbooking;
