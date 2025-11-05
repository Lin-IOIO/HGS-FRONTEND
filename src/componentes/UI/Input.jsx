import React from 'react';
import './Input.css';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, required = false }) => {
    return (
        <div className="ui-form-group">
            <label className="ui-label">{label}</label>
            <input 
                type={type} 
                name={name} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder}
                required={required}
                className="ui-input-field"
            />
        </div>
    );
};

export default Input;