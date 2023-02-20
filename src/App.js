import logo from './logo.svg';
import './App.css';
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

function App() {
  const [profit, setProfit] = useState();
  const [lose, setLose] = useState();
  const [gain, setGain] = useState();
  const [searchInput, setSearchInput] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const calculateWallet = () => {
    
    const jsonData = {
      contractaddress: searchInput,
    };

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token 1b4d9825bd14c43da095124c59fa8e22e3be4980",
      },
    };
    setLoading(true)
    axios
      .post("https://api.nftpnl.xyz/calculate/", jsonData, axiosConfig)
      .then((response) => {
        console.log("Calculate data", response)
        if(response.data.data.data.querystatus == "Filled") {
          setLoading(false)
          const gain = response.data.data.data.gain;
          const lose = response.data.data.data.lose;
          const profit = response.data.data.data.profit;
          if (gain == null) {
            setGain(0);
          } else {
            setGain(gain);
          }
          if (lose == null) {
            setLose(0);
          } else {
            setLose(lose);
          }
          if (profit == null) {
            setProfit(0);
          } else {
            setProfit(profit);
          }
  
        } else {
          setGain("...")
          setLose("...")
          setProfit("...")
        }

        if(response.data.data.data.querystatus == "Pending"){
          setError("Oops! Refresh and try again!")
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error)
        setLoading(false)
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    console.log(searchInput)
  };

 const handleInputPaste = (e) => {
    const value = e.clipboardData.getData('Text');
    setSearchInput(value);
    console.log(searchInput);
}
  return (
    <div className="App container">
      <input placeholder='wallet address' onChange={(e) => handleSearch(e)} onPaste={(e)=> handleInputPaste(e)} className="input"></input>
     <button onClick={()=> {calculateWallet()}}>CHECK DATA</button>
     {error && <p> {error} </p>}
     {loading
     ?<>
     LOADING...
     </>
    : <>
    <p> GAIN: {gain}</p>
    <p> NET: {profit}</p>
    <p> LOSE: {lose}</p>
    </>
    }
     

    </div>
  );
}

export default App;
