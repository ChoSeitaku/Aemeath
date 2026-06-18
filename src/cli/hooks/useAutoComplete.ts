/**
 * 命令自动补全 Hook
 * 提供 Tab 键自动补全功能
 */

import { useState, useCallback } from 'react';

export interface UseAutoCompleteOptions {
  commands: string[];
  enabled?: boolean;
}

export interface UseAutoCompleteResult {
  inputValue: string;
  completions: string[];
  completionIndex: number;
  setInputValue: (value: string) => void;
  handleTab: () => void;
  resetCompletions: () => void;
}

export function useAutoComplete(options: UseAutoCompleteOptions): UseAutoCompleteResult {
  const { commands, enabled = true } = options;
  const [inputValue, setInputValue] = useState('');
  const [completions, setCompletions] = useState<string[]>([]);
  const [completionIndex, setCompletionIndex] = useState(-1);

  const resetCompletions = useCallback(() => {
    setCompletions([]);
    setCompletionIndex(-1);
  }, []);

  const getCompletions = useCallback((input: string): string[] => {
    if (!enabled || !input.startsWith('/')) {
      return [];
    }

    const query = input.slice(1).toLowerCase();
    const matches = commands.filter(cmd => {
      const cmdName = cmd.replace('/', '').toLowerCase();
      return cmdName.startsWith(query);
    });

    return matches;
  }, [commands, enabled]);

  const handleTab = useCallback(() => {
    if (!enabled || !inputValue.startsWith('/')) {
      return;
    }

    const currentCompletions = getCompletions(inputValue);
    
    if (currentCompletions.length === 0) {
      return;
    }

    if (currentCompletions.length === 1) {
      // 只有一个匹配，直接补全
      setInputValue(currentCompletions[0] + ' ');
      resetCompletions();
    } else {
      // 多个匹配，循环显示
      const newIndex = (completionIndex + 1) % currentCompletions.length;
      setCompletionIndex(newIndex);
      setCompletions(currentCompletions);
      setInputValue(currentCompletions[newIndex]);
    }
  }, [inputValue, completionIndex, getCompletions, resetCompletions, enabled]);

  const handleChange = useCallback((value: string) => {
    setInputValue(value);
    
    // 输入变化时重新计算补全
    if (value.startsWith('/')) {
      const newCompletions = getCompletions(value);
      setCompletions(newCompletions);
      setCompletionIndex(-1);
    } else {
      resetCompletions();
    }
  }, [getCompletions, resetCompletions]);

  return {
    inputValue,
    completions,
    completionIndex,
    setInputValue: handleChange,
    handleTab,
    resetCompletions,
  };
}
