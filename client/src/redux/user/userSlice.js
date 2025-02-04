import { createSlice } from "@reduxjs/toolkit";
const initialState={
    currentUser:null,
}
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        logInSuccess:(state,action)=>{
            state.currentUser=action.payload;
        }
    }
});
export const {logInSuccess}=userSlice.actions;
export default userSlice.reducer;