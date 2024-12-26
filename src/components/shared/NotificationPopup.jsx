import React from "react";
import { CheckCircle } from "lucide-react";
export function NotificationPopup({ message, isVisible }) {
  return isVisible ? (
    <div className="popup">
      <div className="flex items-center gap-2 rounded-lg bg-[#9C27B0] px-4 py-3 text-white shadow-lg">
        <CheckCircle className="h-5 w-5" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  ) : null;
}
