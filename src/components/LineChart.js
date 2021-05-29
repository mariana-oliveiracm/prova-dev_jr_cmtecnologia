import React from "react";
import { Line } from "react-chartjs-2";

export default function LineChart({ dados }){

    return(
        <div>
            <div className="row col-lg-8 offset-lg-2 col-md-10 offset-md-1 col-sm-12 chart">
                <Line data={dados} />
            </div>
        </div>
    );
}