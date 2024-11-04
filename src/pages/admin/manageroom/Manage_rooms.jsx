import { useQuery } from "@tanstack/react-query";
import React from "react";
import userInstance from "../../../axios_interceptor/userAxios";

const Manage_rooms = () => {
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

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return <div className="text-center text-red-500">Error loading rooms</div>;

  return (
    <div className="p-4 flex justify-center ml-16 md:ml-64">
      <div className="bg-[#d8cbd7] w-full max-w-7xl rounded-3xl p-3 md:p-4 shadow-lg">
        <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
          <div className="w-full min-h-[250px] bg-[#f1f3f5] p-4 shadow-md rounded-lg">
            <h2 className="text-2xl text-black font-bold mb-4">Available Rooms</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="p-4 text-center rounded-md bg-blue-100 hover:bg-blue-200 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  <span className="font-semibold">{room.name}</span>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>Type: {room.type}</p>
                    <p>Capacity: {room.capacity}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
          <div className="w-full min-h-[250px] bg-[#f1f3f5] p-4 shadow-md rounded-lg">
            <h2 className="text-2xl  text-black font-bold mb-4">Create Rooms</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage_rooms;
