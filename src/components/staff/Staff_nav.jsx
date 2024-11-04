import React, { useState } from "react";
import IMG from "../../asset/Logo.png";
import { IoIosSettings, IoIosNotifications } from "react-icons/io";
import { CiMenuBurger } from "react-icons/ci";
import { CiCircleAlert } from "react-icons/ci";
import { MdMeetingRoom, MdClose } from "react-icons/md";
import { RiDashboard3Line } from "react-icons/ri";
import { MdManageAccounts, MdEventSeat, MdVideocam } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Menu, MenuButton, MenuItem } from "@headlessui/react";
import Staff_dashboard from "../../pages/staff/dashboard/Staff_dashboard";
import View_intern from "../../pages/staff/viewintern/View_intern";
import { useQuery } from "@tanstack/react-query";
import { getIdfromToken } from "../../services/authService";
import userInstance from "../../axios_interceptor/userAxios";
import Seatbooking from "../../pages/staff/Seat/Seatbooking";
import Room from "../../pages/staff/room/Room";

const Staff_nav = () => {
  const Navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const staffid = getIdfromToken();

  const { data } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await userInstance.get(`/admin/profile/${staffid}`);
      return response.data;
    },
  });

  const signout = () => {
    localStorage.clear();
    Navigate("/");
  };

  const { url } = useParams();

  const datas = [
    { name: "Dashboard", icon: <RiDashboard3Line />, url: "dashboard" },
    { name: "View Intern", icon: <MdManageAccounts />, url: "viewintern" },
    { name: "Book Seat", icon: <MdEventSeat />, url: "seats" },
    { name: "Book Cabin", icon: <MdMeetingRoom />, url: "rooms" },
    { name: "Video Conference", icon: <MdVideocam />, url: "videoconference" },
    { name: "Message", icon: <FaMessage />, url: "message" },
  ];

  return (
    <div className="min-h-screen flex bg-[#DADFEF]">
      <header className="md:flex fixed hidden w-[100%] h-[80px] z-10 bg-[#FFFDFD] shadow-sm p-1 justify-between items-center">
        <div className="flex gap-10 justify-center items-center">
          <img src={IMG} alt="Logo" className="w-40 md:ml-10 h-14" />
          <div className="lg:block hidden ml-10">
            <h1 className="text-2xl font-semibold">Hello, Staff</h1>
            <p className="text-sm">Have a nice day</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 bg-gray-200 w-[400px] focus:outline-none rounded-2xl"
        />

        <div className="flex items-center space-x-2 mr-10">
          <div className="border-black border-r-2 flex gap-4 h-[40px] w-[100px] justify-center items-center">
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex focus:ring-white">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <IoIosSettings className="text-2xl" title="Settings" />
                </MenuButton>
              </div>
              <Menu.Items
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none"
              >
                <MenuItem>
                  <a
                    onClick={() => setOpen(true)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={signout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </Menu.Items>
            </Menu>

            <IoIosNotifications
              title="Notifications"
              onClick={() => setOpenNotification(true)}
              className="text-2xl cursor-pointer"
            />
          </div>
          <span className="lg:block hidden">
            {data?.firstname}
            {data?.lastname}
          </span>
          <img
            src={data?.profileImg}
            alt="Staff"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      {openNotification && (
        <div className="fixed top-0 right-0 z-50 flex flex-col items-center justify-center gap-2 h-screen w-full bg-black bg-opacity-50 transition-transform duration-500 ease-out">
          <div className="pt-10 flex items-center flex-col absolute w-[300px] right-0 top-0 bg-white h-screen">
            <MdClose
              onClick={() => setOpenNotification(false)}
              className="absolute right-0 top-0 text-3xl rounded-lg mt-3 hover:bg-gray-200 mr-2 p-2 cursor-pointer"
            />
            {Array(3)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="mt-2 flex justify-between hover:bg-gray-200 items-center font-bold h-[50px] w-[250px] p-2 rounded-lg shadow-sm"
                >
                  <CiCircleAlert className="text-2xl" />
                  <span>Notification {index + 1}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="md:hidden visible bg-[#FFFDFD] h-[80px] justify-between items-center flex w-[100%] fixed">
        <img src={IMG} alt="Logo" className="w-40 ml-1" />
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 bg-gray-200 w-[400px] rounded-lg focus:outline-none"
        />
        <div className="flex gap-3 justify-center items-center mr-1">
          <CiMenuBurger
            onClick={() => setOpen(!open)}
            className="text-3xl font-bold transition-all duration-300"
          />
        </div>
      </div>

      {open && (
        <div className="fixed right-0 w-[300px] h-[100%] transition-all duration-300 bg-[#FFFDFD] flex flex-col gap-4 p-2">
          <div className="flex justify-end">
            <MdClose onClick={() => setOpen(false)} className="text-2xl" />
          </div>
          <img
            src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
            alt="Staff"
            className="w-10 h-10 rounded-full"
          />

          <div className="flex gap-4 h-[40px] w-[100px] justify-center items-center">
            <IoIosSettings className="text-2xl" />
          </div>
          <div className="p-1 flex flex-col gap-2">
            {datas.map((x, index) => (
              <div
                key={index}
                className="bg-[#13425c] flex justify-between p-1 items-center text-white font-bold h-[50px] rounded-lg shadow-sm hover:bg-[#e64c67]"
              >
                <span className="text-2xl">{x.icon}</span>
                <span>{x.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex mt-[80px] w-full">
        <aside
          className={`${
            sideBar ? "w-64" : "w-16"
          } md:w-64 bg-[#FFFDFD] md:p-5 p-1 fixed transition-all duration-300 h-[100vh] shadow-lg`}
        >
          <nav className="space-y-3 flex flex-col gap-4 justify-center m-auto">
            {datas.map((e, index) => (
              <Link
                to={`/staff/${e.url}`}
                onClick={() => setSideBar(!sideBar)}
                key={index}
                className={`flex justify-center gap-3 items-center md:py-2 md:px-4 rounded-lg bg-[#13425c] text-white transition-all duration-300 h-[45px] md:w-[200px] w-full hover:bg-[#e16a80] ${
                  url === e.url && "bg-[#e64c67]"
                }`}
              >
                <div>{e.icon}</div>
                <span className={`${sideBar ? "block" : "hidden md:block"}`}>
                  <div className="w-[150px]">{e.name}</div>
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="overflow-auto justify-center items-center text-white w-[100%]">
          {url === "dashboard" ? (
            <Staff_dashboard />
          ) : url === "viewintern" ? (
            <View_intern />
          ) : url === "seats" ? (
            <Seatbooking />
          ):url === "rooms" ?(
            <Room/>
          ):(
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staff_nav;
