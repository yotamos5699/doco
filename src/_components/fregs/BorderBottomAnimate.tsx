export const BottomLineAnimation = ({ show, onHover }: { show: boolean; onHover: boolean }) => {
  return (
    <div
      className={`opacity-70 absolute   bottom-0 ${
        !show ? `w-0 ${onHover && "hover:w-full"}` : "w-full"
      }  transition-all duration-500 h-[1px] bg-slate-200`}
    ></div>
  );
};
