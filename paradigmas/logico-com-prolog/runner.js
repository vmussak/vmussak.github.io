import { runProlog } from './engine.js';

// A separate thread keeps even an experimental recursive query interruptible.
self.onmessage = ({ data }) => {
  try {
    self.postMessage(runProlog(data.program, data.query, {
      maxSteps: 4000, maxDepth: 65, maxSolutions: 30, maxTrace: 800
    }));
  } catch (error) {
    self.postMessage({ solutions: [], trace: [], error: error.message });
  }
};
