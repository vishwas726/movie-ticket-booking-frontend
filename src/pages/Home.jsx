import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  const { setToken, token } = useContext(AuthContext);

  const [allSeatData, setAllSeatData] = useState({
    totalSeats: 0,
    bookedSeats: [],
    availableSeats: [],
  });

  const [featechBool, setFeatechBool] = useState(true);

  const [seats, setSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [userData, setUserData] = useState([]);

  const onLogout = () => {
    setToken("");
    Cookies.remove("token");
    toast.success("Logout Successfull");
  };

  const movieId = "682fe844411e25794cda5518";

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/bookings/user",
          {
            headers: {
              authorization: "Bearer " + token,
            },
          }
        );
        setUserData(res.data.booking);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserBookings();
  }, []);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + `/api/bookings/${movieId}/seats`
        );
        setAllSeatData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSeatData();
  }, [featechBool]);

  const lockSeats = async (selectedSeats) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/bookings/lock",
        {
          movieId,
          seats: selectedSeats,
        },
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );
      setLockedSeats(res.data.lockedSeats || []);
      toast.success("Seats locked!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to lock seats");
      setSeats([]); // Reset selection if locking fails
    }
  };

  const onSeatClick = (index) => {
    const seatNum = index + 1;
    setSeats((prev) => {
      const newSeats = prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum];
      lockSeats(newSeats); // lock seats after every change
      return newSeats;
    });
  };

  const onBook = async () => {
    try {
      if (!seats.length) {
        toast.error("Select Seats.");
        return;
      }

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/bookings",
        {
          movieId,
          seats,
        },
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setFeatechBool(!featechBool);
      setSeats([]);
      setLockedSeats([]);
      toast.success("Seats Are Booked");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Booking Failed");
    }
  };

  return (
    <div className="mb-20">
      <div className="mt-10 mx-4">
        <div className="flex items-center justify-between">
          <p className="text-emerald-700 font-bold">
            Total Seats : {allSeatData.totalSeats}
          </p>
          <p className="text-emerald-700 font-bold">
            Available Seats : {allSeatData.availableSeats.length}
          </p>
          <p className="text-emerald-700 font-bold">
            Booked Seats : {allSeatData.bookedSeats.length}
          </p>
          <button
            className="rounded bg-black hover:opacity-70 cursor-pointer text-white p-4"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>

        <h1 className="text-[2rem] font-medium text-center">
          Book Movie Ticket
        </h1>
      </div>

      <div className="grid grid-cols-10 gap-2 p-4 mx-auto max-w-[1200px]">
        {[...Array(100)].map((_, index) => {
          const seatNum = index + 1;
          const isBooked = allSeatData.bookedSeats.includes(seatNum);
          const isSelected = seats.includes(seatNum);

          return (
            <button
              key={index}
              disabled={isBooked}
              onClick={() => onSeatClick(index)}
              className={`p-1 text-white text-center rounded cursor-pointer ${
                isBooked
                  ? "bg-slate-600"
                  : isSelected
                  ? "bg-pink-500"
                  : "bg-blue-500"
              }`}
            >
              {seatNum}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center mt-4">
        <button
          className="rounded bg-black text-white p-4"
          onClick={onBook}
        >
          Book Now
        </button>
      </div>

      <h2 className="text-center mt-10 mb-6 text-[2rem] font-bold text-gray-600">
        My Booked Seats
      </h2>

      <div className="flex flex-col gap-6">
        {userData?.map((item, index) => (
          <div className="p-4 bg-slate-100 mx-4" key={index}>
            <div className="space-y-3">
              <p>{item.movieId.description}</p>
              <p>{item.movieId.showTime}</p>
              <p>Booked At : {item.bookedAt}</p>
              <p>
                {item.seats.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-white bg-black p-1 mx-2 rounded"
                  >
                    {s}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
