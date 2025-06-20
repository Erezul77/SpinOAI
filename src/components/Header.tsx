import spinoLogo from "../assets/spino_logo.png";

export default function Header() {
  return (
    <header className="header">
      <img src={spinoLogo} alt="SpiñO" className="logo" />
      <div className="header-buttons">
        <button>🌐</button>
        <button>?</button>
      </div>
    </header>
  );
}
