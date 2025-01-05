import { redirect } from "next/navigation";

function HomePage() {
  redirect("/dashboard");
}
export default HomePage;
