import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/homeUser.css";

const HomeUser = () => {
  return (
    <div className="table-responsive rounded-3" id="tableHomeUser">
      <h1 className="tittleHomeUser">Estas en el component Home user</h1>
      <table className="table rounded-3 " id="tableRecordHomeUser">
        <thead>
          <tr>
            <th className="thHomeUser" scope="col">#</th>
            <th className="thHomeUser" scope="col">First</th>
            <th className="thHomeUser" scope="col">Last</th>
            <th className="thHomeUser" scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="thHomeUser" scope="row">1</th>
            <td className="tdHomeUser">Mark</td>
            <td className="tdHomeUser">Otto</td>
            <td className="tdHomeUser">@mdo</td>
          </tr>
          <tr>
            <th className="thHomeUser" scope="row">2</th>
            <td className="tdHomeUser">Jacob</td>
            <td className="tdHomeUser">Thornton</td>
            <td className="tdHomeUser">@fat</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HomeUser;
