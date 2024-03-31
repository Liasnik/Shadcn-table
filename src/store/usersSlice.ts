import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Payment } from "../lib/definitions";
import { getData, addUserToServer, deleteUsersFromServer } from "../lib/api";

interface UsersState {
  users: Payment[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: UsersState = {
  users: [],
  status: "idle",
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const data = await getData();
  return data;
});

export const addUserAsync = createAsyncThunk(
  "users/addUser",
  async (userData: Payment) => {
    const newUser = await addUserToServer(userData);
    return newUser;
  }
);

export const deleteUsersAsync = createAsyncThunk(
  "users/deleteUsers",
  async (deletedUserIds: number[], { getState }) => {
    const { users } = getState() as { users: UsersState };

    const validDeletedUserIds = deletedUserIds.filter((id) =>
      users.users[id] ? true : false
    );

    await deleteUsersFromServer(validDeletedUserIds, users.users);
    return validDeletedUserIds;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUsersLocally: (state, action: PayloadAction<Payment[]>) => {
      state.users.push(...action.payload);
    },
    removeUsersLocally: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach((id) => {
        state.users = state.users.filter((user) => user.id !== id);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<Payment[]>) => {
          state.status = "succeeded";
          state.users = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(
        addUserAsync.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.users.push(action.payload);
        }
      )
      .addCase(
        deleteUsersAsync.fulfilled,
        (state, action: PayloadAction<number[]>) => {
          // state.users = state.users.filter((user) =>
          //   user.id ? !action.payload.includes(user.id) : true
          // );
          state.users = state.users.filter(
            (_, index) => !action.payload.includes(index)
          );
        }
      );
  },
});

export const { addUsersLocally, removeUsersLocally } = usersSlice.actions;

export default usersSlice.reducer;
