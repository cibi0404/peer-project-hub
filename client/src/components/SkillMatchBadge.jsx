import { useState } from 'react';
import { FiTrendingUp, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getSkillMatches } from '../utils/skillsData';

function SkillMatchBadge({ tags }) {
  const [expanded, setExpanded] = useState(false);
  const { matched, total } = getSkillMatches(tags);

  if (matched.length === 0) return null;

  const percentage = Math.round((matched.length / total) * 100);

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="w-full flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 hover:bg-blue-100 transition"
      >
        <div className="flex items-center gap-2">
          <FiTrendingUp className="text-blue-900" size={15} />
          <span className="text-xs font-medium text-blue-900">
            {matched.length}/{total} in-demand skills
          </span>
        </div>
        {expanded ? (
          <FiChevronUp className="text-blue-900" size={15} />
        ) : (
          <FiChevronDown className="text-blue-900" size={15} />
        )}
      </button>

      <div className="h-1 bg-blue-100 rounded-full mt-1.5 overflow-hidden">
        <div
          className="h-full bg-blue-900 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {expanded && (
        <div className="mt-2 flex flex-wrap gap-1.5 px-1">
          {matched.map((skill) => (
            <span
              key={skill}
              className="text-xs bg-white border border-blue-200 text-blue-900 px-2 py-1 rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillMatchBadge;