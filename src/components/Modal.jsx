import React from 'react';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md w-full">
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        {children}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="success" onClick={onSave}>Save</Button>
          <Button variant="default" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};