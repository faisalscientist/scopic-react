import React, { useState } from 'react'
import Items from './items'

const Home = () => {
  const [priceSort, setPriceSort] = useState('asc');
  const [items, setItems] = useState([]);

  const onFetchedItems = (items) => {
    setItems(items)
  }
  return (
    <><div className="px-5 md:px-10 py-5">
        <div className="mt-20">
          <div className="flex flex-col md:flex-row flex-nowrap space-y-10 md:space-y-0 md:space-x-5">
            <div className="w-12/12 md:w-3/12 mt-0 md:mt-10">
              {items.length > 0 ? <div className="relative md:fixed">
                <div>Sort By: </div>
                <div className="bg-white rounded-lg px-3 py-2 mt-2 border-2 border-gray-300">
                  <select onChange={e => setPriceSort(e.target.value)} className="w-full border-none focus:outline-none font-light" id="">
                    <option value="asc">Price from low to high</option>
                    <option value="desc">Price from high to low</option>
                  </select>
                </div>
              </div> : ''}
            </div>
            <div className="w-12/12 md:w-9/12 bg-white shadow-lg px-5 py-10">
              <div className="font-base text-lg text-center mb-10">Aunction Items</div>
              <Items priceSort={priceSort} fetchedItems={onFetchedItems}/>
            </div>
          </div>
        </div>
      </div>
     
    </>
  )
}

export default Home
