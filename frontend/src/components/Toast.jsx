import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-github-text-success" size={20} />,
    error: <XCircle className="text-github-text-danger" size={20} />,
    info: <Info className="text-github-accent" size={20} />
  };

  const bgColors = {
    success: 'bg-github-success/20 border-github-success/30',
    error: 'bg-github-danger/20 border-github-danger/30',
    info: 'bg-github-accent/20 border-github-accent/30'
  };

  return (
    <div className={`fixed top-4 right-4 github-card p-4 max-w-sm z-50 animate-slide-up ${bgColors[type]}`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm font-medium text-github-text">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-github-text-secondary hover:text-github-text transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;