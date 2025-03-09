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
        },
        updateProfileSuccess:(state,action)=>{
            state.currentUser=action.payload;
        },
        logOutSuccess:(state)=>{
            state.currentUser=null;
        }
    }
});
export const {logInSuccess,updateProfileSuccess,logOutSuccess}=userSlice.actions;
export default userSlice.reducer;