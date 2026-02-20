import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Edit } from '@carbon/icons-react';
import { useAdmin } from '../../contexts/AdminContext';

interface EditableTextProps {
  /** For UI labels: reads/writes via admin context automatically */
  labelKey?: string;
  /** For scenario data: caller provides value and save handler */
  value?: string;
  onSave?: (newValue: string) => void;
  /** Element to render as in view mode */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4';
  /** Enable multiline editing (textarea vs input) */
  multiline?: boolean;
  /** Additional className for the wrapper */
  className?: string;
  /** If true, render \n as <br/> in view mode */
  renderNewlines?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  labelKey,
  value: propValue,
  onSave: propOnSave,
  as: Tag = 'span',
  multiline = false,
  className = '',
  renderNewlines = false,
}) => {
  const { isAdminMode, getLabel, setLabel } = useAdmin();

  // Resolve current value
  const currentValue = labelKey ? getLabel(labelKey) : (propValue ?? '');

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const tapTimerRef = useRef<number[]>([]);

  // Sync edit value when current value changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditValue(currentValue);
    }
  }, [currentValue, isEditing]);

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== currentValue) {
      if (labelKey) {
        setLabel(labelKey, trimmed);
      } else if (propOnSave) {
        propOnSave(trimmed);
      }
    }
    setIsEditing(false);
  }, [editValue, currentValue, labelKey, setLabel, propOnSave]);

  const handleCancel = useCallback(() => {
    setEditValue(currentValue);
    setIsEditing(false);
  }, [currentValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Enter') {
        if (multiline) {
          if (e.ctrlKey) {
            e.preventDefault();
            handleSave();
          }
        } else {
          e.preventDefault();
          handleSave();
        }
      }
    },
    [handleSave, handleCancel, multiline],
  );

  // Double-click / double-tap to enter edit mode
  const handleActivate = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isAdminMode) return;
      e.stopPropagation();

      // Double-click detection for mouse
      if ('detail' in e && (e as React.MouseEvent).detail === 2) {
        setIsEditing(true);
        return;
      }

      // Double-tap detection for touch
      const now = Date.now();
      tapTimerRef.current.push(now);
      if (tapTimerRef.current.length > 2) {
        tapTimerRef.current = tapTimerRef.current.slice(-2);
      }
      if (tapTimerRef.current.length === 2) {
        const diff = tapTimerRef.current[1] - tapTimerRef.current[0];
        if (diff < 400) {
          setIsEditing(true);
          tapTimerRef.current = [];
        }
      }
    },
    [isAdminMode],
  );

  // --- Normal mode: render as-is ---
  if (!isAdminMode) {
    if (renderNewlines && currentValue.includes('\n')) {
      return (
        <Tag className={className}>
          {currentValue.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </Tag>
      );
    }
    return <Tag className={className}>{currentValue}</Tag>;
  }

  // --- Admin mode: editing ---
  if (isEditing) {
    const inputClasses =
      'bg-yellow-50 border-2 border-blue-400 rounded px-2 py-1 text-inherit font-inherit leading-inherit w-full focus:outline-none focus:ring-2 focus:ring-blue-300';

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`${inputClasses} min-h-[60px] resize-y ${className}`}
          rows={Math.max(2, editValue.split('\n').length)}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${inputClasses} ${className}`}
      />
    );
  }

  // --- Admin mode: viewing (with edit indicator) ---
  const viewContent = renderNewlines && currentValue.includes('\n')
    ? currentValue.split('\n').map((line, i, arr) => (
        <React.Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ))
    : currentValue;

  return (
    <Tag
      className={`relative inline group/editable cursor-pointer outline-dashed outline-1 outline-blue-300/60 rounded-sm hover:outline-blue-400 hover:bg-blue-50/30 transition-colors ${className}`}
      onClick={handleActivate}
      role="button"
      tabIndex={0}
      title="Double-click to edit"
    >
      {viewContent}
      <Edit size={12} className="inline-block ml-1 text-blue-400 opacity-0 group-hover/editable:opacity-70 transition-opacity align-super" />
    </Tag>
  );
};
