import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchIcon } from '@heroicons/react/outline'
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';

const Items = ({priceSort = 'asc'}) => {
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState({});
  const [displayItems, setDisplayItems] = useState([])
  const [page, setPage] = useState(1)
  const [errorMessage, setErrorMessage] = useState('');

  const filter = () => {
    const value = document.querySelector('#searchInput').value;
    setSearchKey(value)
  }
  
  const handlePageChange = (e) => {
    const selectedPage = e.selected;
    setPage(selectedPage + 1);
  }

  useEffect( () => {
    const fetchData = async () => {
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/auction-items?page=${page}&searchKey=${searchKey}&orderByPrice=${priceSort}`);
      if(searchKey !== '' && data.data.length <= 0){
        setErrorMessage(`No item found with search key: ${searchKey}`);
        return;
      }
      setItems(data);
      setDisplayItems(data.data);
    }
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [page, searchKey, priceSort])


  return (
    <>
      {!loading ? <><div className="text-red-500 text-center mb-3">{errorMessage}</div>
      <div className="flex justify-between items-center">
        <div className="border border-gray-300 w-11/12 flex rounded-lg px-3 py-2">
          <input type="text" id="searchInput" placeholder="Enter search key" className="flex-1 outline-none focus:outline-none" />
        </div>
        <div className="w-1/12 mr-2 md:mr-0">
          <SearchIcon className="h-5 w-5 ml-5 cursor-pointer" onClick={filter}/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 mt-10 gap-x-4 gap-y-10">
        {displayItems.map((item, i) => {
          return <div key={item.id} className="rounded-lg shadow-lg">
            <img src={`/auction-images/item${i + 1}.jpeg`} alt="Car1" className="object-contain h-20 w-full mt-5"/>
            <div className="px-3 py-2">
            <div className="text-center font-base text-gray-500 mb-10">
              {item.name}
            </div>
            <div className="flex justify-between">
              <div className="font-normal text-sm">Price: </div>
              <div className="font-light text-sm">${item.price}</div>
            </div>
            <div className="mt-8 text-center">
              <Link to={`/items/${item.id}`}>
                <button className="bg-green-400 hover:bg-green-500 font-light text-sm focus:outline-none mb-3 text-white px-3 py-1 rounded-full">
                  Bid Now
                </button>
              </Link>
            </div>
          </div>
          </div>
        })}
      </div>
      <div className="mt-10 flex justify-between items-center">
        <div>Showing {items.from} to {items.to} of {items.total} entries</div>
        <ReactPaginate
          previousLabel={<FontAwesomeIcon icon={faChevronLeft} size="2x" />}
          nextLabel={<FontAwesomeIcon icon={faChevronRight} size="2x" />}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={items.last_page ? items.last_page : 0}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'paginator'}
          activeClassName={'active'}
        />
      </div></> : <div className="text-center mt-20"><FontAwesomeIcon icon={faSpinner} spin size="2x" /></div>}
    </>
  )
}

export default Items
