import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object().shape({
  maximum_amount: yup.number('Enter a valid amount').default(200).typeError('Enter a valid amount').required('Enter a valid amount').positive('Enter a valid amount').integer('Enter a valid amount'),
});

const AutoBidConfig = () => {
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [config, setConfig] = useState({});
  const [max, setMax] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/auto-bidding/${localStorage.getItem('user')}`);
      console.log(data);
      setMax(data.maximum_amount);
      setConfig(data);
      setLoading(false);
    }
    getList();
  }, [max])

  const onSubmit = async (data) => {
    setSpinner(true);
    setSuccessMessage('');
    const payload = {...data, user: localStorage.getItem('user')}
    try {
      const {data} = await axios[Object.keys(config).length > 0 ? 'put' : 'post'](`${process.env.REACT_APP_API_URL}/auto-bidding${Object.keys(config).length > 0  ? `/${config.id}` : ''}`, payload);
      setConfig(data);
      setSuccessMessage(`Auto-bidding configured successfully. Maximum amount set to: $${payload.maximum_amount}.`)
    } catch (error) {
      console.log(error);
      const {data, status} = error.response;
      if(status === 400){
        for (const key in data) {
          const error = data[key];
          setErrorMessage(`${errorMessage}${errorMessage !== ''  ? '<br>' : ''}${error[0]}`)
        }
        setErrorMessage(data.message);
      }
    }
    setSpinner(false);
  }

  return (
    <>
      {!loading ? <div className="px-5 md:px-10 py-5">
      <Breadcrumb currentPage={'Auto-Bidding Configuration'} />
      <div className="container flex justify-center mt-14">
        <div className="w-11/12 md:w-4/12">
        {errorMessage !== '' ? <div className="my-3 bg-red-400 text-red-200 px-2 text-center py-2" dangerouslySetInnerHTML={{__html: errorMessage}}></div>
            :(successMessage && <div className="my-3 bg-green-700 text-green-200 px-2 text-center py-2">{successMessage}</div>)}
          <div className="text-xl font-bold">Auto-Bidding Configuration</div>
          <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="mb-2">Maximum bid amount</label>
            <div className="flex flex-1 flex-col">
              <div className="flex flex-1 border border-gray-300 px-3 py-2 rounded-lg bg-white">
                <input className="flex-1 outline-none focus:outline-none bg-transparent" value={config?.maximum_amount} {...register("maximum_amount")} id="email"  placeholder="Amount"/>
              </div>
              <small className="text-red-500">{errors.maximum_amount?.message}</small>
            </div>
            <button type="submit" disabled={spinner || Object.keys(errors).length > 0} className={`focus:outline-none bg-blue-500 hover:bg-blue-600 mt-10 py-2 px-3 font-light text-sm rounded-lg text-white ${spinner || Object.keys(errors).length > 0 ? 'cursor-not-allowed' : 'cursor-pointer'} ${spinner || Object.keys(errors).length > 0 ? 'opacity-50' : ''}`}>
              Set Configuration {spinner && <FontAwesomeIcon icon={faSpinner} spin className="ml-3" />}
            </button>
          </form>
        </div>
      </div>
    </div> : <div className="text-center mt-20"><FontAwesomeIcon icon={faSpinner} spin size="2x" /></div>}
    </>
  )
}

export default AutoBidConfig
