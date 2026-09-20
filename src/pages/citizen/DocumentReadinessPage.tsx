import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Trash2,
  Shield,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { evaluateDocumentReadiness } from '../../services/documentService';
import { useLanguage } from '../../context/LanguageContext';
import { DemoBadge } from '../../components/common/DemoBadge';

export const DocumentReadinessPage: React.FC = () => {
  const { user, uploadUserDocument, updateUserProfile } = useAuth();
  const { schemes, activeScheme, setActiveSchemeId } = useAppData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedSchemeId, setSelectedSchemeId] = useState(activeScheme?.id || 'SCH-MCR-001');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const currentScheme = schemes.find(s => s.id === selectedSchemeId) || activeScheme;
  const report = evaluateDocumentReadiness(currentScheme, user.uploadedDocuments);

  const handleSimulatedFileUpload = (fileName: string) => {
    setIsUploading(true);
    setUploadMessage(`Analyzing ${fileName} with smart heuristic parser...`);

    setTimeout(() => {
      uploadUserDocument(fileName, '1.4 MB');
      setIsUploading(false);
      setUploadMessage('');
    }, 700);
  };

  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleSimulatedFileUpload(file.name);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    const updated = user.uploadedDocuments.filter(d => d.id !== docId);
    updateUserProfile({ uploadedDocuments: updated });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('Prepare Documents')}
            </h1>
            <DemoBadge />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('AI readiness checklist tailored to your target scheme.')}
          </p>
        </div>

        {/* Scheme Selector */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 pl-1 whitespace-nowrap">Scheme:</span>
          <select
            value={selectedSchemeId}
            onChange={e => {
              setSelectedSchemeId(e.target.value);
              setActiveSchemeId(e.target.value);
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-900 focus:outline-none"
          >
            {schemes.slice(0, 15).map(s => (
              <option key={s.id} value={s.id}>
                {s.name.slice(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Readiness Gauge Meter */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Dossier Readiness
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              report.canSubmit ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {report.canSubmit ? 'Eligible for Channel Partner Submission' : 'Incomplete Dossier'}
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            {report.completedRequired} of {report.totalRequired} Mandatory Documents Verified
          </h2>

          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            Formula: <span className="font-mono font-semibold text-slate-700">({report.completedRequired} / {report.totalRequired}) × 100 = {report.readinessPercentage}%</span>. A minimum readiness of 75% is required before submission to avoid delays with channel partners.
          </p>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                report.readinessPercentage >= 75
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600'
              }`}
              style={{ width: `${report.readinessPercentage}%` }}
            />
          </div>
        </div>

        {/* Circular Percentage Stamp */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center bg-slate-50 rounded-full border-4 border-slate-100">
          <div className="text-center">
            <span className="text-3xl font-extrabold text-blue-900 leading-none">
              {report.readinessPercentage}%
            </span>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase mt-0.5">
              Readiness
            </span>
          </div>
        </div>
      </div>

      {/* Upload Zone & Dynamic Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Dynamic Checklist (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Required Documents for {currentScheme?.category}
            </h3>
            <span className="text-xs text-slate-400">
              {report.missingCount === 0 ? 'All Documents Ready' : `${report.missingCount} Missing`}
            </span>
          </div>

          <div className="space-y-3">
            {report.items.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  item.status === 'Detected' || item.status === 'Uploaded'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-amber-50/40 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.status === 'Detected' || item.status === 'Uploaded' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.status === 'Detected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.detectionNotes}
                    </p>

                    {item.uploadedDoc && (
                      <p className="text-[10px] font-mono text-blue-700 mt-1">
                        📄 {item.uploadedDoc.fileName} ({item.uploadedDoc.fileSize})
                      </p>
                    )}
                  </div>
                </div>

                {item.uploadedDoc && (
                  <button
                    onClick={() => handleDeleteDocument(item.uploadedDoc!.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Remove document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Call to action */}
          {report.canSubmit ? (
            <div className="pt-2">
              <button
                onClick={() => navigate('/apply')}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Partner Selection & Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
              Please upload the missing documents using the test uploader on the right to complete your dossier.
            </p>
          )}
        </div>

        {/* Right: Drag & Drop / One-Click Test Uploader (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Document Upload Simulator</h3>
          </div>

          {/* Drag & drop box */}
          <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group bg-slate-50/50">
            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-2" />
            <p className="text-xs font-bold text-slate-800">
              Click to browse or drop files
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports PDF, PNG, JPG (Demo storage: metadata only)
            </p>
            <input
              type="file"
              onChange={handleNativeFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </label>

          {isUploading && (
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
              <span>{uploadMessage}</span>
            </div>
          )}

          {/* Quick Demo Upload Buttons */}
          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Instant Demo Document Simulators
            </p>
            <div className="space-y-1.5">
              {[
                { name: 'Income_Certificate_Tehsildar.pdf', label: '+ Upload Income Certificate' },
                { name: 'Tailoring_Singer_Machinery_Quote.pdf', label: '+ Upload Machinery Quotation' },
                { name: 'Aadhaar_Card_Masked.pdf', label: '+ Upload Aadhaar Card' },
                { name: 'Bank_Passbook_Statement.pdf', label: '+ Upload Bank Statement' }
              ].map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulatedFileUpload(doc.name)}
                  className="w-full text-left p-2 rounded-xl text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200/80 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium">{doc.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Demo PDF</span>
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong>Privacy & Security:</strong> Prototype parses document metadata locally. Sensitive files are not stored on external servers.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
