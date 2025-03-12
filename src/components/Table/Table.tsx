import { useState } from "react";
import styles from "./Table.module.css";
import EditUser from "@pages/EditUser/EditUser";
import { usersService } from "@services/usersService";
import { useAppDispatch } from "@hooks/reduxHooks";
import { setUsers } from "@redux/slices/usersSlice";

interface UserInTable {
  id: string;
  username: string;
  dateCreated: string;
}

interface TableProps {
  users: UserInTable[];
  ondeleteUser: (id: string) => void;
}

interface FullInfoUser {
  id: string;
  username: string;
  phone: string;
  birthday: string;
  gender: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export default function Table({ users, ondeleteUser }: TableProps) {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FullInfoUser | null>(null);

  async function openDialog(user: UserInTable) {
    try {
      const fullInfoUser = await usersService.getUserById(user.id);
      setSelectedUser(fullInfoUser);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  }
  async function closeDialog() {
    setIsDialogOpen(false);
    setSelectedUser(null);
    const updatedUsers = await usersService.getUsers();
    dispatch(setUsers(updatedUsers));
  }
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>№</th>
            <th>Username</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.dateCreated}</td>
              <td>
                <button onClick={() => openDialog(user)}>Edit</button>
                <button onClick={() => ondeleteUser(user.id)}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDialogOpen && selectedUser && (
        <EditUser onCloseDialog={closeDialog} user={selectedUser} />
      )}
    </>
  );
}
