import styles from "../pages/page.module.css";

export default function SearchInput({
  icon: Icon,
  value,
  onChange,
  placeholder,
  onKeyDown,
}) {
  return (
    <div className={styles["search-input"]}>
      {Icon && <Icon size={20} className={styles["search-icon"]} />}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
