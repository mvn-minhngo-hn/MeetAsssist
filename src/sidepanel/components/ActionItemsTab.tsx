import { useState } from 'react';
import { Plus, Check, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionItemsTabProps {
  items: string[];
}

export default function ActionItemsTab({ items }: ActionItemsTabProps) {
  const [newItem, setNewItem] = useState('');
  const [localItems, setLocalItems] = useState<{ id: string; text: string; completed: boolean }[]>(
    items.map((text, index) => ({ id: `${index}`, text, completed: false }))
  );

  const handleAddItem = () => {
    if (newItem.trim()) {
      setLocalItems([...localItems, { id: Date.now().toString(), text: newItem.trim(), completed: false }]);
      setNewItem('');
    }
  };

  const handleToggleItem = (id: string) => {
    setLocalItems(localItems.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setLocalItems(localItems.filter((item) => item.id !== id));
  };

  const handleCopyToClipboard = () => {
    const text = localItems
      .map((item, index) => `${index + 1}. ${item.text}${item.completed ? ' ✓' : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4 space-y-3">
      {/* Header with Add and Copy */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Action Items</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyToClipboard}
            disabled={localItems.length === 0}
            className="h-8 px-2 text-xs gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy
          </Button>
        </div>
      </div>

      {/* Add New Item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add new action item..."
          className="flex-1 h-8 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          onClick={handleAddItem}
          size="sm"
          className="h-8 px-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Action Items List */}
      {localItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            No Action Items
          </div>
          <div className="text-xs text-muted-foreground">
            Add items above or let AI generate them
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {localItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-2 p-2 rounded-md border',
                item.completed
                  ? 'bg-muted/50 border-border opacity-60'
                  : 'bg-background border-border'
              )}
            >
              <button
                onClick={() => handleToggleItem(item.id)}
                className={cn(
                  'mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                  item.completed
                    ? 'bg-success border-success text-white'
                    : 'border-border hover:border-primary'
                )}
              >
                {item.completed && <Check className="w-3 h-3" />}
              </button>
              <span
                className={cn(
                  'flex-1 text-xs leading-relaxed',
                  item.completed
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                )}
              >
                {item.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteItem(item.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

