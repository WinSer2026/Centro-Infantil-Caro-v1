import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Centro Infantil Caró - Sistema de Gestão",
  description: "Sistema premium de gestão para o Centro Infantil Caró",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <main>{children}</main>
        <footer style={{
          padding: '3rem 2rem',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          marginTop: '4rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Centro Infantil Caró</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Educar. Brincar, crescer e socializar
            </p>
            <div style={{ margin: '1.5rem 0', color: 'var(--text-primary)' }}>
              <strong>Contacto:</strong> 846703122 ou 878581500
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>Bairro:</strong> Mali, entrada de Michafutene, paragem Marcelino, continua um pouco em frente depois vira à direita logo na rua seguinte volta a virar à direita, 80m depois é a creche.
            </p>
            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} Centro Infantil Caró. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
