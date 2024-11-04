import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import userInstance from "../../../axios_interceptor/userAxios";
import { getIdfromToken } from "../../../services/authService";

const Room = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedInternId, setSelectedInternId] = useState(null);

  const id = getIdfromToken();

  const { data: interns } = useQuery({
    queryKey: ["View_intern"],
    queryFn: async () => {
      const response = await userInstance.get(`/staff/intern/${id}`);
      return response.data;
    },
  });

  const { data: bookingData } = useQuery({
    queryKey: ["booking_history"],
    queryFn: async () => {
      const response = await userInstance.get(`/staff/${id}/history`);
      return response.data;
    },
  });

  const ongoing = bookingData?.filter((booking) =>
    booking.bookings.some((b) => b.isDelete === true)
  );

  const history = bookingData?.filter((booking) =>
    booking.bookings.some((b) => b.isDelete === false)
  );

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const {
    data: rooms = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get_rooms"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/room`);
      return response.data;
    },
  });


  const slots = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    const time = `${hour < 10 ? "0" : ""}${hour}:00:00`;
    return `${day}/${month}/${year},${time}`;
  });

  const handleBooking = async () => {
    if (!selectedRoom || !selectedSlot || !selectedInternId) {
      setBookingMessage("Please select a room, time slot, and intern.");
      return;
    }

    const bookingData = {
      staffId: id,
      internId: selectedInternId,
      starttime: selectedSlot,
      cabinId: selectedRoom._id,
    };

    try {
      const response = await userInstance.post("/staff/booking", bookingData);
      setBookingMessage(response.data.message);
      setSelectedRoom(null);
      setSelectedSlot(null);
      setSelectedInternId(null);
      setShowModal(false);
    } catch (error) {
      setBookingMessage(error.response?.data?.message || "Booking failed.");
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center text-red-500">Error loading rooms</div>;

  return (
    <div className="p-4 flex justify-center ml-16 md:ml-64">
      <div className="bg-[#d8cbd7]  w-full max-w-7xl rounded-3xl p-3 md:p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full min-h-[250px] bg-[#f1f3f5] p-4 shadow-md rounded-lg">
            <h2 className="text-2xl text-black font-bold mb-4">Select a Room</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="relative group p-4 text-center rounded-md cursor-pointer bg-blue-100 hover:bg-blue-200 transition duration-200 ease-in-out transform hover:scale-105"
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowModal(true);
                  }}
                >
                  <span className="font-semibold">{room.name}</span>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-40 p-2 text-xs bg-gray-800 text-white rounded-lg shadow-lg">
                    <p>Type: {room.type}</p>
                    <p>Capacity: {room.capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full bg-[#f1f3f5] p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-black">Available Slots</h3>
            <div className="grid grid-cols-3 text-black sm:grid-cols-4 gap-2 mb-4">
              {slots.map((slot, index) => {
                const timeString = slot.split(",")[1];
                const slotDate = new Date(`${year}-${month}-${day}T${timeString}`);
                const isPast = slotDate < new Date(); 

                const [hour, minute] = timeString.split(":");
                const hour12 = hour % 12 || 12;
                const ampm = hour < 12 ? "AM" : "PM";
                const formattedTime = `${hour12}:${minute} ${ampm}`;

                return (
                  <button
                    key={index}
                    className={`p-2 text-center rounded-lg ${
                      isPast
                        ? "bg-red-300 cursor-not-allowed" 
                        : selectedSlot === slot
                        ? "bg-green-300"
                        : "bg-gray-200 hover:bg-gray-300 transition duration-200" 
                    }`}
                    onClick={() => {
                      if (!isPast) {
                        setSelectedSlot(slot);
                      }
                    }}
                    disabled={isPast} 
                  >
                    {formattedTime}
                  </button>
                );
              })}
            </div>

            <button
              className="bg-[#13425c] hover:bg-[#1a4b6d] text-white p-2 rounded-lg transition duration-200"
              onClick={handleBooking}
            >
              Book now
            </button>

            {bookingMessage && <div className="mt-4 text-red-500">{bookingMessage}</div>}
          </div>

          <div className="w-full min-h-[250px] bg-[#f1f3f5] p-4 shadow-md rounded-lg">
            <h2 className="text-2xl text-black font-bold mb-4">Ongoing Booking History</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 scroll-auto">
              {ongoing && ongoing.length > 0 ? (
                ongoing.map((booking) => (
                  <div key={booking._id} className="p-4 text-black bg-blue-100 rounded-lg shadow-md">
                    <p><strong>Room:</strong> {booking.name}</p>
                    {booking.bookings && booking.bookings.length > 0 ? (
                      booking.bookings.map((timeEntry, index) => (
                        <div key={index}>
                          <p className="flex">
                            <strong>Date:</strong> {new Date(timeEntry.startTime).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Time:</strong>
                            {new Date(timeEntry.startTime).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Kolkata",
                            })}
                          </p>
                          <p><strong>Completed:</strong> Pending</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No booking times available</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center col-span-2 text-gray-500">No booking history available</p>
              )}
            </div>
          </div>

          <div className="w-full min-h-[250px] bg-[#f1f3f5] p-4 shadow-md rounded-lg">
            <h2 className="text-2xl text-black font-bold mb-4">Completed Booking History</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 scroll-auto">
              {history && history.length > 0 ? (
                history.map((booking) => (
                  <div key={booking._id} className="p-4 text-black bg-green-100 rounded-lg shadow-md">
                    <p><strong>Room:</strong> {booking.name}</p>
                    {booking.bookings && booking.bookings.length > 0 ? (
                      booking.bookings.map((timeEntry, index) => (
                        <div key={index}>
                          <p className="flex">
                            <strong>Date:</strong> {new Date(timeEntry.startTime).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Time:</strong>
                            {new Date(timeEntry.startTime).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Kolkata",
                            })}
                          </p>
                          <p><strong>Completed:</strong> Completed</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No booking times available</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center col-span-2 text-gray-500">No booking history available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg text-black font-semibold mb-2">Select an Intern</h3>
            <ul className="max-h-48 overflow-y-auto">
              {interns?.map((intern) => (
                <li
                  key={intern._id}
                  className="p-2 cursor-pointer text-black hover:bg-gray-200 transition duration-200"
                  onClick={() => {
                    setSelectedInternId(intern._id);
                    setShowModal(false);
                  }}
                >
                  {intern.firstname}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
