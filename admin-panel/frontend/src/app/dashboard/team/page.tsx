"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, Mail, Linkedin, Twitter, Github, Globe } from "lucide-react";
import { DataTable, Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type AnyRecord = Record<string, any>;

interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  department?: string;
  bio?: string;
  expertise: string[];
  avatarUrl?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  featured: boolean;
  orderIndex: number;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Leadership",
  "Research",
  "Support",
];

export default function TeamManagementPage() {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    role: "",
    department: "",
    bio: "",
    expertise: [] as string[],
    avatarUrl: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    twitterUrl: "",
    githubUrl: "",
    websiteUrl: "",
    isActive: true,
    featured: false,
    orderIndex: 0,
    joinedAt: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [expertiseInput, setExpertiseInput] = React.useState("");

  React.useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/content/team");
      setTeamMembers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      slug: "",
      role: "",
      department: "",
      bio: "",
      expertise: [],
      avatarUrl: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      twitterUrl: "",
      githubUrl: "",
      websiteUrl: "",
      isActive: true,
      featured: false,
      orderIndex: 0,
      joinedAt: "",
    });
    setExpertiseInput("");
    setModalOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      slug: member.slug,
      role: member.role,
      department: member.department || "",
      bio: member.bio || "",
      expertise: member.expertise || [],
      avatarUrl: member.avatarUrl || "",
      email: member.email || "",
      phone: member.phone || "",
      linkedinUrl: member.linkedinUrl || "",
      twitterUrl: member.twitterUrl || "",
      githubUrl: member.githubUrl || "",
      websiteUrl: member.websiteUrl || "",
      isActive: member.isActive,
      featured: member.featured,
      orderIndex: member.orderIndex,
      joinedAt: member.joinedAt || "",
    });
    setExpertiseInput("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Name, slug, and role are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingMember) {
        await api.put(`/content/team/${editingMember.id}`, formData);
        toast({
          title: "Success",
          description: "Team member updated successfully",
          variant: "success",
        });
      } else {
        await api.post("/content/team", formData);
        toast({
          title: "Success",
          description: "Team member created successfully",
          variant: "success",
        });
      }
      setModalOpen(false);
      fetchTeamMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save team member",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      await api.del(`/content/team/${id}`);
      toast({
        title: "Success",
        description: "Team member deleted successfully",
        variant: "success",
      });
      fetchTeamMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, expertiseInput.trim()],
      });
      setExpertiseInput("");
    }
  };

  const removeExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((_, i) => i !== index),
    });
  };

  const columns: Column<AnyRecord>[] = [
    {
      key: "avatarUrl",
      header: "Avatar",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-3">
          {r.avatarUrl ? (
            <img src={r.avatarUrl as string} alt={r.name as string} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {(r.name as string).charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    { key: "department", header: "Department" },
    {
      key: "expertise",
      header: "Expertise",
      render: (r: AnyRecord) => (
        <div className="flex flex-wrap gap-1">
          {(r.expertise as string[])?.slice(0, 3).map((skill: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
              {skill}
            </span>
          ))}
          {(r.expertise as string[])?.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              +{(r.expertise as string[]).length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (r: AnyRecord) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
          {r.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (r: AnyRecord) => (
        <span className={r.featured ? "text-yellow-500 text-lg" : "text-gray-300"}>
          {r.featured ? "★" : "☆"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(r as unknown as TeamMember)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDelete(r.id as string)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their profiles</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members ({teamMembers.length})</CardTitle>
          <CardDescription>View and manage all team members</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={teamMembers} loading={loading} />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
            <DialogDescription>
              {editingMember ? "Update team member information" : "Create a new team member profile"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Avatar */}
            <div>
              <Label>Avatar</Label>
              <ImageUpload
                value={formData.avatarUrl}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (!editingMember) {
                      setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="john-doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Senior Developer"
                />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label>Bio</Label>
              <RichTextEditor
                value={formData.bio}
                onChange={(value) => setFormData({ ...formData, bio: value })}
                placeholder="Write a brief bio..."
              />
            </div>

            {/* Expertise */}
            <div>
              <Label>Expertise/Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())}
                  placeholder="Add a skill..."
                />
                <Button type="button" onClick={addExpertise} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.expertise.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                    {skill}
                    <button onClick={() => removeExpertise(index)} className="hover:text-blue-900">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    className="pl-10"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="twitter">Twitter/X URL</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter"
                    className="pl-10"
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="github"
                    className="pl-10"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    className="pl-10"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="joinedAt">Joined Date</Label>
                <Input
                  id="joinedAt"
                  type="date"
                  value={formData.joinedAt}
                  onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active
                </Label>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingMember ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
