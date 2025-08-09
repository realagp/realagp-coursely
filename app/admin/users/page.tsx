import { getUsers, UserTable } from "@/app/data/admin/get-all-users";
import { UsersDataTable } from "./_components/data-table";

export default async function UsersPage() {
  const tableData: UserTable[] = await getUsers();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UsersDataTable data={tableData} />
    </div>
  );
}
