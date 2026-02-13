import React from 'react';
import { Plus, X } from 'lucide-react';
import { EditableText } from './EditableText';
import { useAdmin } from '../../contexts/AdminContext';

interface EditableListProps {
  items: string[];
  onSave: (newItems: string[]) => void;
  /** Render function for each item in normal mode (caller's existing rendering) */
  renderItem: (item: string, index: number) => React.ReactNode;
  /** Class for the list container */
  className?: string;
}

export const EditableList: React.FC<EditableListProps> = ({
  items,
  onSave,
  renderItem,
  className = '',
}) => {
  const { isAdminMode } = useAdmin();

  // Normal mode: render items using caller's render function
  if (!isAdminMode) {
    return (
      <div className={className}>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>
        ))}
      </div>
    );
  }

  // Admin mode: editable items with add/remove
  const handleItemSave = (index: number, newValue: string) => {
    const updated = [...items];
    updated[index] = newValue;
    onSave(updated);
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onSave(updated);
  };

  const handleAdd = () => {
    onSave([...items, 'New item']);
  };

  return (
    <div className={className}>
      {items.map((item, idx) => (
        <div key={idx} className="group/listitem relative flex items-start gap-1">
          <div className="flex-1 min-w-0">
            <EditableText
              value={item}
              onSave={(v) => handleItemSave(idx, v)}
              as="span"
              multiline={item.length > 80}
            />
          </div>
          <button
            type="button"
            onClick={() => handleDelete(idx)}
            className="shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center opacity-0 group-hover/listitem:opacity-100 transition-opacity mt-0.5"
            title="Remove item"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
      >
        <Plus className="w-3 h-3" />
        Add item
      </button>
    </div>
  );
};
