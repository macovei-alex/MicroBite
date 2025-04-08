import { useMediaQuery } from "react-responsive";
import CartPageDesktopLayout from "../cart/layouts/CartPageDesktopLayout";
import CartPageMobileLayout from "../cart/layouts/CartPageMobileLayout";

export default function CartPage() {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  return isDesktop.valueOf() ? <CartPageDesktopLayout /> : <CartPageMobileLayout />;
}
