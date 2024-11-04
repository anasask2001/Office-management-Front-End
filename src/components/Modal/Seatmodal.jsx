import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userInstance from "../../axios_interceptor/userAxios";
import { getIdfromToken } from "../../services/authService";

const SeatModal = ({ isOpen, onClose, selectedSeat }) => {
  const [selectedIntern, setSelectedIntern] = useState("");
  const [bookedIntern, setBookedIntern] = useState(null);
  const queryClient = useQueryClient();


  const id = getIdfromToken()

  const { data: staff  } = useQuery({
    queryKey: ["get_staff"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/profile/${id}`);
      return response.data;
    },
  });

  const { data: interns = [], error } = useQuery({
    queryKey: ["get_not_booked_intern"],
    queryFn: async () => {
      const response = await userInstance.get(`/staff/${staff.batch}/intern`);
      return response.data;
    },
  });

  useEffect(() => {
    if (selectedSeat._id) {
      const fetchBookedIntern = async () => {
        try {
          const response = await userInstance.get(
            `/staff/intern/${selectedSeat._id}`
          );
          setBookedIntern(response.data);
        } catch (error) {
          console.error("Error fetching booked intern details:", error);
        }
      };
      fetchBookedIntern();
    }
  }, [selectedSeat]);

  const { mutate: seat_book } = useMutation({
    mutationFn: async () => {
      
      const response = await userInstance.patch(
        `/staff/booking/${staff._id}/${selectedIntern}/${selectedSeat._id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_not_booked_intern"]);
      setSelectedIntern("");
      onClose();
    },
    onError: (error) => {
      console.error("Error updating seat booking:", error);
    },
  });

  const handleSubmit = () => {
    seat_book(selectedIntern);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4 sm:p-8">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-6">
    
        {selectedSeat.isReserved ? (
         <div className="text-center max-w-sm mx-auto">
         <h2 className="text-xl font-semibold text-red-600 mb-2">
           This seat is already booked
         </h2>
         
      
         <img 
           src={selectedSeat?.internId?.profileImg} 
           alt="Seat" 
           className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
         />
         
         <div className="text-left bg-gray-50 p-3 rounded-lg shadow-sm">
           <h3 className="text-lg font-bold text-gray-700 mb-2">Intern Details</h3>
           
           <p className="text-gray-600">
             <strong>Name: </strong>{selectedSeat?.internId?.firstname}{" "}
             {selectedSeat?.internId?.lastname}
           </p>
           
           <p className="text-gray-600">
             <strong>Email: </strong>{selectedSeat?.internId?.email || "N/A"}
           </p>
           
           <p className="text-gray-600">
             <strong>Stack: </strong>{selectedSeat?.internId?.stack || "N/A"}
           </p>
             
           <p className="text-gray-600">
             <strong>batch: </strong>{selectedSeat?.staffId?.batch?.batch_number || "N/A"}
           </p>
          
           <p className="text-gray-600">
             <strong>Advisor: </strong>{selectedSeat?.staffId?.firstname}{" "}
             {selectedSeat?.staffId?.lastname}
           </p>
         </div>
       
         <button
           onClick={onClose}
           className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
         >
           Close
         </button>
       </div>
       
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Seat Booking - {selectedSeat?.row}{selectedSeat?.number}
            </h2>

            {error && (
              <div className="text-red-500 text-sm">
                Error fetching interns
              </div>
            )}

            {/* Intern Selection */}
            <div>
  <label className="block text-lg text-gray-700 mb-2">
    Assign Intern
  </label>
  <select
    value={selectedIntern}
    onChange={(e) => setSelectedIntern(e.target.value)}
    className="w-full p-3 border border-gray-300 rounded-lg text-black" // Added 'text-black' here
  >
    <option value="" className="text-gray-500">
      Select Intern
    </option>
    {interns.map((intern) => (
      <option key={intern._id} value={intern._id} className="text-black">
        {intern.firstname} {intern.lastname}
      </option>
    ))}
  </select>
</div>


            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedIntern}
                className={`px-6 py-2 text-white rounded-lg transition ${
                  selectedIntern
                    ? "bg-[#13425c] hover:bg-[#e16a80] "
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Book Seat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatModal;
