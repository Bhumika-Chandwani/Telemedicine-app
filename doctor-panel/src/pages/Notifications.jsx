import { useState } from "react";

export default function Notifications() {
  const [filter, setFilter] = useState("All");

  const notificationsData = [
    {
      id: 1,
      title: "New Appointment Booked",
      message: "A new patient has booked an appointment for 3:00 PM.",
      time: "10 mins ago",
      type: "Appointment",
      read: false,
    },
    {
      id: 2,
      title: "System Maintenance",
      message: "Scheduled maintenance on October 25 may cause slight delays.",
      time: "1 hour ago",
      type: "System",
      read: true,
    },
    {
      id: 3,
      title: "Medical Update Released",
      message: "New research guidelines on hypertension have been published.",
      time: "Yesterday",
      type: "Update",
      read: false,
    },
  ];

  const filteredNotifications =
    filter === "All"
      ? notificationsData
      : notificationsData.filter((n) =>
          filter === "Unread" ? !n.read : n.read
        );

  return (
    <div className="min-h-screen bg-slate-100 p-8 karla-font">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-black">Notifications</h1>
        <p className="text-sm text-black/60 mt-1">
          Stay updated with important alerts and system messages
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {["All", "Unread", "Read"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`
              px-4 py-2 rounded-lg text-sm transition-all
              ${
                filter === type
                  ? "bg-teal-600 text-white"
                  : "bg-teal-50 text-black hover:bg-teal-100"
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications Container */}
      <div className="space-y-4">

        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              relative
              bg-teal-50/40
              border border-teal-500/30
              rounded-2xl
              p-5
              transition-all
              hover:bg-white
              hover:shadow-sm
              ${
                !notification.read
                  ? "border-l-4 border-l-teal-600 bg-teal-100/40"
                  : ""
              }
            `}
          >

            {/* Top Row */}
            <div className="flex justify-between items-start mb-2">

              <div className="flex items-center gap-3">
                <span
                  className="
                    text-xs
                    bg-teal-100
                    text-teal-700
                    px-2 py-[2px]
                    rounded-md
                  "
                >
                  {notification.type}
                </span>

                <h3
                  className={`
                    text-[15px]
                    ${
                      !notification.read
                        ? "text-black font-medium"
                        : "text-black"
                    }
                  `}
                >
                  {notification.title}
                </h3>
              </div>

              <span className="text-xs text-black/60 whitespace-nowrap">
                {notification.time}
              </span>

            </div>

            {/* Message */}
            <p className="text-sm text-black/70">
              {notification.message}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}
