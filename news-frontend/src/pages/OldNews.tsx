import React from "react";
import OldNews from "../components/OldNews";

const OldNewsPage: React.FC = () => {
  return (
    <div className="container-fluid px-0">
      <div className="container-fluid">
        <OldNews showAll={true} />
      </div>
    </div>
  );
};

export default OldNewsPage;
