import Async from "react-async"
import convertHtmlToReact from '@hedgedoc/html-to-react';

const loadPlayer = async({pageId},{ signal }) => {
    const res = await fetch(`https://dev-nsegame.pantheonsite.io/wp-json/wp/v2/pages/${pageId}`, { signal })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
}

const Logbook = () => (
    <Async promiseFn={loadPlayer} pageId={48}>
        {({ data, error, isPending}) => {
        if (isPending) return "Loading..."
        if (error) return `Something went wrong: ${error.message}`
        if (data)
            return (
                <div>
                    <div> {convertHtmlToReact(data.content.rendered) }</div>
                </div>
            )
            return null
        }}
    </Async>
)

export default Logbook;