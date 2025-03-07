import { useEffect, useState } from "react";
import axios from "axios";
type PriceInformation = {
  currency: string;
  date: Date;
  price: number;
};

const App = () => {
  const [from, setFrom] = useState(0);
  const [infoFrom, setInfoFrom] = useState<string>("");

  const [to, setTo] = useState(0);
  const [infoTo, setInfoTo] = useState<string>("");

  const [priceInformation, setPriceInformation] = useState<PriceInformation[]>(
    []
  );

  const [error, setError] = useState<string>(""); //check form

  const [amount, setAmount] = useState(0);

  const handleChange = () => {
    const _from = priceInformation.find((item) => item.currency === infoFrom)!;
    const _to = priceInformation.find((item) => item.currency === infoTo)!;

    const as = _to.price / _from.price;
    const changed = amount * as;

    setFrom(amount);
    setTo(changed);
  };

  useEffect(() => {
    const fetchToken = async () => {
      const response = await axios.get(
        "https://interview.switcheo.com/prices.json"
      );

      setPriceInformation(response.data);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (priceInformation.length > 0) {
      const defaultVal = priceInformation[0].currency;
      setInfoFrom(defaultVal);
      setInfoTo(defaultVal);
    }
  }, [priceInformation]);

  return (
    <div className="bg-purple-900 h-screen place-content-center justify-items-center">
      <div className="grid grid-cols-1">
        <div className="h-fit w-[400px] bg-amber-50 rounded-3xl">
          <div className="my-3">
            <div className="mt-3">
              <p className="text-center font-sans text-3xl">
                Currency converter
              </p>
            </div>

            <div className="mx-6">
              <div className="mt-7">
                <p className="font-sans text-xl">Enter Amount</p>
                <input
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0) {
                      setError("Please enter a positive integer!!!"); //wrong
                      setAmount(0);
                    } else {
                      setError(""); // correct
                      setAmount(value);
                    }
                  }}
                  type="number"
                  className="px-3 border-1 w-full h-12 rounded-sm mt-2"
                  placeholder="Enter value here"
                />
                {error && (
                  <p className="text-red-700 mt-2 font-sans text-center">
                    {error}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <div className="flex gap-1 items-center">
                  <div className="flex-1">
                    <p className="text-lg font-sans">From</p>
                    <select
                      onChange={(e) => {
                        setInfoFrom(e.target.value);
                      }}
                      name=""
                      id=""
                      className="border-1 w-full h-12 rounded-sm mt-4"
                    >
                      {priceInformation.map((item, index) => (
                        <option value={item.currency} key={item.currency}>
                          {item.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-16 h-full  flex items-center justify-center">
                    <p className="pt-9">TRANS</p>
                  </div>
                  <div className=" flex-1">
                    <p className="text-lg font-sans">To</p>
                    <select
                      onChange={(e) => {
                        setInfoTo(e.target.value);
                      }}
                      name=""
                      id=""
                      className="border-1 w-full h-12 rounded-sm mt-4"
                    >
                      {priceInformation.map((item, index) => (
                        <option
                          value={item.currency}
                          key={item.currency}
                          defaultChecked={index === 0}
                        >
                          {item.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-sans">
                  {from} {infoFrom} = {to} {infoTo}
                </p>
              </div>

              <div className="">
                <button
                  onClick={handleChange}
                  className="hover:bg-purple-700 cursor-pointer mt-4 rounded-md font-sans text-xl bg-purple-600 text-indigo-50 w-full h-[50px]"
                >
                  Get Exchange Rate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
