import { useState } from "react";

export function Switch({ defaultChecked = false, onChange }) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState); // Notify parent component of the change
    }
  };

  return (
    <button
      className={`relative w-14 h-7 flex items-center rounded-full transition-all duration-300 
        ${isChecked ? "bg-green-600" : "bg-gray-400"}
      `}
      onClick={handleToggle}
    >
      {/* Switch Knob */}
      <div
        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300
          ${isChecked ? "translate-x-7" : "translate-x-1"}
        `}
      ></div>
    </button>
  );
}