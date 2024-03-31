import { Payment } from "./definitions";

export async function getData(): Promise<Payment[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await response.json();
    const payments: Payment[] = result.map((item: Payment) => ({
      id: item.id,
      username: item.username,
      name: item.name,
      email: item.email,
      amount: Math.floor(Math.random() * (10000 - 1 + 1)) + 1,
    }));
    return payments;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function addUserToServer(userData: Payment) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error adding user to server:", error);
    throw error;
  }
}

export async function deleteUsersFromServer(
  deletedUserIndexes: number[],
  users: Payment[]
) {
  const deletedUserIds = deletedUserIndexes
    .map((index) => users[index]?.id)
    .filter(Boolean);

  try {
    const requests = deletedUserIds.map(async (userId) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      console.log(userId);
      return response.json();
    });

    const responses = await Promise.all(requests);
    console.log(responses);
  } catch (error) {
    console.error("Error when deleting users:", error);
  }
}
