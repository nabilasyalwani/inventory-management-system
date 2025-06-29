import styles from "../pages/page.module.css";

export default function SearchInput({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  onKeyDown,
}) {
  return (
    <div className={styles["statistic-card"]}>
      {Icon && <Icon size={20} className={styles["statistic-icon"]} />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
