import Navbar from "@/Components/navbar/navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default Layout;
