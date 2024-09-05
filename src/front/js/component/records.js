import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/records.css";

const Records = () => {
    return (
        <div className="table-responsive" id="conteinerRecords">
            <h1 className="tittleRecords">Estas en el component Records</h1>
            <table className="table rounded-3" id="recordsTable">
                <thead>
                    <tr>
                        <th className="thRecords" scope="col">#</th>
                        <th className="thRecords" scope="col">First</th>
                        <th className="thRecords" scope="col">Last</th>
                        <th className="thRecords" scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className="thRecords" scope="row">1</th>
                        <td className="tdRecords">Mark</td>
                        <td className="tdRecords">Otto</td>
                        <td className="tdRecords">@mdo</td>
                    </tr>
                    <tr>
                        <th className="thRecords" scope="row">2</th>
                        <td className="tdRecords">Jacob</td>
                        <td className="tdRecords">Thornton</td>
                        <td className="tdRecords">@fat</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Records;
