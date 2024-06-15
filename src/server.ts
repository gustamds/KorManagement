import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = fastify();

const prisma = new PrismaClient();

/*STAFFS CREATION*/

app.get("/staffs", async () => {
  const staffs = await prisma.staff.findMany();

  return { staffs };
});

app.post("/staffs", async (request, reply) => {
  const createSchemaStaffs = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
    address: z.string(),
    phone: z.string(),
    pps: z.string(),
    euCitizen: z.boolean(),
    irelandTime: z.string(),
    englishLevel: z.enum([
      "NATIVE",
      "FLUENT",
      "PROFICIENT",
      "ADVANCED",
      "UPPER_INTERMEDIATE",
      "INTERMEDIATE",
      "PRE_INTERMEDIATE",
      "ELEMENTARY",
      "BEGINNER",
    ]),
    staffExperience: z.enum([
      "RETAIL",
      "HOSPITALITY",
      "TRAVEL",
      "HEALTHCARE",
      "CLEANING",
      "NONE",
    ]),
    staffDescribeExperience: z.string(),
    staffPhoto: z.string(),
    staffId: z.string(),
    staffProofOfWork: z.string(),
    aboutStaff: z.string().optional(),
  });

  const {
    email,
    password,
    name,
    dob,
    address,
    phone,
    pps,
    euCitizen,
    irelandTime,
    englishLevel,
    staffExperience,
    staffDescribeExperience,
    staffPhoto,
    staffId,
    staffProofOfWork,
    aboutStaff,
  } = createSchemaStaffs.parse(request.body);

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.staff.create({
    data: {
      email,
      password: hashedPassword,
      name,
      dob,
      address,
      phone,
      pps,
      euCitizen,
      irelandTime,
      englishLevel,
      staffExperience,
      staffDescribeExperience,
      staffPhoto,
      staffId,
      staffProofOfWork,
      aboutStaff,
    }
  })

  return reply.status(201).send();
});

app.put("/staffs/:id" , async (request) => {
  const { id } = request.params as { id: string };

  const updateSchemaStaffs = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
    address: z.string(),
    phone: z.string(),
    pps: z.string(),
    euCitizen: z.boolean(),
    irelandTime: z.string(),
    englishLevel: z.enum([
      "NATIVE",
      "FLUENT",
      "PROFICIENT",
      "ADVANCED",
      "UPPER_INTERMEDIATE",
      "INTERMEDIATE",
      "PRE_INTERMEDIATE",
      "ELEMENTARY",
      "BEGINNER",
    ]),
    staffExperience: z.enum([
      "RETAIL",
      "HOSPITALITY",
      "TRAVEL",
      "HEALTHCARE",
      "CLEANING",
      "NONE",
    ]),
    staffDescribeExperience: z.string(),
    staffPhoto: z.string(),
    staffId: z.string(),
    staffProofOfWork: z.string(),
    aboutStaff: z.string().optional(),
  });

  const {
    email,
    password,
    name,
    dob,
    address,
    phone,
    pps,
    euCitizen,
    irelandTime,
    englishLevel,
    staffExperience,
    staffDescribeExperience,
    staffPhoto,
    staffId,
    staffProofOfWork,
    aboutStaff,
  } = updateSchemaStaffs.parse(request.body);

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.staff.update({
    where: { id },
    data:{
      email,
      password: hashedPassword,
      name,
      dob,
      address,
      phone,
      pps,
      euCitizen,
      irelandTime,
      englishLevel,
      staffExperience,
      staffDescribeExperience,
      staffPhoto,
      staffId,
      staffProofOfWork,
      aboutStaff,
    }
  })
})

app.delete("/staffs/:id", async (request) => {
  const { id } = request.params as { id: string };
  await prisma.staff.delete({
    where: { id }
  })

})

/*LOGIN*/

app.post("/staffs/login", async (request, reply) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  
  const {email, password} = loginSchema.parse(request.body);

  const staffs = await prisma.staff.findUnique({
    where: { email },
  });

  if(!staffs){
    return reply.status(400).send({error: 'Invalid Email or Password'});
  }

  const isPasswordInvalid = await bcrypt.compare(password, staffs.password);

  if(!isPasswordInvalid){
    return reply.status(400).send({error: 'Invalid Email or Password'});
  }

  const token = jwt.sign({userId : staffs.id}, 'your_jtw_token', {expiresIn: '1h'});

  return reply.send({token});
})

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP SERVER RUNNING.....');
})