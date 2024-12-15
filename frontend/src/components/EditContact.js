import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone1: '',
    phone2: '',
    address: '',
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(`/api/contacts/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContact();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/contacts/${id}`, formData);
      alert('Contact updated successfully!');
      navigate('/contacts');
    } catch (error) {
      console.error(error);
      alert('Error updating contact');
    }
  };

  return (
    <div>
      <h2>Edit Contact</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" value={formData.firstName} onChange={handleChange} required />
        <input name="middleName" value={formData.middleName} onChange={handleChange} />
        <input name="lastName" value={formData.lastName} onChange={handleChange} required />
        <input name="email" value={formData.email} onChange={handleChange} required />
        <input name="phone1" value={formData.phone1} onChange={handleChange} required />
        <input name="phone2" value={formData.phone2} onChange={handleChange} />
        <textarea name="address" value={formData.address} onChange={handleChange} required />
        <button type="submit">Update Contact</button>
      </form>
    </div>
  );
};

export default EditContact;
