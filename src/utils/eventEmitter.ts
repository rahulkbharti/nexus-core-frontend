// src/utils/eventEmitter.js

type EventListener = (data: any) => void;

type EventsMap = {
  [event: string]: EventListener[];
};

const eventEmitter = {
  events: {} as EventsMap,

  // A component will use this to listen for a message
  on(event: string, listener: EventListener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  },

  // Your global function will use this to send a message
  emit(event: string, data: any) {
    if (this.events[event]) {
      this.events[event].forEach((listener: EventListener) => listener(data));
    }
  },
};

export default eventEmitter;
