import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  Clock,
  FileText,
  Trash2,
  Shield,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { evaluateDocumentReadiness } from '../../services/documentService';
import { useLanguage } from '../../context/LanguageContext';

export const DocumentReadinessPage: React.FC = () => {
  const { user, uploadUserDocument, updateUserProfile } = useAuth();
  const { schemes, activeScheme, setActiveSchemeId } = useAppData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedSchemeId, setSelectedSchemeId] = useState(activeScheme?.id || 'SCH-PMEGP-001');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const currentScheme = schemes.find(s => s.id === selectedSchemeId) || activeScheme;
  const report = evaluateDocumentReadiness(currentScheme, user.uploadedDocuments);

  const handleSimulatedFileUpload = (fileName: string) => {
    setIsUploading(true);
    setUploadMessage(`Processing ${fileName}...`);

    setTimeout(() => {
      uploadUserDocument(fileName, '1.4 MB');
      setIsUploading(false);
      setUploadMessage('');
    }, 600);
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
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Document Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Required Documents Checklist
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify and organize the mandatory documents required for scheme application verification.
            </p>
          </div>

          {/* Scheme Selector */}
          <div className="bg-white p-2 rounded border border-slate-200 flex items-center gap-2 text-xs">
            <span className="text-slate-600 font-semibold whitespace-nowrap">Scheme:</span>
            <select
              value={selectedSchemeId}
              onChange={e => {
                setSelectedSchemeId(e.target.value);
                setActiveSchemeId(e.target.value);
              }}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
            >
              {schemes.slice(0, 15).map(s => (
                <option key={s.id} value={s.id}>
                  {s.officialName || s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Readiness Status Strip */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Dossier Completeness
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {report.completedRequired} of {report.totalRequired} Mandatory Documents Ready
              </h2>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
              report.canSubmit ? 'bg-emerald-50 text-[#065F46] border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {report.canSubmit ? 'Ready for Official Submission' : 'Incomplete Document Set'}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#065F46] rounded-full transition-all duration-500"
              style={{ width: `${report.readinessPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Official nodal bank verification requires all mandatory documentation in original or certified copy.
          </p>
        </div>

        {/* Documents Matrix */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            Required Documents for {currentScheme?.officialName || currentScheme?.name}
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Mandatory</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {report.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-slate-900">{item.name}</td>
                    <td>
                      <span className="text-[10px] font-semibold text-slate-600 uppercase">
                        {item.required ? 'Required' : 'Optional'}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'Uploaded'
                          ? 'bg-emerald-50 text-[#065F46]'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {item.status === 'Uploaded' ? 'Verified / Uploaded' : 'Pending Upload'}
                      </span>
                    </td>
                    <td>
                      {item.status !== 'Uploaded' && (
                        <button
                          onClick={() => handleSimulatedFileUpload(item.name)}
                          className="text-xs text-[#065F46] hover:underline font-semibold"
                        >
                          Mark / Upload →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="bg-white rounded-lg border border-dashed border-slate-300 p-6 text-center space-y-2">
          <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-xs text-slate-800">Attach Document to Dossier</h4>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Attach PDF or image copies of your certificates, Aadhaar, or project reports.
          </p>
          <div className="pt-2">
            <label className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors border border-slate-300">
              <span>Select File</span>
              <input type="file" onChange={handleNativeFileUpload} className="hidden" />
            </label>
          </div>
          {isUploading && (
            <p className="text-xs text-[#065F46] font-medium pt-1">{uploadMessage}</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default DocumentReadinessPage;
