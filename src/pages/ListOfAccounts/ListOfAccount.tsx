import Table from "@components/Table/Table";
import { usersService } from "@services/usersService";
import { useEffect } from "react";
import { setLoading, setUsers } from "@redux/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";

function ListOfAccount() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    async function fetchUsers() {
      dispatch(setLoading(true));
      try {
        const fetchedUsers = await usersService.getUsers();
        dispatch(setUsers(fetchedUsers));
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        dispatch(setLoading(false));
      }
    }
    fetchUsers();
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleDeleteUser = async (id: string) => {
    const succes = await usersService.deleteUser(id);
    if (succes) {
      const updatedUsers = await usersService.getUsers();
      dispatch(setUsers(updatedUsers));
    }
  };

  const formattedUsers = users.map((user) => ({
    id: user.id,
    username: user.username,
    dateCreated: new Date(Number(user.createdAt)).toISOString().split("T")[0],
  }));

  return <Table users={formattedUsers} ondeleteUser={handleDeleteUser} />;
}

export default ListOfAccount;
