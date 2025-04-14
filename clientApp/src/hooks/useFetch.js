import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
  
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get(url);
                setData(res.data);
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const reFetch = async () => {
        setLoading(true);
        try {
            const res = await api.get(url);
            setData(res.data);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { data, error, loading, reFetch };
};

export default useFetch;
