import React from "react";
const Header = ({
  title = "",
  description = "",
  actions,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode[];
}) => {
  return (
    <div className={"w-full p-2 flex justify-between items-center"}>
      <div className={"flex flex-col justify-center items-start"}>
        <span className={"text-2xl font-black"}>{title}</span>
        <span className={"text-xs"}>{description}</span>
      </div>
      <div className={"flex flex-row-reverse justify-end items-center gap-2"}>
        {actions?.map((action, index) => (
          <React.Fragment key={index}>{action}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Header;
