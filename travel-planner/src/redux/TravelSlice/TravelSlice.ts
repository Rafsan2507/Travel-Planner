import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface activity {
  activity: string;
}

export interface Travel {
  id?: string;
  userId: string;
  name: string;
  destinations: { destination: string; activities: activity[] }[];
  description: string;
  startdate?: Date;
  enddate?: Date;
  budget?: number;
  expenses?: { id?: string; category: string; amount: number }[];
}

export interface TravelState {
  travels: Partial<Travel>[];
  travel: Partial<Travel>;
}

const initialState: TravelState = {
  travels: [],
  travel: {},
};
const Base_URL = "http://localhost:5000";

export const TravelSlice = createSlice({
  name: "travel",
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(
      addTravel.fulfilled,
      (state, action: PayloadAction<Travel>) => {
        state.travels.push(action.payload);
      }
    );
    builder.addCase(
      getTravels.fulfilled,
      (state, action: PayloadAction<Travel[]>) => {
        state.travels = action.payload;
      }
    );
    builder.addCase(
      getTravelsById.fulfilled,
      (state, action: PayloadAction<Travel>) => {
        state.travel = action.payload;
      }
    );
    builder.addCase(
      updateTravel.fulfilled,
      (state, action: PayloadAction<Travel>) => {
        const updatedTravel = action.payload;
        const index = state.travels.findIndex(
          (travel) => travel.id === updatedTravel.id
        );
        if (index !== -1) {
          state.travels[index] = updatedTravel;
        }
      }
    );
    builder.addCase(
      deleteTravelById.fulfilled,
      (state, action: PayloadAction<Travel>) => {
        state.travels = state.travels.filter(
          (travel) => travel.id !== action.payload.id
        );
      }
    );
    builder.addCase(
      addExpense.fulfilled,
      (state, action: PayloadAction<Travel>) => {
        const updatedTravel = action.payload;
        const index = state.travels.findIndex(
          (travel) => travel.id === updatedTravel.id
        );

        if (index !== -1) {
          state.travels[index].expenses = updatedTravel.expenses;
        }
      }
    );
  },
});

export const addTravel = createAsyncThunk(
  "travel/addTravel",
  async (travel: Partial<Travel>) => {
    const response = await axios.post(`${Base_URL}/travels`, travel);
    return response.data;
  }
);

export const getTravels = createAsyncThunk(
  "travel/getTravels",
  async (userId: string) => {
    const response = await axios.get(`${Base_URL}/travels?userId=${userId}`);
    return response.data;
  }
);

export const getTravelsById = createAsyncThunk(
  "travel/getTravelsById",
  async (id: string) => {
    const response = await axios.get(`${Base_URL}/travels/${id}`);
    return response.data;
  }
);

export const updateTravel = createAsyncThunk(
  "travel/updateTravel",
  async (updatedTravel: Partial<Travel>) => {
    const response = await axios.put(
      `${Base_URL}/travels/${updatedTravel.id}`,
      updatedTravel
    );
    return response.data;
  }
);

export const deleteTravelById = createAsyncThunk(
  "travel/deleteTarvelById",
  async (id: string) => {
    const response = await axios.delete(`${Base_URL}/travels/${id}`);
    return response.data;
  }
);

const API_KEY = "5e3371a57bf54d4caa735939463733c7";

export const getCoordinates = async (place: string) => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    place
  )}&key=${API_KEY}&limit=1`;

  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng };
    } else {
      console.error(`No coordinates found for ${place}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export const addExpense = createAsyncThunk(
  "travel/addExpense",
  async ({ planId, expense }: { planId: string; expense: any }) => {
    const response = await axios.get(`${Base_URL}/travels/${planId}`);
    const travel = response.data;

    // Check if the travel object has an 'expenses' array
    if (!travel.expenses) {
      travel.expenses = [];
    }

    travel.expenses.push(expense);

    // Send the updated travel object back to the server
    const updateResponse = await axios.put(
      `${Base_URL}/travels/${planId}`,
      travel
    );

    return updateResponse.data;
  }
);
export default TravelSlice.reducer;
