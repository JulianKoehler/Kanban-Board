export default function checkFormValidity([...inputValues]: string[]): boolean {
  console.log([...inputValues]);
  for (const value of inputValues) {
    
    if (value.trim().length < 1) {
      return false;
    }
  }
  return true;
}

/**
 * I don't want to limit the user too much in how he wants to use the app but at least advise him to
 * provide input for certain fields that are specified from outside of this function, for instace the
 * title of a board, a task, a subtask etc.
 */
