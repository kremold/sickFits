import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state onject for inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');
  useEffect(() => {
    // this function runs when the things that we are watching changes
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    let { value, name, type } = e.target; // destructuring the state
    if (type === 'number') {
      // console.log(value);
      // if input is of type number set it as number rather than a string that html forms return by default
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files; // give me the first thing out of e.target array and stick the value in there
    }

    setInputs({
      // copy the existing state
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    // make array, map over it, set values to null or empty, then create a object again
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want to surface from this custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
