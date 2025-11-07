import { useState, useCallback } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X, FileText } from "lucide-react";
import { toast } from "sonner";

export type AttachmentType = {
  id: string;
  type: string;
  displayName: string;
  code: string;
  url: string;
};

type DocumentAttachmentProps = {
  attachments: AttachmentType[];
  onAttachmentsChange: (attachments: AttachmentType[]) => void;
};

const DOCUMENT_TYPES = [
  { code: "claim-form", displayName: "Claim Form" },
  { code: "final-bill", displayName: "Final Bill" },
  { code: "discharge-summary", displayName: "Discharge Summary" },
  { code: "theatre-notes", displayName: "Theatre Notes" },
  { code: "imaging-reports", displayName: "Imaging Reports" },
];

export default function DocumentAttachment({
  attachments,
  onAttachmentsChange,
}: DocumentAttachmentProps) {
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [documentUrl, setDocumentUrl] = useState<string>("");

  const availableDocTypes = DOCUMENT_TYPES.filter(
    (docType) => !attachments.some((att) => att.code === docType.code)
  );

  const handleAddDocument = useCallback(() => {
    if (!selectedDocType) {
      toast.error("Please select a document type");
      return;
    }

    if (!documentUrl.trim()) {
      toast.error("Please enter a document URL");
      return;
    }

    const docType = DOCUMENT_TYPES.find((dt) => dt.code === selectedDocType);
    if (!docType) return;

    const newAttachment: AttachmentType = {
      id: `${selectedDocType}-${Date.now()}`,
      type: selectedDocType,
      displayName: docType.displayName,
      code: docType.code,
      url: documentUrl.trim(),
    };

    onAttachmentsChange([...attachments, newAttachment]);
    setSelectedDocType("");
    setDocumentUrl("");
    toast.success(`${docType.displayName} added successfully`);
  }, [selectedDocType, documentUrl, attachments, onAttachmentsChange]);

  const handleRemoveDocument = useCallback(
    (id: string) => {
      onAttachmentsChange(attachments.filter((att) => att.id !== id));
      toast.success("Document removed");
    },
    [attachments, onAttachmentsChange]
  );

  return (
    <div className="border-t border-gray-200 pt-4 mb-6">
      <h3 className="text-lg font-medium text-gray-500 mb-4">
        Document Attachments
      </h3>

      {/* Selected Documents Display */}
      {attachments.length > 0 && (
        <div className="mb-4 space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
            >
              <div className="flex flex-col space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {attachment.displayName}
                  </span>
                </div>
                <span className="text-xs text-gray-500 ml-7 truncate">
                  {attachment.url}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveDocument(attachment.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add Document Section */}
      {availableDocTypes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={selectedDocType} onValueChange={setSelectedDocType}>
              <SelectTrigger id="document-type" className="w-full">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {availableDocTypes.map((docType) => (
                  <SelectItem key={docType.code} value={docType.code}>
                    {docType.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-url">Document URL</Label>
            <Input
              id="document-url"
              type="text"
              placeholder="Enter Document URL"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAddDocument}
              disabled={!selectedDocType || !documentUrl.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-900 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FileText className="h-5 w-5 mr-2" />
              Add Document
            </Button>
          </div>
        </div>
      )}

      {availableDocTypes.length === 0 && attachments.length > 0 && (
        <p className="text-sm text-gray-500 italic">
          All document types have been added
        </p>
      )}
    </div>
  );
}