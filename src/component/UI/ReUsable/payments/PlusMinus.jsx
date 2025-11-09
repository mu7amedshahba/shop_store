import { FiPlus, FiMinus } from "react-icons/fi";

export default function PlusMinus({
  count,
  setCount,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange = () => {},
}) {
  const increment = (e) => {
    e.preventDefault();
    const newValue = Math.min(max, count + step);
    setCount(newValue);
    onChange(newValue);
  };

  const decrement = (e) => {
    e.preventDefault();
    const newValue = Math.max(min, count - step);
    setCount(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decrement}
        disabled={count <= min}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease"
      >
        <FiMinus />
      </button>

      <span className="min-w-8 text-center font-medium">{count}</span>

      <button
        onClick={increment}
        disabled={count >= max}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase"
      >
        <FiPlus />
      </button>
    </div>
  );
}
