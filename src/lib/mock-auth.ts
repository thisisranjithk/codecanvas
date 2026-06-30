export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

const mockUser: User = {
  id: "1",
  fullName: "Ranjith K",
  username: "ranjith7265",
  email: "ranjith@gmail.com",
  role: "ADMIN",
};

export const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === "ranjith@gmail.com" && password === "Ranjith@123") {
      return mockUser;
    }

    throw new Error("Invalid email or password.");
  },
};
