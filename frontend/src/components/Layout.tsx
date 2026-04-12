import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";

export default function Layout({ children }: any) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f7f3ef",
      }}
    >
      <Navbar />

      {/* контент */}
      <div
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        {children}
      </div>

      <Footer />
    </div>
  );
}