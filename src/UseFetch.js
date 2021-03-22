import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import fetchData from './FetchData'

const useFetch = (url) => {
    const [isPending, setIsPending] = useState(true)
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const { user, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {

            const getData = async () => {
                setIsPending(true)
                if (url === `users?authIdentifier=`) {
                    const authIdentifier = user.sub

                    const { dataFromServer, error } = await fetchData(url + authIdentifier);
                        setError(error)
                        setData(dataFromServer)
                        setIsPending(false)

                }
                else {
                    const { dataFromServer, error } = await fetchData(url);
                    setError(error)
                    setData(dataFromServer)
                    setIsPending(false)
                }
            }
            getData()
        }
    }, [url, user, isAuthenticated]);

    return { data, isPending, error };
}

export default useFetch;