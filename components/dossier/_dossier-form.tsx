'use client';

import { memo, useState } from "react";

type FormType = "job" | "azure";

interface JobFormData {
  role: string;
  salary: string;
  skills: string;
  description: string;
}

interface AzureFormData {
  resourceType: string;
  details: string;
}

interface FormContent {
  type: FormType;
  data: JobFormData | AzureFormData;
}

const defaultJobForm: JobFormData = {
  role: "",
  salary: "",
  skills: "",
  description: "",
};

const defaultAzureForm: AzureFormData = {
  resourceType: "",
  details: "",
};

const parseFormContent = (content?: string): FormContent => {
  if (!content) {
    return { type: "job", data: { ...defaultJobForm } };
  }
  try {
    const parsed = JSON.parse(content);
    if (parsed.type === "azure") {
      return {
        type: "azure",
        data: parsed.data || { ...defaultAzureForm },
      };
    }
    return {
      type: "job",
      data: parsed.data || { ...defaultJobForm },
    };
  } catch {
    // Fallback: default to job form
    return { type: "job", data: { ...defaultJobForm } };
  }
};

const PureDossierForm = ({
  content,
  handleContentChange,
  readOnly,
}: {
  content?: string;
  handleContentChange: (content: string) => void;
  readOnly: boolean;
}) => {
  const [form, setForm] = useState<FormContent>(parseFormContent(content));

  // Switch form type
  const switchFormType = (type: FormType) => {
    setForm((prev) => {
      const newForm: FormContent =
        type === "job"
          ? { type, data: { ...defaultJobForm } }
          : { type, data: { ...defaultAzureForm } };
      handleContentChange(JSON.stringify(newForm));
      return newForm;
    });
  };

  // Update field
  const updateField = (field: string, value: string) => {
    if (readOnly) return;
    setForm((prev) => {
      const newData = { ...prev.data, [field]: value };
      const newForm = { ...prev, data: newData };
      handleContentChange(JSON.stringify(newForm));
      return newForm;
    });
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      {!readOnly && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => switchFormType("job")}
            className={`px-2 py-1 border rounded ${
              form.type === "job" ? "bg-blue-100" : ""
            }`}
            disabled={form.type === "job"}
          >
            Job Opening Form
          </button>
          <button
            onClick={() => switchFormType("azure")}
            className={`px-2 py-1 border rounded ${
              form.type === "azure" ? "bg-green-100" : ""
            }`}
            disabled={form.type === "azure"}
          >
            Azure Resource Request
          </button>
        </div>
      )}
      {form.type === "job" ? (
        <form className="w-[500px] flex flex-col gap-4 border p-4 bg-white rounded shadow">
          <label>
            Role:
            <input
              type="text"
              value={(form.data as JobFormData).role}
              onChange={(e) => updateField("role", e.target.value)}
              disabled={readOnly}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>
          <label>
            Salary:
            <input
              type="text"
              value={(form.data as JobFormData).salary}
              onChange={(e) => updateField("salary", e.target.value)}
              disabled={readOnly}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>
          <label>
            Skills:
            <input
              type="text"
              value={(form.data as JobFormData).skills}
              onChange={(e) => updateField("skills", e.target.value)}
              disabled={readOnly}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </label>
          <label>
            Description:
            <textarea
              value={(form.data as JobFormData).description}
              onChange={(e) => updateField("description", e.target.value)}
              disabled={readOnly}
              className="w-full border rounded px-2 py-1 mt-1"
              rows={4}
            />
          </label>
        </form>
      ) : (
        <form className="w-[500px] flex flex-col gap-4 border p-4 bg-white rounded shadow">
          <label>
            Azure Resource Type:
            <select
              value={(form.data as AzureFormData).resourceType}
              onChange={(e) => updateField("resourceType", e.target.value)}
              disabled={readOnly}
              className="w-full border rounded px-2 py-1 mt-1"
            >
              <option value="">Select resource</option>
              <option value="VM">Virtual Machine</option>
              <option value="Storage">Storage Account</option>
              <option value="SQL">SQL Database</option>
              <option value="AppService">App Service</option>
              <option value="Function">Function App</option>
            </select>
          </label>
          <label>
            Details:
            <textarea
              value={(form.data as AzureFormData).details}
              onChange={(e) => updateField("details", e.target.value)}
              disabled={readOnly}
              className="w-full border rounded px-2 py-1 mt-1"
              rows={4}
            />
          </label>
        </form>
      )}
    </div>
  );
};

export const DossierForm = memo(PureDossierForm);
