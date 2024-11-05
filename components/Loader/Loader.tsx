import "./Loader.css";
import Image from "next/image";

export default function Loader() {
  return (
    <>
      <div className="flex items-center justify-center">
        <Image
          className="z-10 absolute"
          src="/logo/logo-circle.png"
          alt="logo"
          width={190}
          height={190}
        />
        <div className="page-loader neon-loader z-9" />
      </div>
    </>
  );
}
