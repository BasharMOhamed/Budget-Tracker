import Navbar from "@/components/navbar/navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default Layout;
