import { useState } from "react";
import "./App.css";
import { Pagination } from "antd";
import type { PaginationProps } from "antd";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [moviesData, setMoviesData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(undefined);

  const searchMovies = async (quertTerm: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${quertTerm}`
    );
    const data = await response.json();
    setMoviesData(data.results);
    setTotal(data.total_results);
  };

  const debounce = (func: any, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = debounce((e: any) => {
    searchMovies(e.target.value);
    setSearchTerm(e.target.value);
  }, 300);

  const fetchByPage = async (page: number) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${searchTerm}&page=${page}`
    );
    const data = await response.json();
    setMoviesData(data.results);
  };

  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setCurrent(page);
    fetchByPage(page);
  };

  return (
    <div className="App p-16">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="border border-gray-300 p-2 rounded-lg"
          onChange={handleSearch}
        />
      </div>
      <div>
        {moviesData.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {moviesData.map((movie: Movie) => (
                <div
                  key={movie.id}
                  className="border border-gray-300 p-2 rounded-lg w-full"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    style={{
                      height: "200px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                  <h2 className="font-bold text-center">{movie.title}</h2>
                </div>
              ))}
            </div>
            <Pagination current={current} total={total} onChange={onChange} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
