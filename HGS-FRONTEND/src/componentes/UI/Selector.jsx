import React from 'react';
import './Input.css'; 

const Selector = ({ label, name, value, onChange, options, required = false }) => {
    return (
        <div className="ui-form-group">
            <label className="ui-label">{label}</label>
            <select 
                name={name} 
                value={value} 
                onChange={onChange}
                required={required}
                className="ui-input-field ui-selector-field"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Selector;