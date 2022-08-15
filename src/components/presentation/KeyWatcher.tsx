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
  const handleKeyDown = useCallback((event: any) => { 
    // Only key up and key down get special keys (not key press)
    if ( event.key === 'Escape' || event.key?.indexOf('Arrow') >= 0 ) {
      handleKeyRef.current(event.key);
    }
  }, []);

  // When the user mouses over the element, start listening for keyboard shortcuts
  // We listen for onKeyDown to catch the escape key
  const handleMouseEnter = () => {
    document.removeEventListener('keypress', handleKeyPress, true);
    document.removeEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keypress', handleKeyPress, true);
    document.addEventListener('keydown', handleKeyDown, true);
  }
  const handleMouseLeave = () => {
    document.removeEventListener('keypress', handleKeyPress, true);
    document.removeEventListener('keydown', handleKeyDown, true);
  }

  // If this element is destroyed, then remove the event listener
  useEffect(() => {
    return () => { 
      document.removeEventListener('keypress', handleKeyPress, true); 
      document.removeEventListener('keydown', handleKeyDown, true); 
    }
  }, [handleKeyPress, handleKeyDown]);

  return (
    <div className={props.className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {props.children}
    </div>
  );
}

export default KeyWatcher;

