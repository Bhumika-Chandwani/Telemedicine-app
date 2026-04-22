import { useState } from "react";

export default function PrescriptionUpload() {
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    notes: "",
  });

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  const [files, setFiles] = useState([]);

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const handleFileUpload = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      medicines,
      files,
    };

    console.log("Prescription Data:", payload);

    alert("Prescription submitted (Backend integration pending)");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 karla-font">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-black">
          Prescription & Medical Records
        </h1>
        <p className="text-sm text-black/60 mt-1">
          Upload prescription details and attach medical reports
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="
          bg-teal-50/40
          border border-teal-500/30
          rounded-2xl
          p-6
          shadow-sm
          space-y-6
        "
      >

        {/* Patient ID */}
        <div>
          <label className="block text-sm text-black mb-2">
            Patient ID
          </label>
          <input
            type="text"
            value={formData.patientId}
            onChange={(e) =>
              setFormData({ ...formData, patientId: e.target.value })
            }
            className="
              w-full
              px-4 py-2
              rounded-lg
              border border-black/10
              bg-white
              text-sm
              outline-none
              focus:ring-2 focus:ring-teal-400
            "
            placeholder="Enter Patient ID"
            required
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm text-black mb-2">
            Diagnosis
          </label>
          <input
            type="text"
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
            className="
              w-full
              px-4 py-2
              rounded-lg
              border border-black/10
              bg-white
              text-sm
              outline-none
              focus:ring-2 focus:ring-teal-400
            "
            placeholder="Enter diagnosis"
            required
          />
        </div>

        {/* Medicines Section */}
        <div>
          <label className="block text-sm text-black mb-3">
            Medicines
          </label>

          <div className="space-y-3">
            {medicines.map((med, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-3"
              >
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={med.name}
                  onChange={(e) =>
                    handleMedicineChange(index, "name", e.target.value)
                  }
                  className="input-field"
                  required
                />

                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    handleMedicineChange(index, "dosage", e.target.value)
                  }
                  className="input-field"
                  required
                />

                <input
                  type="text"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) =>
                    handleMedicineChange(index, "frequency", e.target.value)
                  }
                  className="input-field"
                  required
                />

                <input
                  type="text"
                  placeholder="Duration"
                  value={med.duration}
                  onChange={(e) =>
                    handleMedicineChange(index, "duration", e.target.value)
                  }
                  className="input-field"
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMedicineRow}
            className="
              mt-3
              text-sm
              text-teal-700
              hover:underline
            "
          >
            + Add Another Medicine
          </button>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-black mb-2">
            Additional Notes
          </label>
          <textarea
            rows="3"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="
              w-full
              px-4 py-2
              rounded-lg
              border border-black/10
              bg-white
              text-sm
              outline-none
              focus:ring-2 focus:ring-teal-400
            "
            placeholder="Enter additional comments..."
          ></textarea>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm text-black mb-2">
            Upload Medical Records (PDF / Images)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="text-sm"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="
              w-full
              py-3
              bg-teal-600
              text-white
              rounded-lg
              text-sm
              hover:bg-teal-700
              transition-all
            "
          >
            Submit Prescription
          </button>
        </div>

      </form>
    </div>
  );
}
