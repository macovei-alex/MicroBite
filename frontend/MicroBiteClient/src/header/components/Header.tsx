import { useMediaQuery } from "react-responsive";
import HeaderDesktopLayout from "../layouts/HeaderDesktopLayout";
import HeaderMobileLayout from "../layouts/HeaderMobileLayout";

export default function Header() {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  return isDesktop.valueOf() ? <HeaderDesktopLayout /> : <HeaderMobileLayout />;
}
