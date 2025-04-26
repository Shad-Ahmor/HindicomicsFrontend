import React from 'react'
import '../css/ShineBorder.css';

export default function ShineBorder({ children }) {
    return (
        <div className="shine-border-wrapper" style={{margin:'5px'}}>
          <div className="shine-border-glow" />
          <div className="shine-border-content" >{children}</div>
        </div>
      );
}
