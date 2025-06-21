import Image from "next/image";
import spinoLogo from "../assets/spino.png";

export default function Header() {
  return (
    <header className="header">
      <Image src={spinoLogo} alt="SpiñO" className="logo" />
      <div className="header-buttons">
        <button>🌐</button>
        <button>?</button>
      </div>
    </header>
  );
}
