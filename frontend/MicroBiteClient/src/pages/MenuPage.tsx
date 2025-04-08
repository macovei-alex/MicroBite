import { useMediaQuery } from "react-responsive";
import MenuPageDesktopLayout from "../menu/layouts/MenuPageDesktopLayout";
import MenuPageMobileLayout from "../menu/layouts/MenuPageMobileLayout";

export default function MenuPage() {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  return isDesktop.valueOf() ? <MenuPageDesktopLayout /> : <MenuPageMobileLayout />;
}
