export default function Modal({ open, onClose, children }: any) {
  if (!open) return null;

  return (
    <div
      onClick={(e) => {
            e.stopPropagation();
            onClose();
        }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,

        pointerEvents: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: 20,
          borderRadius: 8,
          minWidth: 300,

          pointerEvents: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}