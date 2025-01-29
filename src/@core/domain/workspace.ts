import { z } from "zod";

export const WorkspaceSchema = z.object({
  // id: z.string().nullable(),
  name: z.string().min(1, { message: "Name cannot be empty." }),
  description: z.string().min(1, { message: "Description cannot be empty." }),
  users: z.array(z.string()).nullable(),
});

export class Workspace {
  public readonly id!: string;
  public name!: string;
  public description!: string;

  constructor(data: z.infer<typeof WorkspaceSchema>) {
    const validatedData = WorkspaceSchema.parse(data);
    Object.assign(this, validatedData);
  }
}
