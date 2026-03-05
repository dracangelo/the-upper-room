const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@upperroom.forum" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@upperroom.forum",
      password: adminPassword,
      role: "ADMIN",
      isApproved: true,
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create sample users
  const users = [
    { name: "Pastor John", email: "john@example.com", role: "PASTOR" },
    { name: "Missionary Sarah", email: "sarah@example.com", role: "MISSIONARY" },
    { name: "Grace Mwangi", email: "grace@example.com", role: "MEMBER" },
    { name: "David Okonkwo", email: "david@example.com", role: "MEMBER" },
    { name: "Dr. Michael Chen", email: "michael@example.com", role: "PASTOR" },
  ];

  for (const userData of users) {
    const password = await bcrypt.hash("password123", 10);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password,
        isApproved: true,
      },
    });
    console.log("✅ Created user:", user.email);
  }

  // Create categories
  const blogCategories = [
    { name: "Theology", slug: "theology", description: "Deep biblical doctrine and systematic theology", type: "BLOG" },
    { name: "Missions", slug: "missions", description: "Mission field updates and strategies", type: "BLOG" },
    { name: "Discipleship", slug: "discipleship", description: "Growing in faith and following Christ", type: "BLOG" },
    { name: "Testimonies", slug: "testimonies", description: "Personal stories of God's faithfulness", type: "BLOG" },
    { name: "Evangelism", slug: "evangelism", description: "Sharing the Gospel effectively", type: "BLOG" },
  ];

  for (const cat of blogCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log("✅ Created category:", cat.name);
  }

  // Create forum categories
  const forumCategories = [
    { name: "Theology Debates", slug: "theology-debates", description: "Moderated discussions on biblical doctrine", type: "FORUM" },
    { name: "Prayer Requests", slug: "prayer-requests", description: "Share and pray for needs", type: "FORUM" },
    { name: "Mission Field Discussions", slug: "mission-discussions", description: "Talk about mission work worldwide", type: "FORUM" },
    { name: "Church Leadership", slug: "church-leadership", description: "Resources for church leaders", type: "FORUM" },
    { name: "Youth Ministry", slug: "youth-ministry", description: "Ideas for youth workers", type: "FORUM" },
    { name: "Forum Testimonies", slug: "forum-testimonies", description: "Share your story of faith", type: "FORUM" },
  ];

  for (const cat of forumCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log("✅ Created forum category:", cat.name);
  }

  // Create sample posts
  const theologyCategory = await prisma.category.findUnique({ where: { slug: "theology" } });
  const pastorJohn = await prisma.user.findUnique({ where: { email: "john@example.com" } });

  if (theologyCategory && pastorJohn) {
    await prisma.post.create({
      data: {
        title: "Understanding the Trinity: A Biblical Foundation",
        slug: "understanding-trinity-biblical-foundation",
        content: `The doctrine of the Trinity is one of the most profound and essential teachings of the Christian faith...`,
        excerpt: "Exploring the nature of God as Father, Son, and Holy Spirit through Scripture...",
        featured: true,
        published: true,
        authorId: pastorJohn.id,
        categoryId: theologyCategory.id,
      },
    });
    console.log("✅ Created sample post");
  }

  // Create sample prayer requests
  const grace = await prisma.user.findUnique({ where: { email: "grace@example.com" } });
  if (grace) {
    await prisma.prayerRequest.create({
      data: {
        title: "Healing for my mother",
        content: "My mother has been diagnosed with cancer and is starting chemotherapy next week. Please pray for healing, strength, and peace for our family during this difficult time.",
        isAnonymous: false,
        prayerCount: 156,
        isAnswered: false,
        authorId: grace.id,
      },
    });
    console.log("✅ Created sample prayer request");
  }

  // Create sample missionary
  const missionarySarah = await prisma.user.findUnique({ where: { email: "sarah@example.com" } });
  if (missionarySarah) {
    await prisma.missionary.create({
      data: {
        userId: missionarySarah.id,
        country: "Kenya",
        organization: "Africa Inland Mission",
        ministryFocus: "Church planting among unreached people groups in Northern Kenya",
        prayerNeeds: "Health, safety in travel, open hearts",
        supportLink: "https://example.com/support",
        isActive: true,
      },
    });
    console.log("✅ Created sample missionary");
  }

  console.log("\n✨ Seed completed successfully!");
  console.log("\nLogin credentials:");
  console.log("Admin: admin@upperroom.forum / admin123");
  console.log("Users: [email] / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
