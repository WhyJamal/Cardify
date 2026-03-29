import { WorkspaceMember } from "@/shared/types";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
     
      workspace?: {
        id: string;
        name: string;
        members: WorkspaceMember[];
      };
    };
  }
}