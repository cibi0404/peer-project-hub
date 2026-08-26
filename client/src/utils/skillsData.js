export const IN_DEMAND_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Tailwind',
  'MongoDB',
  'AI',
  'LLM',
  'Python',
  'GraphQL',
];

export function getSkillMatches(tags) {
  if (!tags || tags.length === 0) {
    return { matched: [], total: IN_DEMAND_SKILLS.length };
  }

  const normalizedTags = tags.map((t) => t.toLowerCase().trim());

  const matched = IN_DEMAND_SKILLS.filter((skill) =>
    normalizedTags.some((tag) => tag.includes(skill.toLowerCase()) || skill.toLowerCase().includes(tag))
  );

  return { matched, total: IN_DEMAND_SKILLS.length };
}
