import { useRef, useEffect, ChangeEvent, KeyboardEvent, TextareaHTMLAttributes } from 'react';

export interface AutoGrowTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
}

/**
 * Auto-growing textarea component.
 *
 * @param value - The textarea value.
 * @param onChange - Change handler.
 * @param onKeyPress - Optional key press handler.
 * @param className - Optional CSS class.
 * @param placeholder - Optional placeholder.
 * @example
 * <AutoGrowTextarea
 *   className={styles.input}
 *   placeholder=""
 *   value={inputValue}
 *   onChange={e => setInputValue(e.target.value)}
 *   onKeyPress={handleInputKeyPress}
 * />
 */
export const AutoGrowTextarea: React.FC<AutoGrowTextareaProps> = ({
  value,
  onChange,
  onKeyPress,
  className,
  placeholder,
  ...rest
}) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const autoGrow = () => {
    const ta = ref.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  useEffect(() => {
    autoGrow();
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    autoGrow();
  };

  return (
    <textarea
      ref={ref}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyPress={onKeyPress}
      rows={1}
      style={{ overflow: 'hidden', resize: 'none' }}
      {...rest}
    />
  );
};