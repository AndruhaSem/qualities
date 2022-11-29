import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import qualityServise from "../services/quality.service";

const QualitiesContex = React.createContext();

export const useQualities = () => {
  return useContext(QualitiesContex);
};
export const QualitiesProvider = ({ children }) => {
  const [qualities, setQualities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const prevState = useRef();
  useEffect(() => {
    const getQualities = async () => {
      try {
        const { content } = await qualityServise.fetcAll();
        setQualities(content);
        setLoading(false);
      } catch (error) {
        errorCatcher(error);
      }
    };
    getQualities();
  }, []);
  const getQuality = (id) => {
    return qualities.find((q) => q._id === id);
  };
  const updateQuality = async ({ _id: id, ...data }) => {
    try {
      const { content } = await qualityServise.update(id, data);
      setQualities((prevState) =>
        prevState.map((item) => {
          if (item._id === content._id) {
            return content;
          }
          return item;
        })
      );
      return content;
    } catch (error) {
      errorCatcher(error);
    }
  };
  // Не Аптимистичный apdate
  const addQuality = async (data) => {
    try {
      const { content } = await qualityServise.create(data);
      setQualities((prevState) => [...prevState, content]);
      return content;
    } catch (error) {
      errorCatcher(error);
    }
  };
  //Аптимистичный apdate
  const deleteQuality = async (id) => {
    prevState.current = qualities;

    setQualities((prevState) => {
      return prevState.filter((item) => item._id !== id);
    });

    try {
      await qualityServise.delete(id);
    } catch (error) {
      errorCatcher(error);
      setQualities(prevState.current);
    }
  };
  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  }
  useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);
  return (
    <QualitiesContex.Provider
      value={{
        qualities,
        getQuality,
        updateQuality,
        addQuality,
        deleteQuality,
      }}
    >
      {!isLoading ? children : <h1>Qualities Loading...</h1>}
    </QualitiesContex.Provider>
  );
};
