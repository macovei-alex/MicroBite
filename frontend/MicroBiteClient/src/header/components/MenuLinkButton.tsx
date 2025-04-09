import { Link } from "react-router-dom";

type MenuLinkButtonProps = {
  to: string;
  text: string;
};

export default function MenuLinkButton({ to, text }: MenuLinkButtonProps) {
  return (
    <Link
      to={to}
      className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-200 hover:text-blue-700 transition duration-300 font-bold"
    >
      {text}
    </Link>
  );
}
