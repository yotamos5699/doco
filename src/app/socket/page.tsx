"use client";
export default function page() {
  const url = window.location;
  return (
    <div className="p4">
      <div>
        {url.protocol}//{url.host}?id=214141
      </div>
      {/* {Object.keys(url).map((k) => (
        <div className={`grid grid-cols-2`}>
          <div>{k}</div>
          <div>{url[k as keyof typeof url]}</div>
        </div>
      ))} */}
    </div>
  );
}
