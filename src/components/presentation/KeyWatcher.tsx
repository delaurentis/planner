import React, { useRef, useCallback, useEffect } from 'react';

interface KeyWatcherProps {
  disabled?: boolean;
  className?: string;
  onKey?(key: string): void;
}

const KeyWatcher: React.FC<KeyWatcherProps> = (props) => {

  // We use this trick so that the callback can be memoized
  // but then it can call a handler that has access to fresh object props/state
  // rather than an earlier memo-ized version of the component
  // Once the new React useEvent hook is implemented, this won't be necessary
  const handleKey = (key: string) => { props.onKey?.(key); }
  const handleKeyRef = useRef(handleKey);
  useEffect(() => { handleKeyRef.current = handleKey; });

  // When the user is moused over an element, accept keyboard shortcuts
  // useCallback is important here because it creates a durable event handler
  // that we can reliably remove from the window when the mouse leaves
  // (even if the react component re-renders)
  const handleKeyPress = useCallback((event: any) => { handleKeyRef.current(event.key); }, []);
  const handleMouseEnter = () => {
    window.removeEventListener('keypress', handleKeyPress, true);
    window.addEventListener('keypress', handleKeyPress, true);
  }
  const handleMouseLeave = () => {
    window.removeEventListener('keypress', handleKeyPress, true);
  }

  // If this element is destroyed, then remove the event listener
  useEffect(() => {
    return () => { window.removeEventListener('keypress', handleKeyPress, true); }
  }, [handleKeyPress]);

  return (
    <div className={props.className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {props.children}
    </div>
  );
}

export default KeyWatcher;

