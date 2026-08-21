import React from "react";

function Button({ fun, label }) {
  return (
    <div>
      <button
        className="
        px-6 py-3
        bg-green-700
        hover:bg-green-800
        text-white
        font-semibold
        rounded-xl
        transition-all
        duration-300
        shadow-md
        hover:shadow-xl
      "
        onClick={fun}
      >
        {label}
      </button>
    </div>
  );
}

export default Button;
