import React from 'react';

const Card = ({ children, className = '', padding = '6', header, footer, ...props }) => {
  const paddingClasses = {
    '3': 'p-3',
    '4': 'p-4',
    '6': 'p-6',
    '8': 'p-8'
  };

  return (
    <div className={`github-card ${paddingClasses[padding]} ${className}`} {...props}>
      {header && (
        <div className="-m-6 mb-6 px-6 py-4 border-b border-github-border bg-github-canvas-subtle rounded-t-md">
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div className="-m-6 mt-6 px-6 py-4 border-t border-github-border bg-github-canvas-subtle rounded-b-md">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;