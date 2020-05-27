import React, {useReducer} from 'react'
import Axios from 'axios'
import GithubReducer from './githubReducer'
import {SEARCH_USERS,
SET_LOADING,
CLEAR_USERS,
GET_USER,
GET_REPOS } from '../types'
import GithubContext from './githubContext';

let githubClientID;
let githubClientSecret;

if(process.env.NODE_ENV !== 'production'){
  githubClientID= process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
}
else{
  githubClientID= process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = (props) => {
    const initialState = {
        users: [],
        loading: false,
        user : {},
        repos: []
    }
    const [state,dispatch] = useReducer(GithubReducer,initialState)
    const getUser = async (username) => {
        setLoading();
        const res = await Axios.get(`https://api.github.com/users/${username}?client_id=${githubClientID}&
        client_secret=${githubClientSecret}`);
        dispatch({
            type: GET_USER,
            payload: res.data
        })
      }
      const getUserRepos = async (username) => {
        setLoading();
        const res = await Axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientID}&
        client_secret=${githubClientSecret}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
      }
    const searchUsers = async (text) =>{
        // console.log(text);
        setLoading();
        const res = await Axios.get(`https://api.github.com/search/users?q=${text}&client_id=${githubClientID}&
        client_secret=${githubClientSecret}`);
        dispatch({
            type:SEARCH_USERS,
            payload: res.data.items
        })
      }
      const clearUsers = () =>{
        dispatch({type: CLEAR_USERS})
      }
    const setLoading =() => dispatch({type: SET_LOADING})
    return <GithubContext.Provider value = {{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.location,
        getUser,
        searchUsers,
        clearUsers,
        getUserRepos
    }}>
        {props.children}
    </GithubContext.Provider>
}
export default GithubState
