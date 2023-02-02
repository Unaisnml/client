import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

export const getUserProfile = (userId, header) =>
  API.get(`/users/${userId}`, header);

export const getFriendList = (userId, header) =>
  API.get(`/users/${userId}/friends`, header);

export const updateUserProfile = (id, formData) =>
  API.put(`/user/${id}`, formData);

export const editUser = (currentUserId, values) =>
  API.put(`/users/edit-user/${currentUserId}`, values);

export const addRemoveFriends = (_id, friendId) =>
  API.patch(`/users/${_id}/${friendId}`);

export const userSearch = (search) => API.get("users/search/user/" + search);
