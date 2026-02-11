import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load env from admin-panel root so DATABASE_URL is available
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // 1. Create Roles
  // ============================================
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "super_admin" },
      update: {},
      create: { name: "super_admin", description: "Full system access" },
    }),
    prisma.role.upsert({
      where: { name: "admin" },
      update: {},
      create: { name: "admin", description: "Most access, cannot manage system settings" },
    }),
    prisma.role.upsert({
      where: { name: "editor" },
      update: {},
      create: { name: "editor", description: "Content management only" },
    }),
    prisma.role.upsert({
      where: { name: "viewer" },
      update: {},
      create: { name: "viewer", description: "Read-only access" },
    }),
  ]);

  console.log("✅ Roles created:", roles.map((r) => r.name).join(", "));

  // ============================================
  // 2. Create Permissions
  // ============================================
  const resources = [
    "projects", "services", "testimonials", "faqs",
    "client_logos", "stats", "media", "users",
    "settings", "analytics", "contacts", "newsletter",
  ];
  const actions = ["create", "read", "update", "delete"];

  const permissions = [];
  for (const resource of resources) {
    for (const action of actions) {
      const perm = await prisma.permission.upsert({
        where: { resource_action: { resource, action } },
        update: {},
        create: { resource, action, description: `${action} ${resource}` },
      });
      permissions.push(perm);
    }
  }
  // Special permissions
  const specialPerms = [
    { resource: "projects", action: "publish", description: "Publish/unpublish projects" },
    { resource: "settings", action: "system", description: "Modify system settings" },
    { resource: "users", action: "assign_roles", description: "Assign roles to users" },
    { resource: "analytics", action: "export", description: "Export analytics reports" },
    { resource: "newsletter", action: "export", description: "Export newsletter subscribers" },
  ];
  for (const sp of specialPerms) {
    const perm = await prisma.permission.upsert({
      where: { resource_action: { resource: sp.resource, action: sp.action } },
      update: {},
      create: sp,
    });
    permissions.push(perm);
  }

  console.log(`✅ ${permissions.length} permissions created`);

  // ============================================
  // 3. Assign Permissions to Roles
  // ============================================
  const allPermIds = permissions.map((p) => p.id);
  const superAdminRole = roles[0];
  const adminRole = roles[1];
  const editorRole = roles[2];
  const viewerRole = roles[3];

  // Super Admin: all permissions
  for (const permId of allPermIds) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: permId } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: permId },
    });
  }

  // Admin: all except system settings, assign roles, delete users
  const adminExclude = permissions
    .filter((p) =>
      (p.resource === "settings" && p.action === "system") ||
      (p.resource === "users" && p.action === "assign_roles") ||
      (p.resource === "users" && p.action === "delete")
    )
    .map((p) => p.id);

  for (const permId of allPermIds.filter((id) => !adminExclude.includes(id))) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permId } },
      update: {},
      create: { roleId: adminRole.id, permissionId: permId },
    });
  }

  // Editor: content CRUD (no delete except own), read analytics
  const editorPerms = permissions.filter((p) => {
    const contentResources = ["projects", "services", "testimonials", "faqs", "client_logos", "stats", "media"];
    if (contentResources.includes(p.resource) && ["create", "read", "update"].includes(p.action)) return true;
    if (p.resource === "projects" && p.action === "publish") return true;
    if (p.resource === "analytics" && p.action === "read") return true;
    if (p.resource === "analytics" && p.action === "export") return true;
    if (p.resource === "contacts" && ["read", "update"].includes(p.action)) return true;
    return false;
  });

  for (const perm of editorPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: editorRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: editorRole.id, permissionId: perm.id },
    });
  }

  // Viewer: read-only on content & analytics
  const viewerPerms = permissions.filter((p) => {
    const viewResources = ["projects", "services", "testimonials", "faqs", "client_logos", "stats", "media", "analytics", "contacts"];
    return viewResources.includes(p.resource) && p.action === "read";
  });

  for (const perm of viewerPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: viewerRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: viewerRole.id, permissionId: perm.id },
    });
  }

  console.log("✅ Role permissions assigned");

  // ============================================
  // 4. Create Super Admin User
  // ============================================
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@asagus.com";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@2026Secure!";
  const adminName = process.env.SUPER_ADMIN_NAME || "Super Admin";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      name: adminName,
      emailVerified: true,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: superAdmin.id, roleId: superAdminRole.id },
  });

  console.log(`✅ Super Admin created: ${adminEmail}`);

  // ============================================
  // 5. Seed Initial Settings
  // ============================================
  const settings = [
    { key: "site_name", value: JSON.stringify("ASAGUS"), group: "general", label: "Site Name", type: "string" },
    { key: "site_description", value: JSON.stringify("AI, Cybersecurity & Web Development Solutions"), group: "general", label: "Site Description", type: "string" },
    { key: "site_url", value: JSON.stringify("https://asagus.com"), group: "general", label: "Site URL", type: "string" },
    { key: "contact_email", value: JSON.stringify("contact@asagus.com"), group: "general", label: "Contact Email", type: "string" },
    { key: "social_github", value: JSON.stringify("https://github.com/asagus"), group: "social", label: "GitHub URL", type: "string" },
    { key: "social_linkedin", value: JSON.stringify(""), group: "social", label: "LinkedIn URL", type: "string" },
    { key: "social_twitter", value: JSON.stringify(""), group: "social", label: "Twitter URL", type: "string" },
    { key: "maintenance_mode", value: JSON.stringify(false), group: "general", label: "Maintenance Mode", type: "boolean" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Settings seeded");

  // ============================================
  // 6. Seed Sample Projects (from existing data)
  // ============================================
  const sampleProjects = [
    {
      title: "LOGBOG",
      slug: "logbog",
      description: "React app in which authenticated users can post their blogs.",
      fullDescription: "Built a full-stack blogging web application with complete frontend, backend, and database architecture.",
      category: "Web Development",
      technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Express"],
      heroImage: "/images/logbog.png",
      galleryImages: ["/images/logbog.png"],
      challenge: "The client needed a user-friendly blogging platform.",
      solution: "Implemented a full-stack solution with React, Node.js, Express, and MongoDB.",
      featured: true,
      published: true,
      projectUrl: "https://logbog.vercel.app/",
      year: "2024",
    },
    {
      title: "AI Vocal Expert",
      slug: "ai-vocal-expert",
      description: "An AI vocal expert with face authentication for secure access.",
      fullDescription: "Developed an advanced AI-powered vocal assistant combining speech recognition and facial authentication.",
      category: "AI & Machine Learning",
      technologies: ["Python", "TensorFlow", "OpenAI", "Face Recognition", "Speech Recognition"],
      heroImage: "/images/vocalexpert.png",
      galleryImages: ["/images/vocalexpert.png"],
      challenge: "Create a secure, intelligent voice assistant with facial recognition.",
      solution: "Integrated AI models for speech-to-text, OpenAI for responses, and facial recognition for authentication.",
      featured: true,
      published: true,
      year: "2024",
    },
  ];

  for (const proj of sampleProjects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {},
      create: proj,
    });
  }

  console.log("✅ Sample projects seeded");

  console.log("\n🎉 Database seeding complete!");
  console.log(`\n📧 Admin Login: ${adminEmail}`);
  console.log(`🔑 Admin Password: [hidden - check your .env file]`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
