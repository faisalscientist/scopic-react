import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Breadcrumb from '../components/Breadcrumb';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ItemDetails = () => {
  const {id} = useParams();
  const [timer, setTimer] = useState({})
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitBidLoading, setSubmitBidLoading] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [payload, setPayload] = useState({amount: 0, bidder: localStorage.getItem('user'), auction_item_id: ''});

  const submitBid = async() => {
    setErrorMessage('')
    setSuccessMessage('')
    console.log(payload);
    setSubmitBidLoading(true);
    payload['auction_item_id'] = item.id;
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/bid`, payload);
      setSuccessMessage('Your bid has been successfully submitted');
      console.log(item);
      item.bids[0] = data;
    } catch (error) {
      const {data, status} = error.response;
      if(status === 400){
        for (const key in data) {
          const error = data[key];
          setErrorMessage(`${errorMessage}${errorMessage !== ''  ? '<br>' : ''}${error[0]}`)
        }
        setErrorMessage(data.message);
      }
    }
    setSubmitBidLoading(false);
  }

  const countDown = (deadline) =>  {
    const total = Date.parse(deadline) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
      
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }

  useEffect(() => {
    let isMounted = true;
    const getItem = async() => {
      setLoading(true);
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/auction-items/${id}`);
      if(isMounted){
        setDeadline(data.deadline);
        setItem(data);
        setLoading(false);
      }
    }
    getItem();
    return () => { isMounted = false };
  }, [id])

  useEffect(() => {
    let counter = setInterval(() => {
      if(deadline !== null){
        setTimer(countDown(deadline))
      }
    }, 1000);
    return () => {
      if(timer.total <= 0){
        clearInterval(counter)
      }
    };
  }, [timer, deadline])
  return (
    <>
    {!loading ? 
    <div className="px-5 md:px-10 py-5">
      <Breadcrumb currentPage={'Details'} />
      <div className="mt-10">
        {Object.keys(item).length > 0 ? <div className="flex flex-col md:flex-row space-x-0 md:space-x-10">
          <img src={`/auction-images/item${item.id}.jpeg`} alt="Item" className="rounded-t-lg h-96 w-full md:w-4/12"/>
          <div className="flex-1 mt-10 md:mt-0 bg-white px-5 py-8 rounded-lg shadow-lg">
            <div className="font-bold text-lg">{item.name}</div>
            <div className="mt-5 font-light flex">
              {item.description}
            </div>
            <div className="border border-gray-300 flex-1 mt-3"></div>
            {errorMessage !== '' ? <div className="mt-3 bg-red-400 text-red-100 px-2 text-center py-2" dangerouslySetInnerHTML={{__html: errorMessage}}></div>
            :(successMessage && <div className="mt-3 bg-green-700 text-green-200 px-2 text-center py-2">{successMessage}</div>)}
            <div className="mt-10 font-bold flex justify-between">
              <div className="flex-1 flex justify-between">
              {item.bids && item.bids.length > 0 ? 
                <div className="flex"><div className="font-bold text-sm mr-5">Current Bid: </div>
                <div className="font-bold text-sm">${item.bids[0].amount}</div></div>
                : <i className="font-bold text-sm">No bids at this time</i>
                }
                <div className="flex">
                  <div className="font-bold text-sm mr-5">Price: </div>
                  <div className="font-bold text-sm">${item.price}</div>
                </div>
              </div>
            </div>
            <div className="mt-10 font-bold flex md:flex-row flex-col md:space-x-10 space-x-0">
              <div className="border bg-white border-gray-300 w-6/6 md:w-2/6 flex rounded-lg px-3 py-2">
                <input type="number" name="amount" onChange={e => setPayload({...payload, [e.target.name]: +e.target.value})} placeholder="Enter amount($)" className="flex-1 bg-transparent w-full md:w-10 outline-none focus:outline-none" />
              </div>
              <div className="flex justify-center flex-col md:flex-row space-x-0 md:space-x-4 md:items-center items-start">
                <div className="flex justify-center items-center space-x-4 md:my-0 my-5">
                  <input type="checkbox" name="autobid" onChange={e => setPayload({...payload, [e.target.name]: e.target.checked ? 'yes' : 'no'})}/> 
                  <span>Auto-bid</span>
                </div>
                <button onClick={submitBid} disabled={submitBidLoading || payload.amount <= 0} className={`focus:outline-none hover:bg-blue-600 bg-blue-500 py-2 px-3 text-md rounded-md text-white ${submitBidLoading || payload.amount <= 0 ? 'cursor-not-allowed' : 'cursor-pointer'} ${submitBidLoading || payload.amount <= 0 ? 'opacity-50' : ''}`}>
                  Submit Bid {submitBidLoading && <FontAwesomeIcon icon={faSpinner} spin className="ml-3" />}
                </button>
              </div>
            </div>
            {deadline !== null && <div className="mt-14 md:mt-20 flex flex-col items-center mb-10">
              <div>Expires In:</div>
              <div className="flex-1 flex space-x-10 mt-5 justify-between">
                <div className="flex flex-col">
                  <div className="bg-blue-500 w-10 flex items-center justify-center text-white px-3 py-2">
                    <div>{timer.days}</div>
                  </div>
                  <div className="text-center">Days</div>
                </div>
                <div className="flex flex-col">
                  <div className="bg-blue-500 w-10 flex items-center justify-center text-white px-3 py-2">
                    <div>{timer.hours}</div>
                  </div>
                  <div className="text-center">Hrs</div>
                </div>
                <div className="flex flex-col">
                  <div className="bg-blue-500 w-10 flex items-center justify-center text-white px-3 py-2">
                    <div>{timer.minutes}</div>
                  </div>
                  <div className="text-center">Mins</div>
                </div>
                <div className="flex flex-col">
                  <div className="bg-blue-500 w-10 flex items-center justify-center text-white px-3 py-2">
                    <div>{timer.seconds}</div>
                  </div>
                  <div className="text-center">Secs</div>
                </div>
              </div>
            </div>}
          </div>
        </div> : <div className="text-center mt-20 text-xl font-base">No item found with id: {id}</div>}
      </div>
    </div> : <div className="text-center mt-20"><FontAwesomeIcon icon={faSpinner} spin size="2x" /></div>
    }
    </>
  )
}

export default ItemDetails
