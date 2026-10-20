import z from "zod"


const schema = z.object({
  name:z.string({error:"Name is required"}).trim().min(1, "Name is required"),
  profile :z.string().optional(),
  status:z.enum(["active", "blocked"]).default("active") ,
  email: z.email({error: "A valid email is required"}),
  password: z.string({error: "Password is required"}).min(1, "Password is required"),
})


const create = z.object({
  body:schema
})
// const update = z.object({
//     body:schema.partial()
// })

const userValidationSchema = {
    create
}

export default userValidationSchema
