import { useEffect, useState } from "react";

export default function WelcomeCard({ doctor, appointmentsToday = 0 }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        p-10
        min-h-[240px]
        flex
        justify-between
        items-center
        bg-gradient-to-r
        from-teal-700
        via-teal-600
        to-teal-500
        text-white
        shadow-lg
      "
    >
      {/* LEFT SECTION */}
      <div className="flex flex-col justify-between h-full z-10">

        {/* Compact Date + Time */}
        <div className="text-xs opacity-90 tracking-wide">
          {formattedDate} • {formattedTime}
        </div>

        {/* Greeting + Appointments */}
        <div className="mt-4">
          <h1 className="text-3xl font-semibold">
            {getGreeting()}, {doctor?.name}
          </h1>

          <p className="text-sm mt-3 opacity-90">
            {appointmentsToday} appointments today
          </p>
        </div>
      </div>

      {/* RIGHT ANIMATION SECTION */}
      <div className="relative w-64 h-full flex items-center justify-center">

        <div className="relative w-40 h-40">

          {/* Outer Rotating Ring 1 */}
          <div className="absolute inset-0 border-4 border-white/30 rounded-2xl animate-rotate-slow"></div>

          {/* Outer Rotating Ring 2 */}
          <div className="absolute inset-3 border-4 border-white/40 rounded-2xl animate-rotate-reverse"></div>

          {/* Static Inner Box */}
          <div className="absolute inset-8 bg-white/20 rounded-2xl backdrop-blur-sm"></div>

        </div>

      </div>
    </div>
  );
}
