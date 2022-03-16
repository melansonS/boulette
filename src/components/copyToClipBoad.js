import React from 'react'
import "./copyToClipBoard.css";
import { IoClipboardOutline } from "react-icons/io5";

const CopyToClipBoard = ({value}) => {
    
    const handleClick = () => {
        navigator.clipboard.writeText(value);
    }

    return (
        <div className="copy-to-clipboard">
            <button title="Copy to clipboard" className='copy-button' onClick={handleClick}>
                <IoClipboardOutline />
            </button>
        </div>
    );
}

export default CopyToClipBoard