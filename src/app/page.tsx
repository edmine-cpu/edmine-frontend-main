import { getLanguage } from "@/utils/getLang";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Lang } from "@/app/(types)/lang";

export default async function Home() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt_token")?.value;

  const lang: Lang = getLanguage(jwt) as Lang;

  return redirect(`/${lang}`);
}
