import React from "react";

const Input_Component = ({type, name, value, placeholder,setFieldValue, width, height, borderRadius,touched,error }) => {

  return (
    <div>
      <input
      type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setFieldValue(name, e.target.value)}
        style={{
          width: width || "100%", 
          height: height || "40px",
          borderRadius: borderRadius || "8px",
          padding: "8px",
          border: "1px solid #ccc",
          
        }}/>
        {touched && error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
    </div>
  );
};

export default Input_Component;
