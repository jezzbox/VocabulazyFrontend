import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import fetchData from './FetchData'

const useFetch = (url, updatedData, resource) => {
    const [isPending, setIsPending] = useState(true)
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const { user, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            console.log("are we fetching ?")
            if (updatedData) {
                const updateData = async () => {
                    setIsPending(true)
                    const patchData = []
                    for (const [key, value] of Object.entries(updatedData)) {
                        patchData.push({ "op": "replace", "path": "/" + key, "value": value })
                    }
                    console.log(`${resource}s/`)
                    const { dataFromServer, error } = await fetchData(`${resource}s/${updatedData[`${resource}Id`]}`, 'PATCH', patchData)
                    setError(error)
                    setData(dataFromServer)
                    setIsPending(false)
                }
                updateData()
            }


            else {
                const getData = async () => {
                    setIsPending(true)
                    if (url === `users?authIdentifier=`) {
                        const authIdentifier = user.sub
                        //user.sub
                        console.log("here")
                        const { dataFromServer, error } = await fetchData(url + authIdentifier);
                        if (dataFromServer.status === 404) {
                            const { dataFromServer, error } = await fetchData('users', 'POST', { authIdentifier })
                            setError(error)
                            setData(dataFromServer)
                            setIsPending(false)

                        }
                        else {
                            setError(error)
                            setData(dataFromServer)
                            setIsPending(false)
                        }

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
        }
    }, [url, user, isAuthenticated, updatedData, resource]);

    return { data, isPending, error };
}

export default useFetch;