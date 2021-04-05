const fetchData = async (url, method = 'GET', bodyData = []) => {
    try {
        const baseUrl = `https://api.vocabulazy.net/`

        if (method === 'GET') {
            const res = await fetch(baseUrl + url)
            const dataFromServer = await res.json()
            return { dataFromServer, error: null }
        }

        else if (method === 'DELETE') {
            await fetch(baseUrl + url, {
                method: 'DELETE',
            })
            return { dataFromServer: [], error: null }

        }

        else {
            const res = await fetch(baseUrl + url, {
                method: method,
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            })
            const dataFromServer = await res.json()
            return { dataFromServer, error: null }

        }

    } catch (error) {
        return { dataFromServer: [], error }
    }
}

export default fetchData;