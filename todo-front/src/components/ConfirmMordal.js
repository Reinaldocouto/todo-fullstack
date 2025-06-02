// src/components/ConfirmModal.js
import React from "react";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Confirmação</h2>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <div className="modal-body" style={{ marginBottom: "16px" }}>
          {message}
        </div>
        <div className="modal-footer">
          <button className="secondary" onClick={onCancel}>
            Não
          </button>
          <button
            className="primary"
            onClick={onConfirm}
            style={{ marginLeft: "8px" }}
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
