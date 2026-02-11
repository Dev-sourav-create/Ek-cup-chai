export default function InputCheckBox({
  checked,
  onChange,
  className = "",
  ...props
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`ui-checkbox ${className}`}
      {...props}
    />
  );
}
