import { NavLink } from "react-router-dom";
import {
  Calendar,
  Bell,
  Users,
  FilePlus,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ doctor, isExpanded, setIsExpanded }) {
  const menuItems = [
    { name: "Appointments", icon: Calendar, path: "/appointments" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Patients", icon: Users, path: "/patients" },
    { name: "Prescription Upload", icon: FilePlus, path: "/prescriptions" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words.length > 1
      ? words[0][0] + words[1][0]
      : words[0][0];
  };

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen z-50
        flex flex-col justify-between
        transition-all duration-300 ease-in-out
        ${isExpanded
          ? "w-64 bg-white border-r-2 border-teal-600 shadow-xl"
          : "w-16 bg-teal-600"}
      `}
    >
      {/* TOP SECTION */}
      <div>
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180 text-teal-600" : "text-white"
            }`}
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-4 space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 mx-2 rounded-xl transition-all duration-200
                  ${
                    isExpanded
                      ? "text-gray-700 hover:bg-teal-50"
                      : "justify-center text-white hover:bg-teal-500"
                  }
                  ${
                    isActive
                      ? isExpanded
                        ? "bg-teal-100 text-teal-700"
                        : "bg-teal-500"
                      : ""
                  }`
                }
              >
                {/* Bold Icons */}
                <Icon size={24} strokeWidth={2.8} />

                {isExpanded && (
                  <span className="whitespace-nowrap font-medium">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="mb-6">
        {/* Logout */}
        <div className="px-2">
          <button
            className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200
            ${
              isExpanded
                ? "text-red-600 hover:bg-red-50"
                : "justify-center text-white hover:bg-red-500"
            }`}
          >
            <LogOut size={24} strokeWidth={2.8} />
            {isExpanded && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Doctor Profile */}
        <div
          className={`
            mt-4 mx-2 rounded-xl p-3 flex items-center gap-3 transition-all duration-300
            ${
              isExpanded
                ? "bg-teal-600 text-white"
                : "justify-center text-white"
            }
          `}
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-white text-teal-600 flex items-center justify-center font-semibold">
            {getInitials(doctor?.name)}
          </div>

          {isExpanded && (
            <div>
              <p className="text-sm font-medium">{doctor?.name}</p>
              <p className="text-xs opacity-80">
                {doctor?.specialization}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
