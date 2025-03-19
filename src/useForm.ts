import { useState } from "react";

type FormValues = Record<string, any>;
type ValidationRules<T> = Partial<
  Record<keyof T, (value: any) => string | null>
>;

export default function useForm<T extends FormValues>(
  initialValues: T,
  validation?: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [watchers, setWatchers] = useState<
    Record<string, (value: any) => void>
  >({});

  const validateField = (name: string, value: any) => {
    if (validation && validation[name as keyof T]) {
      return validation[name as keyof T]?.(value) || "";
    }
    return "";
  };

  const register = (name: string) => ({
    name,
    value: getNestedValue(values, name) || "",
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { value } = event.target;

      // Update values correctly (supports arrays & nested objects)
      setValues((prev) => {
        const newValues = { ...prev };
        setNestedValue(newValues, name, value);
        return newValues;
      });

      // Validate and update errors
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
  });

  const setValue = <T extends Record<string, any>>(
    name: keyof T | string,
    value: any
  ) => {
    setValues((prev) => {
      const keys = name.toString().split(".");
      const newValues = { ...prev };
      let current: any = newValues;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        const isNextArrayIndex = !isNaN(Number(nextKey));

        // If current[key] is missing, create an object or an array
        if (!(key in current) || current[key] === undefined) {
          current[key] = isNextArrayIndex ? [] : {};
        }

        current = current[key]; // Move deeper
      }

      // Finally, set the value
      current[keys[keys.length - 1]] = value;

      return newValues;
    });
  };

  const watch = (name: string): any => {
    return name.split(".").reduce((acc, key) => {
      if (Array.isArray(acc)) {
        const index = Number(key);
        return isNaN(index) ? acc[key] : acc[index];
      }
      return acc?.[key];
    }, values);
  };

  const handleSubmit =
    (callback: (values: T) => void) => (event: React.FormEvent) => {
      event.preventDefault();
      let valid = true;
      const newErrors: Partial<Record<keyof T, string>> = {};

      for (const key in validation) {
        const error = validateField(key, getNestedValue(values, key));
        if (error) {
          newErrors[key] = error;
          valid = false;
        }
      }
      setErrors(newErrors);
      if (!valid) return;
      callback(values);
    };
  // Reset form to initial values
  const reset = (newData?: T | null) => {
    setValues(newData ?? initialValues);
    setErrors({});
    setWatchers({});
  };
  return {
    values,
    errors,
    handleSubmit,
    register,
    setValues,
    watch,
    setValue,
    reset,
  };
}

// Helper to get nested values like `stocks.0.productName`
const getNestedValue = (obj: any, path: string) => {
  return path
    .split(".")
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

// Helper to set nested values like `stocks.0.productName`
const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  let current = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  });
  return obj;
};
