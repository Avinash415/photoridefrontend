import "@/styles/auth.css";

export default function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
