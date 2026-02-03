export default function CustomSelect({ value, onChange, options }) {
  return (
    <div className="custom-select">
      {options.map((item, index) => (
        <div
          className={`custom-select-item ${value === item.value && "custom-select-item-selected"}`}
          key={index}
          onClick={() => onChange(item.value)}
        >
          <p style={{ textAlign: "center" }}>{item.label}</p>
        </div>
      ))}
      <div
        className="custom-select-selected"
        style={{
          transform:
            value === options[0].value ? "translateX(0%)" : "translateX(100%)",
        }}
      ></div>
    </div>
  );
}
