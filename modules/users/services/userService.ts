/**
 * Users Module - User management service
 * Replace with real API
 */

export type UserRecord = {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Inactive";
};

export async function getUsers(): Promise<UserRecord[]> {
  // TODO: Fetch from API
  return [
    { id: "1", name: "John Doe", role: "Admin", status: "Active" },
    { id: "2", name: "Jane Smith", role: "User", status: "Active" },
    { id: "3", name: "Bob Wilson", role: "User", status: "Inactive" },
  ];
}
