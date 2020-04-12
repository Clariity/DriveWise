import React from "react";
import RouteInputRow from "./RouteInputRow";

export default function RouteWindow() {
  return (
    <div className="route-window">
      <RouteInputRow direction="from" />
      <RouteInputRow direction="to" />
    </div>
  );
}
