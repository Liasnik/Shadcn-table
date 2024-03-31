import { createContext, useEffect, useState } from "react";
import { getData } from "./lib/api";
import { Payment } from "./lib/definitions";

export const UsersContext = createContext<{
  users: Payment[];
  loading: boolean;
  addUsers: (newUser: Payment[]) => void;
  deleteUsers: (deletedUserIds: number[]) => void;
}>({
  users: [],
  loading: false,
  addUsers: () => {},
  deleteUsers: () => {},
});

export function UsersContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [users, setUsers] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const preload = async () => {
      setLoading(true);
      const data = await getData();
      setUsers(data);
      setLoading(false);
    };
    preload();
  }, []);

  // function addUsers(newUser: Payment | Payment[]) {
  //   if (Array.isArray(newUser)) {
  //     setUsers((prev) => [...prev, ...newUser]);
  //   } else {
  //     setUsers((prev) => [...prev, newUser]);
  //   }
  // }

  function addUsers(newUser: Payment | Payment[]) {
    setUsers((prev) => {
      const updatedUsers = Array.isArray(newUser) ? newUser : [newUser];
      return [...prev, ...updatedUsers];
    });
  }

  function deleteUsers(deletedUserIds: number[]) {
    setUsers((prevUsers) =>
      prevUsers.filter((_, index) => !deletedUserIds.includes(index))
    );
    console.log(deletedUserIds);
  }

  return (
    <UsersContext.Provider value={{ users, loading, addUsers, deleteUsers }}>
      {children}
    </UsersContext.Provider>
  );
}
