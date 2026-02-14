import React from 'react';
import { FileText, FileSpreadsheet, Presentation, Download, ExternalLink } from 'lucide-react';

interface DocumentCardProps {
  url: string;
  fileName: string;
  description?: string;
  fileSize?: string;
  fileType: 'pptx' | 'xlsx' | 'pdf';
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  pptx: <Presentation className="w-8 h-8" />,
  xlsx: <FileSpreadsheet className="w-8 h-8" />,
  pdf: <FileText className="w-8 h-8" />,
};

const FILE_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  pptx: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    accent: 'from-orange-500 to-red-500',
  },
  xlsx: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    accent: 'from-emerald-500 to-green-500',
  },
  pdf: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    accent: 'from-red-500 to-rose-500',
  },
};

const FILE_LABELS: Record<string, string> = {
  pptx: 'PowerPoint',
  xlsx: 'Excel',
  pdf: 'PDF Document',
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  url,
  fileName,
  description,
  fileSize,
  fileType,
}) => {
  const colors = FILE_COLORS[fileType] || FILE_COLORS.pdf;
  const icon = FILE_ICONS[fileType] || FILE_ICONS.pdf;
  const label = FILE_LABELS[fileType] || 'Document';

  return (
    <div className={`w-full aspect-video rounded-xl ${colors.bg} border ${colors.border} flex flex-col items-center justify-center gap-3 p-5`}>
      {/* File type icon */}
      <div className={`w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center ${colors.text}`}>
        {icon}
      </div>

      {/* File label */}
      <div className="text-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
          {label}
        </span>
      </div>

      {/* File name */}
      <p className="text-sm font-medium text-gray-700 text-center leading-snug line-clamp-2 max-w-full px-2">
        {fileName}
      </p>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 text-center line-clamp-1 max-w-full px-2">
          {description}
        </p>
      )}

      {/* File size + Open button */}
      <div className="flex items-center gap-3 mt-1">
        {fileSize && (
          <span className="text-xs text-gray-400 font-medium">{fileSize}</span>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download={fileType !== 'pdf' ? true : undefined}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${colors.accent} text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all min-h-[32px]`}
          onClick={(e) => e.stopPropagation()}
        >
          {fileType === 'pdf' ? (
            <>
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Download
            </>
          )}
        </a>
      </div>
    </div>
  );
};
