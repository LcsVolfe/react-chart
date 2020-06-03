import React from "react";

export const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${payload[0].value}%`}</p>
            </div>
        );
    }

    return null;
};
