'use client';

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { 
  Receipt, 
  Download, 
  Printer, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  Search,
  CheckCircle2,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function FinanceiroPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribe('pagamentos', (data) => {
      setPayments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totals = payments.reduce((acc, curr) => {
    const amount = typeof curr.amount === 'string' 
      ? parseFloat(curr.amount.replace(/[^0-9.]/g, '')) 
      : (curr.amount || 0);
    
    if (curr.category === 'Entrada') acc.income += amount;
    else acc.expense += amount;
    
    return acc;
  }, { income: 0, expense: 0 });

  const generateReceipt = (payment: any) => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Branding Header
      doc.setFontSize(22);
      doc.setTextColor(0, 119, 194); // var(--primary)
      doc.text('Centro Infantil Caró', 105, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // var(--text-secondary)
      doc.text('Educar. Brincar, crescer e socializar', 105, 32, { align: 'center' });
      
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 40, 190, 40);
      
      // Receipt Title
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text('RECIBO DE PAGAMENTO (DUPLICADO)', 105, 55, { align: 'center' });
      
      // Receipt Info
      doc.setFontSize(12);
      doc.text(`Nº do Recibo: ${payment.id?.substring(0, 8)}`, 20, 75);
      doc.text(`Data: ${payment.date}`, 190, 75, { align: 'right' });
      
      // Content Box
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 85, 170, 60, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(20, 85, 170, 60, 'S');
      
      doc.text(`Recebemos de: ${payment.student}`, 30, 100);
      doc.text(`A quantia de: ${payment.amount}`, 30, 115);
      doc.text(`Referente a: ${payment.type}`, 30, 130);
      
      // Footer Branding
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Contacto: 846703122 ou 878581500', 105, 170, { align: 'center' });
      doc.text('Bairro: Mali, entrada de Michafutene, paragem Marcelino', 105, 175, { align: 'center' });
      
      // Signature lines
      doc.line(30, 220, 90, 220);
      doc.text('O Encarregado', 60, 225, { align: 'center' });
      
      doc.line(120, 220, 180, 220);
      doc.text('A Administração', 150, 225, { align: 'center' });
      
      doc.save(`Recibo_${payment.id}_${payment.student?.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o recibo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Gestão Financeira</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Controle de mensalidades, despesas e emissão de recibos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowDownLeft size={18} />
            Registar Despesa
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={18} />
            Novo Pagamento
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', 
          color: 'white',
          border: 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
              <ArrowUpRight size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Recebido</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totals.income.toLocaleString('pt-MZ')} MT</div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', 
          color: 'white',
          border: 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
              <ArrowDownLeft size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Despesas</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totals.expense.toLocaleString('pt-MZ')} MT</div>
        </div>

        <div className="card" style={{ 
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Balanço Atual</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
            {(totals.income - totals.expense).toLocaleString('pt-MZ')} MT
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem' }}>Recibos Emitidos Recentemente</h3>
        </div>
        {loading ? (
             <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 1rem' }} />
                Carregando transações do Firestore...
             </div>
        ) : payments.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Nenhuma transação financeira registada.
            </div>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
                <tr style={{ background: 'var(--background)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>CLIENTE / ALUNO</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>CONCEITO</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>VALOR</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>DATA</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>ACÇÕES</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((payment) => (
                <tr key={payment.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>
                        {payment.id?.substring(0, 8)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9375rem', fontWeight: 500 }}>{payment.student}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--accent)', color: 'var(--primary)', fontWeight: 600 }}>
                        {payment.type}
                    </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>
                        {typeof payment.amount === 'string' ? payment.amount : `${payment.amount?.toLocaleString('pt-MZ')} MT`}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{payment.date}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                    <button 
                        onClick={() => generateReceipt(payment)}
                        disabled={isGenerating}
                        style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '8px', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: isGenerating ? 0.7 : 1
                        }}
                    >
                        <Printer size={14} />
                        Recibo Duplicado
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
}
