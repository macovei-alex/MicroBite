import { Link } from "react-router-dom";

type DropDownLinkProps = {
  to: string;
  text: string;
  onClick?: () => void;
};

export default function DropDownLink({ to, text, onClick }: DropDownLinkProps) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 text-sm rounded-md text-blue-500 font-bold hover:bg-blue-200 transition duration-300"
      onClick={onClick}
    >
      {text}
    </Link>
  );
}
