export default function InterventionSelector({
  packageId,
  interventions,
  selectedIntervention,
  onSelectIntervention,
}: {
  packageId: string;
  interventions: any[];
  selectedIntervention: string;
  onSelectIntervention: (code: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Intervention Code</label>
      <div className="relative">
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          value={selectedIntervention}
          onChange={(e) => onSelectIntervention(e.target.value)}
          disabled={!packageId}
        >
          <option value="">Select an intervention</option>
          {interventions.map((intervention) => (
            <option key={intervention.code} value={intervention.code}>
              {intervention.name} ({intervention.code})
            </option>
          ))}
        </select>
      </div>
      {selectedIntervention && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Selected: {interventions.find(i => i.code === selectedIntervention)?.name}
          </p>
        </div>
      )}
    </div>
  );
}