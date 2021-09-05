import React, { useEffect, useState } from "react";
import { Search, List, Image } from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import styles from "./Search.module.css";
import cookie from "js-cookie";
let cancel;

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([{}]);

  const handleChange = async (e) => {
    const { value } = e.target;
    setLoading(true);
    if (value.length === 0) return setQuery(value);
    setQuery(value);
    try {
      cancel && cancel();
      // const CancelToken = axios.CancelToken;
      const token = cookie.get("token");
      const results = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: {
          Authorization: token,
        },
        // cancelToken: new CancelToken((canceler) => {
        //   cancel = canceler;
        // }),
      });
      if (results.data.length === 0) return setLoading(false);
      const mappedRes = results.data.map((result) => {
        return {
          _id: result._id,
          profilePicUrl: result.profilePicUrl,
          name: result.name,
        };
      });
      console.log({ results, mappedRes });
      setLoading(false);
      setResults(mappedRes);
    } catch (err) {
      console.error("Error Searching", err);
    }
  };

  useEffect(() => {
    if (query.length === 0 && loading) setLoading(false);
  }, [query]);

  return (
    <Search
      className={styles["search-wrapper"]}
      aligned="right"
      onBlur={() => {
        if (results.length > 0) {
          setQuery("");
          setResults([]);
        }
      }}
      loading={loading}
      value={query}
      results={results}
      resultRenderer={ResultRenderer}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect={(e, data) => {
        console.log("Search Response", data);
      }}
    ></Search>
  );
};

const ResultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List key={_id}>
      <div className={styles.listItem}>
        <img
          className={styles.avatar}
          src={profilePicUrl}
          alt="Profile Avatar"
        />
        <div className={styles.desc}>{name}</div>
      </div>
    </List>
  );
};

export default SearchComponent;
