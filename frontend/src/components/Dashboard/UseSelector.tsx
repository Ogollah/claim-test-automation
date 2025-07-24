import { useState } from 'react';

export default function UseSelector({ use, onSelectUse }: {
  use: any;
  onSelectUse: (use: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [uses, setUses] = useState([{
    id:"claim"
  },{
    id:"preauthorization"
  },
  ]);

  return (
          <div >
            <label className="block text-sm font-medium text-gray-700 mb-1">Select use</label>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              value={use?.id || ''}
              onChange={(e) => {
                const selected = uses.find(p => p.id === e.target.value);
                if (selected) onSelectUse(selected);
              }}
            >
              <option value="">Select use</option>
              {uses.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}
                </option>
              ))}
            </select>
          </div>
  );
}