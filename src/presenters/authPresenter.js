// src/presenters/authPresenter.js
import UserModel from '../models/userModel.js';

const userModel = new UserModel();

export const handleRegisterSubmit = async (event) => {
  event.preventDefault();
  
  const form = event.target;
  const name = form.querySelector('#name').value;
  const email = form.querySelector('#email').value;
  const password = form.querySelector('#password').value;
  
  try {
    await userModel.register({ name, email, password });
    alert('Registrasi berhasil! Silahkan login.');
    window.location.href = 'login.html';
  } catch (error) {
    alert(`Registrasi gagal: ${error.message}`);
  }
};

export const handleLoginSubmit = async (event) => {
  event.preventDefault();
  
  const form = event.target;
  const email = form.querySelector('#email').value;
  const password = form.querySelector('#password').value;
  
  try {
    const user = await userModel.login(email, password);
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(`Login gagal: ${error.message}`);
  }
};