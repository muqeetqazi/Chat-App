// userAuthReducers.js

const userAuthReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user; // Update state directly with action.user
        case 'SET_USER_NULL':
            return null; // Reset user to null
        default:
            return state;
    }
}

export default userAuthReducer;
