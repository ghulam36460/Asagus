"use client";

import { useEffect, useState } from "react";
import { Search, X, Plus } from "lucide-react";

export interface Technology {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  iconType: string;
  color?: string;
  category?: string;
}

interface TechnologySelectorProps {
  selectedTechnologies: Technology[];
  onChange: (technologies: Technology[]) => void;
}

export function TechnologySelector({ selectedTechnologies, onChange }: TechnologySelectorProps) {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  async function fetchTechnologies() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/v1/content/technologies");
      const data = await response.json();
      if (data.success) {
        setTechnologies(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTechnologies = technologies.filter(
    (tech) =>
      tech.name.toLowerCase().includes(search.toLowerCase()) ||
      tech.category?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedTechnologies = filteredTechnologies.reduce((acc, tech) => {
    const category = tech.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  function toggleTechnology(tech: Technology) {
    const isSelected = selectedTechnologies.some((t) => t.id === tech.id);
    if (isSelected) {
      onChange(selectedTechnologies.filter((t) => t.id !== tech.id));
    } else {
      onChange([...selectedTechnologies, tech]);
    }
  }

  function removeTechnology(techId: string) {
    onChange(selectedTechnologies.filter((t) => t.id !== techId));
  }

  return (
    <div className="space-y-2">
      {/* Selected Technologies */}
      <div className="flex flex-wrap gap-2">
        {selectedTechnologies.map((tech) => (
          <div
            key={tech.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
            style={{
              backgroundColor: tech.color ? `${tech.color}20` : "var(--muted)",
              border: `1px solid ${tech.color || "var(--border)"}`,
            }}
          >
            {tech.icon && tech.iconType === "devicon" && (
              <i className={`${tech.icon} colored`} style={{ fontSize: "16px" }}></i>
            )}
            <span style={{ color: "var(--foreground)" }}>{tech.name}</span>
            <button
              type="button"
              onClick={() => removeTechnology(tech.id)}
              className="hover:opacity-70"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm"
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <Plus size={16} />
        Add Technology
      </button>

      {/* Technology Picker Modal */}
      {showPicker && (
        <div className="relative">
          <div
            className="absolute z-50 mt-2 p-4 rounded-xl shadow-lg border w-full max-h-96 overflow-y-auto"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            {/* Search */}
            <div className="relative mb-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--muted-foreground)" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search technologies..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            {/* Technology List */}
            {loading ? (
              <div className="text-center py-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Loading...
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedTechnologies).map(([category, techs]) => (
                  <div key={category}>
                    <h3
                      className="text-xs font-semibold mb-2 uppercase"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {techs.map((tech) => {
                        const isSelected = selectedTechnologies.some((t) => t.id === tech.id);
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => toggleTechnology(tech)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all ${
                              isSelected ? "ring-2" : ""
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? tech.color
                                  ? `${tech.color}30`
                                  : "var(--primary)20"
                                : "var(--background)",
                              border: `1px solid ${
                                isSelected ? tech.color || "var(--primary)" : "var(--border)"
                              }`,
                              ringColor: tech.color || "var(--primary)",
                            }}
                          >
                            {tech.icon && tech.iconType === "devicon" && (
                              <i
                                className={`${tech.icon} colored`}
                                style={{ fontSize: "20px" }}
                              ></i>
                            )}
                            <span style={{ color: "var(--foreground)" }}>{tech.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="mt-4 w-full px-4 py-2 rounded-lg border text-sm"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
