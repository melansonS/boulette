import "./textInput.css";

const TextInput = ({ onChange, placeholder, value, required }) => {
  return (
    <input
      onChange={onChange}
      className="text-input"
      placeholder={placeholder}
      value={value}
      required={required}></input>
  );
};

export default TextInput;
