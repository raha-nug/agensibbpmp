const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function seedRole() {
  try {
    const roles = await prisma.role.createMany({
      data: [
        {
          type: "admin",
        },
        {
          type: "user",
        },
      ],
    });
    console.log("Role seeded successfully:", roles);
  } catch (error) {
    console.error("Error seeding role:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedAdmin() {
  const adminData = {
    nama: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    roleType: "admin",
  };
  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    const admin = await prisma.users.create({
      data: {
        ...adminData,
        password: hashedPassword,
      },
    });

    console.log("Admin registered successfully", admin);
  } catch (error) {
    console.log("Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedUsers() {
  try {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const users = await prisma.users.createMany({
      data: [
        {
          nama: "Kabupaten Bandung",
          email: "rivalnugraha5@gmail.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Bandung",
          email: "rivnime2@gmail.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Bandung Barat",
          email: "kab-bandung-barat@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Bekasi",
          email: "kab-bekasi@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Bogor",
          email: "kab-bogor@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Ciamis",
          email: "kab-ciamis@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Cirebon",
          email: "kab-cirebon@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Garut",
          email: "kab-garut@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Indramayu",
          email: "kab-indramayu@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Karawang",
          email: "kab-karawang@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Kuningan",
          email: "kab-kuningan@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Majalengka",
          email: "kab-majalengka@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Pangandaran",
          email: "kab-pangandaran@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Purwakarta",
          email: "kab-purwakarta@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Subang",
          email: "kab-subang@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Sukabumi",
          email: "kab-sukabumi@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Sumedang",
          email: "kab-sumedang@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kabupaten Tasikmalaya",
          email: "kab-tasikmalaya@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Bandung",
          email: "kota-bandung@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Banjar",
          email: "kota-banjar@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Bekasi",
          email: "kota-bekasi@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Bogor",
          email: "kota-bogor@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Cimahi",
          email: "kota-cimahi@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Cirebon",
          email: "kota-cirebon@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Depok",
          email: "kota-depok@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Sukabumi",
          email: "kota-sukabumi@example.com",
          password: hashedPassword,
          roleType: "user",
        },
        {
          nama: "Kota Tasikmalaya",
          email: "kota-tasikmalaya@example.com",
          password: hashedPassword,
          roleType: "user",
        },
      ],
      skipDuplicates: true, // Optional: Skip inserting if the record already exists (based on unique constraints)
    });

    console.log("Users seeded successfully:", users);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRole();
seedAdmin();
seedUsers();
