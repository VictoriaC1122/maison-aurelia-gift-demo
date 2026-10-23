import { HomeView, homeMetadata } from "@/components/views/home";

export const metadata = homeMetadata("zh");

export default function Page() {
  return <HomeView locale="zh" />;
}
