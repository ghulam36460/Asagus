"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Save, Loader2, RefreshCw } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
  type: string;
  label: string;
  description?: string;
}

interface GroupedSettings {
  [group: string]: Setting[];
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeGroup, setActiveGroup] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Setting[] }>("/settings");
      const grouped: GroupedSettings = {};
      const vals: Record<string, string> = {};
      for (const s of res.data) {
        const group = s.group || "general";
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(s);
        vals[s.key] = s.value;
      }
      setSettings(grouped);
      setValues(vals);
      const groups = Object.keys(grouped);
      if (groups.length > 0 && !activeGroup) setActiveGroup(groups[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [activeGroup]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = Object.entries(values).map(([key, value]) => ({ key, value }));
      await api.put("/settings/bulk", { settings: payload });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const groups = Object.keys(settings);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Settings</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Configure your admin panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--primary)" }}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Group Navigation */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {groups.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm capitalize transition-colors ${
                  activeGroup === g ? "font-medium" : ""
                }`}
                style={{
                  backgroundColor: activeGroup === g ? "rgba(59,130,246,0.1)" : "transparent",
                  color: activeGroup === g ? "var(--primary)" : "var(--muted-foreground)"
                }}>
                {g.replace(/_/g, " ")}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Form */}
        <div className="flex-1 rounded-2xl p-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold mb-6 capitalize" style={{ color: "var(--foreground)" }}>
            {activeGroup.replace(/_/g, " ")} Settings
          </h2>
          <div className="space-y-6">
            {(settings[activeGroup] || []).map(setting => (
              <div key={setting.key}>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                  {setting.label}
                </label>
                {setting.description && (
                  <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>{setting.description}</p>
                )}
                {setting.type === "textarea" ? (
                  <textarea
                    value={values[setting.key] || ""}
                    onChange={e => setValues({ ...values, [setting.key]: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                ) : setting.type === "boolean" ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox"
                      checked={values[setting.key] === "true"}
                      onChange={e => setValues({ ...values, [setting.key]: e.target.checked ? "true" : "false" })}
                      className="rounded"
                    />
                    <span className="text-sm" style={{ color: "var(--foreground)" }}>
                      {values[setting.key] === "true" ? "Enabled" : "Disabled"}
                    </span>
                  </label>
                ) : setting.type === "number" ? (
                  <input type="number"
                    value={values[setting.key] || ""}
                    onChange={e => setValues({ ...values, [setting.key]: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                ) : setting.type === "color" ? (
                  <div className="flex items-center gap-3">
                    <input type="color" value={values[setting.key] || "#000000"}
                      onChange={e => setValues({ ...values, [setting.key]: e.target.value })}
                      className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor: "var(--border)" }}
                    />
                    <input type="text" value={values[setting.key] || ""}
                      onChange={e => setValues({ ...values, [setting.key]: e.target.value })}
                      className="flex-1 px-4 py-2 rounded-xl border text-sm"
                      style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    />
                  </div>
                ) : (
                  <input type="text"
                    value={values[setting.key] || ""}
                    onChange={e => setValues({ ...values, [setting.key]: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                )}
              </div>
            ))}

            {(!settings[activeGroup] || settings[activeGroup].length === 0) && (
              <p className="text-sm py-8 text-center" style={{ color: "var(--muted-foreground)" }}>
                No settings in this group
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
