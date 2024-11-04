import React from "react";
import tw from "tailwind-styled-components";

const Button = tw.button`
  relative inline-flex items-center justify-center text-center
  cursor-pointer select-none rounded-md
  ${props => props.h ? `h-${props.h}` : "h-10"}
  ${props => props.w ? `w-${props.w}` : "w-auto"}
  px-6
  ${props => 
    props.size === "sm" ? "text-sm" : 
    props.size === "md" ? "text-base" : 
    props.size === "lg" ? "text-lg" : 
    "text-sm"}
  ${props => 
    props.variant === "primary" ? "bg-[#12415d] text-white hover:bg-[#e16a80]" : 
    props.variant === "warning" ? "bg-red-600 text-white hover:bg-red-500" : 
    props.variant === "secondary" ? "bg-white text-black hover:bg-gray-200" : 
    props.variant === "remove" ? "bg-[#d8cbd7] text-red-400 hover:bg-gray-200" : 
     "bg-white text-black hover:bg-gray-200" }
`;

const ButtonComponent = ({
  type = "button",
  variant = "primary",
  className = "",
  size = "sm",
  id,
  onClick,
  children,
  ariaLabel,
  h, 
  w,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      className={`btn-component ${className}`}
      id={id}
      size={size}
      onClick={onClick}
      aria-label={ariaLabel}
      h={h} 
      w={w} 
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
