'use client';

import { useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAdjustStock } from '@/hooks/useInventory';
import { useToast } from '@/app/providers';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Upload, X, ArrowUp, ArrowDown, Search } from 'lucide-react';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600,
  letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280'
};

const inputBaseStyle: React.CSSProperties = {
  width: '100%', borderRadius: 12, border: '1px solid #E5E7EB', background: 'white',
  padding: '12px 16px', fontSize: 14, color: '#1F2937', outline: 'none',
  transition: 'all 0.2s ease', boxSizing: 'border-box'
};

export default function AdjustStockModal({ isOpen, onClose, preselectedProductId }: AdjustStockModalProps) {
  const { data: products } = useProducts();
  const adjustStock = useAdjustStock();
  const { addToast } = useToast();

  const [productId, setProductId] = useState(preselectedProductId || '');
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [searchProduct, setSearchProduct] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProduct = products?.find((p) => p.id === productId);

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchProduct.toLowerCase())
  ) || [];

  const amountNum = parseInt(amount) || 0;
  const afterAdjustment = selectedProduct
    ? type === 'IN'
      ? selectedProduct.stock + amountNum
      : selectedProduct.stock - amountNum
    : 0;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!productId) errs.product = 'Pilih produk';
    if (!amount || amountNum <= 0) errs.amount = 'Jumlah harus lebih dari 0';
    if (type === 'OUT' && selectedProduct && amountNum > selectedProduct.stock) {
      errs.amount = `Stok tidak cukup. Stok saat ini: ${selectedProduct.stock}`;
    }
    if (!reason.trim()) errs.reason = 'Alasan wajib diisi';
    if (!evidenceFile) errs.evidence = 'Foto bukti wajib dilampirkan';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('amount', amount);
    formData.append('type', type);
    formData.append('reason', reason.trim());
    if (evidenceFile) formData.append('evidence', evidenceFile);

    try {
      await adjustStock.mutateAsync(formData);
      addToast('success', `Stok berhasil di-${type === 'IN' ? 'tambah' : 'kurangi'}!`);
      resetForm();
      onClose();
    } catch {
      addToast('error', 'Gagal mengubah stok.');
    }
  };

  const resetForm = () => {
    setProductId(preselectedProductId || '');
    setType('IN');
    setAmount('');
    setReason('');
    setEvidenceFile(null);
    setSearchProduct('');
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title="Adjust Stock" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Product Select */}
        <div>
          <label style={labelStyle}>PRODUK</label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              style={{ ...inputBaseStyle, paddingLeft: 38 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#FB923C'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={{ ...inputBaseStyle, border: errors.product ? '1px solid #F87171' : '1px solid #E5E7EB' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = errors.product ? '#EF4444' : '#FB923C'; e.currentTarget.style.boxShadow = errors.product ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(255,107,0,0.1)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = errors.product ? '#F87171' : '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <option value="">Pilih produk...</option>
            {filteredProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku}) — Stok: {p.stock}</option>
            ))}
          </select>
          {errors.product && <p style={{ marginTop: 4, fontSize: 12, color: '#EF4444' }}>{errors.product}</p>}
        </div>

        {/* Type Toggle */}
        <div>
          <label style={labelStyle}>TIPE</label>
          <div style={{ display: 'flex', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setType('IN')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: type === 'IN' ? '#10B981' : 'white',
                color: type === 'IN' ? 'white' : '#6B7280',
              }}
            >
              <ArrowUp style={{ width: 16, height: 16 }} /> Stock IN
            </button>
            <button
              type="button"
              onClick={() => setType('OUT')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: type === 'OUT' ? '#EF4444' : 'white',
                color: type === 'OUT' ? 'white' : '#6B7280',
              }}
            >
              <ArrowDown style={{ width: 16, height: 16 }} /> Stock OUT
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <Input
            label="JUMLAH"
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />
          {selectedProduct && amountNum > 0 && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 16, fontSize: 12 }}>
              <span style={{ color: '#9CA3AF' }}>Stok saat ini: <strong style={{ color: '#374151' }}>{selectedProduct.stock}</strong></span>
              <span style={{ fontWeight: 700, color: type === 'IN' ? '#059669' : afterAdjustment < 0 ? '#DC2626' : '#EF4444' }}>
                Setelah: {afterAdjustment} {type === 'IN' ? '▲' : '▼'}
              </span>
            </div>
          )}
        </div>

        {/* Reason */}
        <Input
          label="ALASAN"
          placeholder="Contoh: Restock, Penjualan, Rusak, dll."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={errors.reason}
        />

        {/* Evidence Upload */}
        <div>
          <label style={labelStyle}>FOTO BUKTI (WAJIB)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            style={{ display: 'none' }}
            onChange={(e) => { setEvidenceFile(e.target.files?.[0] || null); setErrors((prev) => ({ ...prev, evidence: '' })); }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 16,
              border: errors.evidence ? '2px dashed #F87171' : '2px dashed #E5E7EB',
              background: errors.evidence ? '#FEF2F2' : 'white',
              borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { if(!errors.evidence) { e.currentTarget.style.borderColor = '#FB923C'; e.currentTarget.style.background = 'rgba(255,107,0,0.03)'; } }}
            onMouseLeave={(e) => { if(!errors.evidence) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white'; } }}
          >
            <Upload style={{ width: 20, height: 20, color: '#9CA3AF' }} />
            <span style={{ fontSize: 14, color: '#6B7280' }}>
              {evidenceFile ? evidenceFile.name : 'Upload foto bukti mutasi (PNG/JPG, max 2MB)'}
            </span>
            {evidenceFile && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setEvidenceFile(null); }}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 4 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
          {errors.evidence && <p style={{ marginTop: 4, fontSize: 12, color: '#EF4444' }}>{errors.evidence}</p>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
          <Button variant="secondary" onClick={() => { resetForm(); onClose(); }}>Batal</Button>
          <Button onClick={handleSubmit} isLoading={adjustStock.isPending}>
            Konfirmasi Adjust
          </Button>
        </div>
      </div>
    </Modal>
  );
}
