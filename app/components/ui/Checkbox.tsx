import { useState } from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked = false, onChange, id }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <label className="inline-flex items-center space-x-2">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-blue-600"
        checked={isChecked}
        onChange={handleChange}
      />
      {id && <span>{id}</span>}
    </label>
  );
};

export default Checkbox;
