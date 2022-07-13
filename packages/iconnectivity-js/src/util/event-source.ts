/** Creates an event system that others can subscribe to */
export const createEventSource = <T extends (...args: any) => void>() => {
  let listeners: T[] = [];

  const addListener = (listener: T) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const emit = (...args: Parameters<T>) => {
    listeners.forEach((listener) => {
      try {
        listener(...(args as any));
      } catch (e: any) {
        console.error("Error in event listener:", { message: e.message });
      }
    });
  };

  return { addListener, emit };
};
