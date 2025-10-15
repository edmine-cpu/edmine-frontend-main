import { Header } from "@/components/Header/Header";
import { MainPage } from "@/components/indexMain/MainPageComponent";

// Дефолтная версия без языка - английская
export default function Home() {
  return (
    <div>
      <Header lang="en" />
      <MainPage lang="en" />
    </div>
  );
}
