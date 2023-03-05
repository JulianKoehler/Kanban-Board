export default function checkFormValidity([...inputValues]: string[]): boolean {
  for (const value of inputValues) {
    if (value.trim().length < 1) {
      return false;
    }
  }
  return true;
}
