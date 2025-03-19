export default function useFieldArray<T>(
  name: string,
  setValues: (cb: (prev: any) => any) => void
) {
  const add = (newItem: T) => {
    setValues((prev: any) => ({
      ...prev,
      [name]: [...(prev[name] || []), newItem],
    }));
  };

  const remove = (index: number) => {
    setValues((prev: any) => ({
      ...prev,
      [name]: prev[name].filter((_: any, i: number) => i !== index),
    }));
  };

  // Append a new item to the array
  const append = (newItem: T) => {
    setValues((prev: any) => ({
      ...prev,
      [name]: [...(prev[name] || []), newItem],
    }));
  };

  return { add, remove, append };
}
