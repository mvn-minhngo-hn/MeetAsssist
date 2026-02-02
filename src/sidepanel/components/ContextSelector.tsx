import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExtensionStore } from '@/store/useExtensionStore';
import type { ContextType } from '@/types';

const contextOptions: { value: ContextType; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'business', label: 'Business' },
  { value: 'general', label: 'General' },
];

interface ContextSelectorProps {
  context: ContextType;
  onContextChange?: (context: ContextType) => void;
}

export default function ContextSelector({ context, onContextChange }: ContextSelectorProps) {
  const { setContext } = useExtensionStore();

  const handleChange = (value: ContextType) => {
    setContext(value);
    onContextChange?.(value);
  };

  return (
    <Select value={context} onValueChange={handleChange}>
      <SelectTrigger className="w-[100px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {contextOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

