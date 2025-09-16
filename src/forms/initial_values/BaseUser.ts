export interface BaseUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "STAFF" | "MEMBER";
  isActive: boolean;
}

export const baseInitialValues: Omit<BaseUser, "id"> = {
  email: "",
  password: "",
  name: "",
  role: "MEMBER",
  isActive: false,
};
