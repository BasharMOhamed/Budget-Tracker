function Layout({ children }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  );
}

export default Layout;
