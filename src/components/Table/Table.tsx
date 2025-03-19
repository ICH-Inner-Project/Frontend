import styles from "./Table.module.css";

interface User {
    id: number;
    username: string;
    dateCreated: string;
}

interface TableProps {
    users: User[];
}

export default function Table({ users }: TableProps) {
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
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.dateCreated}</td>
                            <td>
                                <button>Edit</button>
                                <button>×</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
