import axios from "axios";

function ChooseTracks(props) {

    //Sends array of track names to the server and moves on to next page if successful
    function saveTracks(e) {
        e.preventDefault()
        const tracks = Object.fromEntries(new FormData(e.target).entries())

        if (Object.keys(tracks).length === 0) {
             console.log("Select at least one track")
        } else {
            axios.post(
                "http://localhost:8000/tracks",
                {
                    "tracks": Object.keys(tracks)
                },
                {withCredentials: true}
            )
                .then((response) => {
                    if(response.status === 200) {
                        console.log("success")
                        props.next()
                    } else {
                        console.log(response.status)
                    }
                })
                .catch((error) => console.log(error))
        }
    }

    return (
        <form onSubmit={saveTracks}>
            <label htmlFor="CSE">Computational Science and Engineering</label>
            <input name="CSE" id="CSE" type="checkbox" />
            <br/>
            <label htmlFor="Graphics">Computer Graphics and Visualization</label>
            <input name="Graphics" id="Graphics" type="checkbox" />
            <br/>
            <label htmlFor="DB">Database and Information Systems</label>
            <input name="DB" id="DB" type="checkbox" />
            <br/>
            <label htmlFor="Algo">(Algorithmic) Foundations</label>
            <input name="Algo" id="Algo" type="checkbox" />
            <br/>
            <label htmlFor="ML">Machine Intelligence</label>
            <input name="ML" id="ML" type="checkbox" />
            <br/>
            <label htmlFor="Language">Programming Language</label>
            <input name="Language" id="Language" type="checkbox" />
            <br/>
            <label htmlFor="Security">Security</label>
            <input name="Security" id="Security" type="checkbox" />
            <br/>
            <label htmlFor="SWE">Software Engineering</label>
            <input name="SWE" id="SWE" type="checkbox" />
            <br/>
            <label htmlFor="Systems">Systems Software</label>
            <input name="Systems" id="Systems" type="checkbox" />
            <button type="submit">SUBMIT</button>
        </form>
    )
}

export default ChooseTracks