import React from "react";

interface ILoaderProps {
  fullScreen?: boolean;
}

const Loader: React.FC<ILoaderProps> = ({fullScreen}) => {
  const parentClass = fullScreen ? "w-screen h-screen grid place-items-center" : "grid place-items-center";
  return (
    <div className={parentClass}>
      <span className="material-symbols-outlined animate-spin text-white text-3xl">progress_activity</span>
    </div>
  );
};


export default Loader;