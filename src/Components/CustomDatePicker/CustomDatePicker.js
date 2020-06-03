import React from "react";

const CustomDatePicker = ({ value, onChange }) => {

    return (
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ border: "solid 1px pink" }}
        />
    );
}
export default CustomDatePicker;
